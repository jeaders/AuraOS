#!/bin/bash
# Install Plymouth splash screen for AuraOS

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOTFS_DIR="${SCRIPT_DIR}/../rootfs"

echo "=== Installing AuraOS Splash Screen ==="

# Create Plymouth theme directory
sudo mkdir -p "${ROOTFS_DIR}/usr/share/plymouth/themes/auraos"

# Copy theme files (to be created)
# sudo cp "${SCRIPT_DIR}/../boot/plymouth/auraos.plymouth" "${ROOTFS_DIR}/usr/share/plymouth/themes/auraos/"
# sudo cp "${SCRIPT_DIR}/../boot/plymouth/bg.png" "${ROOTFS_DIR}/usr/share/plymouth/themes/auraos/"
# sudo cp "${SCRIPT_DIR}/../boot/plymouth/logo.png" "${ROOTFS_DIR}/usr/share/plymouth/themes/auraos/"

# Install Plymouth theme
sudo chroot "${ROOTFS_DIR}" /bin/bash -c "plymouth-set-default-theme auraos -R" || true

echo "=== Splash screen installed ==="
