#!/bin/bash
# Build rootfs for AuraOS
# Requires: debootstrap (Debian/Ubuntu) or pacstrap (Arch)

set -e

DISTRO="debian"
RELEASE="bookworm"
ARCH="amd64"
ROOTFS_DIR="$(pwd)/../rootfs"
MIRROR="http://deb.debian.org/debian"
KERNEL_BUILD_DIR="$(pwd)/../kernel/build"

echo "=== AuraOS RootFS Build ==="
echo "Distro: ${DISTRO} ${RELEASE}"
echo "Arch: ${ARCH}"

# Clean previous rootfs
rm -rf "${ROOTFS_DIR}"
mkdir -p "${ROOTFS_DIR}"

# Create rootfs using debootstrap
echo "Creating rootfs with debootstrap..."
sudo debootstrap --arch=${ARCH} ${RELEASE} "${ROOTFS_DIR}" ${MIRROR}

# Install kernel and modules
echo "Installing kernel and modules..."
if [ -f "${KERNEL_BUILD_DIR}/linux-6.1.0/arch/x86/boot/bzImage" ]; then
    sudo cp "${KERNEL_BUILD_DIR}/linux-6.1.0/arch/x86/boot/bzImage" "${ROOTFS_DIR}/boot/vmlinuz-auraos"
    sudo mkdir -p "${ROOTFS_DIR}/lib/modules"
    sudo cp -r "${KERNEL_BUILD_DIR}/linux-6.1.0" "${ROOTFS_DIR}/lib/modules/auraos-6.1.0"
    echo "Kernel installed."
else
    echo "Warning: Kernel not found. Install linux-image-amd64 in chroot."
fi

# Configure system
echo "Configuring system..."

# Copy AuraOS configuration files
echo "Copying AuraOS config files..."
sudo cp "$(pwd)/../rootfs/etc/passwd" "${ROOTFS_DIR}/etc/passwd"
sudo cp "$(pwd)/../rootfs/etc/group" "${ROOTFS_DIR}/etc/group"
sudo cp "$(pwd)/../rootfs/etc/shadow" "${ROOTFS_DIR}/etc/shadow"
sudo cp "$(pwd)/../rootfs/etc/hostname" "${ROOTFS_DIR}/etc/hostname"
sudo cp "$(pwd)/../rootfs/etc/hosts" "${ROOTFS_DIR}/etc/hosts"
sudo cp "$(pwd)/../rootfs/etc/fstab" "${ROOTFS_DIR}/etc/fstab"
sudo cp "$(pwd)/../rootfs/etc/network/interfaces" "${ROOTFS_DIR}/etc/network/interfaces"

# Hostname
echo "auraos" | sudo tee "${ROOTFS_DIR}/etc/hostname" > /dev/null

# Hosts
cat << EOF | sudo tee "${ROOTFS_DIR}/etc/hosts" > /dev/null
127.0.0.1       localhost
127.0.1.1       auraos.localdomain auraos
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters
EOF

# Fstab
cat << EOF | sudo tee "${ROOTFS_DIR}/etc/fstab" > /dev/null
# <file system> <mount point> <type> <options> <dump> <pass>
/dev/sda1       /               ext4    defaults        0       1
tmpfs           /tmp            tmpfs   defaults        0       0
EOF

# Locale
echo "en_US.UTF-8 UTF-8" | sudo tee "${ROOTFS_DIR}/etc/locale.gen" > /dev/null
echo "it_IT.UTF-8 UTF-8" | sudo tee -a "${ROOTFS_DIR}/etc/locale.gen" > /dev/null
echo "LANG=en_US.UTF-8" | sudo tee "${ROOTFS_DIR}/etc/default/locale" > /dev/null

# Timezone
echo "Europe/Rome" | sudo tee "${ROOTFS_DIR}/etc/timezone" > /dev/null

# Add AuraOS user
sudo chroot "${ROOTFS_DIR}" /bin/bash -c "useradd -m -s /bin/bash auraos"
sudo chroot "${ROOTFS_DIR}" /bin/bash -c "echo 'auraos:auraos' | chpasswd"
sudo chroot "${ROOTFS_DIR}" /bin/bash -c "usermod -aG sudo auraos"

# Install essential packages
echo "Installing essential packages..."
sudo chroot "${ROOTFS_DIR}" /bin/bash -c "apt-get update"
sudo chroot "${ROOTFS_DIR}" /bin/bash -c "apt-get install -y \
    linux-image-amd64 \
    grub-pc \
    lightdm \
    xorg \
    xserver-xorg-video-all \
    xserver-xorg-input-all \
    chromium \
    network-manager \
    sudo \
    locales \
    tzdata \
    dbus \
    wget \
    curl \
    git \
    vim \
    nano \
    initramfs-tools"

# Generate initramfs
echo "Generating initramfs..."
sudo chroot "${ROOTFS_DIR}" /bin/bash -c "update-initramfs -c -k all"

# Install AuraOS desktop
echo "Installing AuraOS desktop..."
sudo mkdir -p "${ROOTFS_DIR}/usr/share/auraos"
sudo cp -r "$(pwd)/../desktop"/* "${ROOTFS_DIR}/usr/share/auraos/"

# Copy AuraOS systemd service
echo "Configuring AuraOS service..."
sudo mkdir -p "${ROOTFS_DIR}/etc/systemd/system"
sudo cp "$(pwd)/../rootfs/etc/systemd/system/auraos.service" "${ROOTFS_DIR}/etc/systemd/system/auraos.service"
sudo chroot "${ROOTFS_DIR}" /bin/bash -c "systemctl enable auraos.service"

# Configure LightDM
echo "Configuring LightDM..."
sudo mkdir -p "${ROOTFS_DIR}/etc/lightdm"
sudo cp "$(pwd)/../rootfs/etc/lightdm/lightdm.conf" "${ROOTFS_DIR}/etc/lightdm/lightdm.conf"

echo "=== RootFS build complete ==="
echo "RootFS location: ${ROOTFS_DIR}"
