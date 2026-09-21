#!/bin/bash
# Build AuraOS kernel
# See kernel/build.sh for details

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KERNEL_DIR="${SCRIPT_DIR}/../kernel"

echo "Building AuraOS kernel..."
cd "${KERNEL_DIR}"
chmod +x build.sh
./build.sh
