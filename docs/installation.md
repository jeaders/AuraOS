# Installazione di AuraOS

Questa guida spiega come installare AuraOS sul tuo computer.

## Download

1. Vai su [Releases](https://github.com/jeaders/AuraOS/releases)
2. Scarica `AuraOS-1.0.iso`
3. Verifica il checksum:
   ```bash
   sha256sum -c AuraOS-1.0.iso.sha256
   ```

## Preparazione USB

### Su Linux/macOS

```bash
# Identifica il dispositivo USB
lsblk

# Scrivi l'ISO (sostituisci sdX con il tuo dispositivo USB)
sudo dd if=AuraOS-1.0.iso of=/dev/sdX bs=4M status=progress && sync
```

### Su Windows

Usa [Rufus](https://rufus.ie/) o [balenaEtcher](https://www.balena.io/etcher/):
1. Seleziona l'ISO di AuraOS
2. Seleziona il dispositivo USB
3. Clicca "Flash"

## Installazione

### Boot da USB

1. Inserisci la USB nel computer
2. Riavvia il computer
3. Entra nel BIOS/UEFI (solitamente F2, F12, o Canc)
4. Seleziona il boot da USB
5. Premi INVIO quando appare il menu GRUB

### Installazione Guidata

AuraOS si avvia in modalità live. Per installarlo:

1. **Avvia** AuraOS in modalità live
2. **Apri** il File Manager
3. **Cerca** lo script di installazione `install-auraos.sh`
4. **Esegui** lo script come root:
   ```bash
   sudo ./install-auraos.sh
   ```
5. **Segui** le istruzioni a schermo

## Partizionamento

### Installazione Automatica (consigliata)

Lo script di installazione può:
- Cancellare tutto il disco e installare AuraOS
- Installare AuraOS accanto a Windows (dual boot)
- Usare lo spazio libero esistente

### Partizionamento Manuale

Se preferisci partizionare manualmente:

```
/dev/sda1  /boot   ext4   512MB
/dev/sda2  /       ext4   Resto del disco
/dev/sda3  swap    swap   4GB (opzionale)
```

## Post-Installazione

1. **Riavvia** il sistema
2. **Rimuovi** la USB
3. **Accedi** al nuovo sistema AuraOS
4. **Configura** le impostazioni iniziali

## Dual Boot con Windows

Per installare AuraOS accanto a Windows:

1. **Riduci** la partizione Windows da Windows stesso
2. **Avvia** da USB AuraOS
3. **Installa** nello spazio libero creato
4. **GRUB** rileverà automaticamente Windows

## Troubleshooting

### USB non si avvia
- Verifica che il BIOS sia in modalità UEFI o Legacy come richiesto
- Prova a riscrivere l'USB
- Verifica l'hash SHA256 dell'ISO

### Schermata nera dopo GRUB
- Prova la modalità "Safe Mode"
- Prova la modalità "Text Mode"
- Verifica i driver grafici

### Installazione si blocca
- Verifica che ci sia spazio su disco
- Verifica che la partizione sia corretta
- Prova con partizionamento manuale

## Supporto

Se hai problemi con l'installazione:
- Consulta [Troubleshooting](troubleshooting.md)
- Apri una [Issue](https://github.com/jeaders/AuraOS/issues)
- Chiedi nelle [Discussions](https://github.com/jeaders/AuraOS/discussions)
