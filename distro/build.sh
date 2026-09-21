#!/bin/bash
# AuraOS Real Distro Build Script
# Hybrid BIOS+UEFI ISO for MacBook Pro 2011 and old PCs

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DISTRO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BUILD_DIR="${DISTRO_DIR}/build"
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
    --include="systemd,systemd-sysv,dbus,udev" \
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
    apt-get install -y $(cat /usr/share/auraos/packages/base.list | grep -v '^#' | xargs)
    apt-get clean
    rm -rf /var/lib/apt/lists/*
"

# Step 4: Configure system
echo "[4/6] Configuring system..."
sudo chroot "${BUILD_DIR}/rootfs" /bin/bash -c "
    export DEBIAN_FRONTEND=noninteractive
    
    # Locale
    echo 'en_US.UTF-8 UTF-8' > /etc/locale.gen
    echo 'it_IT.UTF-8 UTF-8' >> /etc/locale.gen
    locale-gen
    update-locale LANG=en_US.UTF-8

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

    # Network
    systemctl enable NetworkManager

    # LightDM
    systemctl enable lightdm

    # Create user
    useradd -m -s /bin/bash -G sudo,audio,video,plugdev,netdev auraos
    echo 'auraos:auraos' | chpasswd

    # Enable services
    systemctl enable geoclue
    systemctl enable fwupd
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
cp "${BUILD_DIR}/rootfs/boot/vmlinuz-"* "${ISO_DIR}/live/vmlinuz"
cp "${BUILD_DIR}/rootfs/boot/initrd.img-"* "${ISO_DIR}/live/initrd.img"

# Copy squashfs
cp "${BUILD_DIR}/filesystem.squashfs" "${ISO_DIR}/live/"

# Copy GRUB config
cp "${SCRIPT_DIR}/boot/grub/grub.cfg" "${ISO_DIR}/boot/grub/grub.cfg"

# Copy GRUB modules for hybrid BIOS+UEFI
cp -r /usr/lib/grub/i386-pc/* "${ISO_DIR}/boot/grub/i386-pc/"
cp -r /usr/lib/grub/x86_64-efi/* "${ISO_DIR}/boot/grub/x86_64-efi/"

# Create EFI image for UEFI boot
echo "Creating EFI image..."
dd if=/dev/zero of="${ISO_DIR}/boot/grub/x86_64-efi/efi.img" bs=1M count=10 2>/dev/null
mkfs.fat -F 32 "${ISO_DIR}/boot/grub/x86_64-efi/efi.img" 2>/dev/null || true
sudo mkdir -p /mnt/auraos-efi
sudo mount -o loop "${ISO_DIR}/boot/grub/x86_64-efi/efi.img" /mnt/auraos-efi 2>/dev/null || true
sudo cp -r /usr/lib/grub/x86_64-efi/* /mnt/auraos-efi/ 2>/dev/null || true
sudo umount /mnt/auraos-efi 2>/dev/null || true
rmdir /mnt/auraos-efi 2>/dev/null || true

# Create ISO with xorriso for hybrid support
sudo xorriso -as mkisofs \
    -iso-level 3 \
    -full-iso9660-filenames \
    -volid "AuraOS" \
    -output "${ISO_OUTPUT}" \
    -eltorito-boot boot/grub/i386-pc/eltorito.img \
    -eltorito-catalog boot/grub/i386-pc/boot.catalog \
    -no-emul-boot \
    -boot-load-size 4 \
    -boot-info-table \
    -eltorito-alt-boot \
    -e boot/grub/x86_64-efi/efi.img \
    -no-emul-boot \
    -append_partition 2 0xEF boot/grub/x86_64-efi/efi.img \
    "${ISO_DIR}/"

# Make ISO hybrid bootable
sudo isohybrid --uefi "${ISO_OUTPUT}"

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
