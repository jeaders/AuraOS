# AuraOS - Release Notes

## Version 1.0.0 - "First Light" (2026-09-21)

AuraOS è una distribuzione Linux educativa che combina la potenza di Debian con un'interfaccia desktop moderna e intuitiva, perfetta per l'apprendimento e l'uso quotidiano.

### Caratteristiche Principali

**Sistema Operativo**
- Kernel Linux 6.1 personalizzato con branding AuraOS
- GRUB 2 con tema personalizzato scuro
- Debian Bookworm come base stabile
- systemd per la gestione dei servizi
- LightDM con autologin per accesso diretto

**Desktop Environment**
- Interfaccia web moderna (HTML5/CSS3/JavaScript)
- Avvio automatico in modalità kiosk con Chromium
- Design ispirato a GNOME e Zorin OS
- Supporto PWA per installazione come app

**Applicazioni**
- **File Manager**: Gestione file con vista griglia e lista
- **Terminale**: Emulatore terminale con comandi base
- **Browser**: Navigazione web con Chromium
- **Tutor AI**: Assistente educativo in italiano
- **Galleria**: Visualizzatore di immagini
- **Musica**: Player audio con playlist
- **Calcolatrice**: Calcolatrice scientifica
- **Blocco Note**: Editor di testo semplice
- **Impostazioni**: Personalizzazione tema, dock, font
- **Guida**: Documentazione interattiva
- **Giochi**: Giochi educativi
- **Task Manager**: Monitoraggio processi

**Sicurezza e Privacy**
- Login con password opzionale
- Modalità bambino con filtri
- Controlli parentali
- Privacy mode

**Personalizzazione**
- Temi chiaro/scuro/auto
- Sfondi animati (aurora, oceano, matrix)
- Posizione dock (basso/sinistra/destra)
- Dimensione caratteri regolabile
- Effetti sonori

### Requisiti di Sistema

- **CPU**: x86_64 (Intel o AMD)
- **RAM**: 2GB minimo, 4GB raccomandato
- **Disco**: 8GB minimo, 16GB raccomandato
- **Video**: Supporto accelerazione grafica
- **Audio**: Scheda audio compatibile ALSA

### Installazione

1. Scarica l'ISO da GitHub Releases
2. Verifica il checksum SHA256
3. Crea una USB avviabile:
   ```bash
   sudo dd if=AuraOS-1.0.iso of=/dev/sdX bs=4M status=progress && sync
   ```
4. Avvia da USB e segui le istruzioni

### Known Issues

- Il supporto WiFi richiede configurazione manuale in alcuni hardware
- L'audio potrebbe non funzionare su alcune macchine virtuali
- Le prestazioni dipendono dall'hardware sottostante

### Supporto

- Documentazione: https://github.com/jeaders/AuraOS/wiki
- Issues: https://github.com/jeaders/AuraOS/issues
- Discussioni: https://github.com/jeaders/AuraOS/discussions

### Credits

AuraOS è stato creato da Alex Mirici e rilasciato come software open source sotto licenza MIT.

Ispirato da: Zorin OS, GNOME, Elementary OS, e altri progetti open source.

---

**Nota**: Questa è la prima release pubblica di AuraOS. Si tratta di un progetto educativo e in fase di sviluppo attivo. Per favore, riporta eventuali bug o problemi.
