# Risoluzione Problemi - AuraOS

Questa guida aiuta a risolvere i problemi più comuni con AuraOS.

## Problemi di Boot

### GRUB non si avvia

**Sintomi**: Il computer si avvia direttamente in AuraOS o mostra errore GRUB

**Soluzioni**:
1. Ripristina GRUB da live USB:
   ```bash
   sudo mount /dev/sda1 /mnt
   sudo grub-install --boot-directory=/mnt/boot /dev/sda
   sudo update-grub
   ```

### Schermata nera dopo GRUB

**Sintomi**: Schermata nera o vuota dopo il menu GRUB

**Soluzioni**:
1. Prova **Safe Mode** da GRUB
2. Prova **Text Mode** da GRUB
3. Modifica i parametri di boot in GRUB:
   ```
   linux /live/vmlinuz nomodeset
   ```

### Kernel Panic

**Sintomi**: Messaggio "Kernel panic" durante il boot

**Soluzioni**:
1. Verifica che l'ISO non sia corrotta
2. Prova a buildare l'ISO di nuovo
3. Verifica i parametri di boot

## Problemi di Sistema

### Desktop non si carica

**Sintomi**: Schermata vuota dopo il login

**Soluzioni**:
1. Premi `Ctrl+Alt+F2` per aprire un terminale
2. Riavvia il servizio:
   ```bash
   sudo systemctl restart auraos
   ```
3. Verifica che Chromium sia installato:
   ```bash
   which chromium
   ```

### Audio non funziona

**Sintomi**: Nessun suono dal sistema

**Soluzioni**:
1. Verifica che il servizio audio sia attivo:
   ```bash
   systemctl status alsa-state
   ```
2. Riavvia il servizio audio:
   ```bash
   sudo alsa force-reload
   ```
3. Verifica i dispositivi audio:
   ```bash
   aplay -l
   ```

### Rete non funziona

**Sintomi**: Nessuna connessione di rete

**Soluzioni**:
1. Verifica che NetworkManager sia attivo:
   ```bash
   systemctl status NetworkManager
   ```
2. Riavvia NetworkManager:
   ```bash
   sudo systemctl restart NetworkManager
   ```
3. Verifica le interfacce di rete:
   ```bash
   ip a
   ```
4. Prova a connetterti manualmente:
   ```bash
   sudo dhclient eth0
   ```

### WiFi non funziona

**Sintomi**: WiFi non viene rilevato

**Soluzioni**:
1. Verifica che il modulo WiFi sia caricato:
   ```bash
   lsmod | grep wifi
   ```
2. Installa firmware mancanti:
   ```bash
   sudo apt install firmware-linux firmware-iwlwifi
   ```
3. Riavvia il sistema

### Bluetooth non funziona

**Sintomi**: Dispositivi Bluetooth non rilevati

**Soluzioni**:
1. Verifica che Bluetooth sia attivo:
   ```bash
   systemctl status bluetooth
   ```
2. Riavvia il servizio:
   ```bash
   sudo systemctl restart bluetooth
   ```

## Problemi di Hardware

### Touchpad non funziona

**Sintomi**: Il touchpad non risponde

**Soluzioni**:
1. Verifica che sia riconosciuto:
   ```bash
   xinput list
   ```
2. Abilita il touchpad:
   ```bash
   xinput enable <id-touchpad>
   ```

### Schermo esterno non funziona

**Sintomi**: Monitor esterno non rilevato

**Soluzioni**:
1. Verifica le connessioni fisiche
2. Rileva displays:
   ```bash
   xrandr --auto
   ```
3. Configura manualmente:
   ```bash
   xrandr --output HDMI-1 --auto --right-of eDP-1
   ```

### Stampante non funziona

**Sintomi**: La stampante non stampa

**Soluzioni**:
1. Installa CUPS:
   ```bash
   sudo apt install cups
   sudo systemctl enable --now cups
   ```
2. Aggiungi la stampante nelle impostazioni di sistema

## Problemi di Prestazioni

### Sistema lento

**Sintomi**: AuraOS risponde lentamente

**Soluzioni**:
1. Verifica l'uso della CPU:
   ```bash
   top
   ```
2. Verifica l'uso della memoria:
   ```bash
   free -h
   ```
3. Disabilita effetti grafici in Impostazioni
4. Chiudi app non necessarie
5. Aumenta la swap se necessario

### Grafica lenta

**Sintomi**: Animazioni a scatti, interfaccia lenta

**Soluzioni**:
1. Installa driver grafici proprietari:
   ```bash
   sudo apt install nvidia-driver  # Per NVIDIA
   sudo apt install xserver-xorg-video-amdgpu  # Per AMD
   ```
2. Disabilita compositing:
   ```bash
   xcompmgr -c
   ```

## Problemi di Spazio

### Disco pieno

**Sintomi**: Impossibile salvare file, sistema lento

**Soluzioni**:
1. Verifica lo spazio:
   ```bash
   df -h
   ```
2. Pulisci la cache:
   ```bash
   sudo apt clean
   sudo rm -rf ~/.cache/*
   ```
3. Rimuovi pacchetti non necessari:
   ```bash
   sudo apt autoremove
   ```

### Swap piena

**Sintomi**: Sistema molto lento, swap al 100%

**Soluzioni**:
1. Aumenta la dimensione della swap
2. Aggiungi più RAM
3. Chiudi applicazioni che usano molta memoria

## Problemi di Installazione

### Installazione si blocca

**Sintomi**: L'installatore si blocca a una certa percentuale

**Soluzioni**:
1. Verifica che l'ISO non sia corrotta
2. Verifica che il disco sia funzionante
3. Prova installazione da USB 2.0 invece che 3.0
4. Prova partizionamento manuale

### GRUB non rileva Windows

**Sintomi**: Dopo installazione dual boot, Windows non appare nel menu GRUB

**Soluzioni**:
1. Monta la partizione Windows:
   ```bash
   sudo mount /dev/sda2 /mnt
   ```
2. Aggiorna GRUB:
   ```bash
   sudo update-grub
   ```

## Reset e Ripristino

### Ripristina Impostazioni

Per ripristinare le impostazioni di fabbrica:
```bash
rm -rf ~/.config/auraos
rm -rf ~/.cache/auraos
rm -rf ~/.local/share/auraos
```

### Reinstallazione

Per reinstallare AuraOS senza perdere dati:
1. Avvia da USB
2. Scegli "Reinstall AuraOS"
3. Seleziona "Preserve data"

### Rescue Mode

Se il sistema non si avvia:
1. Avvia da USB
2. Scegli "Rescue Mode"
3. Segui le istruzioni per riparare il sistema

## Ottenere Aiuto

Se non riesci a risolvere il problema:

1. **Consulta la documentazione**: https://github.com/jeaders/AuraOS/wiki
2. **Cerca nelle issues**: https://github.com/jeaders/AuraOS/issues
3. **Chiedi aiuto**: https://github.com/jeaders/AuraOS/discussions
4. **Riporta un bug**: https://github.com/jeaders/AuraOS/issues/new

Quando riporti un bug, includi:
- Versione di AuraOS
- Modello del computer
- Output di `dmesg`
- Log di sistema: `/var/log/syslog`
- Descrizione dettagliata del problema
