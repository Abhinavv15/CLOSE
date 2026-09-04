-- CLOSE — AI Finance Controller Initial PostgreSQL Schema
-- Section 34 & 67 of Specifications

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Entity Tables
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    default_currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(64) DEFAULT 'CONTROLLER' NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);

CREATE TABLE IF NOT EXISTS bank_accounts (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    bank_name VARCHAR(255) NOT NULL,
    account_number_mask VARCHAR(32) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    current_balance NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_bank_accounts_company_id ON bank_accounts(company_id);

-- 2. Reconciliation Batches
CREATE TABLE IF NOT EXISTS reconciliation_batches (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    status VARCHAR(32) DEFAULT 'PENDING' NOT NULL,
    records_processed INTEGER DEFAULT 0 NOT NULL,
    matched INTEGER DEFAULT 0 NOT NULL,
    ai_matched INTEGER DEFAULT 0 NOT NULL,
    review_required INTEGER DEFAULT 0 NOT NULL,
    unresolved INTEGER DEFAULT 0 NOT NULL,
    match_rate DOUBLE PRECISION DEFAULT 0.0 NOT NULL,
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_reconciliation_batches_company_id ON reconciliation_batches(company_id);
CREATE INDEX IF NOT EXISTS ix_reconciliation_batches_status ON reconciliation_batches(status);

-- 3. Four Financial Ingestion Sources
CREATE TABLE IF NOT EXISTS bank_transactions (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    batch_id VARCHAR(64) REFERENCES reconciliation_batches(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount NUMERIC(18, 4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    reference VARCHAR(255),
    type VARCHAR(32) NOT NULL,
    ground_truth_match_id VARCHAR(64),
    ground_truth_status VARCHAR(64),
    ground_truth_exception_type VARCHAR(64),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_bank_tx_company_date ON bank_transactions(company_id, date);
CREATE INDEX IF NOT EXISTS ix_bank_tx_amount_ref ON bank_transactions(amount, reference);
CREATE INDEX IF NOT EXISTS ix_bank_tx_batch_id ON bank_transactions(batch_id);

CREATE TABLE IF NOT EXISTS processor_transactions (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    batch_id VARCHAR(64) REFERENCES reconciliation_batches(id) ON DELETE SET NULL,
    settlement_date DATE NOT NULL,
    processor VARCHAR(64) NOT NULL,
    transaction_id VARCHAR(255) NOT NULL,
    gross_amount NUMERIC(18, 4) NOT NULL,
    fee NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    net_amount NUMERIC(18, 4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    status VARCHAR(32) DEFAULT 'SETTLED' NOT NULL,
    reference VARCHAR(255),
    ground_truth_match_id VARCHAR(64),
    ground_truth_status VARCHAR(64),
    ground_truth_exception_type VARCHAR(64),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_proc_tx_company_date ON processor_transactions(company_id, settlement_date);
CREATE INDEX IF NOT EXISTS ix_proc_tx_net_ref ON processor_transactions(net_amount, reference);
CREATE INDEX IF NOT EXISTS ix_proc_tx_batch_id ON processor_transactions(batch_id);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    batch_id VARCHAR(64) REFERENCES reconciliation_batches(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    account VARCHAR(128) NOT NULL,
    description VARCHAR(500) NOT NULL,
    debit NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    credit NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    reference VARCHAR(255),
    ground_truth_match_id VARCHAR(64),
    ground_truth_status VARCHAR(64),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_ledger_company_date ON ledger_entries(company_id, date);
CREATE INDEX IF NOT EXISTS ix_ledger_ref ON ledger_entries(reference);
CREATE INDEX IF NOT EXISTS ix_ledger_batch_id ON ledger_entries(batch_id);

CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    batch_id VARCHAR(64) REFERENCES reconciliation_batches(id) ON DELETE SET NULL,
    invoice_number VARCHAR(128) NOT NULL,
    customer VARCHAR(255) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount NUMERIC(18, 4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR' NOT NULL,
    status VARCHAR(32) DEFAULT 'ISSUED' NOT NULL,
    ground_truth_match_id VARCHAR(64),
    ground_truth_status VARCHAR(64),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_invoice_company_date ON invoices(company_id, invoice_date);
CREATE INDEX IF NOT EXISTS ix_invoice_num_amount ON invoices(invoice_number, amount);
CREATE INDEX IF NOT EXISTS ix_invoice_batch_id ON invoices(batch_id);

-- 4. Matching Matrix and Exceptions
CREATE TABLE IF NOT EXISTS reconciliation_matches (
    id VARCHAR(64) PRIMARY KEY,
    batch_id VARCHAR(64) NOT NULL REFERENCES reconciliation_batches(id) ON DELETE CASCADE,
    bank_tx_id VARCHAR(64) REFERENCES bank_transactions(id) ON DELETE SET NULL,
    processor_tx_id VARCHAR(64) REFERENCES processor_transactions(id) ON DELETE SET NULL,
    ledger_entry_id VARCHAR(64) REFERENCES ledger_entries(id) ON DELETE SET NULL,
    invoice_id VARCHAR(64) REFERENCES invoices(id) ON DELETE SET NULL,
    method VARCHAR(32) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    difference NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    status VARCHAR(32) DEFAULT 'RECONCILED' NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_match_batch_status ON reconciliation_matches(batch_id, status);
CREATE INDEX IF NOT EXISTS ix_match_method ON reconciliation_matches(method);

CREATE TABLE IF NOT EXISTS exceptions (
    id VARCHAR(64) PRIMARY KEY,
    batch_id VARCHAR(64) NOT NULL REFERENCES reconciliation_batches(id) ON DELETE CASCADE,
    type VARCHAR(64) NOT NULL,
    amount NUMERIC(18, 4) NOT NULL,
    difference NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    status VARCHAR(32) DEFAULT 'REVIEW' NOT NULL,
    ai_classification VARCHAR(64),
    ai_explanation TEXT,
    ai_recommended_action TEXT,
    ai_investigated_at TIMESTAMP WITHOUT TIME ZONE,
    resolved_by VARCHAR(255),
    resolution_note TEXT,
    resolved_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_exceptions_batch_status ON exceptions(batch_id, status);
CREATE INDEX IF NOT EXISTS ix_exceptions_type ON exceptions(type);

CREATE TABLE IF NOT EXISTS exception_evidence (
    id VARCHAR(64) PRIMARY KEY,
    exception_id VARCHAR(64) NOT NULL REFERENCES exceptions(id) ON DELETE CASCADE,
    source_type VARCHAR(32) NOT NULL,
    source_id VARCHAR(64) NOT NULL,
    description VARCHAR(500),
    amount NUMERIC(18, 4),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_exception_evidence_exception_id ON exception_evidence(exception_id);
CREATE INDEX IF NOT EXISTS ix_exception_evidence_source ON exception_evidence(source_type, source_id);

-- 5. Forecast, Audit, and Evaluation
CREATE TABLE IF NOT EXISTS cash_forecasts (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    as_of_date DATE DEFAULT CURRENT_DATE NOT NULL,
    timeframe_days INTEGER DEFAULT 30 NOT NULL,
    current_cash NUMERIC(18, 4) NOT NULL,
    expected_receivables NUMERIC(18, 4) NOT NULL,
    upcoming_expenses NUMERIC(18, 4) NOT NULL,
    payroll NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    taxes NUMERIC(18, 4) DEFAULT 0.0000 NOT NULL,
    projected_cash NUMERIC(18, 4) NOT NULL,
    minimum_projected_cash NUMERIC(18, 4) NOT NULL,
    safety_threshold NUMERIC(18, 4) DEFAULT 800000.0000 NOT NULL,
    status VARCHAR(32) DEFAULT 'SAFE' NOT NULL,
    forecast_curve_json JSON NOT NULL,
    ai_explanation TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_cash_forecasts_company_date ON cash_forecasts(company_id, as_of_date);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    actor VARCHAR(255) NOT NULL,
    action VARCHAR(128) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    details_json JSON,
    confidence VARCHAR(32),
    status VARCHAR(32) DEFAULT 'LOGGED' NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_audit_entity_time ON audit_logs(entity_id, timestamp);
CREATE INDEX IF NOT EXISTS ix_audit_action ON audit_logs(action);

CREATE TABLE IF NOT EXISTS evaluation_runs (
    id VARCHAR(64) PRIMARY KEY,
    batch_id VARCHAR(64) NOT NULL REFERENCES reconciliation_batches(id) ON DELETE CASCADE,
    records_processed INTEGER NOT NULL,
    correct_matches INTEGER NOT NULL,
    incorrect_matches INTEGER NOT NULL,
    unresolved_count INTEGER NOT NULL,
    precision DOUBLE PRECISION NOT NULL,
    recall DOUBLE PRECISION NOT NULL,
    f1_score DOUBLE PRECISION NOT NULL,
    match_rate DOUBLE PRECISION NOT NULL,
    auto_resolution_precision DOUBLE PRECISION NOT NULL,
    false_resolution_rate DOUBLE PRECISION NOT NULL,
    average_processing_time_seconds DOUBLE PRECISION NOT NULL,
    honest_breakdown_json JSON NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_evaluation_runs_batch_id ON evaluation_runs(batch_id);
