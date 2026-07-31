#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="$ROOT_DIR/.local-node/node-v22.23.2-linux-x64/bin/node"
if [ ! -x "$NODE_BIN" ]; then
  echo "Node 22 runtime not found at $NODE_BIN" >&2
  exit 1
fi
export PATH="$ROOT_DIR/.local-node/node-v22.23.2-linux-x64/bin:$PATH"
cd "$ROOT_DIR"
exec "$NODE_BIN" ./node_modules/react-native/cli.js start --reset-cache "$@"
