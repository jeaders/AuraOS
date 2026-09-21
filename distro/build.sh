#!/bin/bash
# AuraOS Real Distro Build Script
# Hybrid BIOS+UEFI ISO for MacBook Pro 2011 and old PCs

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DISTRO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BUILD_DIR="/tmp/auraos-build"
ISO_OUTPUT="${DISTRO_DIR}/AuraOS-1.0-amd64.iso"

echo "=== AuraOS Real Distro Build ==="
echo "Target: MacBook Pro 2011, old PCs, low-RAM systems"
echo ""

# Clean previous build
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Step 1: Create rootfs with debootstrap
echo "[1/6] Creating root filesystem with debootstrap..."
sudo debootstrap --arch=amd64 --variant=minbase \
    --include="systemd,systemd-sysv,dbus,udev,linux-image-amd64,linux-headers-amd64" \
    bookworm "${BUILD_DIR}/rootfs" \
    http://deb.debian.org/debian

# Step 2: Copy AuraOS configuration
echo "[2/6] Copying AuraOS configuration..."
sudo mkdir -p "${BUILD_DIR}/rootfs/usr/share/auraos/packages"
sudo cp -r "${SCRIPT_DIR}/debian/etc" "${BUILD_DIR}/rootfs/"
sudo cp -r "${SCRIPT_DIR}/debian/boot" "${BUILD_DIR}/rootfs/"
sudo cp "${SCRIPT_DIR}/packages/base.list" "${BUILD_DIR}/rootfs/usr/share/auraos/packages/base.list"

# Step 3: Install packages
echo "[3/6] Installing packages..."
sudo chroot "${BUILD_DIR}/rootfs" /bin/bash -c "
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y linux-image-amd64 linux-headers-amd64
    apt-get install -y $(grep -v '^#' /usr/share/auraos/packages/base.list | xargs)
    apt-get clean
    rm -rf /var/lib/apt/lists/*
"

# Step 4: Configure system
echo "[4/6] Configuring system..."
sudo chroot "${BUILD_DIR}/rootfs" /bin/bash -c "
    export DEBIAN_FRONTEND=noninteractive

    # Ensure groups referenced by useradd exist
    groupadd -f netdev
    groupadd -f audio
    groupadd -f video
    groupadd -f plugdev

    # Create the user only if it does not already exist
    if ! id -u auraos >/dev/null 2>&1; then
        useradd -m -s /bin/bash -G sudo,netdev,audio,video,plugdev auraos
        printf '%s\n' 'auraos:auraos' | chpasswd
    fi

    # Timezone
    ln -sf /usr/share/zoneinfo/Europe/Rome /etc/localtime
    echo 'Europe/Rome' > /etc/timezone

    # Hostname
    echo 'auraos' > /etc/hostname

    # Hosts
    cat > /etc/hosts << 'HOSTSEOF'
127.0.0.1       localhost
127.0.1.1       auraos.localdomain auraos
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
HOSTSEOF

    # Locales
    if command -v locale-gen >/dev/null 2>&1; then
        sed -i 's/^# *en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen || true
        sed -i 's/^# *it_IT.UTF-8 UTF-8/it_IT.UTF-8 UTF-8/' /etc/locale.gen || true
        locale-gen || true
    fi

    if command -v update-locale >/dev/null 2>&1; then
        update-locale LANG=en_US.UTF-8 || true
    fi

    # Enable services only if unit files exist
    enable_if_present() {
        if command -v systemctl >/dev/null 2>&1; then
            if [ -f /lib/systemd/system/\$1 ] || [ -f /usr/lib/systemd/system/\$1 ]; then
                systemctl enable \$1 || true
            fi
        fi
    }

    enable_if_present NetworkManager.service
    enable_if_present lightdm.service
    enable_if_present geoclue.service
    enable_if_present fwupd.service
"

# Step 5: Build squashfs
echo "[5/6] Building squashfs..."
sudo mksquashfs "${BUILD_DIR}/rootfs" "${BUILD_DIR}/filesystem.squashfs" -comp xz -noappend

# Step 6: Create hybrid ISO
echo "[6/6] Creating hybrid ISO..."
ISO_DIR="${BUILD_DIR}/iso"
mkdir -p "${ISO_DIR}/boot/grub"
mkdir -p "${ISO_DIR}/live"
mkdir -p "${ISO_DIR}/boot/grub/i386-pc"
mkdir -p "${ISO_DIR}/boot/grub/x86_64-efi"

# Copy kernel and initrd
shopt -s nullglob

vmlinuz=( "${BUILD_DIR}/rootfs/boot"/vmlinuz-* )
initrd=( "${BUILD_DIR}/rootfs/boot"/initrd.img-* )

if [ "${#vmlinuz[@]}" -eq 0 ] || [ "${#initrd[@]}" -eq 0 ]; then
    echo "ERROR: no kernel/initramfs found in ${BUILD_DIR}/rootfs/boot"
    echo "Install linux-image-amd64 in the target system before building the ISO."
    exit 1
fi

cp "${vmlinuz[0]}" "${ISO_DIR}/live/vmlinuz"
cp "${initrd[0]}" "${ISO_DIR}/live/initrd.img"

# Copy squashfs
cp "${BUILD_DIR}/filesystem.squashfs" "${ISO_DIR}/live/"

# Copy GRUB config
cp "${SCRIPT_DIR}/boot/grub/grub.cfg" "${ISO_DIR}/boot/grub/grub.cfg"

# Copy GRUB modules for hybrid BIOS+UEFI
cp -r /usr/lib/grub/i386-pc/* "${ISO_DIR}/boot/grub/i386-pc/"
cp -r /usr/lib/grub/x86_64-efi/* "${ISO_DIR}/boot/grub/x86_64-efi/"

# Create hybrid ISO with GRUB
echo "Creating hybrid ISO with GRUB..."
sudo grub-mkrescue -o "${ISO_OUTPUT}" "${ISO_DIR}"

# Generate checksum
sha256sum "${ISO_OUTPUT}" > "${ISO_OUTPUT}.sha256"

echo ""
echo "=== Build Complete ==="
echo "ISO: ${ISO_OUTPUT}"
echo "SHA256: $(cat ${ISO_OUTPUT}.sha256)"
echo ""
echo "Test in QEMU:"
echo "  qemu-system-x86_64 -cdrom ${ISO_OUTPUT} -m 2G"
echo ""
echo "Write to USB:"
echo "  sudo dd if=${ISO_OUTPUT} of=/dev/sdX bs=4M status=progress && sync"
echo ""
echo "Boot on MacBook Pro 2011:"
echo "  Hold Option key at boot, select USB drive"
echo ""
