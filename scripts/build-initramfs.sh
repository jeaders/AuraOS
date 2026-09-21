#!/bin/bash
# Build initramfs for AuraOS
# Creates a minimal initramfs for booting the live system

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOTFS_DIR="${SCRIPT_DIR}/../rootfs"
OUTPUT_DIR="${SCRIPT_DIR}/../iso/live"

echo "=== Building AuraOS Initramfs ==="

# Create temporary directory for initramfs
TMPDIR=$(mktemp -d)
INITRAMFS_DIR="${TMPDIR}/initramfs"

mkdir -p "${INITRAMFS_DIR}"

# Copy essential binaries
echo "Copying essential binaries..."
mkdir -p "${INITRAMFS_DIR}/bin" "${INITRAMFS_DIR}/sbin" "${INITRAMFS_DIR}/usr/bin" "${INITRAMFS_DIR}/usr/sbin" "${INITRAMFS_DIR}/lib" "${INITRAMFS_DIR}/lib64" "${INITRAMFS_DIR}/etc" "${INITRAMFS_DIR}/proc" "${INITRAMFS_DIR}/sys" "${INITRAMFS_DIR}/dev" "${INITRAMFS_DIR}/run" "${INITRAMFS_DIR}/new_root"

# Copy busybox or essential tools
for bin in mount umount switch_root pivot_root sleep echo cat blkid lsmod modprobe; do
    if command -v "$bin" >/dev/null 2>&1; then
        cp "$(command -v "$bin")" "${INITRAMFS_DIR}/bin/" 2>/dev/null || true
    fi
done

# Copy libraries
echo "Copying libraries..."
for bin in "${INITRAMFS_DIR}"/bin/* "${INITRAMFS_DIR}"/sbin/*; do
    if [ -f "$bin" ]; then
        ldd "$bin" 2>/dev/null | grep -o '/[^ ]*' | while read lib; do
            if [ -f "$lib" ]; then
                dest="${INITRAMFS_DIR}${lib}"
                mkdir -p "$(dirname "$dest")"
                cp "$lib" "$dest"
            fi
        done
    fi
done

# Create init script
cat > "${INITRAMFS_DIR}/init" << 'EOF'
#!/bin/bash
# AuraOS Initramfs Init Script

echo "Starting AuraOS..."
echo "Loading kernel modules..."

# Load essential modules
modprobe -a ext4 squashfs loop 2>/dev/null || true

# Create device nodes
echo "Creating device nodes..."
mknod /dev/null c 1 3 2>/dev/null || true
mknod /dev/console c 5 1 2>/dev/null || true
mknod /dev/tty c 5 0 2>/dev/null || true
mknod /dev/zero c 1 5 2>/dev/null || true
mknod /dev/random c 1 8 2>/dev/null || true
mknod /dev/urandom c 1 9 2>/dev/null || true

# Mount essential filesystems
echo "Mounting filesystems..."
mount -t proc proc /proc
mount -t sysfs sysfs /sys
mount -t devtmpfs devtmpfs /dev

# Wait for root device
echo "Waiting for root device..."
ROOT_DEVICE=""
for i in $(seq 1 30); do
    ROOT_DEVICE=$(blkid -t TYPE=squashfs 2>/dev/null | head -n1 | cut -d: -f1)
    if [ -n "$ROOT_DEVICE" ]; then
        break
    fi
    sleep 1
done

if [ -z "$ROOT_DEVICE" ]; then
    echo "ERROR: Could not find root device"
    exec /bin/sh
fi

echo "Found root device: $ROOT_DEVICE"

# Mount root filesystem
mkdir -p /new_root
mount -t squashfs "$ROOT_DEVICE" /new_root || {
    echo "ERROR: Failed to mount root filesystem"
    exec /bin/sh
}

# Switch to new root
echo "Switching to new root..."
exec switch_root /new_root /sbin/init
EOF

chmod +x "${INITRAMFS_DIR}/init"

# Create initramfs
echo "Creating initramfs image..."
cd "${INITRAMFS_DIR}"
find . | cpio -o -H newc | gzip -9 > "${OUTPUT_DIR}/initrd.img"

# Cleanup
rm -rf "${TMPDIR}"

echo "=== Initramfs build complete ==="
echo "Initramfs: ${OUTPUT_DIR}/initrd.img"
