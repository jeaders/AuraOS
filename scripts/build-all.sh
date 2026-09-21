#!/bin/bash
# Complete AuraOS build script
# Builds kernel, rootfs, and ISO

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================="
echo "  AuraOS Build System"
echo "========================================="
echo ""

# Check if running as root for some operations
if [ "$EUID" -eq 0 ]; then
    echo "Please do not run this script as root."
    echo "You will be prompted for sudo password when needed."
    exit 1
fi

# Check dependencies
echo "Checking dependencies..."
command -v debootstrap >/dev/null 2>&1 || { echo "Error: debootstrap is required. Install it first."; exit 1; }
command -v wget >/dev/null 2>&1 || { echo "Error: wget is required. Install it first."; exit 1; }
command -v grub-mkrescue >/dev/null 2>&1 || { echo "Error: grub-mkrescue is required. Install it first."; exit 1; }
command -v mksquashfs >/dev/null 2>&1 || { echo "Error: mksquashfs is required. Install it first."; exit 1; }

# Build kernel
echo ""
echo "Step 1/4: Building kernel..."
"${SCRIPT_DIR}/build-kernel.sh"

# Build initramfs
echo ""
echo "Step 2/4: Building initramfs..."
"${SCRIPT_DIR}/build-initramfs.sh"

# Build rootfs
echo ""
echo "Step 3/4: Building root filesystem..."
"${SCRIPT_DIR}/build-rootfs.sh"

# Build ISO
echo ""
echo "Step 4/4: Building ISO..."
"${SCRIPT_DIR}/build-iso.sh"

echo ""
echo "========================================="
echo "  Build Complete!"
echo "========================================="
echo ""
echo "ISO image: AuraOS-1.0.iso"
echo ""
echo "To test the ISO:"
echo "  qemu-system-x86_64 -cdrom AuraOS-1.0.iso -m 2G"
echo ""
echo "Or write to USB:"
echo "  sudo dd if=AuraOS-1.0.iso of=/dev/sdX bs=4M status=progress && sync"
echo ""
