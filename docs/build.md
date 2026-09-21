# Build di AuraOS

Questa guida spiega come buildare AuraOS da zero.

## Prerequisiti

### Sistema di Build (Linux raccomandato)

AuraOS può essere buildato su:
- **Debian/Ubuntu** (raccomandato)
- **Fedora/RHEL**
- **Arch Linux**

Su macOS, è possibile preparare il progetto ma la build finale richiede Linux.

### Dipendenze

```bash
# Debian/Ubuntu
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

# Fedora/RHEL
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

# Arch
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
```

## Setup Development

```bash
# Automatic setup
chmod +x scripts/setup-dev.sh
sudo ./scripts/setup-dev.sh
```

## Build Completo

```bash
chmod +x scripts/build-all.sh
./scripts/build-all.sh
```

Questo script:
1. Builda il kernel Linux personalizzato
2. Crea il root filesystem con debootstrap
3. Crea l'ISO bootabile

## Build Separati

### Solo Kernel

```bash
chmod +x scripts/build-kernel.sh
./scripts/build-kernel.sh
```

### Solo RootFS

```bash
chmod +x scripts/build-rootfs.sh
./scripts/build-rootfs.sh
```

### Solo ISO

```bash
chmod +x scripts/build-iso.sh
./scripts/build-iso.sh
```

## Output

- `AuraOS-1.0.iso` - Immagine ISO avviabile
- `AuraOS-1.0.iso.sha256` - Checksum SHA256

## Test con QEMU

```bash
qemu-system-x86_64 -cdrom AuraOS-1.0.iso -m 2G -enable-kvm
```

Su macOS (senza KVM):

```bash
qemu-system-x86_64 -cdrom AuraOS-1.0.iso -m 2G
```

## Scrittura su USB

```bash
# Identifica il dispositivo USB (es. /dev/sdb)
lsblk

# Scrivi l'ISO
sudo dd if=AuraOS-1.0.iso of=/dev/sdX bs=4M status=progress && sync
```

## Troubleshooting

### Kernel non compila

Verifica di avere tutti i pacchetti di sviluppo installati.

### debootstrap fallisce

Verifica la connessione internet e il mirror nel script.

### ISO non avviabile

Verifica che GRUB sia installato correttamente e che il kernel sia presente in `/live/`.

## Note

- La build richiede ~4GB di spazio disco
- Il processo richiede 30-60 minuti
- Il kernel richiede ~1GB di RAM per compilare
- L'ISO finale è ~1-2GB
