# AuraOS Real Distro

**AuraOS** è una distribuzione Linux reale, leggera e moderna, basata su Debian Bookworm. È progettata per:
- **Vecchi PC** non adatti a sistemi operativi moderni
- **Computer con problemi** con OS recenti
- **Sistemi a bassa RAM**
- **Hardware x86_64** generico Intel/AMD

## Caratteristiche

### Sistema Operativo Reale
- **Debian Bookworm** base (stabile e sicura)
- **Kernel Linux 6.x** con supporto per hardware legacy e moderno
- **GRUB 2** con ISO ibrida BIOS+UEFI
- **XFCE 4** desktop environment (leggero e veloce)
- **systemd** init system
- **LightDM** display manager con autologin

### Compatibilità Hardware
- **GPU Intel/AMD/NVIDIA**: supporto base con driver open source
- **Hardware legacy**: BIOS e UEFI, GPU più vecchie, audio integrato
- **RAM**: Ottimizzato per funzionare con 2GB minimo, 8GB raccomandato

### Software Preinstallato

**Internet:**
- Chromium (browser primario)
- Firefox ESR
- Transmission (torrent)

**Office:**
- LibreOffice (Writer, Calc, Impress)
- Evince (PDF viewer)
- Image viewer

**Graphics:**
- GIMP (image editor)
- Inkscape (vector graphics)
- ImageMagick

**Video/Audio:**
- VLC (media player)
- MPV
- Audacity (audio editor)
- FFmpeg

**Development:**
- Git
- Vim, Nano
- Python 3, pip
- GCC/G++

**Utilities:**
- GParted (partition editor)
- Disk utility
- System monitor
- Thunar (file manager)
- Hardinfo

**Drivers e firmware:**
- `firmware-linux` / `firmware-linux-nonfree` - firmware generico
- `firmware-misc-nonfree` - firmware aggiuntivo
- `intel-microcode` - CPU microcode
- `mesa-va-drivers` / `mesa-vdpau-drivers` - accelerazione video
- Driver X.Org per Intel, AMD, NVIDIA, VESA, fbdev
- `tlp` - risparmio energetico su laptop
- `firmware-b43-installer` / `broadcom-sta-dkms` - WiFi Broadcom

### AuraOS Desktop Overlay
- **Chromium kiosk mode** con interfaccia web moderna
- **Glassmorphism design** con animazioni fluide
- **App Store** con 42+ applicazioni
- **Terminale** con tab e AI assist
- **Workspace switcher** visuale
- **Widget desktop** interattivi (meteo, sistema, orologio)
- **Centro notifiche** moderno
- **Quick Settings** panel

## Requisiti

### Minimi
- CPU: x86_64 (Intel o AMD)
- RAM: 2GB minimo, 4GB raccomandato
- Disco: 16GB minimo, 32GB raccomandato
- BIOS o UEFI

### Consigliati
- CPU: Intel Core 2 Duo o superiore
- RAM: 4GB o più
- Disco: SSD 32GB+
- GPU: Intel HD 3000 / AMD Radeon / NVIDIA / generiche (con driver open source)

## Download

```bash
# Scarica l'ISO
wget https://github.com/jeaders/AuraOS/releases/download/v1.0/AuraOS-1.0-amd64.iso

# Verifica checksum
sha256sum -c AuraOS-1.0-amd64.iso.sha256
```

## Installazione

### Da USB

1. Crea USB avviabile:
   ```bash
   sudo dd if=AuraOS-1.0-amd64.iso of=/dev/sdX bs=4M status=progress && sync
   ```

2. Boot da USB:
   - **Mac**: Tieni premuto `Option` all'avvio, seleziona USB
   - **PC**: Entra nel BIOS/UEFI (F2, F12, Canc), seleziona boot da USB

3. Scegli "Installa AuraOS" dal menu GRUB

4. Segui l'installer guidato:
   - Seleziona disco di destinazione
   - Partiziona automaticamente (GPT + ext4)
   - Crea utente `auraos`
   - Attendi installazione (~10-20 minuti)

5. Riavvia e rimuovi USB

## Build da Sorgente

### Prerequisiti

```bash
# Su Debian/Ubuntu
sudo apt-get install -y \
    debootstrap \
    squashfs-tools \
    genisoimage \
    grub-pc-bin \
    grub-efi-amd64-bin \
    xorriso \
    qemu-system-x86 \
    qemu-utils \
    dosfstools \
    parted
```

### Build

```bash
cd distro
chmod +x build.sh
sudo ./build.sh
```

Output: `AuraOS-1.0-amd64.iso`

### Test

```bash
qemu-system-x86_64 -cdrom AuraOS-1.0-amd64.iso -m 2G -enable-kvm
```

Su macOS (senza KVM):
```bash
qemu-system-x86_64 -cdrom AuraOS-1.0-amd64.iso -m 2G
```

## Configurazione Post-Installazione

### Rete
```bash
# WiFi
nmcli dev wifi list
nmcli dev wifi connect "SSID" password "password"

# Ethernet (automatico)
```

### Audio
```bash
# Controlla volume
alsamixer

# Riproduci audio di test
speaker-test -c 2
```

### Grafica e video
```bash
# Se hai problemi di schermata nera
# Prova modalità "Safe Mode" da GRUB o parametri nomodeset
sudo nano /etc/default/grub
# Aggiungi parametri se necessario
sudo update-grub
```

### Brightness
```bash
# Regola luminosità
xbacklight -set 50
brightnessctl s 50%
```

### Batteria
```bash
# Visualizza statistiche batteria
tlp-stat -b

# Risparmio energetico
sudo tlp start
```

### Aggiornamenti
```bash
sudo apt update
sudo apt upgrade
sudo apt autoremove
```

## Troubleshooting

**WiFi non funziona:**
```bash
sudo apt install firmware-b43-installer
sudo modprobe b43
```

**Schermata nera:**
- Prova modalità "Safe Mode" da GRUB
- Usa parametri `nomodeset` o `i915.modeset=1`

**Audio non funziona:**
```bash
sudo alsa force-reload
```

**Trackpad non funziona:**
```bash
sudo apt install xserver-xorg-input-libinput
```

### Vecchi PC

**Grafica lenta:**
```bash
# Usa driver VESA fallback
sudo apt install xserver-xorg-video-vesa
```

**Poca RAM:**
```bash
# Disabilita effetti
xfconf-query -c xfce4-session -p /sessions/...
```

## Struttura del Progetto

```
AuraOS/
├── distro/                  # Real distro build system
│   ├── build.sh            # Main build script
│   ├── kernel/
│   │   └── config          # Kernel config for broad x86_64 support
│   ├── boot/
│   │   └── grub/
│   │       ├── grub.cfg    # GRUB config
│   │       └── theme/
│   ├── debian/
│   │   ├── etc/            # System configuration
│   │   └── usr/            # AuraOS overlay
│   ├── packages/
│   │   └── base.list       # Package list
│   └── scripts/
│       ├── install.sh      # Installer
│       └── post-install.sh # Post-install config
├── desktop/                 # Web desktop overlay
├── docs/                    # Documentation
└── README.md
```

## Build CI

L'ISO di AuraOS viene buildata automaticamente su GitHub Actions ad ogni push su `real-distro`.

[![Build ISO](https://github.com/jeaders/AuraOS/actions/workflows/ci.yml/badge.svg?branch=real-distro)](https://github.com/jeaders/AuraOS/actions/workflows/ci.yml)

Gli artifact sono disponibili nella sezione Actions del repository.

## Supporto

- **GitHub**: https://github.com/jeaders/AuraOS
- **Issues**: https://github.com/jeaders/AuraOS/issues
- **Discussions**: https://github.com/jeaders/AuraOS/discussions
- **Wiki**: https://github.com/jeaders/AuraOS/wiki

## Licenza

MIT License - vedi file LICENSE

## Credits

AuraOS è basato su Debian e utilizza software open source.

Ispirato da: Debian, XFCE, GRUB, Chromium, e la comunità open source.
