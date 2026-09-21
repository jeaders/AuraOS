#!/bin/bash
# Build AuraOS ISO image
# Requires: squashfs-tools, genisoimage, grub-pc-bin, grub-efi-amd64-bin

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOTFS_DIR="${SCRIPT_DIR}/../rootfs"
ISO_DIR="${SCRIPT_DIR}/../iso"
OUTPUT_ISO="${SCRIPT_DIR}/../AuraOS-1.0.iso"

echo "=== AuraOS ISO Build ==="

# Clean previous build
rm -rf "${ISO_DIR}"
mkdir -p "${ISO_DIR}"

# Create squashfs
echo "Creating squashfs..."
sudo mksquashfs "${ROOTFS_DIR}" "${ISO_DIR}/filesystem.squashfs" -comp xz -noappend

# Create ISO directory structure
mkdir -p "${ISO_DIR}/boot/grub"
mkdir -p "${ISO_DIR}/live"

# Copy kernel and initrd
echo "Copying kernel and initrd..."
if [ -f "${ROOTFS_DIR}/boot/vmlinuz-auraos" ]; then
    cp "${ROOTFS_DIR}/boot/vmlinuz-auraos" "${ISO_DIR}/live/vmlinuz"
else
    cp "${ROOTFS_DIR}/boot/vmlinuz-"* "${ISO_DIR}/live/vmlinuz"
fi

if [ -f "${ROOTFS_DIR}/boot/initrd.img-auraos" ]; then
    cp "${ROOTFS_DIR}/boot/initrd.img-auraos" "${ISO_DIR}/live/initrd.img"
else
    cp "${ROOTFS_DIR}/boot/initrd.img-"* "${ISO_DIR}/live/initrd.img"
fi

# Copy GRUB config and theme
cp "${SCRIPT_DIR}/../boot/grub/grub.cfg" "${ISO_DIR}/boot/grub/grub.cfg"
mkdir -p "${ISO_DIR}/boot/grub/theme"
cp "${SCRIPT_DIR}/../boot/grub/theme/auraos.txt" "${ISO_DIR}/boot/grub/theme/auraos.txt"

# Copy GRUB modules
echo "Copying GRUB modules..."
cp -r /usr/lib/grub/i386-pc "${ISO_DIR}/boot/grub/"
cp -r /usr/lib/grub/x86_64-efi "${ISO_DIR}/boot/grub/"

# Create ISO
echo "Creating ISO image..."
sudo grub-mkrescue -o "${OUTPUT_ISO}" "${ISO_DIR}" --xorriso=" -quiet "

# Calculate checksum
echo "Generating checksum..."
sha256sum "${OUTPUT_ISO}" > "${OUTPUT_ISO}.sha256"

echo "=== ISO Build Complete ==="
echo "ISO: ${OUTPUT_ISO}"
echo "SHA256: $(cat ${OUTPUT_ISO}.sha256)"
