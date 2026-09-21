# AuraOS

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Linux-lightgrey)

**AuraOS** è una **distribuzione Linux educativa** con ambiente desktop web-based moderno e innovativo. Ispirata da Zorin OS, elementary OS e GNOME, AuraOS combina la potenza di Linux con un'interfaccia desktop professionale, veloce e intuitiva.

## Caratteristiche

### Core OS
- **Kernel Linux 6.1** personalizzato con branding AuraOS
- **GRUB 2** con tema personalizzato moderno
- **Boot options**: Normale, Safe Mode, Text Mode
- **Debian Bookworm** base (stabile e sicura)
- **systemd** init system
- **LightDM** display manager con autologin

### Desktop Environment
- Interfaccia web-based (HTML/CSS/JS) con design **glassmorphism**
- **Chromium** in kiosk mode come shell
- Boot screen moderno con barra di avanzamento
- Login screen con password opzionale
- Quick settings panel per controlli rapidi
- Dashboard con statistiche sistema in tempo reale
- Tutte le app: File Manager, Terminale, Browser, Tutor AI, Galleria, Musica, Calcolatrice

### Innovazione
- **Design moderno**: Glassmorphism, animazioni fluide, transizioni smooth
- **Quick Settings**: Accesso rapido a WiFi, Bluetooth, Dark Mode, Non disturbare
- **Dashboard**: Widget sistema, prestazioni, meteo in tempo reale
- **Tutor AI integrato**: Assistente educativo contestuale
- **Multi-workspace**: Gestione spazi di lavoro multipli
- **Notifiche intelligenti**: Centro notifiche con badge e toast
- **Launcher globale**: Ricerca veloce app, file e impostazioni

## Anteprima

![GRUB](screenshots/grub.png)
![Boot](screenshots/boot.png)
![Desktop](screenshots/desktop.png)

## Installazione

### Requisiti

- CPU: x86_64 (Intel/AMD)
- RAM: 2GB minimo, 4GB raccomandato
- Disco: 8GB minimo, 16GB raccomandato
- BIOS o UEFI

### Download ISO

```bash
# Scarica l'ISO
wget https://github.com/jeaders/AuraOS/releases/download/v1.0/AuraOS-1.0.iso

# Verifica checksum
sha256sum -c AuraOS-1.0.iso.sha256
```

### Scrittura su USB

```bash
# Identifica il dispositivo USB
lsblk

# Scrivi l'ISO (sostituisci sdX con il tuo dispositivo)
sudo dd if=AuraOS-1.0.iso of=/dev/sdX bs=4M status=progress && sync
```

### Installazione su Virtual Machine

```bash
# QEMU/KVM
qemu-system-x86_64 -cdrom AuraOS-1.0.iso -m 4G -enable-kvm

# VirtualBox
VBoxManage createvm --name AuraOS --register
VBoxManage modifyvm AuraOS --memory 4096 --cpus 2
VBoxManage createhd --filename AuraOS.vdi --size 20000
VBoxManage storagectl AuraOS --name "SATA Controller" --add sata --controller IntelAhci
VBoxManage storageattach AuraOS --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium AuraOS.vdi
VBoxManage storagectl AuraOS --name "IDE Controller" --add ide
VBoxManage storageattach AuraOS --storagectl "IDE Controller" --port 0 --device 0 --type dvddrive --medium AuraOS-1.0.iso
VBoxManage startvm AuraOS --type gui
```

## Struttura del Progetto

```
AuraOS/
├── desktop/              # Interfaccia web
│   ├── index.html
│   ├── css/
│   ├── js/
│   ├── manifest.json
│   └── sw.js
├── kernel/               # Kernel Linux personalizzato
│   ├── config
│   ├── build.sh
│   └── patches/
├── boot/                 # Bootloader GRUB
│   ├── grub/
│   │   ├── grub.cfg
│   │   └── theme/
│   └── isolinux/
├── rootfs/               # Filesystem radice
│   ├── etc/
│   ├── usr/share/auraos/
│   └── ...
├── iso/                  # Build ISO
├── scripts/              # Script di build
│   ├── build-all.sh
│   ├── build-kernel.sh
│   ├── build-rootfs.sh
│   ├── build-iso.sh
│   └── setup-dev.sh
├── docs/                 # Documentazione
│   ├── kernel.md
│   ├── grub.md
│   ├── filesystem.md
│   └── build.md
├── package.json          # Electron wrapper (opzionale)
├── main.js
├── preload.js
├── .github/workflows/ci.yml
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

## Build da Sorgente

### Setup Ambiente

```bash
# Su Debian/Ubuntu
sudo apt-get install -y \
    build-essential libncurses-dev libssl-dev libelf-dev bc wget curl git \
    debootstrap squashfs-tools genisoimage grub-pc-bin grub-efi-amd64-bin xorriso \
    qemu-system-x86 qemu-utils

# Setup automatico
chmod +x scripts/setup-dev.sh
sudo ./scripts/setup-dev.sh
```

### Build Completo

```bash
chmod +x scripts/build-all.sh
./scripts/build-all.sh
```

Output: `AuraOS-1.0.iso`

### Test

```bash
qemu-system-x86_64 -cdrom AuraOS-1.0.iso -m 2G
```

## Architettura

```
+------------------+
|   GRUB 2         |  <- Bootloader con tema moderno
+------------------+
         |
+------------------+
|   Linux Kernel   |  <- Kernel 6.1 personalizzato
|   (auraos-kernel)|     + Branding AuraOS
+------------------+
         |
+------------------+
|   Initramfs      |  <- Initramfs minimale
+------------------+
         |
+------------------+
|   Root Filesystem|  <- Debian Bookworm rootfs
|   (ext4)         |     + AuraOS desktop in /usr/share/auraos/
+------------------+
         |
+------------------+
|   systemd        |  <- Init system
+------------------+
         |
+------------------+
|   LightDM        |  <- Display manager con autologin
+------------------+
         |
+------------------+
|   Chromium       |  <- Browser in kiosk mode
|   (kiosk)        |     + Carica /usr/share/auraos/index.html
+------------------+
         |
+------------------+
|   AuraOS Desktop |  <- Interfaccia web moderna
|   (index.html)   |     + Glassmorphism design
|                  |     + Quick Settings
|                  |     + Dashboard
|                  |     + App, finestre, filesystem virtuale
+------------------+
```

## Contributi

Vedi [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Roadmap

Vedi [`docs/implementation-plan.md`](docs/implementation-plan.md).

## Licenza

MIT License - vedi [`LICENSE`](LICENSE).

## Copyright

Copyright Alex Mirici  
Sito: https://alexmirici.netlify.app
