# Guida Rapida - Push su GitHub

Questa guida spiega come caricare AuraOS su GitHub.

## Prerequisiti

- Account GitHub
- Git installato
- Repository creata: https://github.com/jeaders/AuraOS

## Passaggi

### 1. Clona il repository (se non l'hai già fatto)

```bash
git clone https://github.com/jeaders/AuraOS.git
cd AuraOS
```

### 2. Copia i file di AuraOS

Se hai i file in `/Users/jeaders/Desktop/JeadOS`, copiali nella cartella del repository:

```bash
cp -r /Users/jeaders/Desktop/JeadOS/* /path/to/AuraOS/
```

### 3. Configura Git

```bash
git config user.name "Tuo Nome"
git config user.email "tua-email@example.com"
```

### 4. Aggiungi i file

```bash
git add .
```

### 5. Commit

```bash
git commit -m "Initial release: AuraOS 1.0.0 - First Light"
```

### 6. Push

```bash
git branch -M main
git remote add origin https://github.com/jeaders/AuraOS.git
git push -u origin main
```

## Struttura della Repository

Dopo il push, la struttura sarà:

```
AuraOS/
├── desktop/              # Interfaccia web
├── kernel/               # Kernel Linux personalizzato
├── boot/                 # Bootloader GRUB
├── rootfs/               # Filesystem radice
├── iso/                  # Build ISO (non incluso)
├── scripts/              # Script di build
├── docs/                 # Documentazione
├── .github/workflows/    # CI/CD
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CHANGELOG.md
├── RELEASE_NOTES.md
├── Makefile
└── package.json
```

## Note Importanti

- La cartella `iso/` e `kernel/build/` sono in `.gitignore` e non verranno caricate
- I file di build sono script, non gli artifact
- Le release verranno create separatamente con gli ISO compilati

## Creazione della Release

Quando sei pronto per rilasciare AuraOS:

1. Vai su GitHub > Releases
2. Clicca "Draft a new release"
3. Seleziona il tag `v1.0.0`
4. Titolo: `AuraOS 1.0.0 - First Light`
5. Carica gli artifact:
   - `AuraOS-1.0.iso`
   - `AuraOS-1.0.iso.sha256`
   - `AuraOS-1.0.0.deb` (opzionale)
6. Pubblica la release

## Screenshots

Aggiungi screenshot nella cartella `screenshots/`:
- `grub.png` - Schermata GRUB
- `boot.png` - Boot screen
- `desktop.png` - Desktop principale
- `file-manager.png` - File Manager
- `terminal.png` - Terminale

## Topics

Aggiungi questi topics alla repository:
- `linux`
- `distribution`
- `educational`
- `desktop`
- `operating-system`
- `grub`
- `kernel`
- `html`
- `css`
- `javascript`
- `electron`
- `debian`

## Description

```
AuraOS - Educational Linux Distribution with Web-Based Desktop

A modern, user-friendly Linux distribution inspired by Zorin OS,
featuring a custom Linux kernel, GRUB bootloader, and a beautiful
web-based desktop environment built with HTML/CSS/JS.

Perfect for learning Linux, education, and everyday use.
```

## Prossimi Passi

Dopo il push iniziale:
1. Abilita GitHub Actions (già configurato)
2. Crea la prima release
3. Aggiungi screenshot
4. Aggiorna la descrizione e i topics
5. Condividi con la community!

## Supporto

Se hai problemi con il push:
- Consulta [CONTRIBUTING.md](CONTRIBUTING.md)
- Apri una [Issue](https://github.com/jeaders/AuraOS/issues)
