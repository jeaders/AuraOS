# AuraOS Real Distro

This directory contains the files for building a **real Debian-based Linux distribution** that can be installed on real hardware, including MacBook Pro 2011.

## Structure

```
distro/
├── build.sh              # Main build script
├── packages/             # Package lists
│   ├── base.list        # Core system packages
│   ├── desktop.list     # Desktop environment packages
│   ├── internet.list    # Browser and networking
│   ├── office.list      # Productivity apps
│   ├── graphics.list    # Graphics software
│   ├── multimedia.list  # Audio/video
│   └── drivers.list     # MacBook Pro 2011 drivers
├── scripts/
│   ├── post-install.sh  # Post-installation setup
│   └── auraos-setup.sh  # AuraOS configuration
├── debian/
│   ├── etc/             # System configuration
│   └── usr/             # AuraOS overlay files
└── patches/             # Custom patches
```

## Building the ISO

### Prerequisites

You need a Debian/Ubuntu Linux system to build the ISO:

```bash
# On Debian/Ubuntu
sudo apt-get install -y \
    debootstrap \
    squashfs-tools \
    genisoimage \
    grub-pc-bin \
    grub-efi-amd64-bin \
    xorriso \
    qemu-system-x86 \
    qemu-utils \
    systemd-container
```

### Build

```bash
cd distro
chmod +x build.sh
sudo ./build.sh
```

This will create `AuraOS-1.0-amd64.iso` in the parent directory.

### Test

```bash
qemu-system-x86_64 -cdrom ../AuraOS-1.0-amd64.iso -m 2G -enable-kvm
```

### Install on MacBook Pro 2011

1. Create bootable USB:
   ```bash
   sudo dd if=../AuraOS-1.0-amd64.iso of=/dev/sdX bs=4M status=progress && sync
   ```

2. Boot from USB (hold Option key at startup on Mac)

3. Install AuraOS alongside macOS or replace macOS

## MacBook Pro 2011 Compatibility

AuraOS is optimized for MacBook Pro 2011 models with:

- **CPU**: Intel Core i5/i7 (2nd/3rd generation)
- **RAM**: 8GB DDR3
- **GPU**: Intel HD Graphics 3000 / AMD Radeon HD 6750M
- **Display**: 13.3" LED-backlit
- **Storage**: SATA SSD/HDD

### Supported Hardware

- WiFi: Broadcom BCM43xx (requires firmware-b43-installer)
- Audio: Intel HDA (works out of the box)
- Graphics: Intel HD 3000 (with mesa va-drivers)
- Touchpad: Apple Magic Trackpad (works with libinput)
- Keyboard: Apple keyboard (works with xkb options)
- Webcam: FaceTime HD (works with uvcvideo)
- Bluetooth: Broadcom BCM20702 (requires firmware)

### Power Management

- TLP for battery optimization
- thermald for thermal management
- laptop-mode-tools for power saving

## Desktop Environment

AuraOS uses **XFCE 4** as the default desktop environment because:

- Lightweight (runs well on 8GB RAM)
- Fast and responsive
- Highly customizable
- Stable and mature
- Low resource usage (~400MB RAM idle)

### Installed Software

**Internet:**
- Chromium (primary browser)
- Firefox ESR
- Transmission (torrent client)

**Office:**
- LibreOffice (word processor, spreadsheet, presentation)
- Evince (PDF viewer)
- Image viewer

**Graphics:**
- GIMP (image editor)
- Inkscape (vector graphics)
- Blender (3D modeling)

**Video/Audio:**
- VLC (media player)
- Audacity (audio editor)
- OBS Studio (screen recording)

**Development:**
- VS Code
- Git
- Python 3
- Node.js/npm
- GCC/G++

**Utilities:**
- GParted (partition editor)
- Disk utility
- System monitor
- File manager (Thunar)

## AuraOS Desktop Overlay

The `/opt/auraos/` directory contains a modern web-based desktop overlay:

- Chromium kiosk mode loads `file:///opt/auraos/index.html`
- Modern glassmorphism UI
- App launcher with search
- File manager integration
- System monitoring widgets
- Weather widget (requires geolocation)

This overlay runs **on top of** the real XFCE desktop, providing a modern interface while maintaining full access to real Linux applications.

## Customization

### Change Desktop Environment

To use a different DE instead of XFCE:

```bash
# GNOME (heavier)
apt-get install -y gnome-session gdm3

# KDE Plasma (medium)
apt-get install -y plasma-desktop sddm

# LXQt (lighter)
apt-get install -y lxqt-core lxqt-session
```

### Remove AuraOS Overlay

To use plain XFCE without the AuraOS overlay:

```bash
rm -f /home/auraos/.config/autostart/auraos.desktop
```

## Troubleshooting

### MacBook Pro 2011 specific

**WiFi not working:**
```bash
sudo apt-get install firmware-b43-installer
sudo modprobe b43
```

**Brightness control:**
```bash
sudo apt-get install xbacklight brightnessctl
```

**Trackpad issues:**
```bash
sudo apt-get install xserver-xorg-input-libinput
```

**Graphics issues:**
```bash
sudo apt-get install mesa-va-drivers mesa-vdpau-drivers
```

## Support

- Documentation: https://github.com/jeaders/AuraOS/wiki
- Issues: https://github.com/jeaders/AuraOS/issues
- Discussions: https://github.com/jeaders/AuraOS/discussions
