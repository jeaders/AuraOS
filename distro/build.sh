#!/bin/bash
# AuraOS Real Distro Build Script
# Builds a complete Debian-based ISO for MacBook Pro 2011

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DISTRO_DIR="${SCRIPT_DIR}/.."
BUILD_DIR="${DISTRO_DIR}/build"
ISO_OUTPUT="${DISTRO_DIR}/AuraOS-1.0-amd64.iso"

echo "=== AuraOS Real Distro Build ==="
echo "Target: MacBook Pro 2011 (8GB RAM, Intel GPU)"
echo ""

# Clean previous build
rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

# Step 1: Create rootfs with debootstrap
echo "[1/5] Creating root filesystem with debootstrap..."
sudo debootstrap --arch=amd64 --variant=minbase \
    --include="systemd,systemd-sysv,dbus" \
    bookworm "${BUILD_DIR}/rootfs" \
    http://deb.debian.org/debian

# Step 2: Copy AuraOS configuration
echo "[2/5] Copying AuraOS configuration..."
sudo cp -r "${DISTRO_DIR}/distro/debian/etc" "${BUILD_DIR}/rootfs/"
sudo cp -r "${DISTRO_DIR}/distro/debian/usr" "${BUILD_DIR}/rootfs/"

# Step 3: Install packages
echo "[3/5] Installing packages..."
sudo chroot "${BUILD_DIR}/rootfs" /bin/bash -c "
    export DEBIAN_FRONTEND=noninteractive
    apt-get update
    apt-get install -y \
        linux-image-amd64 \
        linux-headers-amd64 \
        grub-pc \
        grub-efi-amd64 \
        xorg \
        xfce4 \
        xfce4-goodies \
        lightdm \
        network-manager \
        network-manager-gnome \
        chromium \
        chromium-l10n \
        firefox-esr \
        sudo \
        locales \
        tzdata \
        wget \
        curl \
        git \
        vim \
        nano \
        htop \
        neofetch \
        apt-transport-https \
        ca-certificates \
        gnupg \
        software-properties-common \
        bluez \
        bluez-firmware \
        pulseaudio \
        pavucontrol \
        alsa-utils \
        firmware-linux \
        firmware-linux-nonfree \
        firmware-misc-nonfree \
        intel-microcode \
        thermald \
        laptop-mode-tools \
        acpi \
        acpi-call-dkms \
        powertop \
        tlp \
        tlp-rdw \
        udisks2 \
        gvfs-backends \
        gvfs-fuse \
        thunar \
        thunar-archive-plugin \
        thunar-media-tags-plugin \
        file-roller \
        p7zip-full \
        unzip \
        zip \
        gparted \
        gnome-disk-utility \
        hardinfo \
        lshw \
        pciutils \
        usbutils \
        dmidecode \
        smartmontools \
        mesa-va-drivers \
        mesa-vdpau-drivers \
        va-driver-all \
        vdpauinfo \
        intel-gpu-tools \
        xbacklight \
        brightnessctl \
        cpufrequtils \
        i965-va-driver \
        vainfo \
        ffmpeg \
        vlc \
        mpv \
        youtube-dl \
        transmission \
        transmission-gtk \
        simple-scan \
        evince \
        eog \
        imagemagick \
        gimp \
        inkscape \
        scribus \
        libreoffice \
        libreoffice-gtk3 \
        libreoffice-style-breeze \
        calibre \
        discord \
        telegram-desktop \
        signal-desktop \
        keepassxc \
        bitwarden \
        gnome-screenshot \
        flameshot \
        obs-studio \
        audacity \
        lmms \
        ardour \
        blender \
        openshot \
        kdenlive \
        scribus \
        freecad \
        darktable \
        rawtherapee \
        avidemux \
        handbrake \
        mkvtoolnix \
        apt-listchanges \
        apt-xapian-index \
        aptitude \
        dpkg-dev \
        debhelper \
        fakeroot \
        build-essential \
        python3 \
        python3-pip \
        nodejs \
        npm \
        code \
        vscode \
        zeal \
        zeal \
        geogebra \
        scilab \
        maxima \
        wxmaxima \
        lyx \
        gummi \
        texlive \
        texlive-latex-extra \
        texlive-fonts-recommended \
        texlive-science \
        texlive-pictures \
        texlive-lang-italian \
        asymptote \
        gnuplot \
        octave \
        r-base \
        sqlite3 \
        sqlitebrowser \
        pgadmin3 \
        mongodb-clients \
        redis-tools \
        docker.io \
        podman \
        kubectl \
        minikube \
        helm \
        terraform \
        ansible \
        vagrant \
        virtualbox \
        virt-manager \
        qemu-system-x86 \
        qemu-utils \
        libvirt-daemon-system \
        libvirt-clients \
        git-cola \
        gitg \
        tig \
        meld \
        diffutils \
        patch \
        rsync \
        rclone \
        ncdu \
        baobab \
        deja-dup \
        timeshift \
        cron \
        at \
        logrotate \
        systemd-analyze
    "

# Step 4: Configure system
echo "[4/5] Configuring system..."
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
"

# Step 5: Build ISO
echo "[5/5] Building ISO..."
sudo mksquashfs "${BUILD_DIR}/rootfs" "${BUILD_DIR}/filesystem.squashfs" -comp xz -noappend

# Create ISO structure
mkdir -p "${BUILD_DIR}/iso/boot/grub"
mkdir -p "${BUILD_DIR}/iso/live"

# Copy kernel and initrd
cp "${BUILD_DIR}/rootfs/boot/vmlinuz-"* "${BUILD_DIR}/iso/live/vmlinuz"
cp "${BUILD_DIR}/rootfs/boot/initrd.img-"* "${BUILD_DIR}/iso/live/initrd.img"

# Copy squashfs
cp "${BUILD_DIR}/filesystem.squashfs" "${BUILD_DIR}/iso/live/"

# Copy GRUB config
cp "${DISTRO_DIR}/boot/grub/grub.cfg" "${BUILD_DIR}/iso/boot/grub/grub.cfg"

# Copy GRUB modules
cp -r /usr/lib/grub/i386-pc "${BUILD_DIR}/iso/boot/grub/"
cp -r /usr/lib/grub/x86_64-efi "${BUILD_DIR}/iso/boot/grub/"

# Create ISO
sudo grub-mkrescue -o "${ISO_OUTPUT}" "${BUILD_DIR}/iso" --xorriso=" -quiet "

# Generate checksum
sha256sum "${ISO_OUTPUT}" > "${ISO_OUTPUT}.sha256"

echo ""
echo "=== Build Complete ==="
echo "ISO: ${ISO_OUTPUT}"
echo "SHA256: $(cat ${ISO_OUTPUT}.sha256)"
echo ""
echo "To test:"
echo "  qemu-system-x86_64 -cdrom ${ISO_OUTPUT} -m 2G -enable-kvm"
echo ""
echo "To write to USB:"
echo "  sudo dd if=${ISO_OUTPUT} of=/dev/sdX bs=4M status=progress && sync"
echo ""
