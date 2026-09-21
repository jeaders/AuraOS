#!/bin/bash
# Setup development environment for AuraOS

set -e

echo "Setting up AuraOS development environment..."

# Install build dependencies
echo "Installing build dependencies..."
if [ -f /etc/debian_version ]; then
    sudo apt-get update
    sudo apt-get install -y \
        build-essential \
        libncurses-dev \
        libssl-dev \
        libelf-dev \
        bc \
        wget \
        curl \
        git \
        debootstrap \
        squashfs-tools \
        genisoimage \
        grub-pc-bin \
        grub-efi-amd64-bin \
        xorriso \
        qemu-system-x86 \
        qemu-utils
elif [ -f /etc/fedora-release ]; then
    sudo dnf install -y \
        @development-tools \
        ncurses-devel \
        openssl-devel \
        elfutils-libelf-devel \
        bc \
        wget \
        curl \
        git \
        debootstrap \
        squashfs-tools \
        genisoimage \
        grub2-tools \
        grub2-efi-x64 \
        xorriso \
        qemu-system-x86 \
        qemu-img
elif [ -f /etc/arch-release ]; then
    sudo pacman -S --needed \
        base-devel \
        ncurses \
        openssl-1.1 \
        elfutils \
        bc \
        wget \
        curl \
        git \
        debootstrap \
        squashfs-tools \
        cdrtools \
        grub \
        qemu-system-x86 \
        qemu-img
else
    echo "Unsupported distribution. Please install dependencies manually."
    echo "Required: build-essential, libncurses-dev, libssl-dev, libelf-dev, bc, wget, curl, git, debootstrap, squashfs-tools, genisoimage, grub-pc-bin, grub-efi-amd64-bin, xorriso, qemu-system-x86"
    exit 1
fi

echo ""
echo "Development environment setup complete!"
echo ""
echo "To build AuraOS:"
echo "  cd scripts"
echo "  ./build-all.sh"
echo ""
