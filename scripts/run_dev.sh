#!/usr/bin/env bash
set -e

echo "========================================================="
echo "   Launching CLOSE AI Finance Controller in Dev Mode     "
echo "========================================================="

# Trap INT and TERM to clean up background processes
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

# 1. Start Python FastAPI Finance Engine
echo "Starting Backend Finance Engine on http://localhost:8000..."
source .venv/bin/activate
cd services/finance-engine
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ../..

# 2. Start Next.js Frontend
echo "Starting Next.js Frontend on http://localhost:3000..."
cd apps/web
npm run dev &
FRONTEND_PID=$!
cd ../..

echo "Both services launched!"
echo "Backend:  http://localhost:8000 (OpenAPI docs: http://localhost:8000/docs)"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to terminate all processes."

wait
