# CLOSE — Evaluation Framework

## Ground Truth Architecture

The CLOSE evaluation engine evaluates reconciliation performance against immutable ground-truth metadata embedded during synthetic dataset generation.

```text
Ground Truth Schema:
- ground_truth_match_id: Unique cross-source identifier for linked records
- ground_truth_status: MATCHED | EXCEPTION_FEE | DUPLICATE | MISSING | UNRESOLVED
- ground_truth_exception_type: FEE_DISCREPANCY | TIMING_GAP | UNMATCHED_OUTFLOW
- ground_truth_resolution: ACCEPT_FEE | REJECT_DUPLICATE | ESCALATE_HUMAN
```

## Evaluated Metrics

1. **Precision**: $\frac{\text{True Matches}}{\text{True Matches} + \text{False Matches}}$
2. **Recall**: $\frac{\text{True Matches}}{\text{Total Ground-Truth Matches}}$
3. **Auto-Resolution Precision**: $\frac{\text{Correct Auto-Resolved Records}}{\text{Total Records Auto-Resolved by Engine \& AI}}$
4. **False Resolution Rate**: $\frac{\text{Incorrect Decisions Made by Engine}}{\text{Total Processed Transactions}}$
   - In financial systems, minimizing False Resolution Rate is paramount; false reconciliations cause material audit misstatements.
5. **Honest Exception Rate**: $\frac{\text{Records Escalated for Human Review}}{\text{Total Processed Transactions}}$
   - CLOSE treats unresolved exceptions as a strength, refusing to speculate without corroborating evidence.
