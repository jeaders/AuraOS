#!/bin/bash
# Build script for AuraOS kernel
# Requires: gcc, make, bc, libncurses-dev, libssl-dev, libelf-dev

set -e

KERNEL_VERSION="6.1.0"
KERNEL_URL="https://cdn.kernel.org/pub/linux/kernel/v6.x/linux-${KERNEL_VERSION}.tar.xz"
BUILD_DIR="$(pwd)/build"

echo "=== AuraOS Kernel Build ==="
echo "Kernel version: ${KERNEL_VERSION}"

# Clean previous build
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"
cd "${BUILD_DIR}"

# Download kernel if not present
if [ ! -f "linux-${KERNEL_VERSION}.tar.xz" ]; then
    echo "Downloading Linux kernel ${KERNEL_VERSION}..."
    wget -q "${KERNEL_URL}"
fi

# Extract
echo "Extracting kernel..."
tar xf "linux-${KERNEL_VERSION}.tar.xz"
cd "linux-${KERNEL_VERSION}"

# Copy AuraOS config
cp "$(pwd)/../../config" .config

# Apply AuraOS branding patch
echo "Applying AuraOS branding..."
if [ -f "$(pwd)/../../patches/auraos-branding.patch" ]; then
    patch -p1 < "$(pwd)/../../patches/auraos-branding.patch"
fi

# Build kernel
echo "Building kernel..."
make -j$(nproc) bzImage

# Build modules
echo "Building modules..."
make -j$(nproc) modules

echo "=== Build complete ==="
echo "Kernel: ${BUILD_DIR}/linux-${KERNEL_VERSION}/arch/x86/boot/bzImage"
echo "Modules: ${BUILD_DIR}/linux-${KERNEL_VERSION}/"

