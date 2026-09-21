# AuraOS Wiki

Benvenuto nella wiki di AuraOS! Qui trovi guide dettagliate, tutorial e documentazione tecnica.

## Guide Utente

- [Guida Utente](user-guide.md) - Guida introduttiva per nuovi utenti
- [Installazione](installation.md) - Come installare AuraOS
- [Configurazione](configuration.md) - Personalizzare AuraOS
- [Risoluzione Problemi](troubleshooting.md) - Problemi comuni e soluzioni

## Guide Sviluppatore

- [Build da Sorgente](build.md) - Come buildare AuraOS da zero
- [Kernel](kernel.md) - Documentazione del kernel Linux personalizzato
- [GRUB](grub.md) - Configurazione del bootloader
- [Filesystem](filesystem.md) - Struttura del filesystem
- [Desktop Environment](desktop.md) - Sviluppo del desktop web
- [Contributi](https://github.com/jeaders/AuraOS/blob/main/CONTRIBUTING.md)

## Architettura

```
+------------------+
|   GRUB 2         |
+------------------+
         |
+------------------+
|   Linux Kernel   |
+------------------+
         |
+------------------+
|   Initramfs      |
+------------------+
         |
+------------------+
|   Root FS        |
|   (Debian)       |
+------------------+
         |
+------------------+
|   systemd        |
+------------------+
         |
+------------------+
|   LightDM        |
+------------------+
         |
+------------------+
|   Chromium       |
+------------------+
         |
+------------------+
|   AuraOS Desktop |
+------------------+
```

## FAQ

**Q: AuraOS è basata su quale distribuzione?**
A: AuraOS è basata su Debian Bookworm, una distribuzione stabile e sicura.

**Q: Posso installare AuraOS sul mio computer?**
A: Sì, AuraOS può essere installata come qualsiasi altra distribuzione Linux.

**Q: Il desktop è veramente in HTML/CSS/JS?**
A: Sì! Il desktop environment di AuraOS è interamente web-based, usando tecnologie web moderne.

**Q: Posso contribuire al progetto?**
A: Assolutamente sì! Leggi [CONTRIBUTING.md](https://github.com/jeaders/AuraOS/blob/main/CONTRIBUTING.md) per iniziare.

**Q: AuraOS è gratuita?**
A: Sì, AuraOS è completamente gratuita e open source, rilasciata sotto licenza MIT.

**Q: Quali sono i requisiti minimi?**
A: CPU x86_64, 2GB RAM, 8GB disco. 4GB RAM e 16GB disco raccomandati.

## Links Utili

- [Repository GitHub](https://github.com/jeaders/AuraOS)
- [Download Releases](https://github.com/jeaders/AuraOS/releases)
- [Segnala un Bug](https://github.com/jeaders/AuraOS/issues)
- [Discussioni](https://github.com/jeaders/AuraOS/discussions)
