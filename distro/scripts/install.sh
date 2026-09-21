#!/bin/bash
# AuraOS Installer
# Simple installer for AuraOS Real Distro

set -e

echo "========================================="
echo "  AuraOS Installer"
echo "========================================="
echo ""

# Check if running from live environment
if [ ! -f /etc/auraos-live ] && [ ! -f /live/config/auraos.conf ]; then
    echo "ERROR: This installer must be run from the AuraOS live environment"
    exit 1
fi

# Check if root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root: sudo ./install.sh"
    exit 1
fi

# Target disk selection
echo "Available disks:"
lsblk -d -o NAME,SIZE,TYPE,MODEL | grep disk
echo ""
read -p "Enter target disk (e.g., sda): " TARGET_DISK
TARGET_DISK="/dev/${TARGET_DISK}"

if [ ! -b "${TARGET_DISK}" ]; then
    echo "ERROR: ${TARGET_DISK} does not exist"
    exit 1
fi

echo ""
echo "WARNING: This will erase all data on ${TARGET_DISK}"
read -p "Are you sure? (yes/no): " CONFIRM
if [ "${CONFIRM}" != "yes" ]; then
    echo "Installation cancelled"
    exit 0
fi

# Get disk size
DISK_SIZE=$(lsblk -d -o SIZE "${TARGET_DISK}" | tail -n1)
echo "Disk size: ${DISK_SIZE}"

# Partitioning
echo ""
echo "Partitioning ${TARGET_DISK}..."
parted -s "${TARGET_DISK}" mklabel gpt
parted -s "${TARGET_DISK}" mkpart primary fat32 1MiB 512MiB
parted -s "${TARGET_DISK}" set 1 boot on
parted -s "${TARGET_DISK}" mkpart primary ext4 512MiB 100%

# Get partition names
BOOT_PART="${TARGET_DISK}1"
ROOT_PART="${TARGET_DISK}2"

echo "Boot partition: ${BOOT_PART}"
echo "Root partition: ${ROOT_PART}"

# Format partitions
echo ""
echo "Formatting partitions..."
mkfs.fat -F 32 "${BOOT_PART}"
mkfs.ext4 "${ROOT_PART}"

# Mount partitions
echo ""
echo "Mounting partitions..."
mount "${ROOT_PART}" /mnt
mkdir -p /mnt/boot/efi
mount "${BOOT_PART}" /mnt/boot/efi

# Copy rootfs
echo ""
echo "Copying system files..."
if [ -f /live/filesystem.squashfs ]; then
    # Live system
    unsquashfs -d /mnt /live/filesystem.squashfs
else
    # Development environment
    cp -a /mnt/rootfs/* /mnt/
fi

# Generate fstab
echo ""
echo "Generating fstab..."
ROOT_UUID=$(blkid -s UUID -o value "${ROOT_PART}")
BOOT_UUID=$(blkid -s UUID -o value "${BOOT_PART}")

cat > /mnt/etc/fstab << EOF
UUID=${ROOT_UUID} / ext4 defaults 0 1
UUID=${BOOT_UUID} /boot/efi vfat defaults 0 2
tmpfs /tmp tmpfs defaults 0 0
EOF

# Install GRUB
echo ""
echo "Installing GRUB..."
mount --bind /dev /mnt/dev
mount --bind /proc /mnt/proc
mount --bind /sys /mnt/sys

chroot /mnt /bin/bash -c "
    grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=AuraOS --recheck
    grub-install --target=i386-pc --boot-directory=/boot
    update-grub
"

umount /mnt/dev
umount /mnt/proc
umount /mnt/sys

# Create user
echo ""
echo "Creating user..."
chroot /mnt /bin/bash -c "
    useradd -m -s /bin/bash -G sudo,audio,video,plugdev,netdev auraos
    echo 'auraos:auraos' | chpasswd
"

# Set hostname
chroot /mnt /bin/bash -c "echo 'auraos' > /etc/hostname"

# Enable services
chroot /mnt /bin/bash -c "
    systemctl enable NetworkManager
    systemctl enable lightdm
    systemctl enable geoclue
    systemctl enable fwupd
"

# Cleanup
echo ""
echo "Cleaning up..."
umount /mnt/boot/efi
umount /mnt

echo ""
echo "========================================="
echo "  Installation Complete!"
echo "========================================="
echo ""
echo "You can now reboot and remove the USB drive."
echo "AuraOS will boot automatically."
echo ""
read -p "Press Enter to reboot..."
reboot
