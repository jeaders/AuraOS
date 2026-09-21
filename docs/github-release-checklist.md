# Checklist per il rilascio su GitHub

## Prima del push

- [x] Rinominato il progetto in **AuraOS**
- [x] Aggiornati tutti i riferimenti nel codice
- [x] Creato `manifest.json` per PWA
- [x] Creato `sw.js` per offline
- [x] Creato wrapper Electron (`main.js`, `preload.js`, `package.json`)
- [x] Aggiunta schermata di login con password
- [x] Aggiunto accesso filesystem reale (File System Access API)
- [x] Creato `.gitignore`, `LICENSE`, `CONTRIBUTING.md`
- [x] Creato `.github/workflows/ci.yml`
- [x] Validati tutti i file (JSON, JS, HTML, CSS)

## Dopo il push su GitHub

- [ ] Aggiungere screenshot in `screenshots/` (boot, desktop, apps)
- [ ] Aggiungere icone in `icons/` (build/icon.png, build/icon.icns, build/icon.ico)
- [ ] Abilitare GitHub Pages per demo live
- [ ] Abilitare GitHub Actions
- [ ] Creare una Release con changelog
- [ ] Aggiungere Topics: `electron`, `pwa`, `educational`, `operating-system`, `javascript`
- [ ] Aggiungere Description: "AuraOS - Virtual operating system built with HTML/CSS/JS and Electron"
- [ ] Abilitare Issues e Discussions

## Note per la community

- Sottolineare che è un progetto educativo
- Sottolineare che può essere usato come Web App o app desktop
- Sottolineare la compatibilità cross-platform
- Invitare contributi via Pull Request
