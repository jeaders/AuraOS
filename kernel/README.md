# AuraOS Kernel

This directory contains the Linux kernel configuration and build scripts for AuraOS.

## Contents

- `config` - Kernel configuration for AuraOS
- `build.sh` - Automated build script
- `patches/auraos-branding.patch` - Branding patch

## Building the Kernel

### Prerequisites

```bash
# Debian/Ubuntu
sudo apt-get install build-essential libncurses-dev libssl-dev libelf-dev bc wget

# Fedora/RHEL
sudo dnf install @development-tools ncurses-devel openssl-devel elfutils-libelf-devel bc wget

# Arch
sudo pacman -S base-devel ncurses openssl-1.1 elfutils bc wget
```

### Build

```bash
chmod +x build.sh
./build.sh
```

The compiled kernel will be in `build/auraos-kernel`.

## Kernel Configuration

The kernel is configured for:
- x86_64 architecture
- Desktop/graphical use
- ext4, FAT filesystems
- Common hardware support (Intel/Realtek NICs, PS/2 input, USB)
- ACPI power management

## Customization

To modify the kernel configuration:

```bash
cd build/linux-6.1.0
make menuconfig
# Then copy .config back to this directory
cp .config ../../config
```

## Notes

- We use Linux as the kernel base
- AuraOS branding is applied via patch
- The kernel is built as a monolithic kernel for simplicity
