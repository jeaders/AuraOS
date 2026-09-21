# Kernel di AuraOS

AuraOS utilizza **Linux 6.1** come kernel base, personalizzato con branding e configurazioni ottimizzate per l'uso desktop educativo.

## Panoramica

Il kernel è configurato per:
- Architettura x86_64
- Supporto hardware desktop completo
- Filesystem ext4, FAT
- Networking (WiFi, Ethernet)
- Input devices (tastiera, mouse, touchpad)
- Grafica (DRM/KMS, framebuffer)
- Audio (ALSA)
- USB
- ACPI per gestione energia

## Struttura

```
kernel/
├── config              # Configurazione kernel
├── build.sh            # Script di compilazione
├── patches/
│   └── auraos-branding.patch  # Patch branding
└── README.md
```

## Build

```bash
chmod +x scripts/build-kernel.sh
./scripts/build-kernel.sh
```

Il kernel compilato sarà in `build/auraos-kernel`.

## Personalizzazione

Per modificare la configurazione:

```bash
cd kernel/build/linux-6.1.0
make menuconfig
# Dopo le modifiche, salva e copia la nuova config
cp .config ../../config
```

## Branding

La patch `auraos-branding.patch` modifica:
- Il banner del kernel da "Linux" a "AuraOS"
- La versione in `EXTRAVERSION`

## Note

- Il kernel è monolitico per semplicità
- I moduli sono installati in `/lib/modules/`
- Il kernel è ottimizzato per prestazioni desktop
