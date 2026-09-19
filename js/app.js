// ===== WebOS Educativo - Main Application =====
class WebOSApp {
    constructor() {
        this.state = {
            profile: localStorage.getItem('webos_profile') || null,
            userMode: localStorage.getItem('webos_mode') || 'adulto',
            iconSize: localStorage.getItem('webos_iconSize') || 'medium',
            wallpaper: localStorage.getItem('webos_wallpaper') || 'gradient',
            openWindows: [],
            windowZIndex: 100,
            activeWindow: null,
            startMenuOpen: false,
            filesystem: null,
            tutorAI: null,
        };

        this.desktopApps = [
            { id: 'file-manager', name: 'File e cartelle', icon: '📁', description: 'Gestisci i tuoi file' },
            { id: 'browser', name: 'Internet', icon: '🌐', description: 'Esplora il web' },
            { id: 'tutor', name: 'Tutor AI', icon: '🤖', description: 'Il tuo assistente' },
            { id: 'settings', name: 'Impostazioni', icon: '⚙️', description: 'Personalizza' },
            { id: 'guide', name: 'Guida', icon: '📖', description: 'Impara come usarlo' },
            { id: 'games', name: 'Giochi', icon: '🎮', description: 'Impara divertendoti' },
            { id: 'calculator', name: 'Calcolatrice', icon: '🧮', description: 'Fai calcoli veloci' },
        ];

        this.wallpapers = {
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            blue: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
            green: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
            purple: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
            orange: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        };

        this.tutorAI = new TutorAI();
        this.init();
    }

    init() {
        // Initialize file system
        this.initFilesystem();

        // Set up event listeners
        this.setupEventListeners();

        // Update clock
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);

        // Check if returning user
        if (this.state.profile) {
            this.boot();
        } else {
            this.showProfileSelection();
        }
    }

    initFilesystem() {
        const saved = localStorage.getItem('webos_filesystem');
        if (saved) {
            this.state.filesystem = JSON.parse(saved);
        } else {
            this.state.filesystem = {
                '/': {
                    type: 'folder',
                    name: 'Home',
                    children: {
                        'Documenti': {
                            type: 'folder',
                            name: 'Documenti',
                            children: {
                                'Lettera.txt': { type: 'file', name: 'Lettera.txt', content: 'Caro amico,\n\nQuesta è una lettera di prova nel File Manager simulato!' },
                            }
                        },
                        'Immagini': {
                            type: 'folder',
                            name: 'Immagini',
                            children: {}
                        },
                        'Musica': {
                            type: 'folder',
                            name: 'Musica',
                            children: {}
                        },
                        'Progetto': {
                            type: 'folder',
                            name: 'Progetto',
                            children: {
                                'Note.txt': { type: 'file', name: 'Note.txt', content: 'Appunti del progetto...' },
                            }
                        },
                    }
                }
            };
        }
    }

    saveFilesystem() {
        localStorage.setItem('webos_filesystem', JSON.stringify(this.state.filesystem));
    }

    setupEventListeners() {
        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            const startMenu = document.getElementById('start-menu');
            const startBtn = document.getElementById('start-btn');
            if (this.state.startMenuOpen && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                this.toggleStartMenu(false);
            }
        });

        // Click on desktop to deselect windows
        const desktop = document.getElementById('desktop');
        if (desktop) {
            desktop.addEventListener('click', (e) => {
                if (e.target === desktop || e.target.classList.contains('desktop-icons')) {
                    this.state.activeWindow = null;
                    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
                    this.updateTaskbarApps();
                }
            });
        }

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleStartMenu(false);
                this.hideTutorBubble();
            }
        });
    }

    // ===== Boot Sequence =====
    showProfileSelection() {
        const bootScreen = document.getElementById('boot-screen');
        const progressBar = document.getElementById('boot-progress-bar');
        const profileSelect = document.getElementById('profile-select');

        // Simulate loading
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    profileSelect.style.display = 'block';
                }, 300);
            }
        }, 200);
    }

    selectProfile(profile) {
        this.state.profile = profile;
        this.state.userMode = profile;
        localStorage.setItem('webos_profile', profile);
        localStorage.setItem('webos_mode', profile);

        const bootScreen = document.getElementById('boot-screen');
        bootScreen.classList.add('fade-out');

        setTimeout(() => {
            bootScreen.classList.add('hidden');
            this.boot();
        }, 800);
    }

    boot() {
        const desktop = document.getElementById('desktop');
        const taskbar = document.getElementById('taskbar');
        const startMenuUser = document.getElementById('start-menu-user');

        // Show desktop elements
        desktop.classList.remove('hidden');
        taskbar.classList.remove('hidden');

        // Set user name based on profile
        const names = {
            bambino: '👦 Bambino',
            adulto: '👤 Utente',
            anziano: '👴 Nonno'
        };
        startMenuUser.textContent = names[this.state.profile] || '👤 Utente';

        // Load saved preferences
        this.applySettings();

        // Create desktop icons
        this.createDesktopIcons();

        // Show welcome message from tutor
        setTimeout(() => {
            this.showTutorMessage('Ciao! Benvenuto nel WebOS Educativo! Sono il tuo Tutor AI. Clicca su "Guida" per iniziare un tour, oppure esplora pure le app!');
        }, 1000);

        // Show voice button for elderly mode
        if (this.state.userMode === 'anziano') {
            document.getElementById('voice-btn').classList.remove('hidden');
        }
    }

    applySettings() {
        // Apply wallpaper
        const desktop = document.getElementById('desktop');
        desktop.style.background = this.wallpapers[this.state.wallpaper] || this.wallpapers.gradient;

        // Apply icon size
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.classList.remove('size-large', 'size-small');
            if (this.state.iconSize !== 'medium') {
                icon.classList.add(`size-${this.state.iconSize}`);
            }
        });

        // Apply mode-specific settings
        if (this.state.userMode === 'bambino') {
            document.body.style.fontSize = '16px';
        } else if (this.state.userMode === 'anziano') {
            document.body.style.fontSize = '18px';
            document.getElementById('voice-btn').classList.remove('hidden');
        } else {
            document.body.style.fontSize = '14px';
        }
    }

    // ===== Desktop =====
    createDesktopIcons() {
        const container = document.getElementById('desktop-icons');
        container.innerHTML = '';

        this.desktopApps.forEach(app => {
            const icon = document.createElement('div');
            icon.className = `desktop-icon ${this.state.iconSize !== 'medium' ? `size-${this.state.iconSize}` : ''}`;
            icon.dataset.app = app.id;
            icon.innerHTML = `
                <div class="icon-img">${app.icon}</div>
                <div class="icon-label">${app.name}</div>
            `;
            icon.addEventListener('dblclick', () => this.openApp(app.id));
            icon.addEventListener('click', () => {
                this.showTutorMessage(`Questa è l'app "${app.name}": ${app.description}. Fai doppio click per aprirla!`);
            });
            container.appendChild(icon);
        });
    }

    // ===== Taskbar & Start Menu =====
    updateClock() {
        const clock = document.getElementById('taskbar-clock');
        const now = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        clock.textContent = now.toLocaleDateString('it-IT', options);
    }

    toggleStartMenu(forceState = null) {
        const menu = document.getElementById('start-menu');
        if (forceState !== null) {
            this.state.startMenuOpen = forceState;
        } else {
            this.state.startMenuOpen = !this.state.startMenuOpen;
        }

        if (this.state.startMenuOpen) {
            menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
        }
    }

    // ===== Window Manager =====
    openApp(appId) {
        this.toggleStartMenu(false);

        const appConfig = this.desktopApps.find(a => a.id === appId);
        if (!appConfig) return;

        // Check if already open
        const existing = this.state.openWindows.find(w => w.appId === appId);
        if (existing) {
            if (existing.minimized) {
                existing.minimized = false;
                const win = document.getElementById(existing.id);
                if (win) win.classList.remove('minimized');
            }
            this.focusWindow(existing.id);
            return;
        }

        const windowId = `window-${Date.now()}`;
        const windowData = {
            id: windowId,
            appId: appId,
            title: appConfig.name,
            icon: appConfig.icon,
            x: 50 + (this.state.openWindows.length * 30),
            y: 50 + (this.state.openWindows.length * 30),
            width: appId === 'tutor' ? 400 : 600,
            height: appId === 'tutor' ? 500 : 450,
            minimized: false,
            maximized: false,
        };

        this.state.openWindows.push(windowData);
        this.renderWindow(windowData);
        this.updateTaskbarApps();
        this.focusWindow(windowId);

        // Show contextual tutor message
        this.showTutorMessage(this.getTutorWelcomeMessage(appId));
    }

    renderWindow(windowData) {
        const container = document.getElementById('window-container');
        const win = document.createElement('div');
        win.className = 'window active';
        win.id = windowData.id;
        win.style.left = windowData.x + 'px';
        win.style.top = windowData.y + 'px';
        win.style.width = windowData.width + 'px';
        win.style.height = windowData.height + 'px';
        win.style.zIndex = ++this.state.windowZIndex;

        win.innerHTML = `
            <div class="window-titlebar" data-window-id="${windowData.id}">
                <div class="window-title">
                    <span>${windowData.icon}</span>
                    <span>${windowData.title}</span>
                </div>
                <div class="window-controls">
                    <button class="window-control minimize" onclick="app.minimizeWindow('${windowData.id}')" title="Minimizza">−</button>
                    <button class="window-control maximize" onclick="app.maximizeWindow('${windowData.id}')" title="Ingrandisci">□</button>
                    <button class="window-control close" onclick="app.closeWindow('${windowData.id}')" title="Chiudi">✕</button>
                </div>
            </div>
            <div class="window-content" id="content-${windowData.id}">
                ${this.getAppContent(windowData.appId, windowData.id)}
            </div>
            <div class="window-resize-handle" data-window-id="${windowData.id}"></div>
        `;

        // Click to focus
        win.addEventListener('mousedown', () => this.focusWindow(windowData.id));

        // Make window draggable
        this.makeDraggable(win, windowData.id);

        // Make window resizable
        this.makeResizable(win, windowData.id);

        container.appendChild(win);

        // Initialize app-specific functionality
        this.initApp(windowData.appId, windowData.id);
    }

    getAppContent(appId, windowId) {
        switch (appId) {
            case 'file-manager':
                return this.getFileManagerContent(windowId);
            case 'browser':
                return this.getBrowserContent(windowId);
            case 'tutor':
                return this.getTutorContent(windowId);
            case 'settings':
                return this.getSettingsContent(windowId);
            case 'guide':
                return this.getGuideContent(windowId);
            case 'games':
                return this.getGamesContent(windowId);
            case 'calculator':
                return this.getCalculatorContent(windowId);
            default:
                return '<p>App in caricamento...</p>';
        }
    }

    focusWindow(windowId) {
        // Remove active class from all windows
        document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));

        const win = document.getElementById(windowId);
        if (win) {
            win.classList.add('active');
            win.style.zIndex = ++this.state.windowZIndex;
            this.state.activeWindow = windowId;

            // Update taskbar
            this.updateTaskbarApps();
        }
    }

    minimizeWindow(windowId) {
        const win = document.getElementById(windowId);
        if (win) {
            win.classList.add('minimized');
            const windowData = this.state.openWindows.find(w => w.id === windowId);
            if (windowData) windowData.minimized = true;
            this.updateTaskbarApps();
        }
    }

    maximizeWindow(windowId) {
        const win = document.getElementById(windowId);
        if (!win) return;

        const windowData = this.state.openWindows.find(w => w.id === windowId);
        if (!windowData) return;

        windowData.maximized = !windowData.maximized;
        if (windowData.maximized) {
            win.classList.add('maximized');
            windowData.prevX = win.style.left;
            windowData.prevY = win.style.top;
            windowData.prevWidth = win.style.width;
            windowData.prevHeight = win.style.height;
        } else {
            win.classList.remove('maximized');
            win.style.left = windowData.prevX || '50px';
            win.style.top = windowData.prevY || '50px';
            win.style.width = windowData.prevWidth || '600px';
            win.style.height = windowData.prevHeight || '450px';
        }
    }

    closeWindow(windowId) {
        const win = document.getElementById(windowId);
        if (win) {
            win.remove();
            this.state.openWindows = this.state.openWindows.filter(w => w.id !== windowId);
            this.updateTaskbarApps();
        }
    }

    updateTaskbarApps() {
        const container = document.getElementById('taskbar-apps');
        container.innerHTML = '';

        this.state.openWindows.forEach(w => {
            const btn = document.createElement('button');
            btn.className = `taskbar-app ${!w.minimized && this.state.activeWindow === w.id ? 'active' : ''}`;
            btn.innerHTML = `<span>${w.icon}</span><span>${w.title}</span>`;
                    btn.addEventListener('click', () => {
                        if (w.minimized) {
                            w.minimized = false;
                            const win = document.getElementById(w.id);
                            if (win) win.classList.remove('minimized');
                            this.focusWindow(w.id);
                        } else if (this.state.activeWindow === w.id) {
                            this.minimizeWindow(w.id);
                        } else {
                            this.focusWindow(w.id);
                        }
                    });
            container.appendChild(btn);
        });
    }

    makeDraggable(win, windowId) {
        const titlebar = win.querySelector('.window-titlebar');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = win.offsetLeft;
            initialY = win.offsetTop;
            win.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            win.style.left = Math.max(0, initialX + dx) + 'px';
            win.style.top = Math.max(0, initialY + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                win.style.cursor = '';
            }
        });
    }

    makeResizable(win, windowId) {
        const handle = win.querySelector('.window-resize-handle');
        let isResizing = false;
        let startX, startY, initialWidth, initialHeight;

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            initialWidth = win.offsetWidth;
            initialHeight = win.offsetHeight;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            win.style.width = Math.max(300, initialWidth + dx) + 'px';
            win.style.height = Math.max(200, initialHeight + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }

    // ===== App Implementations =====
    initApp(appId, windowId) {
        switch (appId) {
            case 'file-manager':
                this.initFileManager(windowId);
                break;
            case 'browser':
                this.initBrowser(windowId);
                break;
            case 'tutor':
                this.initTutor(windowId);
                break;
            case 'settings':
                this.initSettings(windowId);
                break;
            case 'guide':
                this.initGuide(windowId);
                break;
            case 'games':
                this.initGames(windowId);
                break;
            case 'calculator':
                this.initCalculator(windowId);
                break;
        }
    }

    // ===== File Manager =====
    getFileManagerContent(windowId) {
        return `
            <div class="file-manager-toolbar">
                <button class="file-manager-btn" id="up-btn-${windowId}" onclick="app.goUp('${windowId}')" style="display:none;">⬆️ Su</button>
                <button class="file-manager-btn" onclick="app.createFolder('${windowId}')">📁 Nuova cartella</button>
                <button class="file-manager-btn" onclick="app.createFile('${windowId}')">📄 Nuovo file</button>
                <input type="text" class="file-manager-path" id="path-${windowId}" value="/" readonly>
            </div>
            <div class="file-list" id="filelist-${windowId}"></div>
        `;
    }

    initFileManager(windowId) {
        this.renderFileList(windowId, '/');
    }

    renderFileList(windowId, path) {
        const container = document.getElementById(`filelist-${windowId}`);
        const pathInput = document.getElementById(`path-${windowId}`);
        const upBtn = document.getElementById(`up-btn-${windowId}`);
        if (!container) return;

        pathInput.value = path;

        // Show/hide up button
        if (upBtn) {
            upBtn.style.display = path === '/' ? 'none' : 'inline-block';
        }

        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children) {
            container.innerHTML = '<p style="color:#a0aec0;">Cartella vuota</p>';
            return;
        }

        container.innerHTML = '';
        Object.entries(folder.children).forEach(([name, item]) => {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.innerHTML = `
                <div class="file-icon">${item.type === 'folder' ? '📁' : '📄'}</div>
                <div class="file-name">${name}</div>
            `;
            div.addEventListener('click', () => {
                if (item.type === 'folder') {
                    this.renderFileList(windowId, path === '/' ? `/${name}` : `${path}/${name}`);
                } else {
                    this.showFilePreview(windowId, path, name);
                }
            });
            div.addEventListener('dblclick', () => {
                if (item.type === 'folder') {
                    this.renderFileList(windowId, path === '/' ? `/${name}` : `${path}/${name}`);
                } else {
                    this.showFilePreview(windowId, path, name);
                }
            });
            container.appendChild(div);
        });
    }

    getFolderByPath(path) {
        if (path === '/') return this.state.filesystem['/'];

        const parts = path.split('/').filter(p => p);
        let current = this.state.filesystem['/'];

        for (const part of parts) {
            if (current.children && current.children[part]) {
                current = current.children[part];
            } else {
                return null;
            }
        }
        return current;
    }

    createFolder(windowId) {
        const name = prompt('Nome della cartella:');
        if (!name) return;

        const pathInput = document.getElementById(`path-${windowId}`);
        const currentPath = pathInput.value;
        const folder = this.getFolderByPath(currentPath);

        if (folder && folder.children) {
            if (folder.children[name]) {
                alert('Esiste già un file o cartella con questo nome!');
                return;
            }
            folder.children[name] = { type: 'folder', name, children: {} };
            this.saveFilesystem();
            this.renderFileList(windowId, currentPath);
            this.showTutorMessage(`Perfetto! Ho creato la cartella "${name}". È come una scatola vuota dove puoi mettere i tuoi file!`);
        }
    }

    createFile(windowId) {
        const name = prompt('Nome del file:');
        if (!name) return;

        const pathInput = document.getElementById(`path-${windowId}`);
        const currentPath = pathInput.value;
        const folder = this.getFolderByPath(currentPath);

        if (folder && folder.children) {
            if (folder.children[name]) {
                alert('Esiste già un file o cartella con questo nome!');
                return;
            }
            folder.children[name] = { type: 'file', name, content: '' };
            this.saveFilesystem();
            this.renderFileList(windowId, currentPath);
            this.showTutorMessage(`Ho creato il file "${name}". È come un foglio bianco dove puoi scrivere!`);
        }
    }

    goUp(windowId) {
        const pathInput = document.getElementById(`path-${windowId}`);
        const currentPath = pathInput.value;
        if (currentPath === '/') return;

        const parts = currentPath.split('/').filter(p => p);
        parts.pop();
        const parentPath = parts.length === 0 ? '/' : '/' + parts.join('/');
        this.renderFileList(windowId, parentPath);
    }

    showFilePreview(windowId, path, filename) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[filename]) return;

        const file = folder.children[filename];
        const content = file.content || '(file vuoto)';

        // Show in a simple way within the file list area
        const container = document.getElementById(`filelist-${windowId}`);
        container.innerHTML = `
            <div style="padding: 20px; background: white; border-radius: 8px;">
                <h3 style="color: #667eea; margin-bottom: 10px;">📄 ${filename}</h3>
                <pre style="background: #f7fafc; padding: 15px; border-radius: 6px; white-space: pre-wrap; font-family: monospace; margin-bottom: 15px;">${content}</pre>
                <div style="display: flex; gap: 10px;">
                    <button class="file-manager-btn" onclick="app.editFile('${windowId}', '${path}', '${filename}')">✏️ Modifica</button>
                    <button class="file-manager-btn" onclick="app.renderFileList('${windowId}', '${path}')">← Torna alla cartella</button>
                </div>
            </div>
        `;
    }

    editFile(windowId, path, filename) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[filename]) return;

        const file = folder.children[filename];
        const newContent = prompt('Modifica il contenuto:', file.content || '');
        if (newContent !== null) {
            file.content = newContent;
            this.saveFilesystem();
            this.showTutorMessage('Ho salvato le modifiche!');
            this.renderFileList(windowId, path);
        }
    }

    // ===== Browser Simulator =====
    getBrowserContent(windowId) {
        return `
            <div class="browser-toolbar">
                <button class="browser-btn" onclick="app.browserBack('${windowId}')" title="Indietro">←</button>
                <button class="browser-btn" onclick="app.browserForward('${windowId}')" title="Avanti">→</button>
                <input type="text" class="browser-url" id="browser-url-${windowId}" value="webos://home" readonly>
            </div>
            <div class="browser-content" id="browser-content-${windowId}">
                ${this.getBrowserPage('home')}
            </div>
        `;
    }

    getBrowserPage(page) {
        const pages = {
            home: `
                <h2>🌐 Benvenuto nel Browser Simulato!</h2>
                <p>Questo è un browser finto per imparare come funziona Internet in modo sicuro.</p>
                <p><strong>Cosa puoi fare:</strong></p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Imparare cos'è Internet</li>
                    <li>Scoprire cosa sono i siti web</li>
                    <li>Capire come funzionano i link</li>
                    <li>Navigare in sicurezza</li>
                </ul>
                <p style="margin-top: 20px;">Scegli una pagina dalla barra degli indirizzi o clicca qui:</p>
                <p><a onclick="app.navigateBrowser('internet')">Cos'è Internet?</a></p>
                <p><a onclick="app.navigateBrowser('siti')">Cosa sono i siti web?</a></p>
                <p><a onclick="app.navigateBrowser('link')">Cosa sono i link?</a></p>
                <p><a onclick="app.navigateBrowser('sicurezza')">Navigare in sicurezza</a></p>
            `,
            internet: `
                <h2>🌍 Cos'è Internet?</h2>
                <p>Internet è come una <strong>rete mondiale di computer</strong> collegati tra loro.</p>
                <p>Pensa a Internet come a una grande biblioteca dove:</p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Puoi trovare informazioni su qualsiasi cosa</li>
                    <li>Puoi guardare video e foto</li>
                    <li>Puoi parlare con persone lontane</li>
                    <li>Puoi giocare e imparare</li>
                </ul>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
            siti: `
                <h2>📄 Cosa sono i siti web?</h2>
                <p>Un <strong>sito web</strong> è come una pagina di un libro, ma sul computer.</p>
                <p>Ogni sito ha un indirizzo unico, come:</p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li><strong>www.esempio.it</strong> - un sito di esempio</li>
                    <li><strong>www.scuola.it</strong> - un sito della scuola</li>
                </ul>
                <p>Quando scrivi l'indirizzo nella barra del browser e premi Invio, il computer va a "prendere" quella pagina per te!</p>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
            link: `
                <h2>🔗 Cosa sono i link?</h2>
                <p>Un <strong>link</strong> (collegamento) è come un passaggio segreto: cliccandolo vai a un'altra pagina!</p>
                <p>I link sono di solito:</p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Di colore <span style="color: #667eea; text-decoration: underline;">blu e sottolineati</span></li>
                    <li>Cliccandoci, vai a un'altra pagina</li>
                    <li>Utili per esplorare senza dover scrivere indirizzi</li>
                </ul>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
            sicurezza: `
                <h2>🔒 Navigare in sicurezza</h2>
                <p>Quando usi Internet, è importante seguire alcune regole:</p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Non dare il tuo nome o indirizzo a sconosciuti</li>
                    <li>Non scaricare file da persone che non conosci</li>
                    <li>Se vedi qualcosa che non ti piace, chiudi la pagina e chiedi a un adulto</li>
                    <li>Ricorda: Internet è come il mondo reale, ci sono persone gentili e persone meno gentili</li>
                </ul>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
        };

        return pages[page] || pages.home;
    }

    initBrowser(windowId) {
        // Browser initialized
    }

    navigateBrowser(page) {
        const activeWin = this.state.openWindows.find(w => w.appId === 'browser' && !w.minimized);
        if (!activeWin) return;

        const content = document.getElementById(`browser-content-${activeWin.id}`);
        const url = document.getElementById(`browser-url-${activeWin.id}`);
        if (content) {
            content.innerHTML = this.getBrowserPage(page);
            if (url) url.value = `webos://${page}`;
        }
    }

    browserBack(windowId) {
        const content = document.getElementById(`browser-content-${windowId}`);
        const url = document.getElementById(`browser-url-${windowId}`);
        if (content) {
            content.innerHTML = this.getBrowserPage('home');
            if (url) url.value = 'webos://home';
        }
    }

    browserForward(windowId) {
        const content = document.getElementById(`browser-content-${windowId}`);
        const url = document.getElementById(`browser-url-${windowId}`);
        if (content) {
            content.innerHTML = this.getBrowserPage('internet');
            if (url) url.value = 'webos://internet';
        }
    }

    // ===== Tutor App =====
    getTutorContent(windowId) {
        const suggestions = this.tutorAI.getSuggestions(this.state.userMode);
        return `
            <div class="tutor-chat">
                <div class="tutor-messages" id="tutor-messages-${windowId}">
                    <div class="tutor-message tutor">
                        Ciao! Sono il Tutor AI. Come posso aiutarti? Chiedimi qualsiasi cosa!
                    </div>
                </div>
                <div class="tutor-suggestions" id="tutor-suggestions-${windowId}">
                    ${suggestions.map(s => `<button class="tutor-suggestion" onclick="app.askTutor('${windowId}', '${s}')">${s}</button>`).join('')}
                </div>
                <div class="tutor-input-area">
                    <input type="text" class="tutor-input" id="tutor-input-${windowId}" placeholder="Scrivi la tua domanda..."
                           onkeypress="if(event.key==='Enter') app.sendTutorMessage('${windowId}')">
                    <button class="tutor-send" onclick="app.sendTutorMessage('${windowId}')">Invia</button>
                </div>
            </div>
        `;
    }

    initTutor(windowId) {
        // Tutor initialized
    }

    sendTutorMessage(windowId) {
        const input = document.getElementById(`tutor-input-${windowId}`);
        const message = input.value.trim();
        if (!message) return;

        const messagesContainer = document.getElementById(`tutor-messages-${windowId}`);
        if (!messagesContainer) return;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'tutor-message user';
        userMsg.textContent = message;
        messagesContainer.appendChild(userMsg);

        // Get tutor response
        const response = this.tutorAI.getResponse(message, this.state.userMode);

        // Add tutor response after a short delay
        setTimeout(() => {
            const tutorMsg = document.createElement('div');
            tutorMsg.className = 'tutor-message tutor';
            tutorMsg.textContent = response;
            messagesContainer.appendChild(tutorMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);

        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    askTutor(windowId, question) {
        const input = document.getElementById(`tutor-input-${windowId}`);
        if (input) {
            input.value = question;
            this.sendTutorMessage(windowId);
        }
    }

    showTutorMessage(message) {
        const bubble = document.getElementById('tutor-bubble');
        const content = document.getElementById('tutor-bubble-content');

        if (bubble && content) {
            content.textContent = message;
            bubble.classList.remove('hidden');

            // Auto hide after 8 seconds
            clearTimeout(this.tutorTimeout);
            this.tutorTimeout = setTimeout(() => {
                this.hideTutorBubble();
            }, 8000);
        }
    }

    hideTutorBubble() {
        const bubble = document.getElementById('tutor-bubble');
        if (bubble) {
            bubble.classList.add('hidden');
        }
    }

    toggleVoice() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Il tutor AI è qui per aiutarti. Clicca sull\'app Tutor per chiedere qualsiasi cosa!');
            utterance.lang = 'it-IT';
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        } else {
            alert('La sintesi vocale non è supportata dal tuo browser.');
        }
    }

    // ===== Settings =====
    getSettingsContent(windowId) {
        return `
            <div class="settings-section">
                <h3>🎨 Aspetto</h3>
                <div class="settings-option">
                    <span class="settings-label">Sfondo</span>
                    <div class="settings-control">
                        ${Object.keys(this.wallpapers).map(w => `
                            <button class="settings-btn ${this.state.wallpaper === w ? 'active' : ''}"
                                    onclick="app.setWallpaper('${w}')">${w.charAt(0).toUpperCase() + w.slice(1)}</button>
                        `).join('')}
                    </div>
                </div>
                <div class="settings-option">
                    <span class="settings-label">Dimensione icone</span>
                    <div class="settings-control">
                        ${['small', 'medium', 'large'].map(s => `
                            <button class="settings-btn ${this.state.iconSize === s ? 'active' : ''}"
                                    onclick="app.setIconSize('${s}')">${s === 'small' ? 'Piccole' : s === 'medium' ? 'Medie' : 'Grandi'}</button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <h3>👤 Modalità</h3>
                <div class="settings-option">
                    <span class="settings-label">Modalità utente</span>
                    <div class="settings-control">
                        ${['bambino', 'adulto', 'anziano'].map(m => `
                            <button class="settings-btn ${this.state.userMode === m ? 'active' : ''}"
                                    onclick="app.setUserMode('${m}')">${m.charAt(0).toUpperCase() + m.slice(1)}</button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <h3>🔔 Suggerimenti Tutor</h3>
                <div class="settings-option">
                    <span class="settings-label">Mostra suggerimenti automatici</span>
                    <div class="settings-control">
                        <button class="settings-btn active" onclick="app.toggleTutorSuggestions(true)">Attivo</button>
                        <button class="settings-btn" onclick="app.toggleTutorSuggestions(false)">Disattivo</button>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <h3>💾 Dati</h3>
                <div class="settings-option">
                    <span class="settings-label">File salvati</span>
                    <div class="settings-control">
                        <button class="settings-btn" onclick="app.resetFilesystem()">🔄 Ripristina file</button>
                    </div>
                </div>
            </div>
        `;
    }

    initSettings(windowId) {
        // Settings initialized
    }

    setWallpaper(wallpaper) {
        this.state.wallpaper = wallpaper;
        localStorage.setItem('webos_wallpaper', wallpaper);
        this.applySettings();
        this.showTutorMessage(`Ho cambiato lo sfondo! Ora hai lo sfondo "${wallpaper}". Ti piace?`);
    }

    setIconSize(size) {
        this.state.iconSize = size;
        localStorage.setItem('webos_iconSize', size);
        this.applySettings();
    }

    setUserMode(mode) {
        this.state.userMode = mode;
        localStorage.setItem('webos_mode', mode);
        this.applySettings();
        this.showTutorMessage(`Modalità cambiata in "${mode}". Ora il sistema si adatta alle tue necessità!`);
    }

    toggleTutorSuggestions(enabled) {
        this.showTutorMessage(enabled ? 'Suggerimenti del tutor attivati!' : 'Suggerimenti del tutor disattivati.');
    }

    resetFilesystem() {
        if (confirm('Sei sicuro? Tutti i file e le cartelle verranno cancellati.')) {
            localStorage.removeItem('webos_filesystem');
            this.initFilesystem();
            this.showTutorMessage('Ho ripristinato i file predefiniti.');
        }
    }

    // ===== Guide =====
    getGuideContent(windowId) {
        const steps = this.tutorAI.getGuideSteps();
        return `
            <div id="guide-container-${windowId}">
                <div class="guide-step" id="guide-step-${windowId}">
                    <h3 id="guide-title-${windowId}"></h3>
                    <p id="guide-text-${windowId}"></p>
                </div>
                <div class="guide-controls">
                    <button class="guide-btn" id="guide-prev-${windowId}" onclick="app.prevGuideStep('${windowId}')">← Indietro</button>
                    <button class="guide-btn" id="guide-next-${windowId}" onclick="app.nextGuideStep('${windowId}')">Avanti →</button>
                </div>
            </div>
        `;
    }

    initGuide(windowId) {
        this.currentGuideStep = 0;
        this.guideSteps = this.tutorAI.getGuideSteps();
        this.renderGuideStep(windowId);
    }

    renderGuideStep(windowId) {
        const step = this.guideSteps[this.currentGuideStep];
        const titleEl = document.getElementById(`guide-title-${windowId}`);
        const textEl = document.getElementById(`guide-text-${windowId}`);
        const prevBtn = document.getElementById(`guide-prev-${windowId}`);
        const nextBtn = document.getElementById(`guide-next-${windowId}`);

        if (titleEl) titleEl.textContent = step.title;
        if (textEl) textEl.textContent = step.text;
        if (prevBtn) prevBtn.disabled = this.currentGuideStep === 0;
        if (nextBtn) {
            nextBtn.textContent = this.currentGuideStep === this.guideSteps.length - 1 ? 'Ricomincia' : 'Avanti →';
        }

        // Highlight target if any
        if (step.target) {
            const target = document.querySelector(step.target);
            if (target) {
                target.style.boxShadow = '0 0 0 4px #667eea';
                setTimeout(() => {
                    target.style.boxShadow = '';
                }, 2000);
            }
        }
    }

    nextGuideStep(windowId) {
        if (this.currentGuideStep < this.guideSteps.length - 1) {
            this.currentGuideStep++;
            this.renderGuideStep(windowId);
        } else {
            this.currentGuideStep = 0;
            this.renderGuideStep(windowId);
        }
    }

    prevGuideStep(windowId) {
        if (this.currentGuideStep > 0) {
            this.currentGuideStep--;
            this.renderGuideStep(windowId);
        }
    }

    // ===== Games =====
    getGamesContent(windowId) {
        return `
            <div class="game-container">
                <h2 class="game-title">🎮 Giochi Didattici</h2>
                <div class="game-area" id="game-area-${windowId}">
                    <p>Scegli un gioco per iniziare!</p>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
                        <button class="guide-btn" onclick="app.startGame('${windowId}', 'dragdrop')">📁 Trascina nella cartella</button>
                        <button class="guide-btn" onclick="app.startGame('${windowId}', 'match')">🔍 Indovina a cosa serve</button>
                    </div>
                </div>
            </div>
        `;
    }

    initGames(windowId) {
        // Games initialized
    }

    startGame(windowId, gameType) {
        const area = document.getElementById(`game-area-${windowId}`);
        if (!area) return;

        if (gameType === 'dragdrop') {
            area.innerHTML = `
                <h3 style="color: #667eea;">📁 Trascina i file nella cartella giusta!</h3>
                <p style="color: #4a5568;">Trascina i file nella cartella corretta. Ogni file appartiene a una cartella specifica.</p>
                <div class="drag-drop-game" id="drag-game-${windowId}">
                    <div class="drop-zone" data-folder="Immagini" ondrop="app.handleDrop(event, '${windowId}')" ondragover="app.handleDragOver(event)" ondragleave="app.handleDragLeave(event)">
                        <span style="font-size: 40px;">📁</span>
                        <span>Immagini</span>
                    </div>
                    <div class="drop-zone" data-folder="Documenti" ondrop="app.handleDrop(event, '${windowId}')" ondragover="app.handleDragOver(event)" ondragleave="app.handleDragLeave(event)">
                        <span style="font-size: 40px;">📁</span>
                        <span>Documenti</span>
                    </div>
                    <div class="drop-zone" data-folder="Musica" ondrop="app.handleDrop(event, '${windowId}')" ondragover="app.handleDragOver(event)" ondragleave="app.handleDragLeave(event)">
                        <span style="font-size: 40px;">📁</span>
                        <span>Musica</span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
                    <div class="drag-item" draggable="true" data-correct="Immagini" ondragstart="app.handleDragStart(event, 'Immagini')" ondragend="app.handleDragEnd(event)">🖼️ foto.jpg</div>
                    <div class="drag-item" draggable="true" data-correct="Documenti" ondragstart="app.handleDragStart(event, 'Documenti')" ondragend="app.handleDragEnd(event)">📝 lettera.txt</div>
                    <div class="drag-item" draggable="true" data-correct="Musica" ondragstart="app.handleDragStart(event, 'Musica')" ondragend="app.handleDragEnd(event)">🎵 canzone.mp3</div>
                </div>
                <div id="game-feedback-${windowId}"></div>
                <button class="guide-btn" style="margin-top: 20px;" onclick="app.resetGameArea('${windowId}')">← Torna ai giochi</button>
            `;
        } else if (gameType === 'match') {
            const questions = [
                { icon: '📁', answer: 'cartella', options: ['cartella', 'file', 'computer', 'internet'] },
                { icon: '🌐', answer: 'internet', options: ['computer', 'internet', 'stampante', 'tastiera'] },
                { icon: '🤖', answer: 'tutor', options: ['tutor', 'gioco', 'musica', 'foto'] },
                { icon: '💾', answer: 'file', options: ['cartella', 'file', 'schermo', 'mouse'] },
            ];

            const q = questions[Math.floor(Math.random() * questions.length)];
            area.innerHTML = `
                <h3 style="color: #667eea;">🔍 A cosa serve questa icona?</h3>
                <p style="color: #4a5568;">Guarda l'icona e scegli la risposta giusta!</p>
                <div style="font-size: 80px; margin: 20px 0;">${q.icon}</div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                    ${q.options.map(opt => `
                        <button class="guide-btn" onclick="app.checkMatchAnswer('${windowId}', '${opt}', '${q.answer}')">${opt}</button>
                    `).join('')}
                </div>
                <div id="game-feedback-${windowId}"></div>
                <button class="guide-btn" style="margin-top: 20px;" onclick="app.resetGameArea('${windowId}')">← Torna ai giochi</button>
            `;
        }
    }

    handleDragStart(e, correctFolder) {
        e.dataTransfer.setData('text/plain', correctFolder);
        e.target.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e, windowId) {
        e.preventDefault();
        const dropZone = e.currentTarget;
        dropZone.classList.remove('drag-over');

        const correctFolder = e.dataTransfer.getData('text/plain');
        const targetFolder = dropZone.dataset.folder;

        const feedback = document.getElementById(`game-feedback-${windowId}`);

        if (correctFolder === targetFolder) {
            feedback.innerHTML = '<div class="game-feedback success">✅ Corretto! Bravo!</div>';
            this.showTutorMessage('Bravo! Hai messo il file nella cartella giusta!');
        } else {
            feedback.innerHTML = '<div class="game-feedback error">❌ Non è la cartella giusta. Riprova!</div>';
        }
    }

    checkMatchAnswer(windowId, answer, correct) {
        const feedback = document.getElementById(`game-feedback-${windowId}`);
        if (answer === correct) {
            feedback.innerHTML = '<div class="game-feedback success">✅ Esatto! Molto bene!</div>';
            this.showTutorMessage('Corretto! Sai tante cose!');
        } else {
            feedback.innerHTML = '<div class="game-feedback error">❌ Non esattamente. Riprova!</div>';
        }
    }

    resetGameArea(windowId) {
        const area = document.getElementById(`game-area-${windowId}`);
        if (area) {
            area.innerHTML = `
                <p>Scegli un gioco per iniziare!</p>
                <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
                    <button class="guide-btn" onclick="app.startGame('${windowId}', 'dragdrop')">📁 Trascina nella cartella</button>
                    <button class="guide-btn" onclick="app.startGame('${windowId}', 'match')">🔍 Indovina a cosa serve</button>
                </div>
            `;
        }
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    // ===== Calculator =====
    getCalculatorContent(windowId) {
        return `
            <div class="calculator" id="calc-${windowId}">
                <div class="calc-display" id="calc-display-${windowId}">0</div>
                <div class="calc-buttons">
                    <button class="calc-btn calc-clear" onclick="app.calcClear('${windowId}')">C</button>
                    <button class="calc-btn calc-op" onclick="app.calcBackspace('${windowId}')">⌫</button>
                    <button class="calc-btn calc-op" onclick="app.calcInput('${windowId}', '/')">/</button>
                    <button class="calc-btn calc-op" onclick="app.calcInput('${windowId}', '*')">×</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '7')">7</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '8')">8</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '9')">9</button>
                    <button class="calc-btn calc-op" onclick="app.calcInput('${windowId}', '-')">-</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '4')">4</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '5')">5</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '6')">6</button>
                    <button class="calc-btn calc-op" onclick="app.calcInput('${windowId}', '+')">+</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '1')">1</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '2')">2</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '3')">3</button>
                    <button class="calc-btn calc-equal" onclick="app.calcEqual('${windowId}')">=</button>
                    <button class="calc-btn calc-zero" onclick="app.calcInput('${windowId}', '0')">0</button>
                    <button class="calc-btn" onclick="app.calcInput('${windowId}', '.')">.</button>
                </div>
            </div>
        `;
    }

    initCalculator(windowId) {
        const calc = {
            current: '0',
            previous: null,
            operator: null,
            waitingForOperand: false,
        };

        this.calculators = this.calculators || {};
        this.calculators[windowId] = calc;
    }

    calcInput(windowId, value) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        if (!calc || !display) return;

        if (calc.waitingForOperand) {
            calc.current = value === '.' ? '0.' : value;
            calc.waitingForOperand = false;
        } else {
            if (value === '.' && calc.current.includes('.')) return;
            calc.current = calc.current === '0' && value !== '.' ? value : calc.current + value;
        }

        display.textContent = calc.current;
    }

    calcClear(windowId) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        if (!calc || !display) return;

        calc.current = '0';
        calc.previous = null;
        calc.operator = null;
        calc.waitingForOperand = false;
        display.textContent = '0';
    }

    calcBackspace(windowId) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        if (!calc || !display) return;

        if (calc.waitingForOperand) return;
        calc.current = calc.current.length > 1 ? calc.current.slice(0, -1) : '0';
        display.textContent = calc.current;
    }

    calcOperation(windowId, nextOperator) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        if (!calc || !display) return;

        const inputValue = parseFloat(calc.current);

        if (calc.previous === null) {
            calc.previous = inputValue;
        } else if (calc.operator) {
            const currentValue = calc.previous || 0;
            let result;
            switch (calc.operator) {
                case '+': result = currentValue + inputValue; break;
                case '-': result = currentValue - inputValue; break;
                case '*': result = currentValue * inputValue; break;
                case '/': result = inputValue === 0 ? 'Errore' : currentValue / inputValue; break;
                default: result = inputValue;
            }
            calc.current = typeof result === 'number' ? String(result) : result;
            calc.previous = typeof result === 'number' ? result : null;
            display.textContent = calc.current;
        }

        calc.waitingForOperand = true;
        calc.operator = nextOperator;
    }

    calcEqual(windowId) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        if (!calc || !display) return;

        if (!calc.operator || calc.previous === null) return;

        const inputValue = parseFloat(calc.current);
        const currentValue = calc.previous || 0;
        let result;
        switch (calc.operator) {
            case '+': result = currentValue + inputValue; break;
            case '-': result = currentValue - inputValue; break;
            case '*': result = currentValue * inputValue; break;
            case '/': result = inputValue === 0 ? 'Errore' : currentValue / inputValue; break;
            default: result = inputValue;
        }

        calc.current = typeof result === 'number' ? String(result) : result;
        calc.previous = null;
        calc.operator = null;
        calc.waitingForOperand = true;
        display.textContent = calc.current;
    }

    // ===== Tutor Helper Methods =====
    getTutorWelcomeMessage(appId) {
        const messages = {
            'file-manager': 'Benvenuto nel File Manager! Qui puoi organizzare i tuoi file in cartelle, come un vero armadio digitale!',
            'browser': 'Ecco il Browser! Da qui puoi esplorare pagine sicure per imparare cos\'è Internet. Tutto è controllato e sicuro!',
            'tutor': 'Sono il tuo Tutor AI! Chiedimi qualsiasi cosa. Cosa vuoi sapere?',
            'settings': 'Nelle Impostazioni puoi personalizzare il computer: cambia lo sfondo, la dimensione delle icone e la modalità!',
            'guide': 'Benvenuto nella Guida! Ti accompagnerò passo passo alla scoperta del computer. Iniziamo?',
            'games': 'Ecco i Giochi! Qui impari divertendoti. Scegli un gioco e buon divertimento!',
            'calculator': 'Ecco la Calcolatrice! Puoi fare addizioni, sottrazioni, moltiplicazioni e divisioni in modo semplice e veloce.',
        };
        return messages[appId] || 'Benvenuto!';
    }

    // ===== System =====
    shutdown() {
        this.toggleStartMenu(false);
        const shutdownScreen = document.getElementById('shutdown-screen');
        shutdownScreen.classList.remove('hidden');

        // Close all windows
        this.state.openWindows.forEach(w => {
            const win = document.getElementById(w.id);
            if (win) win.remove();
        });
        this.state.openWindows = [];
        this.updateTaskbarApps();
    }

    wakeUp() {
        const shutdownScreen = document.getElementById('shutdown-screen');
        shutdownScreen.classList.add('hidden');

        this.showTutorMessage('Bentornato! Sei di nuovo nel tuo computer virtuale.');
    }

    // ===== Global Methods =====
    selectProfile(profile) {
        this.state.profile = profile;
        this.state.userMode = profile;
        localStorage.setItem('webos_profile', profile);
        localStorage.setItem('webos_mode', profile);

        const bootScreen = document.getElementById('boot-screen');
        bootScreen.classList.add('fade-out');

        setTimeout(() => {
            bootScreen.classList.add('hidden');
            this.boot();
        }, 800);
    }

    toggleStartMenu(forceState = null) {
        const menu = document.getElementById('start-menu');
        if (forceState !== null) {
            this.state.startMenuOpen = forceState;
        } else {
            this.state.startMenuOpen = !this.state.startMenuOpen;
        }

        if (this.state.startMenuOpen) {
            menu.classList.remove('hidden');
        } else {
            menu.classList.add('hidden');
        }
    }

    showTutorMessage(message) {
        const bubble = document.getElementById('tutor-bubble');
        const content = document.getElementById('tutor-bubble-content');

        if (bubble && content) {
            content.textContent = message;
            bubble.classList.remove('hidden');

            clearTimeout(this.tutorTimeout);
            this.tutorTimeout = setTimeout(() => {
                this.hideTutorBubble();
            }, 8000);
        }
    }

    hideTutorBubble() {
        const bubble = document.getElementById('tutor-bubble');
        if (bubble) {
            bubble.classList.add('hidden');
        }
    }

    toggleVoice() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('Ciao! Sono il Tutor AI. Clicca sull\'app Tutor per chiedermi qualsiasi cosa!');
            utterance.lang = 'it-IT';
            utterance.rate = 0.9;
            speechSynthesis.speak(utterance);
        } else {
            alert('La sintesi vocale non è supportata dal tuo browser.');
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WebOSApp();
});
