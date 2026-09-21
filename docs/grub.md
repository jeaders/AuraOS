# GRUB Bootloader

AuraOS utilizza **GRUB 2** come bootloader, con tema personalizzato.

## Panoramica

GRUB (Grand Unified Bootloader) è il bootloader standard per la maggior parte delle distribuzioni Linux. In AuraOS è configurato con:
- Tema personalizzato AuraOS
- Supporto BIOS e UEFI
- Avvio automatico dopo 5 secondi
- Opzioni di boot (normale, safe mode, text mode)

## Struttura

```
boot/
├── grub/
│   ├── grub.cfg            # Configurazione principale
│   └── theme/
│       └── auraos.txt      # Tema personalizzato
└── isolinux/               # Boot legacy (opzionale)
```

## Configurazione

### grub.cfg

Entry principali:
1. **AuraOS** - Boot normale con GUI
2. **AuraOS (Safe Mode)** - Boot senza driver grafici
3. **AuraOS (Text Mode)** - Boot in modalità testo
4. **System Setup** - Entra nel BIOS/UEFI

### Theme

Il tema GRUB è definito in `theme/auraos.txt` con:
- Colori scuri (tema notte)
- Logo AuraOS
- Testo in italiano
- Sottotitolo: "Sistema Operativo Virtuale Educativo"

## Build

```bash
# Per BIOS
grub-install --target=i386-pc --boot-directory=iso/boot /dev/sdX

# Per UEFI
grub-install --target=x86_64-efi --efi-directory=iso/boot/efi --boot-directory=iso/boot --removable
```

## Personalizzazione

Per modificare il tema, editare `theme/auraos.txt`.

Per aggiungere voci di menu, editare `grub.cfg`.

## Note

- Il timeout è impostato a 5 secondi
- L'avvio automatico è abilitato
- Il kernel è caricato da `/live/vmlinuz`
- L'initrd è caricato da `/live/initrd.img`
