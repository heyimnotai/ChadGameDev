#!/bin/bash
# Run Claude Code in isolated Docker sandbox
#
# Usage:
#   ./sandbox.sh              # Start Claude with --dangerously-skip-permissions
#   ./sandbox.sh --build      # Rebuild the container first
#   ./sandbox.sh claude       # Run normal claude (no permission override)

set -e

cd "$(dirname "$0")"

# Check for OAuth credentials
if [ ! -f ~/.claude/.credentials.json ]; then
    echo "Error: No Claude OAuth credentials found"
    echo ""
    echo "Run 'claude' once outside Docker to login first"
    exit 1
fi

# Handle --build flag
if [ "$1" == "--build" ]; then
    echo "Building Docker image..."
    docker compose build
    shift
fi

# Default to claude with permissions override
if [ $# -eq 0 ]; then
    echo "Starting Claude Code in sandbox..."
    echo "Claude can ONLY access: $(pwd)"
    echo ""
    docker compose run --rm claude
else
    # Pass custom command
    docker compose run --rm claude "$@"
fi
