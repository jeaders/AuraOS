# Configurazione di AuraOS

Questa guida spiega come personalizzare e configurare AuraOS dopo l'installazione.

## Aspetto

### Temi

AuraOS supporta:
- **Chiaro** - Tema chiaro per ambienti luminosi
- **Scuro** - Tema scuro per ambienti bui
- **Auto** - Cambia automaticamente in base all'ora

Per cambiare tema:
1. Apri **Impostazioni**
2. Vai alla sezione **Aspetto**
3. Seleziona il tema desiderato

### Sfondi

Sfondi disponibili:
- **Gradient** - Sfondo gradiente viola/blu
- **Blue** - Sfondo blu oceano
- **Green** - Sfondo verde natura
- **Purple** - Sfondo viola
- **Orange** - Sfondo arancione
- **Aurora** - Sfondo aurora boreale animato
- **Ocean** - Sfondo oceano animato
- **Matrix** - Sfondo Matrix animato

Per cambiare sfondo:
1. Clicca destro sul desktop
2. Seleziona **Cambia sfondo**
3. Scegli lo sfondo desiderato

### Dock

La dock può essere posizionata:
- **In basso** (predefinito)
- **A sinistra**
- **A destra**

Per cambiare posizione:
1. Apri **Impostazioni**
2. Vai a **Aspetto**
3. Seleziona la posizione della dock

## Sistema

### Aggiornamenti

AuraOS riceve aggiornamenti automatici per:
- Pacchetti di sistema
- Aggiornamenti di sicurezza
- Browser Chromium

Per controllare manualmente:
```bash
sudo apt update && sudo apt upgrade
```

### Backup

AuraOS include strumenti di backup per:
- File personali
- Configurazioni di sistema
- Preferiti e impostazioni

### Lingua

Lingue supportate:
- Italiano (predefinito)
- Inglese
- Altre lingue in arrivo

Per cambiare lingua:
1. Apri **Impostazioni**
2. Vai a **Sistema**
3. Seleziona la lingua

## Rete

### Connessione WiFi

1. Clicca sull'icona di rete nella barra superiore
2. Seleziona la rete WiFi
3. Inserisci la password

### Connessione Ethernet

La connessione Ethernet è automatica via DHCP.

### Condivisione File

Per condividere file sulla rete:
1. Apri **File Manager**
2. Clicca su **Condividi**
3. Configura le opzioni di condivisione

## Sicurezza

### Password

Per impostare/modificare la password:
1. Apri **Impostazioni**
2. Vai a **Sicurezza**
3. Imposta/modifica password

### Firewall

AuraOS include un firewall configurato per:
- Bloccare connessioni non autorizzate
- Permettere traffico necessario
- Log delle connessioni

### Privacy

Modalità privacy disponibile:
- Disabilita tracking
- Cancella dati di navigazione
- Modalità anonima

## Applicazioni

### Installare Applicazioni

Da terminale:
```bash
sudo apt install <nome-pacchetto>
```

Da App Store (in arrivo):
1. Apri **App Store**
2. Cerca l'applicazione
3. Clicca **Installa**

### Aggiornare Applicazioni

```bash
sudo apt update && sudo apt upgrade
```

## Personalizzazione Avanzata

### Tema Personalizzato

Per creare un tema personalizzato:
1. Crea una cartella in `~/.themes/nome-tema/`
2. Aggiungi i file CSS personalizzati
3. Seleziona il tema in Impostazioni

### Estensioni

AuraOS supporta estensioni per:
- Nuove app
- Widget personalizzati
- Temi personalizzati
- Funzionalità aggiuntive

### Script

Puoi aggiungere script personalizzati in:
- `~/.local/bin/` - Script utente
- `/usr/local/bin/` - Script di sistema

## Ottimizzazione

### Prestazioni

Per migliorare le prestazioni:
1. Chiudi le app non utilizzate
2. Disabilita effetti animati in Impostazioni
3. Usa un tema semplice
4. Limita le app in avvio automatico

### Energia

Per risparmiare energia:
1. Riduci luminosità schermo
2. Disabilita WiFi/Bluetooth quando non usati
3. Usa la modalità risparmio energia

## Risoluzione Problemi

### Problemi Comuni

**Audio non funziona**
```bash
sudo alsa force-reload
```

**Rete non funziona**
```bash
sudo systemctl restart NetworkManager
```

**Grafica lenta**
```bash
# Installa driver proprietari
sudo apt install nvidia-driver
```

**Desktop si blocca**
```bash
# Riavvia il servizio
sudo systemctl restart auraos
```

### Reset

Per ripristinare le impostazioni di fabbrica:
1. Apri **Terminale**
2. Esegui:
   ```bash
   rm -rf ~/.config/auraos
   rm -rf ~/.cache/auraos
   ```
3. Riavvia il sistema

## Supporto

- [Documentazione](https://github.com/jeaders/AuraOS/wiki)
- [Issues](https://github.com/jeaders/AuraOS/issues)
- [Discussions](https://github.com/jeaders/AuraOS/discussions)
