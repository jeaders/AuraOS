# Filesystem di AuraOS

AuraOS utilizza un filesystem gerarchico standard Linux con alcune personalizzazioni.

## Struttura

```
rootfs/
├── bin/           # Binari essenziali
├── sbin/          # Binari di sistema
├── lib/           # Librerie condivise
├── lib64/         # Librerie 64-bit
├── usr/
│   ├── bin/       # Binari utente
│   ├── sbin/      # Binari di amministrazione
│   └── share/
│       └── auraos/  # Desktop AuraOS (HTML/CSS/JS)
├── etc/           # Configurazioni
│   ├── default/
│   │   └── grub  # Configurazione GRUB
│   ├── grub/
│   │   └── grub.cfg
│   ├── lightdm/  # Display manager
│   ├── network/  # Configurazione rete
│   ├── systemd/system/  # Servizi systemd
│   └── apt/      # Package manager
├── dev/           # Device files
├── proc/          # Process info
├── sys/           # Sysfs
├── run/           # Runtime data
├── home/          # Home utenti
├── mnt/           # Mount points
├── opt/           # Software aggiuntivo
├── root/          # Home di root
├── tmp/           # File temporanei
└── var/
    ├── log/       # Log di sistema
    └── cache/     # Cache
```

## Partizioni

- **/** - Root filesystem (ext4)
- **/boot** - Boot files (opzionale, 512MB)
- **/home** - Dati utente (opzionale, separato)
- **swap** - Swap (opzionale, 2-4GB)

## Filesystem Supportati

- **ext4** - Predefinito, journaling, affidabile
- **FAT32** - Compatibilità con Windows
- **NTFS** - Lettura/scrittura Windows
- **ISO9660** - Lettura CD/DVD
- **TMPFS** - Filesystem in memoria (tmp, run)

## Persistent Storage

AuraOS salva:
- Configurazioni utente in `/home/auraos/`
- Dati app in `/home/auraos/.config/`
- Filesystem virtuale in `/home/auraos/.auraos/`
- Note, impostazioni, preferiti

## Permessi

- Owner: `auraos:auraos`
- Home: `700`
- Config: `600`
- Temp: `1777`

## Note

- Il rootfs è minimale (~2GB con desktop)
- Le applicazioni sono installate via apt
- Il desktop web è in `/usr/share/auraos/`
- I dati persistenti sono in `/home/auraos/`
