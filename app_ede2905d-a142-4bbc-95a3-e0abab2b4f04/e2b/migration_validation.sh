#!/bin/sh

set -eux

# Migration validation script for E2B sandbox environment
# This script validates database migrations by starting the backend server
# and checking health endpoints

# Configuration - Force these values to override any environment variables
unset DB_PORT POSTGRES_PORT  # Clear any existing environment variables
DB_NAME="migration_validation_db"
DB_HOST="localhost"
DB_PORT="5432"
TEST_BACKEND_PORT="3001"
BACKEND_PATH="$1"

# Export to ensure our values are used by subcommands
export DB_NAME DB_HOST DB_PORT TEST_BACKEND_PORT

if [ -z "$BACKEND_PATH" ]; then
    echo "Usage: $0 <backend_path>"
    exit 1
fi

echo "Starting migration validation for backend at: $BACKEND_PATH"

# Initialize cleanup variables
SERVER_PID=""
VALIDATION_SUCCESS=false

# Cleanup function - always called on exit
cleanup() {
    echo "Cleaning up..."
    if [ -n "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
    fi
    psql -h $DB_HOST -p $DB_PORT -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || true
    echo "Cleanup complete!"
}

# Set trap to ensure cleanup runs on any exit
trap cleanup EXIT

# Verify PostgreSQL is accessible
echo "Verifying PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT -U postgres >/dev/null 2>&1; then
    echo "ERROR: Cannot connect to PostgreSQL on $DB_HOST:$DB_PORT"
    echo "Please ensure PostgreSQL is running and accessible"
    echo "This is an infrastructure error that cannot be fixed by modifying migrations"
    exit 3  # Exit code 3 = Infrastructure error, skip fixer
fi

echo "PostgreSQL is ready!"

# Create validation database
echo "Setting up validation database..."
psql -h $DB_HOST -p $DB_PORT -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || true

if ! psql -h $DB_HOST -p $DB_PORT -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null; then
    echo "ERROR: Failed to create validation database"
    echo "This is an infrastructure/permissions error that cannot be fixed by modifying migrations"
    exit 3  # Exit code 3 = Infrastructure error, skip fixer
fi

# Start backend server and validate
echo "Starting backend server for validation..."
cd "$BACKEND_PATH"

# Start server in background with validation database
DATABASE_URL="postgresql://postgres@$DB_HOST:$DB_PORT/$DB_NAME" \
PORT=$TEST_BACKEND_PORT \
timeout 30 node --import tsx src/server.ts &

SERVER_PID=$!

# Wait for server to be ready with timeout
echo "Waiting for server to start..."
MAX_WAIT_TIME=30
WAIT_COUNT=0

while [ $WAIT_COUNT -lt $MAX_WAIT_TIME ]; do
    # Check if server process is still running
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        echo "ERROR: Server process died unexpectedly"
        exit 1
    fi
    
    # Check if server is responding
    if curl -f http://localhost:$TEST_BACKEND_PORT/api/v1/health >/dev/null 2>&1; then
        break
    fi
    
    echo "Server not ready yet, waiting... ($((WAIT_COUNT + 1))/$MAX_WAIT_TIME)"
    sleep 1
    WAIT_COUNT=$((WAIT_COUNT + 1))
done

if [ $WAIT_COUNT -eq $MAX_WAIT_TIME ]; then
    echo "ERROR: Server failed to start within $MAX_WAIT_TIME seconds"
    exit 1
fi

echo "Server is ready!"

# Check health endpoints
echo "Validating server health..."
curl -f http://localhost:$TEST_BACKEND_PORT/api/v1/health
curl -f http://localhost:$TEST_BACKEND_PORT/api/v1/docs

VALIDATION_SUCCESS=true
echo "Migration validation completed successfully!"
