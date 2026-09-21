#!/bin/bash
# AuraOS Live Boot Script
# Runs when booting from the ISO

set -e

echo "Starting AuraOS Live..."

# Mount filesystem
mkdir -p /run/auraos
if [ -f /live/filesystem.squashfs ]; then
    mount -t squashfs /live/filesystem.squashfs /run/auraos
    mount --bind /run/auraos /root
fi

# Mount essential filesystems
mount -t proc proc /proc
mount -t sysfs sysfs /sys
mount -t devtmpfs devtmpfs /dev

# Start NetworkManager
systemctl start NetworkManager

# Start display manager
systemctl start lightdm

# Show desktop
echo "AuraOS Live started successfully"
echo "You can try AuraOS or install it to your hard drive"
echo ""
echo "To install, run: sudo /usr/share/auraos/scripts/install.sh"
echo ""

# Keep script running
tail -f /dev/null
