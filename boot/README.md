# AuraOS Boot System

This directory contains the bootloader configuration and files for AuraOS.

## Contents

- `grub/grub.cfg` - Main GRUB configuration
- `grub/theme/auraos.txt` - GRUB theme configuration
- `isolinux/` - Legacy BIOS boot files (optional)

## Boot Process

1. BIOS/UEFI loads GRUB
2. GRUB shows AuraOS menu with theme
3. Linux kernel is loaded
4. Initramfs is loaded
5. Root filesystem is mounted
6. `init` process starts

## Building Boot Files

```bash
# Install GRUB
grub-install --target=i386-pc --boot-directory=iso/boot /dev/sdX

# Or for UEFI
grub-install --target=x86_64-efi --efi-directory=iso/boot/efi --boot-directory=iso/boot --removable
```

## Customization

- Edit `grub.cfg` to change boot entries
- Edit `theme/auraos.txt` to change GRUB appearance
- Add kernel parameters in `grub.cfg`
