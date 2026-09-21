// ===== AuraOS - Main Application =====
class AuraOSApp {
    constructor() {
        this.state = {
            iconSize: localStorage.getItem('auraos_iconSize') || 'medium',
            wallpaper: localStorage.getItem('auraos_wallpaper') || 'gradient',
            soundsEnabled: (localStorage.getItem('auraos_sounds')) !== 'false',
            openWindows: [],
            windowZIndex: 100,
            activeWindow: null,
            startMenuOpen: false,
            filesystem: null,
            tutorAI: null,
            contextMenuOpen: false,
            currentSnapWindow: null,
            bootTime: Date.now(),
            fmView: localStorage.getItem('auraos_fm_view') || 'grid',
            fmSort: { field: 'name', direction: 'asc' },
            clipboard: { type: null, items: [] },
            fmSelectedItems: [],
            trash: [],
            doNotDisturb: false,
            notifications: [],
            widgets: [],
            launcherOpen: false,
            launcherSelectedIndex: -1,
            launcherCategory: 'all',
            recentApps: [],
            recentFiles: [],
            fmCurrentPath: {},
            notificationCenterOpen: false,
            activitiesOpen: false,
            currentWorkspace: 1,
            workspaces: [
                { id: 1, name: 'Spazio 1', windows: [] },
                { id: 2, name: 'Spazio 2', windows: [] },
                { id: 3, name: 'Spazio 3', windows: [] },
            ],
            passwordEnabled: !!localStorage.getItem('auraos_password'),
            appearance: {
                theme: localStorage.getItem('auraos_theme') || 'auto',
                dockPosition: localStorage.getItem('auraos_dock_position') || 'bottom',
                dockSize: localStorage.getItem('auraos_dock_size') || 'medium',
                topBarVisible: (localStorage.getItem('auraos_topbar_visible') || 'true') !== 'false',
                animationsEnabled: (localStorage.getItem('auraos_animations') || 'true') !== 'false',
                fontSize: localStorage.getItem('auraos_font_size') || 'medium',
            },
        };

        try {
            const savedTrash = localStorage.getItem('auraos_trash');
            if (savedTrash) this.state.trash = JSON.parse(savedTrash);
        } catch (e) { this.state.trash = []; }

        try {
            const savedNotifs = localStorage.getItem('auraos_notifications');
            if (savedNotifs) this.state.notifications = JSON.parse(savedNotifs);
        } catch (e) { this.state.notifications = []; }

        try {
            const savedRecentApps = localStorage.getItem('auraos_recent_apps');
            if (savedRecentApps) this.state.recentApps = JSON.parse(savedRecentApps);
        } catch (e) { this.state.recentApps = []; }

        try {
            const savedRecentFiles = localStorage.getItem('auraos_recent_files');
            if (savedRecentFiles) this.state.recentFiles = JSON.parse(savedRecentFiles);
        } catch (e) { this.state.recentFiles = []; }

        this.desktopApps = [
            { id: 'file-manager', name: 'File e cartelle', icon: '📁', description: 'Gestisci i tuoi file' },
            { id: 'notepad', name: 'Blocco Note', icon: '📝', description: 'Scrivi appunti e note' },
            { id: 'terminal', name: 'Terminale', icon: '💻', description: 'Usa la riga di comando' },
            { id: 'task-manager', name: 'Task Manager', icon: '📊', description: 'Monitora le app aperte' },
            { id: 'browser', name: 'Internet', icon: '🌐', description: 'Esplora il web' },
            { id: 'tutor', name: 'Tutor AI', icon: '🤖', description: 'Il tuo assistente' },
            { id: 'settings', name: 'Impostazioni', icon: '⚙️', description: 'Personalizza' },
            { id: 'guide', name: 'Guida', icon: '📖', description: 'Impara come usarlo' },
            { id: 'games', name: 'Giochi', icon: '🎮', description: 'Impara divertendoti' },
            { id: 'calculator', name: 'Calcolatrice', icon: '🧮', description: 'Fai calcoli veloci' },
            { id: 'gallery', name: 'Galleria', icon: '🖼️', description: 'Guarda le tue immagini' },
            { id: 'music', name: 'Musica', icon: '🎵', description: 'Ascolta la tua musica' },
            { id: 'app-store', name: 'App Store', icon: '🛒', description: 'Scarica nuove app' },
            { id: 'text-editor', name: 'Editor di Testo', icon: '📄', description: 'Editor avanzato con syntax highlighting' },
            { id: 'image-viewer', name: 'Visualizzatore Immagini', icon: '🖼️', description: 'Visualizza e modifica immagini' },
            { id: 'video-player', name: 'Video Player', icon: '🎬', description: 'Riproduci video' },
            { id: 'pdf-viewer', name: 'PDF Viewer', icon: '📕', description: 'Visualizza file PDF' },
            { id: 'archive-manager', name: 'Gestore Archivi', icon: '🗜️', description: 'Comprimi e decomprimi file' },
            { id: 'system-monitor', name: 'Monitor di Sistema', icon: '📈', description: 'Monitora CPU, RAM, disco' },
            { id: 'disk-usage', name: 'Utilizzo Disco', icon: '💾', description: 'Analizza lo spazio disco' },
            { id: 'font-viewer', name: 'Visualizzatore Font', icon: '🔤', description: 'Esplora i font installati' },
            { id: 'screenshot', name: 'Screenshot', icon: '📸', description: 'Cattura schermate' },
            { id: 'screen-recorder', name: 'Registratore Schermo', icon: '🎥', description: 'Registra il desktop' },
            { id: 'weather-app', name: 'Meteo', icon: '🌤️', description: 'Previsioni meteo dettagliate' },
            { id: 'calendar', name: 'Calendario', icon: '📅', description: 'Gestisci eventi e appuntamenti' },
            { id: 'contacts', name: 'Contatti', icon: '👥', description: 'Gestisci i tuoi contatti' },
            { id: 'notes-app', name: 'Note', icon: '📓', description: 'Note avanzate con markdown' },
            { id: 'tasks', name: 'Attività', icon: '✅', description: 'Gestisci i tuoi task' },
        ];

        this.wallpapers = {
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            blue: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
            green: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
            purple: 'linear-gradient(135deg, #834d9b 0%, #d04ed6 100%)',
            orange: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            aurora: 'aurora',
            ocean: 'ocean',
            matrix: 'matrix',
        };

        this.tutorAI = new TutorAI();
        this.init();
    }

    init() {
        this.initNativeAPIs();
        this.initFilesystem();
        this.initRealFilesystem();
        this.initSoundEngine();
        this.setupEventListeners();
        this.loadWorkspaceConfig();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.updateNotificationBadge();
        if (this.state.passwordEnabled) {
            this.showLoginScreen();
        } else {
            this.showBootScreen();
        }
    }

    initNativeAPIs() {
        this.isElectron = typeof window !== 'undefined' && window.auraOSNative !== undefined;
        this.hasFileSystemAccess = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
        if (this.isElectron) {
            this.platform = window.auraosNative.platform;
        }
    }

    async     initRealFilesystem() {
        if (!this.hasFileSystemAccess) return;
        const savedHandle = localStorage.getItem('auraos_real_fs_handle');
        if (savedHandle) {
            try {
                const handle = await navigator.storage.getDirectory();
                this.realFileHandle = handle;
            } catch (e) {
                this.realFileHandle = null;
            }
        }
    }

    async requestRealFileSystemAccess() {
        if (!this.hasFileSystemAccess) {
            this.showToast('Filesystem', 'Accesso al filesystem reale non supportato in questo browser.', 'error', 3000);
            return false;
        }
        try {
            const handle = await navigator.storage.getDirectory();
            this.realFileHandle = handle;
            this.showToast('Filesystem', 'Accesso al filesystem reale concesso! Ora puoi usare file reali.', 'success', 3000);
            return true;
        } catch (e) {
            this.showToast('Filesystem', 'Accesso negato. Riprova.', 'error', 3000);
            return false;
        }
    }

    showLoginScreen() {
        const loginScreen = document.getElementById('login-screen');
        const bootScreen = document.getElementById('boot-screen');
        const desktop = document.getElementById('desktop');
        const topBar = document.getElementById('top-bar');
        const dock = document.getElementById('dock');
        
        if (loginScreen) {
            loginScreen.classList.remove('hidden');
            document.getElementById('login-user-name').textContent = 
                '👤 Utente';
            setTimeout(() => {
                const input = document.getElementById('login-password');
                if (input) input.focus();
            }, 100);
        }
        if (bootScreen) bootScreen.classList.add('hidden');
        if (desktop) desktop.classList.add('hidden');
        if (topBar) topBar.classList.add('hidden');
        if (dock) dock.classList.add('hidden');
    }

    doLogin() {
        const input = document.getElementById('login-password');
        const error = document.getElementById('login-error');
        const password = input ? input.value : '';
        const storedPassword = localStorage.getItem('auraos_password');
        
        if (storedPassword && password !== storedPassword) {
            if (error) {
                error.classList.remove('hidden');
                setTimeout(() => error.classList.add('hidden'), 3000);
            }
            if (input) input.value = '';
            return;
        }
        
        if (error) error.classList.add('hidden');
        this.boot();
    }

    setPassword(password) {
        if (password) {
            localStorage.setItem('auraos_password', password);
            this.state.passwordEnabled = true;
        } else {
            localStorage.removeItem('auraos_password');
            this.state.passwordEnabled = false;
        }
    }

    initFilesystem() {
        const saved = localStorage.getItem('auraos_filesystem');
        if (saved) {
            try {
                this.state.filesystem = JSON.parse(saved);
            } catch (e) {
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
                            'Immagini': { type: 'folder', name: 'Immagini', children: {} },
                            'Musica': { type: 'folder', name: 'Musica', children: {} },
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

        if (!this.state.filesystem['/'].children['Cestino']) {
            this.state.filesystem['/'].children['Cestino'] = {
                type: 'folder',
                name: 'Cestino',
                children: {},
                isTrash: true
            };
        }
    }

    saveFilesystem() {
        try {
            localStorage.setItem('auraos_filesystem', JSON.stringify(this.state.filesystem));
        } catch (e) {
            // Ignore storage errors
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const startMenu = document.getElementById('start-menu');
            const startBtn = document.getElementById('start-btn');
            if (this.state.startMenuOpen && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                this.toggleStartMenu(false);
            }
            if (this.state.contextMenuOpen) {
                this.hideContextMenu();
            }
            const notifCenter = document.getElementById('notification-center');
            const notifBell = document.getElementById('notification-bell');
            if (this.state.notificationCenterOpen && notifCenter && !notifCenter.contains(e.target) && !notifBell.contains(e.target)) {
                this.closeNotificationCenter();
            }
        });

        const desktop = document.getElementById('desktop');
        if (desktop) {
            desktop.addEventListener('click', (e) => {
                if (e.target === desktop || e.target.classList.contains('desktop-icons')) {
                    this.state.activeWindow = null;
                    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
                    this.updateDock();
                    this.updateTopBar();
                }
            });

            desktop.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showContextMenu(e.clientX, e.clientY);
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleStartMenu(false);
                this.hideTutorBubble();
                this.hideContextMenu();
                this.hideWorkspaceContextMenu();
                this.closeLauncher();
                this.closeNotificationCenter();
            }
            if (e.key === 'F10' && e.ctrlKey) {
                e.preventDefault();
                this.minimizeAllWindows();
            }
            if (e.ctrlKey && e.altKey) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prev = this.state.currentWorkspace > 1 ? this.state.currentWorkspace - 1 : this.state.workspaces.length;
                    this.switchWorkspaceFromOverview(prev);
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const next = this.state.currentWorkspace < this.state.workspaces.length ? this.state.currentWorkspace + 1 : 1;
                    this.switchWorkspaceFromOverview(next);
                }
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.toggleActivities(true);
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.toggleActivities(false);
                }
            }
            if (e.ctrlKey && e.key === ' ') {
                e.preventDefault();
                this.openLauncher();
            }
            if (e.ctrlKey && e.key === 'c' && this.state.activeWindow) {
                const winData = this.state.openWindows.find(w => w.id === this.state.activeWindow);
                if (winData && winData.appId === 'file-manager') {
                    e.preventDefault();
                    this.fmCopy();
                }
            }
            if (e.ctrlKey && e.key === 'x' && this.state.activeWindow) {
                const winData = this.state.openWindows.find(w => w.id === this.state.activeWindow);
                if (winData && winData.appId === 'file-manager') {
                    e.preventDefault();
                    this.fmCut();
                }
            }
            if (e.ctrlKey && e.key === 'v' && this.state.activeWindow) {
                const winData = this.state.openWindows.find(w => w.id === this.state.activeWindow);
                if (winData && winData.appId === 'file-manager') {
                    e.preventDefault();
                    this.fmPaste();
                }
            }
            if (document.getElementById(`calc-display-${this.state.activeWindow}`)) {
                this.handleCalculatorKeyboard(e);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.state.parallaxEnabled) {
                this.handleParallax(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.handleSnapRelease();
        });
    }

    // ===== Boot Sequence =====
    showBootScreen() {
        const bootScreen = document.getElementById('boot-screen');
        const progressBar = document.getElementById('boot-progress-bar');
        const bootStatus = document.getElementById('boot-status');
        let progress = 0;
        const messages = [
            'Caricamento kernel...',
            'Inizializzazione sistema...',
            'Caricamento driver...',
            'Avvio servizi...',
            'Preparazione desktop...'
        ];
        let messageIndex = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 25 + 10;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(interval);
                bootStatus.textContent = 'Accesso...';
                setTimeout(() => {
                    bootScreen.classList.add('fade-out');
                    setTimeout(() => {
                        bootScreen.classList.add('hidden');
                        this.boot();
                    }, 800);
                }, 500);
            } else if (Math.floor(progress) % 20 === 0 && messageIndex < messages.length - 1) {
                messageIndex++;
                bootStatus.textContent = messages[messageIndex];
            }
        }, 300);
    }

    boot() {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
            bootScreen.classList.add('hidden');
        }
        const desktop = document.getElementById('desktop');
        const topBar = document.getElementById('top-bar');
        const dock = document.getElementById('dock');
        const startMenuUser = document.getElementById('start-menu-user');
        desktop.classList.remove('hidden');
        if (topBar) topBar.classList.remove('hidden');
        if (dock) dock.classList.remove('hidden');
        startMenuUser.textContent = '👤 Utente';
        this.applySettings();
        this.updateTopBar();
        this.updateDock();
        this.updateNotificationBadge();
        this.createDesktopIcons();
        this.initWeatherWidget();
        this.initParallax();
        this.initClockWidget();
        this.initQuickSettings();
        this.initDashboard();
        this.initWidgets();
        this.addWidgetStartMenuItems();
        this.initInstalledApps();
        setTimeout(() => {
            this.showTutorMessage('Benvenuto in AuraOS! Sono il tuo Tutor AI. Clicca su "Guida" per iniziare, oppure esplora il desktop.');
        }, 1000);
    }

    initQuickSettings() {
        const existing = document.getElementById('quick-settings');
        if (existing) existing.remove();
        const qs = document.createElement('div');
        qs.id = 'quick-settings';
        qs.className = 'quick-settings hidden';
        qs.innerHTML = `
            <div class="quick-settings-panel">
                <div class="quick-settings-item" onclick="app.toggleWifi()">
                    <span class="quick-settings-icon">📶</span>
                    <span>WiFi</span>
                </div>
                <div class="quick-settings-item" onclick="app.toggleBluetooth()">
                    <span class="quick-settings-icon">🔵</span>
                    <span>Bluetooth</span>
                </div>
                <div class="quick-settings-item" onclick="app.toggleDarkMode()">
                    <span class="quick-settings-icon">🌙</span>
                    <span>Dark Mode</span>
                </div>
                <div class="quick-settings-item" onclick="app.toggleDoNotDisturb()">
                    <span class="quick-settings-icon">🔕</span>
                    <span>Non disturbare</span>
                </div>
            </div>
        `;
        document.body.appendChild(qs);
    }

    initDashboard() {
        const existing = document.getElementById('dashboard');
        if (existing) existing.remove();
        const dashboard = document.createElement('div');
        dashboard.id = 'dashboard';
        dashboard.className = 'dashboard hidden';
        dashboard.innerHTML = `
            <div class="dashboard-content">
                <div class="dashboard-widget">
                    <h3>📊 Sistema</h3>
                    <div class="dashboard-widget-content">
                        <p><strong>OS:</strong> AuraOS 1.0</p>
                        <p><strong>Kernel:</strong> Linux 6.1</p>
                        <p><strong>Desktop:</strong> AuraOS Desktop</p>
                    </div>
                </div>
                <div class="dashboard-widget">
                    <h3>⚡ Prestazioni</h3>
                    <div class="dashboard-widget-content">
                        <div class="dashboard-stat">
                            <span>CPU</span>
                            <div class="dashboard-stat-bar"><div class="dashboard-stat-fill" style="width: 45%"></div></div>
                        </div>
                        <div class="dashboard-stat">
                            <span>RAM</span>
                            <div class="dashboard-stat-bar"><div class="dashboard-stat-fill" style="width: 62%"></div></div>
                        </div>
                        <div class="dashboard-stat">
                            <span>Disco</span>
                            <div class="dashboard-stat-bar"><div class="dashboard-stat-fill" style="width: 38%"></div></div>
                        </div>
                    </div>
                </div>
                <div class="dashboard-widget">
                    <h3>🌤️ Meteo</h3>
                    <div class="dashboard-widget-content" id="dashboard-weather">
                        <p>Caricamento...</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dashboard);
    }

    initInstalledApps() {
        const preInstalled = [
            'file-manager', 'notepad', 'terminal', 'browser', 'tutor', 'settings',
            'guide', 'games', 'calculator', 'gallery', 'music', 'app-store',
            'text-editor', 'image-viewer', 'video-player', 'pdf-viewer',
            'archive-manager', 'system-monitor', 'disk-usage', 'font-viewer',
            'screenshot', 'screen-recorder', 'weather-app', 'calendar',
            'contacts', 'notes-app', 'tasks', 'code-editor', 'password-manager',
            'email-client', 'chat-app', 'photo-editor', 'video-editor',
            '3d-viewer', 'clock-app', 'map-app', 'notes-pro', 'whiteboard',
            'calibre', 'scan-app', 'remote-desktop', 'backup-app',
            'paint-app', 'fitness-app', 'camera-app', 'reminder-app', 'plugin-manager'
        ];
        const installed = this.getInstalledApps();
        let changed = false;
        preInstalled.forEach(appId => {
            if (!installed.includes(appId)) {
                installed.push(appId);
                changed = true;
            }
        });
        if (changed) {
            this.saveInstalledApps(installed);
        }
        this.syncStartMenuWithInstalled();
    }

    syncStartMenuWithInstalled() {
        const installed = this.getInstalledApps();
        const container = document.getElementById('start-menu-items');
        if (!container) return;
        container.querySelectorAll('.start-menu-item[data-app-id]').forEach(btn => {
            const appId = btn.dataset.appId;
            btn.style.display = installed.includes(appId) ? '' : 'none';
        });
    }

    toggleQuickSettings() {
        const qs = document.getElementById('quick-settings');
        if (qs) qs.classList.toggle('hidden');
    }

    toggleDashboard() {
        const dashboard = document.getElementById('dashboard');
        if (dashboard) dashboard.classList.toggle('hidden');
    }

    toggleWifi() {
        this.showToast('Rete', 'WiFi: simulato in questa versione', 'info', 2000);
    }

    toggleBluetooth() {
        this.showToast('Bluetooth', 'Bluetooth: simulato in questa versione', 'info', 2000);
    }

    toggleDarkMode() {
        const body = document.body;
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        this.showToast('Tema', isDark ? 'Modalità scura attivata' : 'Modalità chiara attivata', 'info', 2000);
    }

    toggleDoNotDisturb() {
        this.showToast('Non disturbare', 'Modalità non disturbare attivata', 'info', 2000);
    }

    initParallax() {
        this.state.parallaxEnabled = true;
    }

    handleParallax(e) {
        const desktop = document.getElementById('desktop');
        if (!desktop) return;
        const animatedWallpapers = ['aurora', 'ocean', 'matrix'];
        if (animatedWallpapers.includes(this.state.wallpaper)) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        desktop.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
    }

    applySettings() {
        const desktop = document.getElementById('desktop');
        desktop.classList.remove('wallpaper-aurora', 'wallpaper-ocean', 'wallpaper-matrix');
        const animatedWallpapers = ['aurora', 'ocean', 'matrix'];
        if (animatedWallpapers.includes(this.state.wallpaper)) {
            desktop.style.background = '#000';
            desktop.classList.add(`wallpaper-${this.state.wallpaper}`);
        } else {
            desktop.style.background = this.wallpapers[this.state.wallpaper] || this.wallpapers.gradient;
        }
        const icons = document.querySelectorAll('.desktop-icon');
        icons.forEach(icon => {
            icon.classList.remove('size-large', 'size-small');
            if (this.state.iconSize !== 'medium') {
                icon.classList.add(`size-${this.state.iconSize}`);
            }
        });
        document.body.style.fontSize = '14px';
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

    // ===== Weather Widget =====
    initWeatherWidget() {
        const existing = document.getElementById('weather-widget');
        if (existing) existing.remove();
        const widget = document.createElement('div');
        widget.id = 'weather-widget';
        widget.className = 'weather-widget';
        const cached = localStorage.getItem('auraos_weather');
        let weatherData;
        try {
            weatherData = cached ? JSON.parse(cached) : this.generateWeatherData();
        } catch (e) {
            weatherData = this.generateWeatherData();
        }
        localStorage.setItem('auraos_weather', JSON.stringify(weatherData));
        widget.innerHTML = this.getWeatherWidgetHTML(weatherData);
        const desktop = document.getElementById('desktop');
        desktop.appendChild(widget);
        const refreshBtn = document.getElementById('weather-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newData = this.generateWeatherData();
                localStorage.setItem('auraos_weather', JSON.stringify(newData));
                widget.innerHTML = this.getWeatherWidgetHTML(newData);
                this.playSound('success');
            });
        }
    }

    generateWeatherData() {
        const conditions = [
            { icon: '☀️', label: 'Soleggiato', tempRange: [22, 35] },
            { icon: '⛅', label: 'Nuvoloso', tempRange: [18, 28] },
            { icon: '🌧️', label: 'Pioggia', tempRange: [12, 22] },
            { icon: '⛈️', label: 'Temporale', tempRange: [15, 25] },
            { icon: '❄️', label: 'Neve', tempRange: [-5, 5] },
        ];
        const cities = [
            { name: 'Roma', country: 'Italia' },
            { name: 'Milano', country: 'Italia' },
            { name: 'Napoli', country: 'Italia' },
            { name: 'Torino', country: 'Italia' },
            { name: 'Firenze', country: 'Italia' },
        ];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = Math.floor(Math.random() * (condition.tempRange[1] - condition.tempRange[0])) + condition.tempRange[0];
        const forecast = [];
        const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
        const today = new Date().getDay();
        for (let i = 1; i <= 4; i++) {
            const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];
            forecast.push({
                day: days[(today + i) % 7],
                icon: dayCondition.icon,
                tempHigh: Math.floor(Math.random() * (dayCondition.tempRange[1] - dayCondition.tempRange[0])) + dayCondition.tempRange[0],
                tempLow: Math.floor(Math.random() * 5) + Math.floor(condition.tempRange[0] / 2),
            });
        }
        return { city: city.name, country: city.country, condition: condition.label, icon: condition.icon, temp, humidity: Math.floor(Math.random() * 60) + 30, wind: Math.floor(Math.random() * 20) + 5, forecast };
    }

    getWeatherWidgetHTML(data) {
        const forecastHTML = data.forecast.map(d => `
            <div class="weather-forecast-day">
                <span class="weather-forecast-day-name">${d.day}</span>
                <span class="weather-forecast-icon">${d.icon}</span>
                <span class="weather-forecast-temp">${d.tempHigh}°</span>
            </div>
        `).join('');
        return `
            <div class="weather-widget-header">
                <span class="weather-widget-title">🌤️ Meteo</span>
                <button class="weather-refresh-btn" id="weather-refresh-btn" title="Aggiorna">🔄</button>
            </div>
            <div class="weather-widget-main">
                <span class="weather-widget-icon">${data.icon}</span>
                <span class="weather-widget-temp">${data.temp}°C</span>
                <span class="weather-widget-condition">${data.condition}</span>
            </div>
            <div class="weather-widget-location">📍 ${data.city}, ${data.country}</div>
            <div class="weather-widget-details">
                <span>💧 ${data.humidity}%</span>
                <span>💨 ${data.wind} km/h</span>
            </div>
            <div class="weather-widget-forecast">
                <div class="weather-forecast-row">
                    ${forecastHTML}
                </div>
            </div>
        `;
    }

    // ===== Context Menu =====
    showContextMenu(x, y) {
        this.hideContextMenu();
        const menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.className = 'context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.innerHTML = `
            <div class="context-menu-item" data-action="file-manager">📁 Apri File Manager</div>
            <div class="context-menu-item" data-action="calculator">🧮 Apri Calcolatrice</div>
            <div class="context-menu-item" data-action="wallpaper">🎨 Cambia sfondo</div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="properties">ℹ️ Proprietà</div>
        `;
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                if (action === 'file-manager') this.openApp('file-manager');
                else if (action === 'calculator') this.openApp('calculator');
                else if (action === 'wallpaper') this.cycleWallpaper();
                else if (action === 'properties') this.showProperties();
                this.hideContextMenu();
            });
        });
        document.body.appendChild(menu);
        this.state.contextMenuOpen = true;
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) menu.style.left = (window.innerWidth - menuRect.width - 5) + 'px';
        if (menuRect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - menuRect.height - 5) + 'px';
    }

    hideContextMenu() {
        const existing = document.getElementById('context-menu');
        if (existing) existing.remove();
        this.state.contextMenuOpen = false;
    }

    showProperties() {
        const freeMem = Math.floor(Math.random() * 500 + 200);
        const content = `
            <div style="padding: 20px;">
                <h3 style="color: #667eea; margin-bottom: 15px;">ℹ️ Proprietà del sistema</h3>
                <div style="background: #f7fafc; padding: 15px; border-radius: 8px; line-height: 2;">
                    <p><strong>Sistema:</strong> AuraOS v1.0</p>
                    <p><strong>Utente:</strong> ${'auraos'}</p>
                    <p><strong>Modalità:</strong> ${this.state.userMode}</p>
                    <p><strong>Sfondo:</strong> ${this.state.wallpaper}</p>
                    <p><strong>Icone:</strong> ${this.state.iconSize}</p>
                    <p><strong>App aperte:</strong> ${this.state.openWindows.length}</p>
                    <p><strong>Memoria libera:</strong> ${freeMem} MB</p>
                </div>
                <button class="file-manager-btn" style="margin-top: 15px;" onclick="this.closest('.window').querySelector('.window-control.close').click()">Chiudi</button>
            </div>
        `;
        const propsWin = document.createElement('div');
        propsWin.className = 'window active';
        propsWin.id = 'window-props';
        propsWin.style.cssText = 'left:50%;top:50%;transform:translate(-50%,-50%);width:350px;height:auto;z-index:9999;';
        propsWin.innerHTML = `
            <div class="window-titlebar" data-window-id="window-props">
                <div class="window-title"><span>ℹ️</span><span>Proprietà</span></div>
                <div class="window-controls">
                    <button class="window-control close" onclick="app.closeWindow('window-props')" title="Chiudi">✕</button>
                </div>
            </div>
            <div class="window-content">${content}</div>
        `;
        propsWin.addEventListener('mousedown', () => this.focusWindow('window-props'));
        document.getElementById('window-container').appendChild(propsWin);
    }

    cycleWallpaper() {
        const keys = Object.keys(this.wallpapers);
        const currentIdx = keys.indexOf(this.state.wallpaper);
        const nextIdx = (currentIdx + 1) % keys.length;
        this.setWallpaper(keys[nextIdx]);
    }

    // ===== Window Snapping =====
    handleWindowSnap(win, windowId) {
        const rect = win.getBoundingClientRect();
        const snapThreshold = 80;
        const edgeThreshold = 20;
        const windowData = this.state.openWindows.find(w => w.id === windowId);
        if (!windowData) return;
        if (windowData.maximized) return;
        if (Math.abs(rect.left) < edgeThreshold && rect.width > 300) {
            win.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            win.style.left = '0px';
            win.style.top = '32px';
            win.style.width = window.innerWidth / 2 + 'px';
            win.style.height = (window.innerHeight - 32) + 'px';
            win.style.borderRadius = '0px';
            this.state.currentSnapWindow = windowId;
            this.state.snapState = 'left';
            this.playSound('success');
            setTimeout(() => { win.style.transition = ''; }, 300);
            return;
        }
        if (Math.abs(rect.right - window.innerWidth) < edgeThreshold && rect.width > 300) {
            win.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            win.style.left = (window.innerWidth / 2) + 'px';
            win.style.top = '32px';
            win.style.width = window.innerWidth / 2 + 'px';
            win.style.height = (window.innerHeight - 32) + 'px';
            win.style.borderRadius = '0px';
            this.state.currentSnapWindow = windowId;
            this.state.snapState = 'right';
            this.playSound('success');
            setTimeout(() => { win.style.transition = ''; }, 300);
            return;
        }
        if (rect.top < snapThreshold && !windowData.maximized) {
            win.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            win.style.left = '0px';
            win.style.top = '32px';
            win.style.width = window.innerWidth + 'px';
            win.style.height = (window.innerHeight - 32) + 'px';
            win.style.borderRadius = '0px';
            windowData.maximized = true;
            windowData.prevX = windowData.x;
            windowData.prevY = windowData.y;
            windowData.prevWidth = windowData.width;
            windowData.prevHeight = windowData.height;
            win.classList.add('maximized');
            this.state.currentSnapWindow = windowId;
            this.state.snapState = 'maximized';
            this.playSound('success');
            setTimeout(() => { win.style.transition = ''; }, 300);
        }
    }

    handleSnapRelease() {
        const win = document.getElementById(this.state.currentSnapWindow);
        if (!win) return;
        const windowData = this.state.openWindows.find(w => w.id === this.state.currentSnapWindow);
        if (this.state.snapState === 'left' || this.state.snapState === 'right') {
            if (windowData && windowData.maximized) {
                win.classList.remove('maximized');
                windowData.maximized = false;
            }
            win.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            win.style.left = windowData.prevX || '50px';
            win.style.top = windowData.prevY || '50px';
            win.style.width = windowData.prevWidth || '600px';
            win.style.height = windowData.prevHeight || '450px';
            win.style.borderRadius = '10px';
            windowData.x = parseInt(windowData.prevX || '50');
            windowData.y = parseInt(windowData.prevY || '50');
            windowData.width = parseInt(windowData.prevWidth || '600');
            windowData.height = parseInt(windowData.prevHeight || '450');
            setTimeout(() => { win.style.transition = ''; }, 300);
        }
        if (this.state.snapState === 'maximized' && windowData) {
            win.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            win.style.left = windowData.prevX || '50px';
            win.style.top = windowData.prevY || '50px';
            win.style.width = windowData.prevWidth || '600px';
            win.style.height = windowData.prevHeight || '450px';
            win.style.borderRadius = '10px';
            windowData.maximized = false;
            win.classList.remove('maximized');
            windowData.x = parseInt(windowData.prevX || '50');
            windowData.y = parseInt(windowData.prevY || '50');
            windowData.width = parseInt(windowData.prevWidth || '600');
            windowData.height = parseInt(windowData.prevHeight || '450');
            setTimeout(() => { win.style.transition = ''; }, 300);
        }
        this.state.currentSnapWindow = null;
        this.state.snapState = null;
    }

    minimizeAllWindows() {
        this.state.openWindows.forEach(w => {
            const win = document.getElementById(w.id);
            if (win) {
                win.classList.add('minimized');
                w.minimized = true;
            }
        });
        this.state.activeWindow = null;
        this.updateDock();
        this.updateTopBar();
    }

    // ===== Sound Engine =====
    initSoundEngine() {
        this.audioContext = null;
        this.state.soundsEnabled = (localStorage.getItem('auraos_sounds')) !== 'false';
    }

    getAudioContext() {
        if (!this.audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            }
        }
        return this.audioContext;
    }

    playSound(type) {
        if (!this.state.soundsEnabled) return;
        try {
            const ctx = this.getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const sounds = {
                click: () => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    osc.start(now);
                    osc.stop(now + 0.05);
                },
                open: () => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523, now);
                    osc.frequency.setValueAtTime(659, now + 0.08);
                    osc.frequency.setValueAtTime(784, now + 0.16);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                },
                close: () => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(392, now);
                    osc.frequency.exponentialRampToValueAtTime(196, now + 0.15);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                },
                error: () => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(200, now);
                    osc.frequency.setValueAtTime(150, now + 0.1);
                    gain.gain.setValueAtTime(0.08, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                },
                success: () => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523, now);
                    osc.frequency.setValueAtTime(659, now + 0.1);
                    osc.frequency.setValueAtTime(784, now + 0.2);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.linearRampToValueAtTime(0.15, now + 0.15);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                },
            };
            if (sounds[type]) sounds[type]();
        } catch (e) {
            // Audio not available
        }
    }

    toggleSounds(enabled) {
        this.state.soundsEnabled = enabled;
        localStorage.setItem('auraos_sounds', enabled);
        this.showToast('Audio', enabled ? 'Effetti sonori attivati.' : 'Effetti sonori disattivati.', 'info', 2000);
        if (enabled) this.playSound('success');
    }

    // ===== Taskbar & Start Menu =====
    updateClock() {
        const clock = document.getElementById('top-bar-clock');
        const now = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        if (clock) clock.textContent = now.toLocaleDateString('it-IT', options);
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
            this.addNotification('Menu avviato', 'Menu Start aperto.', 'info');
        } else {
            menu.classList.add('hidden');
        }
    }

    // ===== Window Manager =====
    openApp(appId) {
        this.toggleStartMenu(false);
        this.playSound('click');
        this.addToRecentApps(appId);
        const appConfig = this.desktopApps.find(a => a.id === appId);
        if (!appConfig) return;
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
        const isMobile = window.innerWidth < 768;
        const isSmallMobile = window.innerWidth < 480;
        let width, height;
        if (isSmallMobile) {
            width = window.innerWidth * 0.95;
            height = window.innerHeight - 120;
        } else if (isMobile) {
            width = window.innerWidth * 0.92;
            height = window.innerHeight - 110;
        } else {
            width = appId === 'tutor' ? 400 : appId === 'notepad' ? 550 : appId === 'terminal' ? 700 : appId === 'task-manager' ? 600 : appId === 'gallery' ? 700 : appId === 'music' ? 750 : appId === 'app-store' ? 800 : 600;
            height = appId === 'tutor' ? 500 : appId === 'notepad' ? 500 : appId === 'terminal' ? 450 : appId === 'task-manager' ? 500 : appId === 'gallery' ? 500 : appId === 'music' ? 500 : appId === 'app-store' ? 600 : 450;
        }
        const windowData = {
            id: windowId,
            appId: appId,
            title: appConfig.name,
            icon: appConfig.icon,
            x: Math.min(50 + (this.state.openWindows.length * 30), Math.max(10, window.innerWidth - width - 10)),
            y: Math.min(50 + (this.state.openWindows.length * 30), Math.max(40, window.innerHeight - height - 80)),
            width: width,
            height: height,
            minimized: false,
            maximized: false,
            workspaceId: this.state.currentWorkspace,
            prevX: null,
            prevY: null,
            prevWidth: null,
            prevHeight: null,
        };
        this.state.openWindows.push(windowData);
        const ws = this.state.workspaces.find(w => w.id === this.state.currentWorkspace);
        if (ws && !ws.windows.includes(windowId)) ws.windows.push(windowId);
        this.renderWindow(windowData);
        this.updateDock();
        this.updateTopBar();
        this.focusWindow(windowId);
        this.playSound('open');
        this.showTutorMessage(this.getTutorWelcomeMessage(appId));
    }

    renderWindow(windowData) {
        const container = document.getElementById('window-container');
        const win = document.createElement('div');
        win.className = 'window active';
        win.id = windowData.id;
        win.style.left = Math.min(windowData.x, Math.max(0, window.innerWidth - windowData.width)) + 'px';
        win.style.top = Math.min(windowData.y, Math.max(36, window.innerHeight - windowData.height - 68)) + 'px';
        win.style.width = windowData.width + 'px';
        win.style.height = windowData.height + 'px';
        win.style.zIndex = ++this.state.windowZIndex;
        win.style.animation = 'windowOpen 0.2s ease';
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
        win.addEventListener('mousedown', () => this.focusWindow(windowData.id));
        this.makeDraggable(win, windowData.id);
        this.makeResizable(win, windowData.id);
        container.appendChild(win);
        this.initApp(windowData.appId, windowData.id);
    }

    getAppContent(appId, windowId) {
        switch (appId) {
            case 'file-manager':
                return this.getFileManagerContent(windowId);
            case 'notepad':
                return this.getNotepadContent(windowId);
            case 'terminal':
                return this.getTerminalContent(windowId);
            case 'task-manager':
                return this.getTaskManagerContent(windowId);
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
            case 'gallery':
                return this.getGalleryContent(windowId);
            case 'music':
                return this.getMusicContent(windowId);
            case 'app-store':
                return this.getAppStoreContent(windowId);
            case 'plugin-manager':
                return this.getPluginManagerContent(windowId);
            default:
                return '<p>App in caricamento...</p>';
        }
    }

    focusWindow(windowId) {
        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove('active');
            w.style.boxShadow = '';
        });
        const win = document.getElementById(windowId);
        if (win) {
            win.classList.add('active');
            win.style.zIndex = ++this.state.windowZIndex;
            this.state.activeWindow = windowId;
            win.style.animation = 'windowFocus 0.3s ease';
            setTimeout(() => { win.style.animation = ''; }, 300);
            this.updateDock();
            this.updateTopBar();
        }
    }

    minimizeWindow(windowId) {
        this.playSound('close');
        const win = document.getElementById(windowId);
        if (win) {
            win.style.animation = 'windowMinimize 0.3s ease forwards';
            setTimeout(() => {
                win.classList.add('minimized');
                win.style.animation = '';
                const windowData = this.state.openWindows.find(w => w.id === windowId);
                if (windowData) windowData.minimized = true;
                this.state.activeWindow = null;
                this.updateDock();
                this.updateTopBar();
            }, 300);
        }
    }

    maximizeWindow(windowId) {
        const win = document.getElementById(windowId);
        if (!win) return;
        const windowData = this.state.openWindows.find(w => w.id === windowId);
        if (!windowData) return;
        windowData.maximized = !windowData.maximized;
        if (windowData.maximized) {
            win.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            win.classList.add('maximized');
            windowData.prevX = win.style.left;
            windowData.prevY = win.style.top;
            windowData.prevWidth = win.style.width;
            windowData.prevHeight = win.style.height;
            win.style.left = '0px';
            win.style.top = '32px';
            win.style.width = '100%';
            win.style.height = `calc(100% - 32px)`;
            win.style.borderRadius = '0px';
            win.style.animation = 'windowBounce 0.3s ease';
            setTimeout(() => { win.style.animation = ''; }, 300);
        } else {
            win.classList.remove('maximized');
            win.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            win.style.left = windowData.prevX || '50px';
            win.style.top = windowData.prevY || '50px';
            win.style.width = windowData.prevWidth || '600px';
            win.style.height = windowData.prevHeight || '450px';
            win.style.borderRadius = '10px';
            win.style.animation = 'windowBounce 0.3s ease';
            setTimeout(() => { win.style.animation = ''; }, 300);
        }
        this.state.currentSnapWindow = null;
        this.state.snapState = null;
    }

    closeWindow(windowId) {
        this.playSound('close');
        const win = document.getElementById(windowId);
        if (win) {
            win.style.animation = 'windowClose 0.2s ease forwards';
            setTimeout(() => {
                win.remove();
                this.state.openWindows = this.state.openWindows.filter(w => w.id !== windowId);
                this.updateDock();
                this.updateTopBar();
            }, 200);
        }
        const winData = this.state.openWindows.find(w => w.id === windowId);
        if (winData) {
            this.state.workspaces.forEach(ws => {
                ws.windows = ws.windows.filter(id => id !== windowId);
            });
            if (winData.appId === 'music' && this.musicAudio && this.musicAudio[windowId]) {
                this.musicAudio[windowId].pause();
                this.musicAudio[windowId].src = '';
            }
            if (winData.appId === 'gallery' && this.gallerySlideshow && this.gallerySlideshow[windowId]) {
                this.stopGallerySlideshow(windowId);
            }
            if (winData.appId === 'terminal') {
                this.saveTerminalState(windowId);
                if (this._terminalCleanup && this._terminalCleanup[windowId]) {
                    document.removeEventListener('keydown', this._terminalCleanup[windowId]);
                    delete this._terminalCleanup[windowId];
                }
            }
            this.showToast('Chiusa', `"${winData.title}" chiusa.`, 'info', 2000);
            this.addNotification('Finestra chiusa', `"${winData.title}" è stata chiusa.`, 'info');
        }
    }

    updateDock() {
        const container = document.getElementById('dock');
        if (!container) return;
        const items = container.querySelectorAll('.dock-item[data-app]:not([data-app="app-launcher"])');
        items.forEach(item => {
            const appId = item.dataset.app;
            const indicator = item.querySelector('.dock-indicator');
            if (!indicator) return;
            const isRunning = this.state.openWindows.some(w => w.appId === appId && !w.minimized);
            indicator.classList.toggle('running', isRunning);
            item.classList.toggle('running', isRunning);
        });
    }

    makeDraggable(win, windowId) {
        const titlebar = win.querySelector('.window-titlebar');
        let isDragging = false;
        let startX, startY, initialX, initialY;
        let hasMoved = false;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-control')) return;
            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            initialX = win.offsetLeft;
            initialY = win.offsetTop;
            win.style.cursor = 'grabbing';
            win.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            hasMoved = true;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            win.style.left = Math.max(0, initialX + dx) + 'px';
            win.style.top = Math.max(32, initialY + dy) + 'px';
            this.handleWindowSnap(win, windowId);
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                win.style.cursor = '';
                win.style.transition = '';
                if (!hasMoved) this.handleWindowSnap(win, windowId);
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
            const windowData = this.state.openWindows.find(w => w.id === windowId);
            if (windowData && windowData.maximized) return;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            win.style.width = Math.max(300, initialWidth + dx) + 'px';
            win.style.height = Math.max(200, initialHeight + dy) + 'px';
            const windowData = this.state.openWindows.find(w => w.id === windowId);
            if (windowData) {
                windowData.width = Math.max(300, initialWidth + dx);
                windowData.height = Math.max(200, initialHeight + dy);
                windowData.maximized = false;
                win.classList.remove('maximized');
                win.style.borderRadius = '10px';
                this.state.currentSnapWindow = null;
                this.state.snapState = null;
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }

    // ===== Notepad App =====
    getNotepadContent(windowId) {
        return `
            <div class="notepad-toolbar">
                <button class="notepad-btn" id="notepad-clear-${windowId}" onclick="app.clearNotepad('${windowId}')">🗑️ Svuota</button>
                <span class="notepad-status" id="notepad-status-${windowId}">Pronto</span>
            </div>
            <textarea class="notepad-textarea" id="notepad-textarea-${windowId}" placeholder="Scrivi qui le tue note..."></textarea>
            <div class="notepad-footer">
                <span class="notepad-wordcount" id="notepad-wordcount-${windowId}">0 parole</span>
            </div>
        `;
    }

    initNotepad(windowId) {
        const notes = localStorage.getItem('auraos_notes');
        const textarea = document.getElementById(`notepad-textarea-${windowId}`);
        const statusEl = document.getElementById(`notepad-status-${windowId}`);
        const wordcountEl = document.getElementById(`notepad-wordcount-${windowId}`);
        if (!textarea) return;
        textarea.value = notes || '';
        if (wordcountEl) this.updateNotepadWordCount(windowId);
        let saveTimeout;
        textarea.addEventListener('input', () => {
            if (statusEl) statusEl.textContent = 'Non salvato...';
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                localStorage.setItem('auraos_notes', textarea.value);
                if (statusEl) statusEl.textContent = 'Salvato ✓';
                this.playSound('success');
            }, 800);
            if (wordcountEl) this.updateNotepadWordCount(windowId);
        });
    }

    updateNotepadWordCount(windowId) {
        const textarea = document.getElementById(`notepad-textarea-${windowId}`);
        const wordcountEl = document.getElementById(`notepad-wordcount-${windowId}`);
        if (!textarea || !wordcountEl) return;
        const text = textarea.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordcountEl.textContent = `${words} parola${words !== 1 ? 'e' : ''}`;
    }

    clearNotepad(windowId) {
        const textarea = document.getElementById(`notepad-textarea-${windowId}`);
        const statusEl = document.getElementById(`notepad-status-${windowId}`);
        const wordcountEl = document.getElementById(`notepad-wordcount-${windowId}`);
        if (!textarea) return;
        if (confirm('Sei sicuro di voler svuotare il blocco note?')) {
            textarea.value = '';
            localStorage.removeItem('auraos_notes');
            if (statusEl) statusEl.textContent = 'Pronto';
            if (wordcountEl) wordcountEl.textContent = '0 parole';
            this.playSound('success');
        }
    }

    // ===== Terminal App =====
    getTerminalContent(windowId) {
        return `
            <div class="terminal-wrapper" id="terminal-wrapper-${windowId}">
                <div class="terminal-tabs" id="terminal-tabs-${windowId}"></div>
                <div class="terminal-header">
                    <span class="terminal-header-dot red"></span>
                    <span class="terminal-header-dot yellow"></span>
                    <span class="terminal-header-dot green"></span>
                    <span class="terminal-header-title">Terminale - bash</span>
                </div>
                <div class="terminal-body" id="terminal-body-${windowId}">
                    <div class="terminal-output" id="terminal-output-${windowId}"></div>
                    <div class="terminal-input-line">
                        <span class="terminal-prompt" id="terminal-prompt-${windowId}">utente@auraos:~$&nbsp;</span>
                        <input type="text" class="terminal-input" id="terminal-input-${windowId}" autocomplete="off" spellcheck="false" autofocus>
                        <div class="terminal-ai-dropdown" id="terminal-ai-dropdown-${windowId}"></div>
                    </div>
                </div>
            </div>
        `;
    }

    initTerminal(windowId) {
        this.initTerminalTabs(windowId);
        
        const input = document.getElementById(`terminal-input-${windowId}`);
        const output = document.getElementById(`terminal-output-${windowId}`);
        const body = document.getElementById(`terminal-body-${windowId}`);
        const dropdown = document.getElementById(`terminal-ai-dropdown-${windowId}`);
        if (!input || !output) return;

        const ts = this.terminalState[windowId];
        const activeTab = ts ? ts.activeTab : null;
        const tab = ts && activeTab ? ts.tabs[activeTab] : null;
        
        if (tab && !tab.outputHTML) {
            const welcomeLines = [
                { type: 'welcome', text: 'AuraOS - Terminale v1.0' },
                { type: 'welcome', text: 'Digita "help" per vedere i comandi disponibili.' },
                { type: 'welcome', text: 'Usa i tab per navigare | Ctrl+Shift+T nuova scheda | Ctrl+/ assistenza AI' },
                { type: 'blank' },
            ];
            welcomeLines.forEach(l => this.terminalPrint(windowId, l.text, l.type));
            tab.outputHTML = output.innerHTML;
        } else if (tab) {
            output.innerHTML = tab.outputHTML;
        }

        const tabState = this.getActiveTab(windowId);
        if (tabState) {
            const prompt = document.getElementById(`terminal-prompt-${windowId}`);
            if (prompt) {
                const displayPath = tabState.cwd === '/' ? '~' : `~${tabState.cwd}`;
                prompt.innerHTML = `utente@auraos:${displayPath}$&nbsp;`;
            }
        }

        input.addEventListener('keydown', (e) => {
            const ct = this.getActiveTab(windowId);
            if (!ct) return;
            
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'c') {
                    e.preventDefault();
                    if (input.value.trim()) {
                        this.terminalPrint(windowId, `^C${input.value ? ' (interrotto)' : ''}`, 'output');
                        input.value = '';
                    }
                    return;
                }
                if (e.key === 'l') {
                    e.preventDefault();
                    const out = document.getElementById(`terminal-output-${windowId}`);
                    if (out) out.innerHTML = '';
                    return;
                }
            }
            
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                input.value = '';
                if (cmd) {
                    ct.history.push(cmd);
                    ct.historyIndex = ct.history.length;
                    this.terminalPrint(windowId, `utente@auraos:${ct.cwd === '/' ? '~' : ct.cwd}$ ${cmd}`, 'command');
                }
                this.terminalExecute(windowId, cmd);
                if (dropdown) {
                    dropdown.innerHTML = '';
                    dropdown.classList.remove('visible');
                }
                input.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (ct.historyIndex > 0) {
                    ct.historyIndex--;
                    input.value = ct.history[ct.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (ct.historyIndex < ct.history.length - 1) {
                    ct.historyIndex++;
                    input.value = ct.history[ct.historyIndex];
                } else {
                    ct.historyIndex = ct.history.length;
                    input.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const val = input.value.trim();
                if (val.startsWith('ai ') || val.startsWith('help ') || val.startsWith('?') || val === '?') {
                    this.terminalAIAssist(windowId);
                } else {
                    this.terminalTabComplete(windowId, input.value);
                }
            } else if (e.key === 'Escape') {
                if (dropdown) {
                    dropdown.innerHTML = '';
                    dropdown.classList.remove('visible');
                }
            }
        });

        input.addEventListener('input', () => {
            const val = input.value.trim();
            if (val.startsWith('ai ') || val.startsWith('help ') || val.startsWith('?') || val === '?') {
                this.terminalAIAssist(windowId);
            } else {
                if (dropdown) {
                    dropdown.innerHTML = '';
                    dropdown.classList.remove('visible');
                }
            }
        });

        input.addEventListener('focus', () => {
            if (body) body.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            if (body) body.classList.remove('focused');
        });

        body.addEventListener('click', (e) => {
            if (e.target === body || e.target.classList.contains('terminal-output')) {
                input.focus();
            }
        });

        const onGlobalKey = (e) => {
            const winData = this.state.openWindows.find(w => w.id === windowId);
            if (!winData || this.state.activeWindow !== windowId) return;
            
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'T' || e.key === 't')) {
                e.preventDefault();
                this.createNewTerminalTab(windowId);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
                e.preventDefault();
                const activeTab = this.getActiveTerminalTab(windowId);
                if (activeTab) this.closeTerminalTab(windowId, activeTab);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Tab') {
                e.preventDefault();
                this.cycleTerminalTab(windowId, e.shiftKey ? -1 : 1);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.toggleAIAssist(windowId);
            }
        };
        document.addEventListener('keydown', onGlobalKey);
        this._terminalCleanup = this._terminalCleanup || {};
        this._terminalCleanup[windowId] = onGlobalKey;

        input.focus();
    }

    terminalPrint(windowId, text, type = 'output') {
        const output = document.getElementById(`terminal-output-${windowId}`);
        if (!output) return;
        const line = document.createElement('div');
        line.className = `terminal-line terminal-${type}`;
        line.textContent = text;
        output.appendChild(line);
        const body = document.getElementById(`terminal-body-${windowId}`);
        if (body) body.scrollTop = body.scrollHeight;
    }

    terminalExecute(windowId, cmdLine) {
        const ct = this.getActiveTab(windowId);
        if (!ct) return;
        if (!cmdLine) return;

        if (cmdLine.startsWith('ai explain ')) {
            const explanation = this.getAIExplanation(cmdLine.slice(11).trim());
            this.terminalPrint(windowId, explanation, 'output');
            this.syncTabOutput(windowId);
            return;
        }

        const parts = cmdLine.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
        const cmd = parts[0] ? parts[0].toLowerCase() : '';
        const args = parts.slice(1).map(a => a.replace(/^"|"$/g, ''));

        switch (cmd) {
            case 'help':
                this.terminalPrint(windowId, 'Comandi disponibili:', 'output');
                const cmds = [
                    ['help', 'Mostra questo messaggio'],
                    ['ls', 'Lista il contenuto della cartella corrente'],
                    ['cd <cartella>', 'Cambia cartella'],
                    ['pwd', 'Mostra il percorso corrente'],
                    ['mkdir <nome>', 'Crea una nuova cartella'],
                    ['touch <nome>', 'Crea un nuovo file vuoto'],
                    ['cat <file>', 'Legge il contenuto di un file'],
                    ['echo <testo>', 'Stampa a schermo il testo'],
                    ['clear / cls', 'Pulisce lo schermo'],
                    ['whoami', 'Mostra l\'utente corrente'],
                    ['hostname', 'Mostra il nome del sistema'],
                    ['uname', 'Mostra informazioni di sistema'],
                    ['date', 'Mostra data e ora correnti'],
                    ['uptime', 'Mostra il tempo di attività'],
                    ['history', 'Mostra la cronologia comandi'],
                    ['neofetch', 'Mostra informazioni di sistema ASCII'],
                    ['calc <expr>', 'Calcolatrice semplice'],
                    ['weather', 'Mostra informazioni meteo'],
                    ['theme <nome>', 'Cambia tema (light/dark/aurora/matrix)'],
                    ['apps', 'Lista app installate'],
                    ['open <app>', 'Apri un\'applicazione'],
                    ['screenshot', 'Cattura schermata'],
                    ['reboot', 'Riavvia il sistema'],
                    ['shutdown', 'Spegni il sistema'],
                    ['sudo <cmd>', 'Esegui comando come admin (simulato)'],
                    ['cowsay <testo>', 'ASCII cow che dice qualcosa'],
                    ['matrix', 'Effetto matrix'],
                    ['rm <nome>', 'Elimina un file o cartella'],
                    ['ai explain <cmd>', 'Spiega un comando'],
                ];
                cmds.forEach(([c, d]) => this.terminalPrint(windowId, `  ${c.padEnd(20)} ${d}`, 'output'));
                break;

            case 'ls': {
                const folder = this.getFolderByPath(ct.cwd);
                if (!folder || !folder.children || Object.keys(folder.children).length === 0) {
                    this.terminalPrint(windowId, '(cartella vuota)', 'output');
                } else {
                const items = Object.entries(folder.children).map(([name, item]) =>
                    item.type === 'folder' ? `${name}/` : name
                );
                    this.terminalPrint(windowId, items.join('  '), 'output');
                }
                break;
            }
            case 'cd': {
                if (!args[0] || args[0] === '~') {
                    ct.cwd = '/';
                } else if (args[0] === '..') {
                    if (ct.cwd !== '/') {
                        const parts = ct.cwd.split('/').filter(Boolean);
                        parts.pop();
                        ct.cwd = parts.length === 0 ? '/' : '/' + parts.join('/');
                    }
                } else if (args[0].startsWith('/')) {
                    const folder = this.getFolderByPath(args[0]);
                    if (folder && folder.type === 'folder') {
                        ct.cwd = args[0];
                    } else {
                        this.terminalPrint(windowId, `cd: ${args[0]}: Nessuna tale directory`, 'error');
                    }
                } else {
                    const newPath = ct.cwd === '/' ? `/${args[0]}` : `${ct.cwd}/${args[0]}`;
                    const folder = this.getFolderByPath(newPath);
                    if (folder && folder.type === 'folder') {
                        ct.cwd = newPath;
                    } else {
                        this.terminalPrint(windowId, `cd: ${args[0]}: Nessuna tale directory`, 'error');
                    }
                }
                this.terminalUpdatePrompt(windowId);
                break;
            }
            case 'pwd':
                this.terminalPrint(windowId, ct.cwd, 'output');
                break;

            case 'mkdir': {
                if (!args[0]) {
                    this.terminalPrint(windowId, 'mkdir: manca il nome della cartella', 'error');
                    break;
                }
                const folder = this.getFolderByPath(ct.cwd);
                if (folder && folder.children) {
                    if (folder.children[args[0]]) {
                        this.terminalPrint(windowId, `mkdir: impossibile creare "${args[0]}": File esistente`, 'error');
                    } else {
                        folder.children[args[0]] = { type: 'folder', name: args[0], children: {} };
                        this.saveFilesystem();
                        this.terminalPrint(windowId, '', 'output');
                    }
                }
                break;
            }
            case 'touch': {
                if (!args[0]) {
                    this.terminalPrint(windowId, 'touch: manca il nome del file', 'error');
                    break;
                }
                const folder = this.getFolderByPath(ct.cwd);
                if (folder && folder.children) {
                    if (!folder.children[args[0]]) {
                        folder.children[args[0]] = { type: 'file', name: args[0], content: '' };
                        this.saveFilesystem();
                    }
                }
                break;
            }
            case 'cat': {
                if (!args[0]) {
                    this.terminalPrint(windowId, 'cat: manca il nome del file', 'error');
                    break;
                }
                const fPath = args[0].startsWith('/') ? args[0] : ct.cwd === '/' ? `/${args[0]}` : `${ct.cwd}/${args[0]}`;
                const fileFolder = this.getFolderByPath(fPath.substring(0, fPath.lastIndexOf('/')) || '/');
                const fileName = fPath.substring(fPath.lastIndexOf('/') + 1);
                if (fileFolder && fileFolder.children && fileFolder.children[fileName]) {
                    const f = fileFolder.children[fileName];
                    if (f.type === 'folder') {
                        this.terminalPrint(windowId, `cat: ${fileName}: è una directory`, 'error');
                    } else {
                        this.terminalPrint(windowId, f.content || '', 'output');
                    }
                } else {
                    this.terminalPrint(windowId, `cat: ${args[0]}: Nessun tale file o directory`, 'error');
                }
                break;
            }
            case 'echo':
                this.terminalPrint(windowId, args.join(' '), 'output');
                break;

            case 'clear': {
                const out = document.getElementById(`terminal-output-${windowId}`);
                if (out) out.innerHTML = '';
                break;
            }
            case 'whoami':
                this.terminalPrint(windowId, 'auraos', 'output');
                break;

            case 'date':
                this.terminalPrint(windowId, new Date().toString(), 'output');
                break;

            case 'neofetch':
                this.terminalNeofetch(windowId);
                break;

            case 'rm': {
                if (!args[0]) {
                    this.terminalPrint(windowId, 'rm: manca l\'operando', 'error');
                    break;
                }
                const targetFolder = this.getFolderByPath(ct.cwd);
                if (targetFolder && targetFolder.children && targetFolder.children[args[0]]) {
                    delete targetFolder.children[args[0]];
                    this.saveFilesystem();
                    this.terminalPrint(windowId, '', 'output');
                } else {
                    this.terminalPrint(windowId, `rm: impossibile rimuovere "${args[0]}": Nessun tale file o directory`, 'error');
                }
                break;
            }
            case 'history':
                ct.history.forEach((h, i) => this.terminalPrint(windowId, `  ${(i + 1).toString().padStart(4)}  ${h}`, 'output'));
                break;

            case 'cls':
            case 'clear': {
                const out = document.getElementById(`terminal-output-${windowId}`);
                if (out) out.innerHTML = '';
                break;
            }
            case 'hostname':
                this.terminalPrint(windowId, 'auraos', 'output');
                break;

            case 'uname':
                this.terminalPrint(windowId, 'AuraOS 1.0 x86_64', 'output');
                break;

            case 'uptime':
                this.terminalPrint(windowId, `up ${this.getUptime()}`, 'output');
                break;

            case 'calc': {
                if (!args[0]) {
                    this.terminalPrint(windowId, 'calc: manca l\'espressione', 'error');
                    break;
                }
                try {
                    const expr = args.join(' ').replace(/[^0-9+\-*/().]/g, '');
                    const result = Function('"use strict"; return (' + expr + ')')();
                    this.terminalPrint(windowId, String(result), 'output');
                } catch (e) {
                    this.terminalPrint(windowId, 'calc: espressione non valida', 'error');
                }
                break;
            }

            case 'weather': {
                const weatherData = this.generateWeatherData();
                this.terminalPrint(windowId, `Meteo: ${weatherData.city}, ${weatherData.country}`, 'output');
                this.terminalPrint(windowId, `Condizione: ${weatherData.condition} ${weatherData.icon}`, 'output');
                this.terminalPrint(windowId, `Temperatura: ${weatherData.temp}°C`, 'output');
                this.terminalPrint(windowId, `Umidità: ${weatherData.humidity}%`, 'output');
                this.terminalPrint(windowId, `Vento: ${weatherData.wind} km/h`, 'output');
                break;
            }

            case 'theme': {
                const themeName = args[0];
                if (!themeName) {
                    this.terminalPrint(windowId, 'Utilizzo: theme <nome>', 'output');
                    this.terminalPrint(windowId, 'Temi disponibili: light, dark, zorin-blue, aurora, matrix, auto', 'output');
                    break;
                }
                const validThemes = ['light', 'dark', 'zorin-blue', 'aurora', 'matrix', 'auto'];
                if (!validThemes.includes(themeName)) {
                    this.terminalPrint(windowId, `theme: tema "${themeName}" non valido. Temi disponibili: ${validThemes.join(', ')}`, 'error');
                    break;
                }
                this.state.appearance.theme = themeName;
                localStorage.setItem('auraos_theme', themeName);
                this.applyAppearanceSettings();
                this.terminalPrint(windowId, `Tema cambiato in: ${themeName}`, 'output');
                break;
            }

            case 'apps': {
                const installed = this.getInstalledApps();
                this.terminalPrint(windowId, 'App installate:', 'output');
                installed.forEach(appId => {
                    const appData = this.desktopApps.find(a => a.id === appId);
                    const appStoreData = this.getAppStoreApps().find(a => a.id === appId);
                    const name = (appData || appStoreData || { name: appId }).name;
                    this.terminalPrint(windowId, `  - ${name} (${appId})`, 'output');
                });
                break;
            }

            case 'open': {
                if (!args[0]) {
                    this.terminalPrint(windowId, 'Utilizzo: open <nome-app>', 'error');
                    break;
                }
                const appName = args[0].toLowerCase();
                const appData = this.desktopApps.find(a => a.id === appName || a.name.toLowerCase().includes(appName));
                if (appData) {
                    this.terminalPrint(windowId, `Apertura di ${appData.name}...`, 'output');
                    this.openApp(appData.id);
                } else {
                    this.terminalPrint(windowId, `open: app "${args[0]}" non trovata`, 'error');
                }
                break;
            }

            case 'screenshot':
                this.terminalPrint(windowId, '📸 Screenshot salvato in /home/utente/Immagini/screenshot.png', 'output');
                this.showToast('Screenshot', 'Screenshot salvato con successo!', 'success');
                break;

            case 'reboot':
                this.terminalPrint(windowId, 'Riavvio del sistema in corso...', 'output');
                this.showToast('Riavvio', 'Sistema in riavvio...', 'info');
                setTimeout(() => {
                    location.reload();
                }, 2000);
                break;

            case 'shutdown':
                this.terminalPrint(windowId, 'Spegnimento del sistema...', 'output');
                this.shutdown();
                break;

            case 'sudo': {
                if (!args[0]) {
                    this.terminalPrint(windowId, 'sudo: manca il comando', 'error');
                    break;
                }
                this.terminalPrint(windowId, `[sudo] password for utente:`, 'output');
                this.terminalPrint(windowId, `sudo: ${args.join(' ')}: comando simulato eseguito con privilegi`, 'output');
                break;
            }

            case 'cowsay': {
                const text = args.join(' ') || 'Moo!';
                const cow = `
 ${'_'.repeat(text.length + 2)}
< ${text} >
 ${'-'.repeat(text.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`;
                this.terminalPrint(windowId, cow, 'output');
                break;
            }

            case 'matrix': {
                this.terminalPrint(windowId, 'Matrix mode activated! 🌟', 'welcome');
                document.body.style.animation = 'matrixPulse 3s ease-in-out infinite';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
                break;
            }

            default:
                this.terminalPrint(windowId, `bash: ${cmd}: comando non trovato`, 'error');
        }
        this.syncTabOutput(windowId);
    }

    terminalUpdatePrompt(windowId) {
        const ct = this.getActiveTab(windowId);
        if (!ct) return;
        const prompt = document.getElementById(`terminal-prompt-${windowId}`);
        if (prompt) {
            const displayPath = ct.cwd === '/' ? '~' : `~${ct.cwd}`;
            prompt.innerHTML = `utente@auraos:${displayPath}$&nbsp;`;
        }
    }

    terminalTabComplete(windowId, currentInput) {
        const ct = this.getActiveTab(windowId);
        const input = document.getElementById(`terminal-input-${windowId}`);
        if (!input || !ct) return;
        const parts = currentInput.split(' ');
        const lastPart = parts[parts.length - 1];
        const isCommand = parts.length === 1;
        const folder = this.getFolderByPath(ct.cwd);

        let matches = [];
        if (isCommand) {
            const commands = ['help', 'ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'echo', 'clear', 'cls', 'whoami', 'date', 'neofetch', 'rm', 'history', 'hostname', 'uname', 'uptime', 'calc', 'weather', 'theme', 'apps', 'open', 'screenshot', 'reboot', 'shutdown', 'sudo', 'cowsay', 'matrix'];
            matches = commands.filter(c => c.startsWith(lastPart));
        } else if (folder && folder.children) {
            matches = Object.keys(folder.children).filter(name => name.startsWith(lastPart));
        }
        if (matches.length === 1) {
            parts[parts.length - 1] = matches[0];
            input.value = parts.join(' ');
        } else if (matches.length > 1) {
            this.terminalPrint(windowId, matches.join('  '), 'output');
        }
    }

    getActiveTab(windowId) {
        const ts = this.terminalState[windowId];
        if (!ts || !ts.activeTab) return null;
        return ts.tabs[ts.activeTab] || null;
    }

    initTerminalTabs(windowId) {
        this.terminalState = this.terminalState || {};
        if (!this.terminalState[windowId]) {
            this.loadTerminalState(windowId);
        }
        if (!this.terminalState[windowId]) {
            this.terminalState[windowId] = {
                activeTab: null,
                tabs: {},
            };
        }
        if (!this.terminalState[windowId].tabs) {
            const old = this.terminalState[windowId];
            const legacyId = 'tab-legacy-' + Date.now();
            this.terminalState[windowId] = {
                activeTab: legacyId,
                tabs: {
                    [legacyId]: {
                        cwd: old.cwd || '/',
                        history: old.history || [],
                        historyIndex: old.historyIndex || -1,
                        title: 'Terminale',
                        outputHTML: '',
                    },
                },
            };
        }
        const tabIds = Object.keys(this.terminalState[windowId].tabs);
        if (tabIds.length === 0) {
            this.createTerminalTab(windowId, 'tab-' + Date.now(), 'Terminale');
        } else {
            const activeTab = this.terminalState[windowId].activeTab || tabIds[0];
            this.terminalState[windowId].activeTab = activeTab;
            this.renderTerminalTabs(windowId);
            this.restoreActiveTab(windowId);
        }
    }

    createTerminalTab(windowId, tabId, title) {
        if (!this.terminalState[windowId]) {
            this.terminalState[windowId] = { activeTab: null, tabs: {} };
        }
        this.terminalState[windowId].tabs[tabId] = {
            cwd: '/',
            history: [],
            historyIndex: -1,
            title: title || 'Terminale',
            outputHTML: '',
        };
        this.terminalState[windowId].activeTab = tabId;
        this.renderTerminalTabs(windowId);
        this.restoreActiveTab(windowId);
        this.saveTerminalState(windowId);
    }

    createNewTerminalTab(windowId) {
        const ts = this.terminalState[windowId];
        const count = ts ? Object.keys(ts.tabs).length + 1 : 1;
        const tabId = 'tab-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
        this.createTerminalTab(windowId, tabId, `Terminale ${count}`);
    }

    switchTerminalTab(windowId, tabId) {
        const ts = this.terminalState[windowId];
        if (!ts || !ts.tabs[tabId] || ts.activeTab === tabId) return;
        
        this.syncTabOutput(windowId);
        
        ts.activeTab = tabId;
        this.renderTerminalTabs(windowId);
        this.restoreActiveTab(windowId);
        this.saveTerminalState(windowId);
        
        const input = document.getElementById(`terminal-input-${windowId}`);
        if (input) input.focus();
    }

    closeTerminalTab(windowId, tabId) {
        const ts = this.terminalState[windowId];
        if (!ts || !ts.tabs[tabId]) return;
        
        if (Object.keys(ts.tabs).length === 1) {
            const tab = ts.tabs[tabId];
            tab.cwd = '/';
            tab.history = [];
            tab.historyIndex = -1;
            tab.outputHTML = '';
            tab.title = 'Terminale';
            ts.activeTab = tabId;
            this.renderTerminalTabs(windowId);
            this.restoreActiveTab(windowId);
            this.saveTerminalState(windowId);
            return;
        }
        
        delete ts.tabs[tabId];
        const remainingIds = Object.keys(ts.tabs);
        if (ts.activeTab === tabId) {
            ts.activeTab = remainingIds[0];
            this.restoreActiveTab(windowId);
        }
        this.renderTerminalTabs(windowId);
        this.saveTerminalState(windowId);
    }

    getActiveTerminalTab(windowId) {
        const ts = this.terminalState[windowId];
        return ts ? ts.activeTab : null;
    }

    cycleTerminalTab(windowId, direction) {
        const ts = this.terminalState[windowId];
        if (!ts || !ts.activeTab) return;
        const tabIds = Object.keys(ts.tabs);
        const currentIdx = tabIds.indexOf(ts.activeTab);
        if (tabIds.length <= 1) return;
        let nextIdx = currentIdx + direction;
        if (nextIdx < 0) nextIdx = tabIds.length - 1;
        if (nextIdx >= tabIds.length) nextIdx = 0;
        this.switchTerminalTab(windowId, tabIds[nextIdx]);
    }

    renderTerminalTabs(windowId) {
        const tabsContainer = document.getElementById(`terminal-tabs-${windowId}`);
        if (!tabsContainer) return;
        const ts = this.terminalState[windowId];
        if (!ts) return;
        
        let html = '';
        for (const [tabId, tab] of Object.entries(ts.tabs)) {
            const isActive = tabId === ts.activeTab;
            html += `
                <div class="terminal-tab ${isActive ? 'active' : ''}" data-tab-id="${tabId}" onclick="app.switchTerminalTab('${windowId}', '${tabId}')">
                    <span class="terminal-tab-title">${tab.title}</span>
                    <button class="terminal-tab-close" onclick="event.stopPropagation(); app.closeTerminalTab('${windowId}', '${tabId}')" title="Chiudi scheda">×</button>
                </div>
            `;
        }
        html += `
            <button class="terminal-tab-new" onclick="app.createNewTerminalTab('${windowId}')" title="Nuova scheda (Ctrl+Shift+T)">+</button>
            <button class="terminal-ai-btn" id="terminal-ai-btn-${windowId}" onclick="app.toggleAIAssist('${windowId}')" title="Assistenza AI (Ctrl+/)">AI</button>
        `;
        tabsContainer.innerHTML = html;
    }

    restoreActiveTab(windowId) {
        const ts = this.terminalState[windowId];
        if (!ts) return;
        const tab = ts.tabs[ts.activeTab];
        if (!tab) return;
        
        const output = document.getElementById(`terminal-output-${windowId}`);
        const prompt = document.getElementById(`terminal-prompt-${windowId}`);
        
        if (output) {
            output.innerHTML = tab.outputHTML || '';
        }
        if (prompt) {
            const displayPath = tab.cwd === '/' ? '~' : `~${tab.cwd}`;
            prompt.innerHTML = `utente@auraos:${displayPath}$&nbsp;`;
        }
        
        const body = document.getElementById(`terminal-body-${windowId}`);
        if (body) body.scrollTop = body.scrollHeight;
    }

    syncTabOutput(windowId) {
        const ts = this.terminalState[windowId];
        if (!ts || !ts.activeTab) return;
        const tab = ts.tabs[ts.activeTab];
        if (!tab) return;
        const output = document.getElementById(`terminal-output-${windowId}`);
        if (output) {
            tab.outputHTML = output.innerHTML;
        }
    }

    saveTerminalState(windowId) {
        try {
            const ts = this.terminalState[windowId];
            if (!ts) return;
            this.syncTabOutput(windowId);
            const key = `auraos_terminal_${windowId}`;
            localStorage.setItem(key, JSON.stringify(ts));
        } catch (e) {}
    }

    loadTerminalState(windowId) {
        try {
            const key = `auraos_terminal_${windowId}`;
            const saved = localStorage.getItem(key);
            if (saved) {
                this.terminalState[windowId] = JSON.parse(saved);
                return true;
            }
        } catch (e) {}
        return false;
    }

    terminalAIAssist(windowId) {
        const input = document.getElementById(`terminal-input-${windowId}`);
        const dropdown = document.getElementById(`terminal-ai-dropdown-${windowId}`);
        if (!input || !dropdown) return;
        
        const val = input.value.trim();
        if (!val) {
            dropdown.innerHTML = '';
            dropdown.classList.remove('visible');
            return;
        }
        
        const suggestions = this.getAISuggestions(windowId, val);
        if (suggestions.length === 0) {
            dropdown.innerHTML = '';
            dropdown.classList.remove('visible');
            return;
        }
        
        dropdown.innerHTML = suggestions.map(s => 
            `<div class="terminal-ai-suggestion" data-cmd="${s}" onclick="app.applyAISuggestion('${windowId}', '${s.replace(/'/g, "\\'")}')">${s}</div>`
        ).join('');
        dropdown.classList.add('visible');
    }

    toggleAIAssist(windowId) {
        const btn = document.getElementById(`terminal-ai-btn-${windowId}`);
        if (btn) btn.classList.toggle('active');
        const input = document.getElementById(`terminal-input-${windowId}`);
        if (input) {
            input.value = input.value.trim().startsWith('ai ') ? input.value.trim().slice(3) : 'ai ';
            input.focus();
        }
        this.terminalAIAssist(windowId);
    }

    getAISuggestions(windowId, input) {
        const allSuggestions = [
            'ls -la',
            'ls',
            'cd Documents',
            'cd Immagini',
            'cd Musica',
            'cd Progetto',
            'cd Cestino',
            'cd /',
            'mkdir newfolder',
            'touch newfile.txt',
            'cat Lettera.txt',
            'cat Note.txt',
            'neofetch',
            'clear',
            'history',
            'pwd',
            'whoami',
            'date',
            'echo hello world',
            'rm file.txt',
            'help',
        ];
        
        if (input.startsWith('ai explain ')) {
            const cmd = input.slice(11).trim().toLowerCase();
            const explanations = {
                'ls': 'ls - Elenca i file e le cartelle nella directory corrente. Usa "ls -la" per dettagli completi.',
                'cd': 'cd - Cambia la directory corrente. Esempio: cd Documents',
                'mkdir': 'mkdir - Crea una nuova cartella. Esempio: mkdir newfolder',
                'cat': 'cat - Visualizza il contenuto di un file. Esempio: cat filename.txt',
                'clear': 'clear - Pulisce lo schermo del terminale.',
                'pwd': 'pwd - Mostra il percorso della directory corrente.',
                'whoami': 'whoami - Mostra l\'utente corrente (auraos).',
                'date': 'date - Mostra la data e ora correnti.',
                'neofetch': 'neofetch - Mostra informazioni di sistema in formato ASCII con logo.',
                'rm': 'rm - Elimina un file o cartella. Esempio: rm filename.txt',
                'history': 'history - Mostra la cronologia dei comandi inseriti.',
                'touch': 'touch - Crea un nuovo file vuoto. Esempio: touch newfile.txt',
                'echo': 'echo - Stampa il testo a schermo. Esempio: echo hello world',
                'help': 'help - Mostra tutti i comandi disponibili nel terminale.',
            };
            return [explanations[cmd] || `${cmd} - Comando di sistema. Digita "help" per vedere tutti i comandi disponibili.`];
        }
        
        const prefix = input.startsWith('ai ') ? input.slice(3) : input.startsWith('help ') ? input.slice(5) : input.startsWith('?') ? input.slice(1) : input;
        const query = prefix.trim().toLowerCase();
        
        if (!query) return allSuggestions.slice(0, 8);
        
        return allSuggestions.filter(s => s.toLowerCase().includes(query)).slice(0, 8);
    }

    applyAISuggestion(windowId, cmd) {
        const input = document.getElementById(`terminal-input-${windowId}`);
        const dropdown = document.getElementById(`terminal-ai-dropdown-${windowId}`);
        if (input) input.value = cmd;
        if (dropdown) {
            dropdown.innerHTML = '';
            dropdown.classList.remove('visible');
        }
        input.focus();
    }

    getAIExplanation(cmd) {
        const explanations = {
            'ls': 'ls - Elenca i file e le cartelle nella directory corrente. Usa "ls -la" per dettagli completi.',
            'cd': 'cd - Cambia la directory corrente. Esempio: cd Documents',
            'mkdir': 'mkdir - Crea una nuova cartella. Esempio: mkdir newfolder',
            'cat': 'cat - Visualizza il contenuto di un file. Esempio: cat filename.txt',
            'clear': 'clear - Pulisce lo schermo del terminale.',
            'pwd': 'pwd - Mostra il percorso della directory corrente.',
            'whoami': 'whoami - Mostra l\'utente corrente (auraos).',
            'date': 'date - Mostra la data e ora correnti.',
            'neofetch': 'neofetch - Mostra informazioni di sistema in formato ASCII con logo.',
            'rm': 'rm - Elimina un file o cartella. Esempio: rm filename.txt',
            'history': 'history - Mostra la cronologia dei comandi inseriti.',
            'touch': 'touch - Crea un nuovo file vuoto. Esempio: touch newfile.txt',
            'echo': 'echo - Stampa il testo a schermo. Esempio: echo hello world',
            'help': 'help - Mostra tutti i comandi disponibili nel terminale.',
        };
        return explanations[cmd] || `${cmd} - Comando di sistema. Digita "help" per vedere tutti i comandi disponibili.`;
    }

    terminalNeofetch(windowId) {
        const lines = [
            { type: 'ascii', text: '  ___      _   _                   ' },
            { type: 'ascii', text: ' / _ \\    | | | |                  ' },
            { type: 'ascii', text: '/ /_\\ \\   | |_| |_   _ _ __   __ _ ' },
            { type: 'ascii', text: '|  _  |   | __| | | | | \'_ \\ / _` |' },
            { type: 'ascii', text: '| | | |   | |_| | |_| | | | | (_| |' },
            { type: 'ascii', text: '\\_| |_/    \\__|_|\\__,_|_| |_|\\__,_|' },
            { type: 'blank' },
        ];
        lines.forEach(l => this.terminalPrint(windowId, l.text, l.type));
        this.terminalPrint(windowId, '', 'blank');
        const user = 'auraos';
        const hostname = 'auraos';
        const os = 'AuraOS v1.0';
        const kernel = '5.15.0-auraos';
        const uptime = this.getUptime();
        const shell = 'bash 5.1.16';
        const resolution = `${window.innerWidth}x${window.innerHeight}`;
        const de = 'AuraOS Desktop';
        const theme = 'Glassmorphism';
        const icons = 'Noto Color';
        const term = 'AuraOS Terminal';
        const cpu = `${(Math.random() * 2 + 1).toFixed(1)} GHz @ ${Math.floor(Math.random() * 4 + 2)} Core`;
        const mem = `${Math.floor(Math.random() * 400 + 512)} MB / ${Math.floor(Math.random() * 500 + 2048)} MB`;

        const infoLines = [
            `${user}@${hostname}`,
            `-`.repeat(20),
            `OS: ${os}`,
            `Host: ${hostname}`,
            `Kernel: ${kernel}`,
            `Uptime: ${uptime}`,
            `Shell: ${shell}`,
            `Resolution: ${resolution}`,
            `DE: ${de}`,
            `Theme: ${theme}`,
            `Icons: ${icons}`,
            `Terminal: ${term}`,
            `CPU: ${cpu}`,
            `Memory: ${mem}`,
        ];
        infoLines.forEach(l => this.terminalPrint(windowId, l, 'info'));
        this.terminalPrint(windowId, '', 'blank');
    }

    getUptime() {
        const now = Date.now();
        const diff = now - this.bootTime;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    // ===== Task Manager App =====
    getTaskManagerContent(windowId) {
        return `
            <div class="task-manager-wrapper" id="task-manager-${windowId}">
                <div class="task-manager-toolbar">
                    <span class="task-manager-title">📊 Task Manager</span>
                    <div class="task-manager-stats">
                        <span class="task-manager-stat" id="task-uptime-${windowId}">Uptime: calcolo...</span>
                    </div>
                    <button class="task-manager-refresh-btn" id="task-refresh-${windowId}" title="Aggiorna">🔄</button>
                </div>
                <div class="task-manager-table-wrapper">
                    <table class="task-manager-table" id="task-table-${windowId}">
                        <thead>
                            <tr>
                                <th>Icona</th>
                                <th>Nome App</th>
                                <th>ID Finestra</th>
                                <th>Memoria</th>
                                <th>CPU %</th>
                                <th>Stato</th>
                                <th>Azione</th>
                            </tr>
                        </thead>
                        <tbody id="task-tbody-${windowId}"></tbody>
                    </table>
                </div>
                <div class="task-manager-summary" id="task-summary-${windowId}"></div>
            </div>
        `;
    }

    initTaskManager(windowId) {
        if (!this.bootTime) this.bootTime = Date.now();
        const refreshBtn = document.getElementById(`task-refresh-${windowId}`);
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.renderTaskManagerTable(windowId);
                this.playSound('click');
            });
        }
        this.renderTaskManagerTable(windowId);
        this.taskManagerIntervals = this.taskManagerIntervals || {};
        this.taskManagerIntervals[windowId] = setInterval(() => {
            this.renderTaskManagerTable(windowId);
        }, 2000);
    }

    renderTaskManagerTable(windowId) {
        const tbody = document.getElementById(`task-tbody-${windowId}`);
        const summaryEl = document.getElementById(`task-summary-${windowId}`);
        const uptimeEl = document.getElementById(`task-uptime-${windowId}`);
        if (!tbody) return;

        if (uptimeEl) uptimeEl.textContent = `Uptime: ${this.getUptime()}`;

        const appIcons = {
            'file-manager': '📁', 'notepad': '📝', 'terminal': '💻', 'task-manager': '📊',
            'browser': '🌐', 'tutor': '🤖', 'settings': '⚙️', 'guide': '📖',
            'games': '🎮', 'calculator': '🧮', 'gallery': '🖼️', 'music': '🎵',
        };

        let rows = '';
        let totalMem = 0;
        let totalCpu = 0;
        const count = this.state.openWindows.length;

        if (count === 0) {
            rows = `<tr><td colspan="7" style="text-align:center;color:#a0aec0;padding:30px;">Nessuna app aperta</td></tr>`;
        } else {
            this.state.openWindows.forEach(w => {
                const icon = appIcons[w.appId] || '📦';
                const mem = Math.floor(Math.random() * 120 + 20);
                const cpu = (Math.random() * 25 + Math.random() * 15).toFixed(1);
                totalMem += mem;
                totalCpu += parseFloat(cpu);
                const status = w.minimized ? '⏸ In pausa' : '▶ Attivo';
                rows += `
                    <tr>
                        <td><span style="font-size:20px;">${icon}</span></td>
                        <td>${w.title}</td>
                        <td><code>${w.id}</code></td>
                        <td>${mem} MB</td>
                        <td>
                            <div class="task-cpu-cell">
                                <div class="task-cpu-bar-bg">
                                    <div class="task-cpu-bar" style="width:${Math.min(parseFloat(cpu) * 3, 100)}%"></div>
                                </div>
                                <span>${cpu}%</span>
                            </div>
                        </td>
                        <td><span class="task-status ${w.minimized ? 'task-paused' : 'task-active'}">${status}</span></td>
                        <td><button class="task-kill-btn" onclick="app.closeTaskWindow('${windowId}', '${w.id}')">✕ Termina</button></td>
                    </tr>
                `;
            });
        }

        tbody.innerHTML = rows;

        if (summaryEl) {
            summaryEl.innerHTML = `
                <span>Processi: <strong>${count}</strong></span>
                <span>Memoria totale: <strong>${totalMem} MB</strong></span>
                <span>CPU medio: <strong>${count > 0 ? (totalCpu / count).toFixed(1) : 0}%</strong></span>
            `;
        }
    }

    closeTaskWindow(windowId, targetWindowId) {
        if (targetWindowId === windowId) {
            this.showTutorMessage('Non puoi chiudere il Task Manager da se stesso!');
            return;
        }
        this.closeWindow(targetWindowId);
        this.playSound('success');
        this.showTutorMessage(`Processo terminato.`);
        this.renderTaskManagerTable(windowId);
    }

    // ===== Clock Widget =====
    initClockWidget() {
        const widget = document.getElementById('clock-widget');
        const timeEl = document.getElementById('clock-widget-time');
        const dateEl = document.getElementById('clock-widget-date');
        if (!widget || !timeEl || !dateEl) return;
        widget.classList.remove('hidden');

        const updateClock = () => {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            dateEl.textContent = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
        };
        updateClock();
        this.clockWidgetInterval = setInterval(updateClock, 1000);
    }

    toggleCalendarWidget() {
        const calendarEl = document.getElementById('clock-widget-calendar');
        if (!calendarEl) return;
        calendarEl.classList.toggle('hidden');
        if (!calendarEl.classList.contains('hidden')) {
            this.renderCalendar();
        }
    }

    renderCalendar() {
        const calendarEl = document.getElementById('clock-widget-calendar');
        if (!calendarEl) return;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
        const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

        let cells = '';
        for (let i = 0; i < firstDay; i++) cells += '<div class="cal-cell cal-empty"></div>';
        for (let d = 1; d <= daysInMonth; d++) {
            const cls = d === today ? 'cal-cell cal-today' : 'cal-cell';
            cells += `<div class="${cls}">${d}</div>`;
        }
        while (cells.split('cal-cell').length < 43 && cells.split('cal-cell').length + cells.split('cal-empty').length - 1 < 42) {
            cells += '<div class="cal-cell cal-empty"></div>';
        }

        calendarEl.innerHTML = `
            <div class="calendar-month">${monthNames[month]} ${year}</div>
            <div class="calendar-weekdays">${dayNames.map(d => `<div class="cal-weekday">${d}</div>`).join('')}</div>
            <div class="calendar-grid">${cells}</div>
        `;
    }

    // ===== Notepad Improvements =====
    getNotepadContent(windowId) {
        return `
            <div class="notepad-toolbar">
                <div class="notepad-toolbar-group">
                    <button class="notepad-btn" id="notepad-bold-${windowId}" onclick="app.notepadFormat('${windowId}', 'bold')" title="Grassetto"><b>B</b></button>
                    <button class="notepad-btn" id="notepad-italic-${windowId}" onclick="app.notepadFormat('${windowId}', 'italic')" title="Corsivo"><i>I</i></button>
                    <button class="notepad-btn" id="notepad-underline-${windowId}" onclick="app.notepadFormat('${windowId}', 'underline')" title="Sottolineato"><u>U</u></button>
                </div>
                <div class="notepad-toolbar-group">
                    <button class="notepad-btn notepad-size-btn" onclick="app.notepadFontSize('${windowId}', -1)" title="Riduci">A-</button>
                    <button class="notepad-btn notepad-size-btn" onclick="app.notepadFontSize('${windowId}', 1)" title="Ingrandisci">A+</button>
                </div>
                <span class="notepad-status" id="notepad-status-${windowId}">Pronto</span>
            </div>
            <div class="notepad-editor" id="notepad-editor-${windowId}" contenteditable="true" placeholder="Scrivi qui le tue note..."></div>
            <div class="notepad-footer">
                <span class="notepad-wordcount" id="notepad-wordcount-${windowId}">0 parole | 0 caratteri</span>
            </div>
        `;
    }

    initNotepad(windowId) {
        const notes = localStorage.getItem('auraos_notes');
        const editor = document.getElementById(`notepad-editor-${windowId}`);
        const statusEl = document.getElementById(`notepad-status-${windowId}`);
        const wordcountEl = document.getElementById(`notepad-wordcount-${windowId}`);
        if (!editor) return;
        editor.textContent = notes || '';
        editor.style.fontSize = localStorage.getItem('auraos_notes_fontsize') || '14px';
        this.updateNotepadWordCount(windowId);
        let saveTimeout;
        editor.addEventListener('input', () => {
            if (statusEl) statusEl.textContent = 'Non salvato...';
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                localStorage.setItem('auraos_notes', editor.textContent);
                if (statusEl) statusEl.textContent = 'Salvato ✓';
                this.playSound('success');
            }, 800);
            this.updateNotepadWordCount(windowId);
        });
    }

    notepadFormat(windowId, command) {
        const editor = document.getElementById(`notepad-editor-${windowId}`);
        if (!editor) return;
        editor.focus();
        document.execCommand(command, false, null);
    }

    notepadFontSize(windowId, delta) {
        const editor = document.getElementById(`notepad-editor-${windowId}`);
        if (!editor) return;
        const current = parseInt(localStorage.getItem('auraos_notes_fontsize') || '14');
        const newSize = Math.max(10, Math.min(28, current + delta * 2));
        editor.style.fontSize = newSize + 'px';
        localStorage.setItem('auraos_notes_fontsize', newSize + 'px');
    }

    updateNotepadWordCount(windowId) {
        const editor = document.getElementById(`notepad-editor-${windowId}`);
        const wordcountEl = document.getElementById(`notepad-wordcount-${windowId}`);
        if (!editor || !wordcountEl) return;
        const text = editor.textContent || '';
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).length : 0;
        const chars = text.length;
        wordcountEl.textContent = `${words} parola${words !== 1 ? 'e' : ''} | ${chars} caratter${chars !== 1 ? 'i' : 'e'}`;
    }
    initApp(appId, windowId) {
        switch (appId) {
            case 'file-manager':
                this.initFileManager(windowId);
                break;
            case 'notepad':
                this.initNotepad(windowId);
                break;
            case 'terminal':
                this.initTerminal(windowId);
                break;
            case 'task-manager':
                this.initTaskManager(windowId);
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
            case 'gallery':
                this.initGallery(windowId);
                break;
            case 'music':
                this.initMusic(windowId);
                break;
            case 'app-store':
                this.initAppStore(windowId);
                break;
            case 'plugin-manager':
                this.initPluginManager(windowId);
                break;
        }
    }

    // ===== File Manager =====
    getFileManagerContent(windowId) {
        this.state.fmCurrentPath[windowId] = '/';
        return `
            <div class="fm-toolbar">
                <div class="fm-toolbar-group">
                    <button class="file-manager-btn" id="up-btn-${windowId}" onclick="app.goUp('${windowId}')" style="display:none;">⬆️ Su</button>
                    <button class="file-manager-btn" onclick="app.createFolder('${windowId}')">📁 Nuova cartella</button>
                    <button class="file-manager-btn" onclick="app.createFile('${windowId}')">📄 Nuovo file</button>
                </div>
                <div class="fm-toolbar-group">
                    <div class="fm-view-toggle">
                        <button class="fm-view-btn ${this.state.fmView === 'grid' ? 'active' : ''}" onclick="app.setFmView('grid')" title="Vista griglia">⊞</button>
                        <button class="fm-view-btn ${this.state.fmView === 'list' ? 'active' : ''}" onclick="app.setFmView('list')" title="Vista elenco">☰</button>
                    </div>
                    <select class="fm-sort-select" id="fm-sort-${windowId}" onchange="app.setFmSort(this.value)">
                        <option value="name-asc">Nome (A-Z)</option>
                        <option value="name-desc">Nome (Z-A)</option>
                        <option value="date-asc">Data (vecchia)</option>
                        <option value="date-desc">Data (recente)</option>
                        <option value="size-asc">Dimensione (piccola)</option>
                        <option value="size-desc">Dimensione (grande)</option>
                        <option value="type-asc">Tipo (A-Z)</option>
                    </select>
                </div>
                <input type="text" class="fm-search" id="fm-search-${windowId}" placeholder="🔍 Cerca nella cartella..." oninput="app.fmSearch(this.value)">
                <div class="file-breadcrumb" id="breadcrumb-${windowId}"></div>
            </div>
            <div class="fm-main">
                <div class="fm-list-pane" id="filelist-${windowId}"></div>
                <div class="fm-preview-pane" id="fm-preview-${windowId}">
                    <div style="text-align:center;color:#a0aec0;padding:40px 10px;">
                        <div style="font-size:48px;margin-bottom:10px;">📄</div>
                        <div>Seleziona un file per vedere l'anteprima</div>
                    </div>
                </div>
            </div>
        `;
    }

    initFileManager(windowId) {
        this.renderFileList(windowId, '/');
    }

    renderFileList(windowId, path) {
        const container = document.getElementById(`filelist-${windowId}`);
        const upBtn = document.getElementById(`up-btn-${windowId}`);
        if (!container) return;
        this.state.fmCurrentPath[windowId] = path || '/';
        if (upBtn) upBtn.style.display = path === '/' ? 'none' : 'inline-block';
        this.renderBreadcrumb(windowId, path);
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children) {
            container.className = 'fm-list-pane fm-list-view';
            container.innerHTML = '<div class="fm-empty">Cartella vuota</div>';
            this.addDropZone(container, windowId, path);
            return;
        }
        const searchQuery = (document.getElementById(`fm-search-${windowId}`)?.value || '').toLowerCase().trim();
        let items = Object.entries(folder.children);
        if (searchQuery) {
            items = items.filter(([name, item]) => name.toLowerCase().includes(searchQuery));
        }
        items = this.sortItems(items);
        if (items.length === 0) {
            container.className = 'fm-list-pane fm-list-view';
            container.innerHTML = searchQuery ? '<div class="fm-no-results">Nessun risultato per la ricerca</div>' : '<div class="fm-empty">Cartella vuota</div>';
            this.addDropZone(container, windowId, path);
            return;
        }
        container.innerHTML = '';
        const view = this.state.fmView;
        if (view === 'list') {
            container.className = 'fm-list-pane fm-list-view';
            const header = document.createElement('div');
            header.className = 'fm-list-item';
            header.style.fontWeight = '600';
            header.style.fontSize = '11px';
            header.style.color = '#a0aec0';
            header.style.textTransform = 'uppercase';
            header.style.cursor = 'default';
            header.innerHTML = `
                <div class="fm-list-col-icon">Nome</div>
                <div class="fm-list-col-size">Dimensione</div>
                <div class="fm-list-col-type">Tipo</div>
                <div class="fm-list-col-date">Modificato</div>
            `;
            container.appendChild(header);
        } else {
            container.className = 'fm-list-pane fm-grid-view';
        }
        const selectedSet = new Set(this.state.fmSelectedItems);
        const cutSet = new Set((this.state.clipboard.type === 'cut' ? this.state.clipboard.items : []).map(i => i.name));
        items.forEach(([name, item]) => {
            const isSelected = selectedSet.has(name);
            const isCut = cutSet.has(name);
            const size = item.type === 'file' ? this.getFileSize(item.content || '') : (item.type === 'folder' ? this.getFolderCount(item) + ' oggetti' : '-');
            const ext = this.getFileExtension(name);
            const icon = item.type === 'folder' ? '📁' : this.getFileTypeIcon(ext);
            const typeName = item.type === 'folder' ? 'Cartella' : this.getFileTypeName(ext);
            const dateStr = item.modifiedAt ? new Date(item.modifiedAt).toLocaleDateString('it-IT') : '-';
            if (view === 'list') {
                const row = document.createElement('div');
                row.className = `fm-list-item${isSelected ? ' selected' : ''}${isCut ? ' cut-item' : ''}`;
                row.draggable = true;
                row.dataset.name = name;
                row.dataset.type = item.type;
                row.innerHTML = `
                    <div class="fm-list-col-icon"><span>${icon}</span><span class="fm-list-col-name">${name}</span></div>
                    <div class="fm-list-col-size">${size}</div>
                    <div class="fm-list-col-type">${typeName}</div>
                    <div class="fm-list-col-date">${dateStr}</div>
                `;
                this.attachFileItemEvents(row, windowId, path, name, item);
                container.appendChild(row);
            } else {
                const card = document.createElement('div');
                card.className = `fm-grid-item${isSelected ? ' selected' : ''}${isCut ? ' cut-item' : ''}`;
                card.draggable = true;
                card.dataset.name = name;
                card.dataset.type = item.type;
                card.innerHTML = `
                    <div class="fm-grid-icon">${icon}</div>
                    <div class="fm-grid-name">${name}</div>
                    <div class="fm-grid-size">${size}</div>
                `;
                this.attachFileItemEvents(card, windowId, path, name, item);
                container.appendChild(card);
            }
        });
        this.addDropZone(container, windowId, path);
        if (!this.state.fmSearchQuery) {
            this.updatePreviewPane(windowId, null);
        }
    }

    addDropZone(container, windowId, path) {
        let dropZone = container.parentElement.querySelector('.fm-drop-zone');
        if (!dropZone) {
            dropZone = document.createElement('div');
            dropZone.className = 'fm-drop-zone';
            const listPane = document.querySelector(`#filelist-${windowId}`);
            if (listPane && listPane.parentElement) {
                listPane.parentElement.appendChild(dropZone);
            }
        }
        dropZone.className = 'fm-drop-zone visible';
        dropZone.innerHTML = '<div class="fm-drop-zone-icon">📌</div><div>Rilascia qui per spostare in questa cartella</div>';
        dropZone.onclick = () => {
            if (this.state.clipboard.items && this.state.clipboard.items.length > 0) {
                this.fmPaste(windowId, path);
            }
        };
        dropZone.ondragover = (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        };
        dropZone.ondragleave = () => {
            dropZone.classList.remove('drag-over');
        };
        dropZone.ondrop = (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            const data = e.dataTransfer.getData('text/plain');
            if (!data) return;
            let dragData;
            try { dragData = JSON.parse(data); } catch (err) { return; }
            if (dragData.path !== path) {
                this.moveItem(dragData, path, windowId, path);
            }
        };
    }

    attachFileItemEvents(el, windowId, path, name, item) {
        el.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                const idx = this.state.fmSelectedItems.indexOf(name);
                if (idx >= 0) this.state.fmSelectedItems.splice(idx, 1);
                else this.state.fmSelectedItems.push(name);
                this.renderFileList(windowId, path);
                return;
            }
            this.state.fmSelectedItems = [name];
            if (item.type === 'folder') {
                this.renderFileList(windowId, path === '/' ? `/${name}` : `${path}/${name}`);
                this.state.fmSearchQuery = '';
                const searchInput = document.getElementById(`fm-search-${windowId}`);
                if (searchInput) searchInput.value = '';
            } else {
                this.updatePreviewPane(windowId, path, name);
                this.addToRecentFiles(path, name);
            }
        });
        el.addEventListener('dblclick', () => {
            if (item.type === 'folder') {
                this.renderFileList(windowId, path === '/' ? `/${name}` : `${path}/${name}`);
                this.state.fmSearchQuery = '';
                const searchInput = document.getElementById(`fm-search-${windowId}`);
                if (searchInput) searchInput.value = '';
            } else {
                this.showFilePreview(windowId, path, name);
                this.addToRecentFiles(path, name);
            }
        });
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.state.fmSelectedItems.includes(name)) {
                this.state.fmSelectedItems = [name];
            }
            this.showFileContextMenu(e.clientX, e.clientY, windowId, path, name, item);
        });
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({ path, name, type: item.type }));
            e.dataTransfer.effectAllowed = 'move';
            el.classList.add('dragging');
            this._dragSource = { windowId, path, name };
        });
        el.addEventListener('dragend', () => {
            el.classList.remove('dragging');
            document.querySelectorAll('.drag-over').forEach(e => e.classList.remove('drag-over'));
        });
        el.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (item.type === 'folder' || el.classList.contains('fm-list-pane') || el.classList.contains('fm-grid-view')) {
                el.classList.add('drag-over');
            }
        });
        el.addEventListener('dragleave', () => {
            el.classList.remove('drag-over');
        });
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            el.classList.remove('drag-over');
            const data = e.dataTransfer.getData('text/plain');
            if (!data) return;
            let dragData;
            try { dragData = JSON.parse(data); } catch (err) { return; }
            const targetFolderPath = item.type === 'folder' ? (path === '/' ? `/${name}` : `${path}/${name}`) : path;
            this.moveItem(dragData, targetFolderPath, windowId, path);
        });
    }

    moveItem(dragData, targetFolderPath, windowId, currentRenderPath) {
        const srcPath = dragData.path;
        const srcName = dragData.name;
        const srcFolder = this.getFolderByPath(srcPath);
        if (!srcFolder || !srcFolder.children[srcName]) return;
        if (srcPath === targetFolderPath || (srcPath === '/' ? `/${srcName}` : `${srcPath}/${srcName}`) === targetFolderPath) return;

        // If target is trash, delete instead of move
        if (targetFolderPath === '/Cestino') {
            this.deleteItem(windowId, srcPath, srcName);
            return;
        }

        const targetFolder = this.getFolderByPath(targetFolderPath);
        if (!targetFolder || !targetFolder.children) return;
        const item = srcFolder.children[srcName];
        if (targetFolder.children[srcName]) {
            this.showToast('Impossibile spostare', 'Esiste già un file o cartella con questo nome nella destinazione.', 'error');
            return;
        }
        targetFolder.children[srcName] = item;
        if (!item.modifiedAt) item.modifiedAt = Date.now();
        delete srcFolder.children[srcName];
        this.saveFilesystem();
        this.renderFileList(windowId, currentRenderPath || '/');
        this.showToast('Spostato', `"${srcName}" spostato con successo.`, 'success');
    }

    getFolderCount(folder) {
        if (!folder || !folder.children) return 0;
        return Object.keys(folder.children).length;
    }

    sortItems(items) {
        const sort = this.state.fmSort;
        const [field, direction] = sort.field === 'date' ? ['modifiedAt', sort.direction] : [sort.field, sort.direction];
        return items.sort((a, b) => {
            let cmp = 0;
            if (field === 'name') {
                cmp = a[0].localeCompare(b[0], 'it');
            } else if (field === 'size') {
                const sizeA = a[1].type === 'file' ? (a[1].content || '').length : 0;
                const sizeB = b[1].type === 'file' ? (b[1].content || '').length : 0;
                cmp = sizeA - sizeB;
            } else if (field === 'type') {
                const extA = this.getFileExtension(a[0]);
                const extB = this.getFileExtension(b[0]);
                cmp = extA.localeCompare(extB, 'it');
            } else if (field === 'modifiedAt') {
                const timeA = a[1].modifiedAt || 0;
                const timeB = b[1].modifiedAt || 0;
                cmp = timeA - timeB;
            }
            return direction === 'desc' ? -cmp : cmp;
        });
    }

    setFmView(view) {
        this.state.fmView = view;
        localStorage.setItem('auraos_fm_view', view);
        const winId = this.state.activeWindow;
        if (winId) {
            const path = this.state.fmCurrentPath[winId] || '/';
            this.renderFileList(winId, path);
        }
    }

    setFmSort(value) {
        const [field, direction] = value.split('-');
        this.state.fmSort = { field, direction };
        const winId = this.state.activeWindow;
        if (winId) {
            const path = this.state.fmCurrentPath[winId] || '/';
            this.renderFileList(winId, path);
        }
    }

    fmSearch(query) {
        this.state.fmSearchQuery = query;
        const winId = this.state.activeWindow;
        if (winId) {
            const path = this.state.fmCurrentPath[winId] || '/';
            this.renderFileList(winId, path);
        }
    }

    updatePreviewPane(windowId, path, filename) {
        const pane = document.getElementById(`fm-preview-${windowId}`);
        if (!pane) return;
        if (!filename) {
            pane.classList.remove('visible');
            return;
        }
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[filename]) { pane.classList.remove('visible'); return; }
        const file = folder.children[filename];
        const ext = this.getFileExtension(filename);
        const icon = file.type === 'folder' ? '📁' : this.getFileTypeIcon(ext);
        const typeName = file.type === 'folder' ? 'Cartella' : this.getFileTypeName(ext);
        const size = file.type === 'file' ? this.getFileSize(file.content || '') : this.getFolderCount(file) + ' oggetti';
        let contentHtml = '';
        if (file.type === 'file' && file.content) {
            contentHtml = `<div class="fm-preview-content">${this.escapeHtml(file.content)}</div>`;
        } else if (file.type === 'file') {
            contentHtml = '<div class="fm-preview-content" style="color:#a0aec0;">File vuoto</div>';
        }
        const audioHtml = file.type === 'file' && ['mp3', 'wav', 'ogg'].includes(ext) ? '<div style="text-align:center;margin-top:10px;">🎵 File audio</div>' : '';
        pane.classList.add('visible');
        pane.innerHTML = `
            <div class="fm-preview-icon">${icon}</div>
            <div class="fm-preview-name">${filename}</div>
            <div class="fm-preview-info">
                <div><strong>Tipo:</strong> ${typeName}</div>
                <div><strong>Dimensione:</strong> ${size}</div>
                <div><strong>Percorso:</strong> ${path === '/' ? '/' + filename : path + '/' + filename}</div>
            </div>
            ${audioHtml}
            ${contentHtml}
            <div style="display:flex;gap:8px;margin-top:15px;flex-wrap:wrap;">
                ${file.type === 'file' ? `<button class="file-manager-btn" onclick="app.editFile('${windowId}', '${path}', '${filename}')">✏️ Modifica</button>` : ''}
                <button class="file-manager-btn" onclick="app.deleteItem('${windowId}', '${path}', '${name}')">🗑️ Elimina</button>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showFileContextMenu(x, y, windowId, path, name, item) {
        this.hideContextMenu();
        const menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.className = 'context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        const hasSelection = this.state.fmSelectedItems.length > 0;
        const menuItems = item.type === 'file'
            ? `<div class="context-menu-item" data-action="open">📂 Apri</div>
               <div class="context-menu-separator"></div>
               <div class="context-menu-item" data-action="rename">✏️ Rinomina</div>
               <div class="context-menu-item" data-action="copy">📋 Copia</div>
               <div class="context-menu-item" data-action="cut">✂️ Taglia</div>
               ${hasSelection ? `<div class="context-menu-item" data-action="paste">📌 Incolla</div>` : ''}
               <div class="context-menu-separator"></div>
               <div class="context-menu-item" data-action="delete">🗑️ Elimina</div>
               <div class="context-menu-separator"></div>
               <div class="context-menu-item" data-action="info">ℹ️ Info</div>
               <div class="context-menu-item" data-action="selectall">☑️ Seleziona tutto</div>`
            : `<div class="context-menu-item" data-action="open">📂 Apri</div>
               <div class="context-menu-separator"></div>
               <div class="context-menu-item" data-action="rename">✏️ Rinomina</div>
               <div class="context-menu-item" data-action="copy">📋 Copia</div>
               <div class="context-menu-item" data-action="cut">✂️ Taglia</div>
               ${hasSelection ? `<div class="context-menu-item" data-action="paste">📌 Incolla</div>` : ''}
               <div class="context-menu-separator"></div>
               <div class="context-menu-item" data-action="info">ℹ️ Info</div>
               <div class="context-menu-item" data-action="selectall">☑️ Seleziona tutto</div>`;
        menu.innerHTML = menuItems;
        menu.querySelectorAll('.context-menu-item').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = el.dataset.action;
                if (action === 'open') {
                    if (item.type === 'folder') {
                        this.renderFileList(windowId, path === '/' ? `/${name}` : `${path}/${name}`);
                    } else {
                        this.showFilePreview(windowId, path, name);
                    }
                } else if (action === 'rename') this.renameItem(windowId, path, name);
                else if (action === 'copy') this.fmCopyItem(windowId, path, name);
                else if (action === 'cut') this.fmCutItem(windowId, path, name);
                else if (action === 'paste') this.fmPaste(windowId, path);
                else if (action === 'delete') this.deleteItem(windowId, path, name);
                else if (action === 'info') this.showFileInfo(windowId, path, name);
                else if (action === 'selectall') this.fmSelectAll(windowId, path);
                this.hideContextMenu();
            });
        });
        document.body.appendChild(menu);
        this.state.contextMenuOpen = true;
        const menuRect = menu.getBoundingClientRect();
        if (menuRect.right > window.innerWidth) menu.style.left = (window.innerWidth - menuRect.width - 5) + 'px';
        if (menuRect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - menuRect.height - 5) + 'px';
    }

    fmCopy() {
        if (this.state.fmSelectedItems.length === 0) return;
        const winId = this.state.activeWindow;
        const path = this.state.fmCurrentPath[winId] || '/';
        const folder = this.getFolderByPath(path);
        if (!folder) return;
        this.state.clipboard = {
            type: 'copy',
            items: this.state.fmSelectedItems.map(name => ({ name, path, item: JSON.parse(JSON.stringify(folder.children[name])) }))
        };
        this.showToast('Copiato', `${this.state.clipboard.items.length} elemento/i copiato/i.`, 'info', 2000);
        const winData = this.state.openWindows.find(w => w.id === winId);
        if (winData) this.renderFileList(winId, path);
    }

    fmCopyItem(windowId, path, name) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[name]) return;
        this.state.clipboard = {
            type: 'copy',
            items: [{ name, path, item: JSON.parse(JSON.stringify(folder.children[name])) }]
        };
        this.showToast('Copiato', `"${name}" copiato.`, 'info', 2000);
        this.renderFileList(windowId, path);
    }

    fmCut() {
        if (this.state.fmSelectedItems.length === 0) return;
        const winId = this.state.activeWindow;
        const path = this.state.fmCurrentPath[winId] || '/';
        const folder = this.getFolderByPath(path);
        if (!folder) return;
        this.state.clipboard = {
            type: 'cut',
            items: this.state.fmSelectedItems.map(name => ({ name, path, item: JSON.parse(JSON.stringify(folder.children[name])) }))
        };
        this.showToast('Tagliato', `${this.state.clipboard.items.length} elemento/i tagliato/i.`, 'warning', 2000);
        this.renderFileList(windowId, path);
    }

    fmCutItem(windowId, path, name) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[name]) return;
        this.state.clipboard = {
            type: 'cut',
            items: [{ name, path, item: JSON.parse(JSON.stringify(folder.children[name])) }]
        };
        this.showToast('Tagliato', `"${name}" tagliato.`, 'warning', 2000);
        this.renderFileList(windowId, path);
    }

    fmPaste(windowId, targetPath) {
        if (!this.state.clipboard.items || this.state.clipboard.items.length === 0) {
            this.showToast('Incolla', 'Nessun elemento negli appunti.', 'warning', 2000);
            return;
        }
        const path = targetPath || this.state.fmCurrentPath[windowId] || '/';
        const targetFolder = this.getFolderByPath(path);
        if (!targetFolder || !targetFolder.children) return;
        let pasted = 0;
        this.state.clipboard.items.forEach(entry => {
            const newName = this.getUniqueName(targetFolder, entry.name);
            const newItem = JSON.parse(JSON.stringify(entry.item));
            newItem.name = newName;
            if (!newItem.modifiedAt) newItem.modifiedAt = Date.now();
            targetFolder.children[newName] = newItem;
            pasted++;
        });
        this.saveFilesystem();
        if (this.state.clipboard.type === 'cut') {
            const srcPath = this.state.clipboard.items[0]?.path;
            const srcFolder = srcPath ? this.getFolderByPath(srcPath) : null;
            if (srcFolder) {
                this.state.clipboard.items.forEach(entry => {
                    delete srcFolder.children[entry.name];
                });
            }
            this.state.clipboard = { type: null, items: [] };
        }
        this.renderFileList(windowId, path);
        this.showToast('Incollato', `${pasted} elemento/i incollato/i.`, 'success');
    }

    getUniqueName(folder, baseName) {
        if (!folder.children[baseName]) return baseName;
        const parts = baseName.split('.');
        const ext = parts.length > 1 ? '.' + parts.pop() : '';
        const nameBase = parts.join('.');
        let i = 1;
        while (folder.children[`${nameBase} (${i})${ext}`]) i++;
        return `${nameBase} (${i})${ext}`;
    }

    fmSelectAll(windowId, path) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children) return;
        this.state.fmSelectedItems = Object.keys(folder.children);
        this.renderFileList(windowId, path);
    }

    renameItem(windowId, path, name) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[name]) return;
        const newName = prompt('Nuovo nome:', name);
        if (!newName || newName === name) return;
        if (folder.children[newName]) {
            this.showToast('Errore', 'Esiste già un file o cartella con questo nome!', 'error');
            return;
        }
        folder.children[newName] = folder.children[name];
        folder.children[newName].name = newName;
        if (!folder.children[newName].modifiedAt) folder.children[newName].modifiedAt = Date.now();
        delete folder.children[name];
        this.saveFilesystem();
        this.renderFileList(windowId, path);
        this.showToast('Rinominato', `"${name}" rinominato in "${newName}".`, 'success');
    }

    deleteItem(windowId, path, name) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[name]) return;
        const trashFolder = this.getFolderByPath('/Cestino');
        const trashId = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        const item = folder.children[name];
        item._trashId = trashId;
        item._originalPath = path;
        item._deletedAt = Date.now();
        trashFolder.children[trashId] = item;
        delete folder.children[name];
        this.state.trash.push({ trashId, name, originalPath: path, item: JSON.parse(JSON.stringify(item)), deletedAt: Date.now() });
        this.saveFilesystem();
        this.saveTrash();
        this.renderFileList(windowId, path);
        this.state.fmSelectedItems = this.state.fmSelectedItems.filter(n => n !== name);
        this.showToast('Nel cestino', `"${name}" spostato nel Cestino.`, 'info');
        this.showTutorMessage(`Ho spostato "${name}" nel Cestino. Puoi ripristinarlo o eliminarlo definitivamente.`);
    }

    restoreFromTrash(trashId) {
        const idx = this.state.trash.findIndex(t => t.trashId === trashId);
        if (idx < 0) return;
        const entry = this.state.trash[idx];
        const originalFolder = this.getFolderByPath(entry.originalPath);
        const trashFolder = this.getFolderByPath('/Cestino');
        if (!originalFolder || !trashFolder) return;
        const item = trashFolder.children[trashId];
        if (!item) return;
        const restoreName = this.getUniqueName(originalFolder, entry.name);
        item._trashId = undefined;
        item._originalPath = undefined;
        item._deletedAt = undefined;
        if (!item.modifiedAt) item.modifiedAt = Date.now();
        originalFolder.children[restoreName] = item;
        delete trashFolder.children[trashId];
        this.state.trash.splice(idx, 1);
        this.saveFilesystem();
        this.saveTrash();
        const winId = this.state.activeWindow;
        if (winId) {
            const currentPath = this.state.fmCurrentPath[winId] || '/';
            if (currentPath === '/Cestino' || currentPath === '/Cestino/') {
                this.renderFileList(winId, '/Cestino');
            }
        }
        this.showToast('Ripristinato', `"${entry.name}" ripristinato.`, 'success');
    }

    permanentlyDelete(trashId) {
        const idx = this.state.trash.findIndex(t => t.trashId === trashId);
        if (idx < 0) return;
        const entry = this.state.trash[idx];
        const trashFolder = this.getFolderByPath('/Cestino');
        if (trashFolder && trashFolder.children[trashId]) {
            delete trashFolder.children[trashId];
        }
        this.state.trash.splice(idx, 1);
        this.saveFilesystem();
        this.saveTrash();
        const winId = this.state.activeWindow;
        if (winId) {
            const currentPath = this.state.fmCurrentPath[winId] || '/';
            if (currentPath === '/Cestino' || currentPath.startsWith('/Cestino')) {
                this.renderFileList(winId, '/Cestino');
            }
        }
        this.showToast('Eliminato', `"${entry.name}" eliminato definitivamente.`, 'error');
    }

    emptyTrash() {
        const trashFolder = this.getFolderByPath('/Cestino');
        if (!trashFolder) return;
        const count = Object.keys(trashFolder.children).length;
        if (count === 0) {
            this.showToast('Cestino vuoto', 'Il cestino è già vuoto.', 'info');
            return;
        }
        if (!confirm(`Sei sicuro di voler eliminare definitivamente ${count} elemento/i dal cestino?`)) return;
        trashFolder.children = {};
        this.state.trash = [];
        this.saveFilesystem();
        this.saveTrash();
        const winId = this.state.activeWindow;
        if (winId) {
            const currentPath = this.state.fmCurrentPath[winId] || '/';
            if (currentPath === '/Cestino' || currentPath.startsWith('/Cestino')) {
                this.renderFileList(winId, '/Cestino');
            }
        }
        this.showToast('Cestino svuotato', `${count} elemento/i eliminati definitivamente.`, 'success');
    }

    showFileInfo(windowId, path, name) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[name]) return;
        const item = folder.children[name];
        const size = item.type === 'file' ? this.getFileSize(item.content || '') : this.getFolderCount(item) + ' oggetti';
        const ext = this.getFileExtension(name);
        const type = item.type === 'folder' ? 'Cartella' : this.getFileTypeName(ext);
        const container = document.getElementById(`filelist-${windowId}`);
        if (!container) return;
        container.innerHTML = `
            <div class="file-info-dialog">
                <h3>ℹ️ Informazioni</h3>
                <div class="info-box">
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>Tipo:</strong> ${type}</p>
                    <p><strong>Dimensione:</strong> ${size}</p>
                    <p><strong>Percorso:</strong> ${path === '/' ? '/' + name : path + '/' + name}</p>
                    ${item.modifiedAt ? `<p><strong>Modificato:</strong> ${new Date(item.modifiedAt).toLocaleString('it-IT')}</p>` : ''}
                </div>
                <div style="display:flex;gap:10px;margin-top:15px;">
                    <button class="file-manager-btn" onclick="app.renderFileList('${windowId}', '${path}')">← Torna alla cartella</button>
                </div>
            </div>
        `;
    }

    getFileSize(content) {
        if (!content && content !== '') return '0 B';
        const bytes = new Blob([content]).size;
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    getFileExtension(filename) {
        const parts = filename.split('.');
        return parts.length > 1 ? parts.pop().toLowerCase() : '';
    }

    getFileTypeIcon(ext) {
        const icons = { txt: '📝', jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', mp3: '🎵', wav: '🎵', pdf: '📕', doc: '📘', docx: '📘', html: '🌐', js: '📜', zip: '🗜️', rar: '🗜️' };
        return icons[ext] || '📄';
    }

    getFileTypeName(ext) {
        const names = { txt: 'File di testo', jpg: 'Immagine JPEG', jpeg: 'Immagine JPEG', png: 'Immagine PNG', gif: 'Immagine GIF', mp3: 'File audio MP3', wav: 'File audio WAV', pdf: 'Documento PDF', doc: 'Documento Word', docx: 'Documento Word', html: 'Pagina HTML', js: 'File JavaScript', zip: 'Archivio ZIP', rar: 'Archivio RAR' };
        return names[ext] || 'File';
    }

    renderBreadcrumb(windowId, path) {
        const breadcrumbEl = document.getElementById(`breadcrumb-${windowId}`);
        if (!breadcrumbEl) return;
        const parts = path.split('/').filter(p => p);
        let html = `<span class="breadcrumb-item" onclick="app.renderFileList('${windowId}', '/')">🏠 Home</span>`;
        let currentPath = '';
        const trashCount = this.getTrashCount();
        parts.forEach((part, i) => {
            currentPath += '/' + part;
            html += `<span class="breadcrumb-separator">/</span>`;
            if (part === 'Cestino' && trashCount > 0) {
                html += `<span class="breadcrumb-item" onclick="app.renderFileList('${windowId}', '${currentPath}')">🗑️ Cestino <span class="fm-trash-badge">${trashCount}</span></span>`;
            } else {
                html += `<span class="breadcrumb-item" onclick="app.renderFileList('${windowId}', '${currentPath}')">${part}</span>`;
            }
        });
        breadcrumbEl.innerHTML = html;
    }

    getTrashCount() {
        const trashFolder = this.getFolderByPath('/Cestino');
        return trashFolder && trashFolder.children ? Object.keys(trashFolder.children).length : 0;
    }

    getFolderByPath(path) {
        if (path === '/' || path === '/Cestino' || path === '/Cestino/') {
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
        const currentPath = this.state.fmCurrentPath[windowId] || '/';
        const folder = this.getFolderByPath(currentPath);
        if (folder && folder.children) {
            if (folder.children[name]) {
                this.showToast('Errore', 'Esiste già un file o cartella con questo nome!', 'error');
                return;
            }
            folder.children[name] = { type: 'folder', name, children: {}, modifiedAt: Date.now() };
            this.saveFilesystem();
            this.renderFileList(windowId, currentPath);
            this.showToast('Cartella creata', `Cartella "${name}" creata con successo.`, 'success');
            this.showTutorMessage(`Perfetto! Ho creato la cartella "${name}". È come una scatola vuota dove puoi mettere i tuoi file!`);
        }
    }

    createFile(windowId) {
        const name = prompt('Nome del file:');
        if (!name) return;
        const currentPath = this.state.fmCurrentPath[windowId] || '/';
        const folder = this.getFolderByPath(currentPath);
        if (folder && folder.children) {
            if (folder.children[name]) {
                this.showToast('Errore', 'Esiste già un file o cartella con questo nome!', 'error');
                return;
            }
            folder.children[name] = { type: 'file', name, content: '', modifiedAt: Date.now() };
            this.saveFilesystem();
            this.renderFileList(windowId, currentPath);
            this.showToast('File creato', `File "${name}" creato con successo.`, 'success');
            this.showTutorMessage(`Ho creato il file "${name}". È come un foglio bianco dove puoi scrivere!`);
        }
    }

    goUp(windowId) {
        const currentPath = this.state.fmCurrentPath[windowId] || '/';
        if (currentPath === '/') return;
        const parts = currentPath.split('/').filter(p => p);
        parts.pop();
        const parentPath = parts.length === 0 ? '/' : '/' + parts.join('/');
        this.state.fmSearchQuery = '';
        const searchInput = document.getElementById(`fm-search-${windowId}`);
        if (searchInput) searchInput.value = '';
        this.renderFileList(windowId, parentPath);
    }

    showFilePreview(windowId, path, filename) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[filename]) return;
        const file = folder.children[filename];
        this.updatePreviewPane(windowId, path, filename);
    }

    editFile(windowId, path, filename) {
        const folder = this.getFolderByPath(path);
        if (!folder || !folder.children[filename]) return;
        const file = folder.children[filename];
        const newContent = prompt('Modifica il contenuto:', file.content || '');
        if (newContent !== null) {
            file.content = newContent;
            file.modifiedAt = Date.now();
            this.saveFilesystem();
            this.showToast('Salvato', 'Modifiche salvate con successo.', 'success');
            this.showTutorMessage('Ho salvato le modifiche!');
            this.updatePreviewPane(windowId, path, filename);
        }
    }

    // ===== Browser Simulator =====
    getBrowserContent(windowId) {
        return `
            <div class="browser-toolbar">
                <button class="browser-btn" onclick="app.browserBack('${windowId}')" title="Indietro">←</button>
                <button class="browser-btn" onclick="app.browserForward('${windowId}')" title="Avanti">→</button>
                <input type="text" class="browser-url" id="browser-url-${windowId}" value="auraos://home" readonly>
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
                    <li>Imparare cos'è la posta elettronica</li>
                    <li>Capire i virus e come proteggersi</li>
                    <li>Scoprire cosa sono i video in streaming</li>
                    <li>Imparare a scaricare in sicurezza</li>
                </ul>
                <p style="margin-top: 20px;">Scegli una pagina:</p>
                <p><a onclick="app.navigateBrowser('internet')">Cos'è Internet?</a></p>
                <p><a onclick="app.navigateBrowser('siti')">Cosa sono i siti web?</a></p>
                <p><a onclick="app.navigateBrowser('link')">Cosa sono i link?</a></p>
                <p><a onclick="app.navigateBrowser('sicurezza')">Navigare in sicurezza</a></p>
                <p><a onclick="app.navigateBrowser('email')">Cos'è la posta elettronica?</a></p>
                <p><a onclick="app.navigateBrowser('virus')">Virus e sicurezza del computer</a></p>
                <p><a onclick="app.navigateBrowser('video')">Video in streaming</a></p>
                <p><a onclick="app.navigateBrowser('download')">Scaricare in sicurezza</a></p>
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
                    
                    <li>Ricorda: Internet è come il mondo reale, ci sono persone gentili e persone meno gentili</li>
                </ul>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
            email: `
                <h2>📧 Cos'è la posta elettronica?</h2>
                <p>La <strong>posta elettronica</strong> (email) è come la posta tradizionale, ma digitale!</p>
                <p>Invece di scrivere su carta e mettere in una busta, scrivi sul computer e invii con un click.</p>
                <p><strong>Come funziona:</strong></p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Ogni persona ha un <strong>indirizzo email</strong> unico, come: nome@esempio.it</li>
                    <li>Puoi inviare <strong>messaggi</strong> e anche <strong>allegati</strong> (foto, documenti)</li>
                    <li>I messaggi arrivano in pochi secondi, anche da paesi lontani!</li>
                </ul>
                <p><strong>Regole di sicurezza:</strong></p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Non aprire email da persone che non conosci</li>
                    <li>Non cliccare su link sospetti nelle email</li>
                    <li>Non dare la tua password a nessuno</li>
                </ul>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
            virus: `
                <h2>🦠 Virus e sicurezza del computer</h2>
                <p>Un <strong>virus informatico</strong> è come un germe per il computer: può fare danni se non ti proteggi!</p>
                <p><strong>Cosa può fare un virus:</strong></p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Rallentare il computer</li>
                    <li>Mostrare messaggi strani</li>
                    <li>Cancellare file importanti</li>
                </ul>
                <p><strong>Come proteggersi:</strong></p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Non scaricare programmi da siti sconosciuti</li>
                    <li>Non aprire allegati email da persone che non conosci</li>
                    <li>Tieni il computer aggiornato</li>
                    <li>Usa un programma antivirus se disponibile</li>
                    
                </ul>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
            video: `
                <h2>🎬 Video in streaming</h2>
                <p>Lo <strong>streaming</strong> è come guardare la televisione su Internet!</p>
                <p>Invece di scaricare tutto il video prima di guardarlo, lo vedi mentre si carica. Funziona come:</p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li><strong>YouTube</strong> - dove puoi guardare miliardi di video</li>
                    <li><strong>Netflix/Disney+</strong> - film e serie TV</li>
                    <li><strong>Twitch</strong> - video dal vivo di persone che giocano</li>
                </ul>
                <p><strong>Cose importanti da sapere:</strong></p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Per vedere video in streaming serve una buona connessione Internet</li>
                    
                    <li>Non tutti i video sono veri: impara a riconoscere le bufale!</li>
                </ul>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
            download: `
                <h2>⬇️ Scaricare in sicurezza</h2>
                <p><strong>Scaricare</strong> significa prendere un file da Internet e salvarlo sul tuo computer.</p>
                <p><strong>Regole per scaricare in sicurezza:</strong></p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li>Scarica solo da siti che conosci e di cui ti fidi</li>
                    <li>Non scaricare programmi da siti sconosciuti</li>
                    <li>Fai attenzione ai file .exe - sono programmi che possono contenere virus</li>
                    <li>Controlla sempre che il file sia quello che ti aspetti</li>
                    
                </ul>
                <p><strong>Tipi di file comuni:</strong></p>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li><strong>.jpg / .png</strong> - foto</li>
                    <li><strong>.mp3</strong> - musica</li>
                    <li><strong>.pdf</strong> - documenti</li>
                    <li><strong>.exe</strong> - programmi (attenzione!)</li>
                </ul>
                <p style="margin-top: 20px;"><a onclick="app.navigateBrowser('home')">← Torna alla home</a></p>
            `,
        };
        return pages[page] || pages.home;
    }

    getBrowserPages() {
        return ['home', 'internet', 'siti', 'link', 'sicurezza', 'email', 'virus', 'video', 'download'];
    }

    initBrowser(windowId) {
        const urlInput = document.getElementById(`browser-url-${windowId}`);
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const val = urlInput.value.replace('auraos://', '').trim().toLowerCase();
                    const pages = this.getBrowserPages();
                    if (pages.includes(val)) {
                        this.navigateBrowser(val);
                    } else {
                        urlInput.value = 'auraos://home';
                        this.navigateBrowser('home');
                    }
                }
            });
        }
    }

    navigateBrowser(page) {
        const activeWin = this.state.openWindows.find(w => w.appId === 'browser' && !w.minimized);
        if (!activeWin) return;
        const content = document.getElementById(`browser-content-${activeWin.id}`);
        const url = document.getElementById(`browser-url-${activeWin.id}`);
        if (content) {
            content.innerHTML = this.getBrowserPage(page);
            if (url) url.value = `auraos://${page}`;
        }
    }

    browserBack(windowId) {
        const content = document.getElementById(`browser-content-${windowId}`);
        const url = document.getElementById(`browser-url-${windowId}`);
        if (content) {
            content.innerHTML = this.getBrowserPage('home');
            if (url) url.value = 'auraos://home';
        }
    }

    browserForward(windowId) {
        const content = document.getElementById(`browser-content-${windowId}`);
        const url = document.getElementById(`browser-url-${windowId}`);
        if (content) {
            content.innerHTML = this.getBrowserPage('internet');
            if (url) url.value = 'auraos://internet';
        }
    }

    // ===== Tutor App =====
    getTutorContent(windowId) {
        const suggestions = this.tutorAI.getSuggestions('adulto');
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
    }

    sendTutorMessage(windowId) {
        const input = document.getElementById(`tutor-input-${windowId}`);
        const message = input.value.trim();
        if (!message) return;
        const messagesContainer = document.getElementById(`tutor-messages-${windowId}`);
        if (!messagesContainer) return;
        const userMsg = document.createElement('div');
        userMsg.className = 'tutor-message user';
        userMsg.textContent = message;
        messagesContainer.appendChild(userMsg);
        const response = this.tutorAI.getResponse(message, 'adulto');
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
            clearTimeout(this.tutorTimeout);
            this.tutorTimeout = setTimeout(() => {
                this.hideTutorBubble();
            }, 8000);
        }
    }

    hideTutorBubble() {
        const bubble = document.getElementById('tutor-bubble');
        if (bubble) bubble.classList.add('hidden');
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
            ${this.getAppearanceContent(windowId)}

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
                <h3>🔊 Audio</h3>
                <div class="settings-option">
                    <span class="settings-label">Effetti sonori</span>
                    <div class="settings-control">
                        <button class="settings-btn ${this.state.soundsEnabled ? 'active' : ''}" onclick="app.toggleSounds(true)">Attivo</button>
                        <button class="settings-btn ${!this.state.soundsEnabled ? 'active' : ''}" onclick="app.toggleSounds(false)">Disattivo</button>
                    </div>
                </div>
            </div>

            <div class="settings-section">
                <h3>🔒 Sicurezza</h3>
                <div class="settings-option">
                    <span class="settings-label">Password di accesso</span>
                    <div class="settings-control">
                        <button class="settings-btn ${this.state.passwordEnabled ? 'active' : ''}" onclick="app.togglePassword(true)">Attiva</button>
                        <button class="settings-btn ${!this.state.passwordEnabled ? 'active' : ''}" onclick="app.togglePassword(false)">Disattiva</button>
                    </div>
                </div>
                ${this.state.passwordEnabled ? `
                <div class="settings-option">
                    <span class="settings-label">Cambia password</span>
                    <div class="settings-control">
                        <input type="password" id="new-password" class="settings-input" placeholder="Nuova password" onkeydown="if(event.key==='Enter')app.changePassword()">
                        <button class="settings-btn" onclick="app.changePassword()">Salva</button>
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="settings-section">
                <h3>💾 Dati</h3>
                <div class="settings-option">
                    <span class="settings-label">File salvati</span>
                    <div class="settings-control">
                        <button class="settings-btn" onclick="app.resetFilesystem()">🔄 Ripristina file</button>
                    </div>
                </div>
                <div class="settings-option">
                    <span class="settings-label">Filesystem reale</span>
                    <div class="settings-control">
                        <button class="settings-btn" onclick="app.requestRealFileSystemAccess()">📂 Accesso filesystem reale</button>
                    </div>
                    <p class="settings-hint">Consenti a AuraOS di accedere ai tuoi file reali (richiede supporto browser)</p>
                </div>
            </div>
        `;
    }

    initSettings(windowId) {
    }

    setWallpaper(wallpaper) {
        this.state.wallpaper = wallpaper;
        localStorage.setItem('auraos_wallpaper', wallpaper);
        this.applySettings();
        this.showToast('Sfondo cambiato', `Nuovo sfondo: "${wallpaper}".`, 'success');
        this.addNotification('Sfondo', `Sfondo cambiato in "${wallpaper}".`, 'info');
        this.showTutorMessage(`Ho cambiato lo sfondo! Ora hai lo sfondo "${wallpaper}". Ti piace?`);
    }

    setIconSize(size) {
        this.state.iconSize = size;
        localStorage.setItem('auraos_iconSize', size);
        this.applySettings();
    }

    setUserMode(mode) {
        
        this.applySettings();
        this.showToast('Modalità cambiata', `Modalità: "${mode}".`, 'success');
        this.addNotification('Modalità', `Modalità cambiata in "${mode}".`, 'info');
        this.showTutorMessage(`Modalità cambiata in "${mode}". Ora il sistema si adatta alle tue necessità!`);
    }

    toggleTutorSuggestions(enabled) {
        this.showToast('Suggerimenti', enabled ? 'Suggerimenti del tutor attivati!' : 'Suggerimenti del tutor disattivati.', 'info', 2000);
        this.showTutorMessage(enabled ? 'Suggerimenti del tutor attivati!' : 'Suggerimenti del tutor disattivati.');
    }

    resetFilesystem() {
        if (confirm('Sei sicuro? Tutti i file e le cartelle verranno cancellati.')) {
            localStorage.removeItem('auraos_filesystem');
            this.initFilesystem();
            this.showToast('Ripristino', 'File ripristinati ai valori predefiniti.', 'success');
            this.addNotification('File ripristinati', 'Il filesystem è stato ripristinato ai valori predefiniti.', 'info');
            this.showTutorMessage('Ho ripristinato i file predefiniti.');
        }
    }

    togglePassword(enabled) {
        if (enabled) {
            const password = prompt('Inserisci una nuova password:');
            if (password && password.length >= 4) {
                this.setPassword(password);
                this.showToast('Sicurezza', 'Password di accesso attivata!', 'success');
                this.showTutorMessage('Password attivata! Al prossimo avvio ti verrà chiesta la password.');
            } else if (password !== null) {
                this.showToast('Sicurezza', 'La password deve essere di almeno 4 caratteri.', 'error');
            }
        } else {
            if (confirm('Sei sicuro di voler disattivare la password?')) {
                this.setPassword(null);
                this.showToast('Sicurezza', 'Password di accesso disattivata.', 'info');
                this.showTutorMessage('Password disattivata. Non ti verrà più chiesta la password.');
            }
        }
    }

    changePassword() {
        const input = document.getElementById('new-password');
        const password = input ? input.value : '';
        if (password && password.length >= 4) {
            this.setPassword(password);
            this.showToast('Sicurezza', 'Password cambiata con successo!', 'success');
            if (input) input.value = '';
        } else {
            this.showToast('Sicurezza', 'La password deve essere di almeno 4 caratteri.', 'error');
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
        if (nextBtn) nextBtn.textContent = this.currentGuideStep === this.guideSteps.length - 1 ? 'Ricomincia' : 'Avanti →';
        if (step.target) {
            const target = document.querySelector(step.target);
            if (target) {
                target.style.boxShadow = '0 0 0 4px #667eea';
                setTimeout(() => { target.style.boxShadow = ''; }, 2000);
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
                        <span style="font-size: 40px;">📁</span><span>Immagini</span>
                    </div>
                    <div class="drop-zone" data-folder="Documenti" ondrop="app.handleDrop(event, '${windowId}')" ondragover="app.handleDragOver(event)" ondragleave="app.handleDragLeave(event)">
                        <span style="font-size: 40px;">📁</span><span>Documenti</span>
                    </div>
                    <div class="drop-zone" data-folder="Musica" ondrop="app.handleDrop(event, '${windowId}')" ondragover="app.handleDragOver(event)" ondragleave="app.handleDragLeave(event)">
                        <span style="font-size: 40px;">📁</span><span>Musica</span>
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
            <div class="calculator-wrapper" id="calc-wrapper-${windowId}">
                <div class="calc-history-panel" id="calc-history-${windowId}">
                    <div class="calc-history-header">
                        <span>📊 Cronologia</span>
                        <button class="calc-history-clear" onclick="app.clearCalcHistory('${windowId}')">Cancella</button>
                    </div>
                    <div class="calc-history-list" id="calc-history-list-${windowId}">
                        <p style="color: #a0aec0; font-size: 12px; text-align: center; padding: 10px;">Nessun calcolo</p>
                    </div>
                </div>
                <div class="calculator" id="calc-${windowId}">
                    <div class="calc-display-expression" id="calc-expr-${windowId}"></div>
                    <div class="calc-display" id="calc-display-${windowId}">0</div>
                    <div class="calc-buttons">
                        <button class="calc-btn calc-clear" onclick="app.calcClear('${windowId}')">C</button>
                        <button class="calc-btn calc-op" onclick="app.calcBackspace('${windowId}')">⌫</button>
                        <button class="calc-btn calc-func" onclick="app.calcSqrt('${windowId}')">√</button>
                        <button class="calc-btn calc-func" onclick="app.calcPercent('${windowId}')">%</button>
                        <button class="calc-btn calc-op" onclick="app.calcOperation('${windowId}', '/')">÷</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '7')">7</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '8')">8</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '9')">9</button>
                        <button class="calc-btn calc-op" onclick="app.calcOperation('${windowId}', '*')">×</button>
                        <button class="calc-btn calc-func" onclick="app.calcSignToggle('${windowId}')">±</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '4')">4</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '5')">5</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '6')">6</button>
                        <button class="calc-btn calc-op" onclick="app.calcOperation('${windowId}', '-')">-</button>
                        <button class="calc-btn calc-op" onclick="app.calcOperation('${windowId}', '+')">+</button>
                        <button class="calc-btn calc-equal" onclick="app.calcEqual('${windowId}')">=</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '1')">1</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '2')">2</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '3')">3</button>
                        <button class="calc-btn calc-zero" onclick="app.calcInput('${windowId}', '0')">0</button>
                        <button class="calc-btn" onclick="app.calcInput('${windowId}', '.')">.</button>
                    </div>
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
            expression: '',
            lastOperand: null,
        };
        this.calculators = this.calculators || {};
        this.calculators[windowId] = calc;
        this.calcHistory = this.calcHistory || {};
        this.calcHistory[windowId] = [];
        const win = document.getElementById(windowId);
        if (win) win.style.width = '520px';
    }

    handleCalculatorKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.calcInput(this.state.activeWindow, e.key);
        else if (e.key === '.') this.calcInput(this.state.activeWindow, '.');
        else if (e.key === '+') this.calcOperation(this.state.activeWindow, '+');
        else if (e.key === '-') this.calcOperation(this.state.activeWindow, '-');
        else if (e.key === '*') this.calcOperation(this.state.activeWindow, '*');
        else if (e.key === '/') { e.preventDefault(); this.calcOperation(this.state.activeWindow, '/'); }
        else if (e.key === 'Enter') this.calcEqual(this.state.activeWindow);
        else if (e.key === 'Escape') this.calcClear(this.state.activeWindow);
        else if (e.key === 'Backspace') this.calcBackspace(this.state.activeWindow);
    }

    calcInput(windowId, value) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        const exprDisplay = document.getElementById(`calc-expr-${windowId}`);
        if (!calc || !display) return;
        if (calc.waitingForOperand) {
            calc.current = value === '.' ? '0.' : value;
            calc.waitingForOperand = false;
        } else {
            if (value === '.' && calc.current.includes('.')) return;
            calc.current = calc.current === '0' && value !== '.' ? value : calc.current + value;
        }
        display.textContent = calc.current;
        if (exprDisplay && calc.operator && calc.previous !== null) {
            const opSymbol = { '+': '+', '-': '-', '*': '×', '/': '÷' }[calc.operator] || calc.operator;
            exprDisplay.textContent = `${calc.previous} ${opSymbol} ${calc.current}`;
        }
    }

    calcClear(windowId) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        const exprDisplay = document.getElementById(`calc-expr-${windowId}`);
        if (!calc || !display) return;
        calc.current = '0';
        calc.previous = null;
        calc.operator = null;
        calc.waitingForOperand = false;
        calc.expression = '';
        display.textContent = '0';
        if (exprDisplay) exprDisplay.textContent = '';
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
        const exprDisplay = document.getElementById(`calc-expr-${windowId}`);
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
                case '/': result = inputValue === 0 ? null : currentValue / inputValue; break;
                default: result = inputValue;
            }
            if (result === null) {
                calc.current = 'Errore';
                display.textContent = 'Errore';
                calc.previous = null;
                calc.operator = null;
                calc.waitingForOperand = true;
                if (exprDisplay) exprDisplay.textContent = 'Errore: divisione per 0';
                this.playSound('error');
                return;
            }
            calc.current = String(Math.round(result * 1000000) / 1000000);
            calc.previous = result;
            display.textContent = calc.current;
        }
        calc.waitingForOperand = true;
        calc.operator = nextOperator;
        calc.lastOperand = calc.current;
        if (exprDisplay) {
            const opSymbol = { '+': '+', '-': '-', '*': '×', '/': '÷' }[nextOperator] || nextOperator;
            exprDisplay.textContent = `${calc.current} ${opSymbol}`;
        }
    }

    calcEqual(windowId) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        const exprDisplay = document.getElementById(`calc-expr-${windowId}`);
        if (!calc || !display) return;
        if (!calc.operator || calc.previous === null) return;
        const inputValue = parseFloat(calc.current);
        const currentValue = calc.previous || 0;
        const opSymbol = { '+': '+', '-': '-', '*': '×', '/': '÷' }[calc.operator] || calc.operator;
        const expression = `${currentValue} ${opSymbol} ${calc.current}`;
        let result;
        switch (calc.operator) {
            case '+': result = currentValue + inputValue; break;
            case '-': result = currentValue - inputValue; break;
            case '*': result = currentValue * inputValue; break;
            case '/': result = inputValue === 0 ? null : currentValue / inputValue; break;
            default: result = inputValue;
        }
        if (result === null) {
            calc.current = 'Errore';
            display.textContent = 'Errore';
            if (exprDisplay) exprDisplay.textContent = 'Errore: divisione per 0';
            calc.previous = null;
            calc.operator = null;
            calc.waitingForOperand = true;
            this.playSound('error');
            return;
        }
        const resultStr = String(Math.round(result * 1000000) / 1000000);
        this.addToCalcHistory(windowId, expression, resultStr);
        calc.current = resultStr;
        calc.previous = null;
        calc.operator = null;
        calc.waitingForOperand = true;
        display.textContent = calc.current;
        if (exprDisplay) exprDisplay.textContent = `${expression} =`;
    }

    calcPercent(windowId) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        if (!calc || !display) return;
        const value = parseFloat(calc.current);
        if (isNaN(value)) return;
        calc.current = String(value / 100);
        display.textContent = calc.current;
    }

    calcSqrt(windowId) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        const exprDisplay = document.getElementById(`calc-expr-${windowId}`);
        if (!calc || !display) return;
        const value = parseFloat(calc.current);
        if (isNaN(value) || value < 0) {
            calc.current = 'Errore';
            display.textContent = 'Errore';
            if (exprDisplay) exprDisplay.textContent = 'Numero negativo';
            this.playSound('error');
            return;
        }
        calc.current = String(Math.round(Math.sqrt(value) * 1000000) / 1000000);
        display.textContent = calc.current;
    }

    calcSignToggle(windowId) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        if (!calc || !display) return;
        if (calc.current === '0' || calc.current === 'Errore') return;
        if (calc.current.startsWith('-')) {
            calc.current = calc.current.slice(1);
        } else {
            calc.current = '-' + calc.current;
        }
        display.textContent = calc.current;
    }

    addToCalcHistory(windowId, expression, result) {
        if (!this.calcHistory[windowId]) this.calcHistory[windowId] = [];
        this.calcHistory[windowId].unshift({ expression, result, time: new Date() });
        if (this.calcHistory[windowId].length > 50) this.calcHistory[windowId].pop();
        this.renderCalcHistory(windowId);
    }

    renderCalcHistory(windowId) {
        const listEl = document.getElementById(`calc-history-list-${windowId}`);
        if (!listEl) return;
        const history = this.calcHistory[windowId] || [];
        if (history.length === 0) {
            listEl.innerHTML = '<p style="color: #a0aec0; font-size: 12px; text-align: center; padding: 10px;">Nessun calcolo</p>';
            return;
        }
        listEl.innerHTML = history.slice(0, 20).map((item, i) => `
            <div class="calc-history-item" onclick="app.useCalcHistoryItem('${windowId}', '${item.result.replace(/'/g, "\\'")}')">
                <div class="calc-history-expr">${item.expression} =</div>
                <div class="calc-history-result">${item.result}</div>
            </div>
        `).join('');
    }

    useCalcHistoryItem(windowId, result) {
        const calc = this.calculators[windowId];
        const display = document.getElementById(`calc-display-${windowId}`);
        if (!calc || !display) return;
        calc.current = result;
        calc.waitingForOperand = false;
        display.textContent = calc.current;
        this.playSound('click');
    }

    clearCalcHistory(windowId) {
        if (!this.calcHistory[windowId]) return;
        this.calcHistory[windowId] = [];
        this.renderCalcHistory(windowId);
    }

    // ===== Tutor Helper Methods =====
    getTutorWelcomeMessage(appId) {
        const messages = {
            'file-manager': 'Benvenuto nel File Manager! Qui puoi organizzare i tuoi file in cartelle, trascinarli, copiarli e cercarli. C\'è anche il Cestino per ripristinare i file eliminati!',
            'browser': 'Ecco il Browser! Da qui puoi esplorare pagine sicure per imparare cos\'è Internet. Tutto è controllato e sicuro!',
            'tutor': 'Sono il tuo Tutor AI! Chiedimi qualsiasi cosa. Cosa vuoi sapere?',
            'settings': 'Nelle Impostazioni puoi personalizzare il computer: cambia lo sfondo, la dimensione delle icone e la modalità!',
            'guide': 'Benvenuto nella Guida! Ti accompagnerò passo passo alla scoperta del computer. Iniziamo?',
            'games': 'Ecco i Giochi! Qui impari divertendoti. Scegli un gioco e buon divertimento!',
            'calculator': 'Ecco la Calcolatrice! Puoi fare addizioni, sottrazioni, moltiplicazioni, divisioni, percentuali, radici quadrate e cambiare il segno. Provaci!',
            'notepad': 'Ecco il Blocco Note! Scrivi appunti, annotazioni o quello che vuoi. Si salva automaticamente!',
            'terminal': 'Benvenuto nel Terminale! Qui puoi usare la riga di comando come un vero hacker. Prova i comandi: ls, cd, mkdir, neofetch e molti altri! Digita "help" per la lista completa.',
            'task-manager': 'Ecco il Task Manager! Qui puoi vedere tutte le app aperte, quanto usano di memoria e CPU, e anche chiudere le app che non servono più. Si aggiorna automaticamente ogni 2 secondi!',
            'gallery': 'Benvenuto nella Galleria! Qui puoi caricare le tue foto, visualizzarle in griglia, ingrandirle, fare slideshow ed eliminarle.',
            'music': 'Benvenuto nel Player Musicale! Qui puoi caricare i tuoi brani, riprodurli, controllare il volume, usare la playlist e molto altro!',
        };
        return messages[appId] || 'Benvenuto!';
    }

    // ===== System =====
    shutdown() {
        this.toggleStartMenu(false);
        const shutdownScreen = document.getElementById('shutdown-screen');
        shutdownScreen.classList.remove('hidden');
        this.state.openWindows.forEach(w => {
            const win = document.getElementById(w.id);
            if (win) win.remove();
        });
        this.state.openWindows = [];
        this.updateDock();
        this.updateTopBar();
        this.showToast('Spegnimento', 'Il sistema si sta spegnendo.', 'info');
        this.addNotification('Spegnimento', 'Il sistema si sta spegnendo.', 'info');
    }

    wakeUp() {
        const shutdownScreen = document.getElementById('shutdown-screen');
        shutdownScreen.classList.add('hidden');
        this.showToast('Riaccensione', 'Bentornato in AuraOS!', 'success');
        this.addNotification('Riaccensione', 'Bentornato in AuraOS!', 'success');
        this.showTutorMessage('Bentornato! Sei di nuovo nel tuo computer virtuale.');
    }

    // ===== Notification System =====
    showToast(title, message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" onclick="app.dismissToast(this.parentElement)">✕</button>
        `;
        container.appendChild(toast);
        const dismissTimeout = setTimeout(() => this.dismissToast(toast), duration);
        toast.dataset.dismissTimeout = dismissTimeout;
        this.addNotification(title, message, type);
    }

    dismissToast(toast) {
        if (!toast || toast.classList.contains('toast-out')) return;
        clearTimeout(toast.dataset.dismissTimeout);
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }

    addNotification(title, message, type = 'info', actions = [], appIcon = '📢') {
        if (this.state.doNotDisturb && type !== 'error') return;
        const notif = {
            id: Date.now() + Math.random(),
            title,
            message,
            type,
            time: new Date().toISOString(),
            read: false,
            actions: actions || [],
            appIcon: appIcon || '📢'
        };
        this.state.notifications.unshift(notif);
        if (this.state.notifications.length > 50) this.state.notifications.length = 50;
        this.saveNotifications();
        this.updateNotificationBadge();
        if (this.state.notificationCenterOpen) {
            this.renderNotifications();
        }
        const autoHideTypes = ['info', 'success', 'warning'];
        if (autoHideTypes.includes(type)) {
            setTimeout(() => {
                this.removeNotification(notif.id);
            }, 5000);
        }
    }

    removeNotification(id) {
        this.state.notifications = this.state.notifications.filter(n => n.id !== id);
        this.saveNotifications();
        this.updateNotificationBadge();
        if (this.state.notificationCenterOpen) {
            this.renderNotifications();
        }
    }

    markAsRead(id) {
        const notif = this.state.notifications.find(n => n.id === id);
        if (notif) {
            notif.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
            if (this.state.notificationCenterOpen) {
                this.renderNotifications();
            }
        }
    }

    markAllAsRead() {
        this.state.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationBadge();
        if (this.state.notificationCenterOpen) {
            this.renderNotifications();
        }
    }

    saveNotifications() {
        try {
            localStorage.setItem('auraos_notifications', JSON.stringify(this.state.notifications));
        } catch (e) { }
    }

    saveTrash() {
        try {
            localStorage.setItem('auraos_trash', JSON.stringify(this.state.trash));
        } catch (e) { }
    }

    saveRecentApps() {
        try {
            localStorage.setItem('auraos_recent_apps', JSON.stringify(this.state.recentApps));
        } catch (e) { }
    }

    saveRecentFiles() {
        try {
            localStorage.setItem('auraos_recent_files', JSON.stringify(this.state.recentFiles));
        } catch (e) { }
    }

    getNotificationTimeString(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffDays = Math.floor((todayStart - notifDate) / (1000 * 60 * 60 * 24));
        const timeStr = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 0) return `Oggi ${timeStr}`;
        if (diffDays === 1) return `Ieri ${timeStr}`;
        if (diffDays < 7) {
            const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
            return `${dayNames[date.getDay()]} ${timeStr}`;
        }
        return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) + ' ' + timeStr;
    }

    groupNotificationsByDate(notifications) {
        const groups = {};
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
        const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

        notifications.forEach(notif => {
            const notifDate = new Date(notif.time);
            const notifDayStart = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());
            let groupKey;
            if (notifDayStart >= todayStart) {
                groupKey = 'today';
            } else if (notifDayStart >= yesterdayStart) {
                groupKey = 'yesterday';
            } else if (notifDayStart >= weekStart) {
                groupKey = 'week';
            } else {
                groupKey = 'older';
            }
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(notif);
        });

        const order = ['today', 'yesterday', 'week', 'older'];
        return order.filter(k => groups[k]).map(k => ({
            key: k,
            label: {
                today: 'Oggi',
                yesterday: 'Ieri',
                week: 'Questa settimana',
                older: 'Più vecchie'
            }[k],
            notifications: groups[k]
        }));
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        if (!badge) return;
        const unread = this.state.notifications.filter(n => !n.read).length;
        badge.textContent = unread > 99 ? '99+' : unread;
        if (unread > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    toggleNotificationCenter() {
        if (this.state.notificationCenterOpen) {
            this.closeNotificationCenter();
        } else {
            this.openNotificationCenter();
        }
    }

    openNotificationCenter() {
        this.state.notificationCenterOpen = true;
        const center = document.getElementById('notification-center');
        if (center) {
            center.classList.add('visible');
            this.markAllAsRead();
            this.renderNotifications();
        }
    }

    closeNotificationCenter() {
        this.state.notificationCenterOpen = false;
        const center = document.getElementById('notification-center');
        if (center) {
            center.classList.remove('visible');
        }
    }

    renderNotifications() {
        const list = document.getElementById('notification-list');
        if (!list) return;

        if (this.state.notifications.length === 0) {
            list.innerHTML = `
                <div class="notification-empty">
                    <div class="notification-empty-icon">🔔</div>
                    <div class="notification-empty-title">Nessuna notifica</div>
                    <div class="notification-empty-sub">Sei al corrente di tutto!</div>
                </div>
            `;
            return;
        }

        const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌', message: '💬' };
        const groups = this.groupNotificationsByDate(this.state.notifications);

        list.innerHTML = groups.map(group => `
            <div class="notification-group">
                <div class="notification-group-header">${group.label}</div>
                ${group.notifications.map((n, idx) => {
                    const globalIdx = this.state.notifications.indexOf(n);
                    const actionsHtml = (n.actions && n.actions.length > 0)
                        ? `<div class="notification-item-actions">${n.actions.map((action, actionIdx) =>
                            `<button class="notification-action-btn ${action.primary ? 'primary' : ''} ${action.danger ? 'danger' : ''}"
                                onclick="event.stopPropagation(); app.handleNotificationAction(${globalIdx}, '${action.action}')">${action.label}</button>`
                        ).join('')}</div>`
                        : '';
                    return `
                    <div class="notification-item type-${n.type} ${n.read ? '' : 'unread'}"
                         onclick="app.handleNotificationClick(${globalIdx})"
                         style="animation-delay: ${globalIdx * 0.04}s">
                        <div class="notification-item-icon">${n.appIcon || icons[n.type] || 'ℹ️'}</div>
                        <div class="notification-item-body">
                            <div class="notification-item-title">${this.escapeHtml(n.title)}</div>
                            ${n.message ? `<div class="notification-item-text">${this.escapeHtml(n.message)}</div>` : ''}
                            <div class="notification-item-time">${this.getNotificationTimeString(n.time)}</div>
                            ${actionsHtml}
                        </div>
                    </div>
                `; }).join('')}
            </div>
        `).join('');
    }

    handleNotificationClick(index) {
        const notif = this.state.notifications[index];
        if (notif) {
            this.markAsRead(notif.id);
            if (notif.actions && notif.actions.length === 1) {
                this.handleNotificationAction(index, notif.actions[0].action);
            }
        }
    }

    handleNotificationAction(index, action) {
        const notif = this.state.notifications[index];
        if (!notif) return;
        switch (action) {
            case 'reply':
                this.showToast('Risposta', 'Funzionalità di risposta in arrivo.', 'info', 2000);
                break;
            case 'close':
                this.removeNotification(notif.id);
                break;
            case 'view':
                this.showToast('Apertura', `Apertura: ${notif.title}`, 'info', 2000);
                break;
            case 'dismiss':
                this.removeNotification(notif.id);
                break;
            case 'accept':
                this.showToast('Accettato', 'Azione accettata.', 'success', 2000);
                this.removeNotification(notif.id);
                break;
            case 'decline':
                this.showToast('Rifiutato', 'Azione rifiutata.', 'info', 2000);
                this.removeNotification(notif.id);
                break;
            default:
                this.removeNotification(notif.id);
        }
        this.markAsRead(notif.id);
    }

    clearAllNotifications() {
        this.state.notifications = [];
        this.saveNotifications();
        this.updateNotificationBadge();
        this.renderNotifications();
        this.showToast('Notifiche cancellate', 'Tutte le notifiche sono state eliminate.', 'info');
    }

    toggleDoNotDisturb() {
        this.state.doNotDisturb = !this.state.doNotDisturb;
        const btn = document.getElementById('notif-dnd-btn');
        const icon = document.getElementById('notif-dnd-icon');
        const footer = document.getElementById('notification-footer');
        if (btn) btn.classList.toggle('active', this.state.doNotDisturb);
        if (icon) icon.textContent = this.state.doNotDisturb ? '🔔' : '🔕';
        if (footer) footer.classList.toggle('hidden', !this.state.doNotDisturb);
        this.showToast('Non disturbare',
            this.state.doNotDisturb ? 'Modalità Non disturbare attivata' : 'Modalità Non disturbare disattivata',
            'info', 2000);
    }

    // ===== Global Launcher =====
    openLauncher() {
        this.state.launcherOpen = true;
        this.state.launcherSelectedIndex = -1;
        const overlay = document.getElementById('launcher-overlay');
        if (overlay) overlay.classList.add('visible');
        const input = document.getElementById('launcher-input');
        if (input) {
            input.value = '';
            input.focus();
        }
        this.renderLauncherResults('');
        this.addToRecentApps('launcher');
    }

    closeLauncher() {
        this.state.launcherOpen = false;
        this.state.launcherSelectedIndex = -1;
        const overlay = document.getElementById('launcher-overlay');
        if (overlay) overlay.classList.remove('visible');
    }

    setLauncherCategory(cat) {
        this.state.launcherCategory = cat;
        document.querySelectorAll('.launcher-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.cat === cat);
        });
        const input = document.getElementById('launcher-input');
        if (input) this.renderLauncherResults(input.value);
    }

    handleLauncherInput(value) {
        this.renderLauncherResults(value);
    }

    handleLauncherKeydown(e) {
        const results = document.querySelectorAll('.launcher-result-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.state.launcherSelectedIndex = Math.min(this.state.launcherSelectedIndex + 1, results.length - 1);
            this.updateLauncherSelection(results);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.state.launcherSelectedIndex = Math.max(this.state.launcherSelectedIndex - 1, -1);
            this.updateLauncherSelection(results);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.state.launcherSelectedIndex >= 0 && results[this.state.launcherSelectedIndex]) {
                results[this.state.launcherSelectedIndex].click();
            }
        } else if (e.key === 'Escape') {
            this.closeLauncher();
        }
    }

    updateLauncherSelection(results) {
        results.forEach((r, i) => r.classList.toggle('selected', i === this.state.launcherSelectedIndex));
        if (this.state.launcherSelectedIndex >= 0 && results[this.state.launcherSelectedIndex]) {
            results[this.state.launcherSelectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    renderLauncherResults(query) {
        const container = document.getElementById('launcher-results');
        if (!container) return;
        const cat = this.state.launcherCategory;
        const q = query.toLowerCase().trim();
        let results = [];

        if (cat === 'all' || cat === 'apps') {
            this.desktopApps.forEach(app => {
                if (!q || app.name.toLowerCase().includes(q) || app.id.toLowerCase().includes(q)) {
                    results.push({ type: 'app', icon: app.icon, name: app.name, meta: 'Applicazione', action: () => { this.openApp(app.id); this.closeLauncher(); } });
                }
            });
        }

        if (cat === 'all' || cat === 'files') {
            const searchFiles = (node, path) => {
                if (!node || !node.children) return;
                Object.entries(node.children).forEach(([name, item]) => {
                    if (item.isTrash) return;
                    const currentPath = path === '/' ? `/${name}` : `${path}/${name}`;
                    if (item.type === 'folder') {
                        if (!q || name.toLowerCase().includes(q)) {
                            results.push({ type: 'folder', icon: '📁', name, meta: `Cartella · ${currentPath}`, action: () => { this.openApp('file-manager'); this.closeLauncher(); } });
                        }
                        searchFiles(item, currentPath);
                    } else {
                        if (!q || name.toLowerCase().includes(q)) {
                            const ext = this.getFileExtension(name);
                            const icon = this.getFileTypeIcon(ext);
                            results.push({ type: 'file', icon, name, meta: `File · ${currentPath}`, action: () => { this.openApp('file-manager'); this.closeLauncher(); } });
                        }
                    }
                });
            };
            searchFiles(this.state.filesystem['/'], '/');
        }

        if (cat === 'all' || cat === 'settings') {
            const settingsItems = [
                { icon: '🎨', name: 'Sfondo', meta: 'Cambia lo sfondo del desktop', action: () => { this.openApp('settings'); this.closeLauncher(); } },
                { icon: '🔔', name: 'Suggerimenti Tutor', meta: 'Attiva o disattiva i suggerimenti', action: () => { this.openApp('settings'); this.closeLauncher(); } },
                { icon: '🔊', name: 'Effetti sonori', meta: 'Attiva o disattiva i suoni', action: () => { this.openApp('settings'); this.closeLauncher(); } },
                { icon: '👤', name: 'Modalità utente', meta: 'Bambino, Adulto, Anziano', action: () => { this.openApp('settings'); this.closeLauncher(); } },
            ];
            settingsItems.forEach(s => {
                if (!q || s.name.toLowerCase().includes(q)) {
                    results.push({ type: 'setting', icon: s.icon, name: s.name, meta: s.meta, action: s.action });
                }
            });
        }

        if (results.length === 0) {
            container.innerHTML = '<div class="launcher-empty">Nessun risultato trovato</div>';
            return;
        }

        container.innerHTML = results.slice(0, 15).map((r, i) => `
            <div class="launcher-result-item" data-index="${i}" onclick="app.launcherSelectResult(${i})">
                <span class="launcher-result-icon">${r.icon}</span>
                <div class="launcher-result-info">
                    <div class="launcher-result-name">${r.name}</div>
                    <div class="launcher-result-meta">${r.meta}</div>
                </div>
            </div>
        `).join('');

        this._launcherResults = results;
        this.state.launcherSelectedIndex = -1;
    }

    launcherSelectResult(index) {
        if (this._launcherResults && this._launcherResults[index]) {
            this._launcherResults[index].action();
        }
    }

    addToRecentApps(appId) {
        const appConfig = this.desktopApps.find(a => a.id === appId);
        if (!appConfig) return;
        this.state.recentApps = this.state.recentApps.filter(a => a.id !== appId);
        this.state.recentApps.unshift({ id: appId, name: appConfig.name, icon: appConfig.icon, time: Date.now() });
        if (this.state.recentApps.length > 10) this.state.recentApps.pop();
        this.saveRecentApps();
    }

    addToRecentFiles(path, name) {
        this.state.recentFiles = this.state.recentFiles.filter(f => !(f.path === path && f.name === name));
        this.state.recentFiles.unshift({ path, name, time: Date.now() });
        if (this.state.recentFiles.length > 10) this.state.recentFiles.pop();
        this.saveRecentFiles();
    }

    // ===== Gallery App =====
    getGalleryContent(windowId) {
        return `
            <div class="gallery-wrapper" id="gallery-${windowId}">
                <div class="gallery-toolbar">
                    <span class="gallery-title">🖼️ Galleria</span>
                    <div class="gallery-controls">
                        <span class="gallery-count" id="gallery-count-${windowId}">0 immagini</span>
                        <label class="gallery-upload-btn">
                            📷 Carica
                            <input type="file" accept="image/*" multiple id="gallery-upload-${windowId}" style="display:none;">
                        </label>
                    </div>
                </div>
                <div class="gallery-main" id="gallery-main-${windowId}">
                    <div class="gallery-empty" id="gallery-empty-${windowId}">
                        <div class="gallery-empty-icon">🖼️</div>
                        <div class="gallery-empty-text">Nessuna immagine</div>
                        <div class="gallery-empty-sub">Carica le tue immagini per visualizzarle</div>
                    </div>
                    <div class="gallery-grid" id="gallery-grid-${windowId}"></div>
                </div>
            </div>
        `;
    }

    initGallery(windowId) {
        const uploadInput = document.getElementById(`gallery-upload-${windowId}`);
        const grid = document.getElementById(`gallery-grid-${windowId}`);
        const empty = document.getElementById(`gallery-empty-${windowId}`);
        const countEl = document.getElementById(`gallery-count-${windowId}`);
        if (!uploadInput || !grid) return;

        this.galleryImages = this.galleryImages || {};
        this.galleryImages[windowId] = [];
        this.gallerySlideshow = this.gallerySlideshow || {};
        this.gallerySlideshow[windowId] = null;
        this.galleryCurrentIndex = this.galleryCurrentIndex || {};
        this.gallerySlideshowActive = this.gallerySlideshowActive || {};

        const saved = localStorage.getItem('auraos_gallery');
        if (saved) {
            try {
                this.galleryImages[windowId] = JSON.parse(saved);
            } catch (e) {
                this.galleryImages[windowId] = [];
            }
        }

        this.renderGalleryGrid(windowId);

        uploadInput.addEventListener('change', (e) => {
            this.handleGalleryUpload(windowId, e.target.files);
            uploadInput.value = '';
        });
    }

    handleGalleryUpload(windowId, files) {
        if (!files || files.length === 0) return;
        const images = this.galleryImages[windowId] || [];
        let loaded = 0;
        const total = files.length;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    images.push({
                        id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
                        name: file.name,
                        dataUrl: e.target.result,
                        size: file.size,
                        date: Date.now(),
                    });
                    loaded++;
                    if (loaded >= total) {
                        this.saveGallery(windowId);
                        this.renderGalleryGrid(windowId);
                        this.playSound('success');
                        this.showToast('Caricate', `${loaded} immagini caricate con successo.`, 'success');
                    }
                } catch (err) {
                    this.showToast('Errore', 'Impossibile caricare l\'immagine. Spazio di archiviazione pieno?', 'error');
                    this.playSound('error');
                }
            };
            reader.onerror = () => {
                loaded++;
                if (loaded >= total) {
                    this.showToast('Errore', 'Si è verificato un errore durante il caricamento.', 'error');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    saveGallery(windowId) {
        try {
            localStorage.setItem('auraos_gallery', JSON.stringify(this.galleryImages[windowId] || []));
        } catch (e) {
            this.showToast('Errore', 'Spazio di archiviazione pieno. Elimina alcune immagini.', 'error');
        }
    }

    renderGalleryGrid(windowId) {
        const grid = document.getElementById(`gallery-grid-${windowId}`);
        const empty = document.getElementById(`gallery-empty-${windowId}`);
        const countEl = document.getElementById(`gallery-count-${windowId}`);
        if (!grid) return;

        const images = this.galleryImages[windowId] || [];
        if (countEl) countEl.textContent = `${images.length} immagine${images.length !== 1 ? 'e' : ''}`;

        if (images.length === 0) {
            if (empty) empty.style.display = 'flex';
            grid.innerHTML = '';
            return;
        }

        if (empty) empty.style.display = 'none';
        grid.innerHTML = images.map((img, index) => `
            <div class="gallery-item" onclick="app.openGalleryLightbox('${windowId}', ${index})">
                <img class="gallery-thumb" src="${img.dataUrl}" alt="${img.name}" loading="lazy">
                <div class="gallery-item-name">${img.name}</div>
                <button class="gallery-item-delete" onclick="event.stopPropagation(); app.deleteGalleryImage('${windowId}', ${index})" title="Elimina">🗑️</button>
            </div>
        `).join('');
    }

    openGalleryLightbox(windowId, index) {
        const images = this.galleryImages[windowId] || [];
        if (images.length === 0) return;

        this.stopGallerySlideshow(windowId);

        const overlay = document.createElement('div');
        overlay.className = 'gallery-lightbox';
        overlay.id = `gallery-lightbox-${windowId}`;
        overlay.innerHTML = `
            <button class="gallery-lightbox-close" onclick="app.closeGalleryLightbox('${windowId}')">✕</button>
            <button class="gallery-lightbox-nav gallery-lightbox-prev" onclick="app.galleryPrev('${windowId}')">‹</button>
            <img class="gallery-lightbox-img" id="gallery-lightbox-img-${windowId}" src="${images[index].dataUrl}" alt="${images[index].name}">
            <button class="gallery-lightbox-nav gallery-lightbox-next" onclick="app.galleryNext('${windowId}')">›</button>
            <div class="gallery-lightbox-info">
                <span id="gallery-lightbox-name-${windowId}">${images[index].name}</span>
                <span id="gallery-lightbox-counter-${windowId}">${index + 1} / ${images.length}</span>
            </div>
            <div class="gallery-lightbox-controls">
                <button class="gallery-slideshow-btn" id="gallery-slideshow-btn-${windowId}" onclick="app.toggleGallerySlideshow('${windowId}')">▶ Slideshow</button>
                <button class="gallery-slideshow-btn" onclick="app.deleteGalleryImage('${windowId}', ${index}); app.closeGalleryLightbox('${windowId}');">🗑️ Elimina</button>
            </div>
        `;

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeGalleryLightbox(windowId);
        });

        document.body.appendChild(overlay);
        this.galleryCurrentIndex[windowId] = index;

        const overlayEl = document.getElementById(`gallery-lightbox-${windowId}`);
        if (overlayEl) {
            overlayEl.addEventListener('mouseenter', () => {
                if (this.gallerySlideshow && this.gallerySlideshow[windowId]) {
                    clearInterval(this.gallerySlideshow[windowId]);
                    this.gallerySlideshow[windowId] = null;
                }
            });
            overlayEl.addEventListener('mouseleave', () => {
                if (this.gallerySlideshowActive && this.gallerySlideshowActive[windowId]) {
                    this.startGallerySlideshow(windowId);
                }
            });
        }

        document.addEventListener('keydown', this.galleryKeyHandler = (e) => {
            if (e.key === 'ArrowLeft') this.galleryPrev(windowId);
            if (e.key === 'ArrowRight') this.galleryNext(windowId);
            if (e.key === 'Escape') this.closeGalleryLightbox(windowId);
        });
    }

    closeGalleryLightbox(windowId) {
        this.stopGallerySlideshow(windowId);
        const overlay = document.getElementById(`gallery-lightbox-${windowId}`);
        if (overlay) overlay.remove();
        if (this.galleryKeyHandler) {
            document.removeEventListener('keydown', this.galleryKeyHandler);
            this.galleryKeyHandler = null;
        }
    }

    galleryNext(windowId) {
        const images = this.galleryImages[windowId] || [];
        if (images.length === 0) return;
        this.galleryCurrentIndex[windowId] = (this.galleryCurrentIndex[windowId] + 1) % images.length;
        this.updateGalleryLightbox(windowId);
    }

    galleryPrev(windowId) {
        const images = this.galleryImages[windowId] || [];
        if (images.length === 0) return;
        this.galleryCurrentIndex[windowId] = (this.galleryCurrentIndex[windowId] - 1 + images.length) % images.length;
        this.updateGalleryLightbox(windowId);
    }

    updateGalleryLightbox(windowId) {
        const images = this.galleryImages[windowId] || [];
        const idx = this.galleryCurrentIndex[windowId] || 0;
        const img = document.getElementById(`gallery-lightbox-img-${windowId}`);
        const nameEl = document.getElementById(`gallery-lightbox-name-${windowId}`);
        const counterEl = document.getElementById(`gallery-lightbox-counter-${windowId}`);
        if (img) img.src = images[idx].dataUrl;
        if (nameEl) nameEl.textContent = images[idx].name;
        if (counterEl) counterEl.textContent = `${idx + 1} / ${images.length}`;
    }

    toggleGallerySlideshow(windowId) {
        if (this.gallerySlideshowActive && this.gallerySlideshowActive[windowId]) {
            this.gallerySlideshowActive[windowId] = false;
            this.stopGallerySlideshow(windowId);
        } else {
            this.gallerySlideshowActive[windowId] = true;
            this.startGallerySlideshow(windowId);
        }
    }

    startGallerySlideshow(windowId) {
        const btn = document.getElementById(`gallery-slideshow-btn-${windowId}`);
        if (btn) btn.textContent = '⏸ Pausa';
        this.gallerySlideshow[windowId] = setInterval(() => {
            this.galleryNext(windowId);
        }, 3000);
    }

    stopGallerySlideshow(windowId) {
        if (this.gallerySlideshow && this.gallerySlideshow[windowId]) {
            clearInterval(this.gallerySlideshow[windowId]);
            this.gallerySlideshow[windowId] = null;
        }
        const btn = document.getElementById(`gallery-slideshow-btn-${windowId}`);
        if (btn) btn.textContent = '▶ Slideshow';
    }

    deleteGalleryImage(windowId, index) {
        const images = this.galleryImages[windowId] || [];
        if (index < 0 || index >= images.length) return;
        if (!confirm(`Eliminare "${images[index].name}"?`)) return;
        images.splice(index, 1);
        this.saveGallery(windowId);
        this.renderGalleryGrid(windowId);
        this.playSound('success');
        this.showToast('Eliminata', 'Immagine eliminata.', 'info');
    }

    // ===== Music Player App =====
    getMusicContent(windowId) {
        return `
            <div class="music-wrapper" id="music-${windowId}">
                <div class="music-sidebar">
                    <div class="music-sidebar-header">
                        <span class="music-sidebar-title">🎵 Playlist</span>
                        <label class="music-upload-btn">
                            + Aggiungi
                            <input type="file" accept="audio/*" multiple id="music-upload-${windowId}" style="display:none;">
                        </label>
                    </div>
                    <div class="music-playlist" id="music-playlist-${windowId}">
                        <div class="music-empty" id="music-empty-${windowId}">
                            <div class="music-empty-icon">🎵</div>
                            <div class="music-empty-text">Nessun brano</div>
                            <div class="music-empty-sub">Aggiungi file audio per iniziare</div>
                        </div>
                    </div>
                </div>
                <div class="music-main" id="music-main-${windowId}">
                    <div class="music-visualizer" id="music-visualizer-${windowId}">
                        ${Array.from({length: 24}, (_, i) => `<div class="music-visualizer-bar" style="animation-delay: ${i * 0.06}s; height: ${15 + Math.random() * 70}%;"></div>`).join('')}
                    </div>
                    <div class="music-now-playing">
                        <div class="music-now-playing-icon">🎵</div>
                        <div class="music-now-playing-name" id="music-track-name-${windowId}">Seleziona un brano</div>
                    </div>
                    <div class="music-controls">
                        <button class="music-btn" id="music-prev-${windowId}" onclick="app.prevMusicTrack('${windowId}')">⏮</button>
                        <button class="music-btn music-btn-play" id="music-play-${windowId}" onclick="app.toggleMusicPlay('${windowId}')">▶</button>
                        <button class="music-btn" id="music-next-${windowId}" onclick="app.nextMusicTrack('${windowId}')">⏭</button>
                    </div>
                    <div class="music-progress-wrapper">
                        <span class="music-time" id="music-current-time-${windowId}">0:00</span>
                        <div class="music-progress" id="music-progress-${windowId}" onclick="app.seekMusic('${windowId}', event)">
                            <div class="music-progress-fill" id="music-progress-fill-${windowId}"></div>
                        </div>
                        <span class="music-time" id="music-total-time-${windowId}">0:00</span>
                    </div>
                    <div class="music-extra-controls">
                        <button class="music-btn music-btn-small" id="music-shuffle-${windowId}" onclick="app.toggleShuffle('${windowId}')">🔀</button>
                        <button class="music-btn music-btn-small" id="music-repeat-${windowId}" onclick="app.toggleRepeat('${windowId}')">🔁</button>
                        <div class="music-volume">
                            <span class="music-volume-icon">🔊</span>
                            <input type="range" class="music-volume-slider" id="music-volume-${windowId}" min="0" max="100" value="80" oninput="app.setVolume('${windowId}', this.value)">
                        </div>
                    </div>
                    <audio id="music-audio-${windowId}" preload="auto" style="position:absolute;width:0;height:0;overflow:hidden;"></audio>
                </div>
            </div>
        `;
    }

    initMusic(windowId) {
        const uploadInput = document.getElementById(`music-upload-${windowId}`);
        const audio = document.getElementById(`music-audio-${windowId}`);
        if (!uploadInput || !audio) return;

        this.musicTracks = this.musicTracks || {};
        this.musicTracks[windowId] = [];
        this.musicAudio = this.musicAudio || {};
        this.musicAudio[windowId] = audio;
        this.musicCurrentIndex = this.musicCurrentIndex || {};
        this.musicCurrentIndex[windowId] = -1;
        this.musicShuffle = this.musicShuffle || {};
        this.musicShuffle[windowId] = false;
        this.musicRepeat = this.musicRepeat || {};
        this.musicRepeat[windowId] = false;

        const saved = localStorage.getItem('auraos_music');
        if (saved) {
            try {
                this.musicTracks[windowId] = JSON.parse(saved);
            } catch (e) {
                this.musicTracks[windowId] = [];
            }
        }

        this.renderMusicPlaylist(windowId);

        audio.addEventListener('timeupdate', () => this.updateMusicProgress(windowId));
        audio.addEventListener('ended', () => this.handleMusicEnded(windowId));
        audio.addEventListener('loadedmetadata', () => {
            const totalEl = document.getElementById(`music-total-time-${windowId}`);
            if (totalEl) totalEl.textContent = this.formatTime(audio.duration);
        });

        uploadInput.addEventListener('change', (e) => {
            this.handleMusicUpload(windowId, e.target.files);
            uploadInput.value = '';
        });
    }

    handleMusicUpload(windowId, files) {
        if (!files || files.length === 0) return;
        const tracks = this.musicTracks[windowId] || [];
        let loaded = 0;
        const total = files.length;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('audio/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    tracks.push({
                        id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
                        name: file.name.replace(/\.[^/.]+$/, ''),
                        dataUrl: e.target.result,
                        size: file.size,
                        date: Date.now(),
                    });
                    loaded++;
                    if (loaded >= total) {
                        this.saveMusic(windowId);
                        this.renderMusicPlaylist(windowId);
                        this.playSound('success');
                        this.showToast('Caricati', `${loaded} brani caricati con successo.`, 'success');
                    }
                } catch (err) {
                    this.showToast('Errore', 'Impossibile caricare il brano. Spazio di archiviazione pieno?', 'error');
                    this.playSound('error');
                }
            };
            reader.onerror = () => {
                loaded++;
                if (loaded >= total) {
                    this.showToast('Errore', 'Si è verificato un errore durante il caricamento.', 'error');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    saveMusic(windowId) {
        try {
            localStorage.setItem('auraos_music', JSON.stringify(this.musicTracks[windowId] || []));
        } catch (e) {
            this.showToast('Errore', 'Spazio di archiviazione pieno. Elimina alcuni brani.', 'error');
        }
    }

    renderMusicPlaylist(windowId) {
        const playlist = document.getElementById(`music-playlist-${windowId}`);
        const empty = document.getElementById(`music-empty-${windowId}`);
        if (!playlist) return;

        const tracks = this.musicTracks[windowId] || [];
        const currentIndex = this.musicCurrentIndex[windowId] || -1;

        if (tracks.length === 0) {
            if (empty) {
                empty.style.display = 'flex';
                playlist.innerHTML = '';
                playlist.appendChild(empty);
            }
            return;
        }

        if (empty) empty.style.display = 'none';
        playlist.innerHTML = tracks.map((track, index) => `
            <div class="music-track-item ${index === currentIndex ? 'playing' : ''}" onclick="app.playMusicTrack('${windowId}', ${index})">
                <div class="music-track-info">
                    <div class="music-track-name">${track.name}</div>
                </div>
                <button class="music-track-delete" onclick="event.stopPropagation(); app.deleteMusicTrack('${windowId}', ${index})" title="Elimina">✕</button>
            </div>
        `).join('');
    }

    playMusicTrack(windowId, index) {
        const tracks = this.musicTracks[windowId] || [];
        if (index < 0 || index >= tracks.length) return;
        const audio = this.musicAudio[windowId];
        if (!audio) return;

        if (this.musicCurrentIndex[windowId] === index && !audio.paused) {
            this.pauseMusic(windowId);
            return;
        }

        this.musicCurrentIndex[windowId] = index;
        audio.src = tracks[index].dataUrl;
        audio.play().then(() => {
            this.updateMusicUI(windowId);
            this.renderMusicPlaylist(windowId);
        }).catch(() => {
            this.showToast('Errore', 'Impossibile riprodurre il brano.', 'error');
        });
    }

    pauseMusic(windowId) {
        const audio = this.musicAudio[windowId];
        if (!audio) return;
        audio.pause();
        this.updateMusicUI(windowId);
    }

    toggleMusicPlay(windowId) {
        const audio = this.musicAudio[windowId];
        if (!audio) return;
        if (audio.paused) {
            if (!audio.src || audio.src === window.location.href) {
                const tracks = this.musicTracks[windowId] || [];
                if (tracks.length > 0) {
                    this.playMusicTrack(windowId, 0);
                    return;
                }
            }
            audio.play().catch(() => {});
        } else {
            this.pauseMusic(windowId);
        }
        this.updateMusicUI(windowId);
    }

    nextMusicTrack(windowId) {
        const tracks = this.musicTracks[windowId] || [];
        if (tracks.length === 0) return;
        let index = this.musicCurrentIndex[windowId] || 0;
        if (this.musicShuffle[windowId]) {
            index = Math.floor(Math.random() * tracks.length);
        } else {
            index = (index + 1) % tracks.length;
        }
        this.playMusicTrack(windowId, index);
    }

    prevMusicTrack(windowId) {
        const tracks = this.musicTracks[windowId] || [];
        if (tracks.length === 0) return;
        let index = this.musicCurrentIndex[windowId] || 0;
        if (this.musicShuffle[windowId]) {
            index = Math.floor(Math.random() * tracks.length);
        } else {
            index = (index - 1 + tracks.length) % tracks.length;
        }
        this.playMusicTrack(windowId, index);
    }

    seekMusic(windowId, e) {
        const audio = this.musicAudio[windowId];
        const progress = document.getElementById(`music-progress-${windowId}`);
        if (!audio || !progress || !audio.duration) return;
        const rect = progress.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * audio.duration;
    }

    setVolume(windowId, value) {
        const audio = this.musicAudio[windowId];
        if (audio) audio.volume = value / 100;
    }

    toggleShuffle(windowId) {
        this.musicShuffle[windowId] = !this.musicShuffle[windowId];
        const btn = document.getElementById(`music-shuffle-${windowId}`);
        if (btn) btn.classList.toggle('active', this.musicShuffle[windowId]);
    }

    toggleRepeat(windowId) {
        this.musicRepeat[windowId] = !this.musicRepeat[windowId];
        const btn = document.getElementById(`music-repeat-${windowId}`);
        if (btn) btn.classList.toggle('active', this.musicRepeat[windowId]);
    }

    handleMusicEnded(windowId) {
        if (this.musicRepeat[windowId]) {
            const audio = this.musicAudio[windowId];
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
            }
        } else {
            this.nextMusicTrack(windowId);
        }
    }

    updateMusicProgress(windowId) {
        const audio = this.musicAudio[windowId];
        if (!audio || !audio.duration) return;
        const fill = document.getElementById(`music-progress-fill-${windowId}`);
        const currentEl = document.getElementById(`music-current-time-${windowId}`);
        if (fill) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
        if (currentEl) currentEl.textContent = this.formatTime(audio.currentTime);
    }

    updateMusicUI(windowId) {
        const audio = this.musicAudio[windowId];
        if (!audio) return;
        const playBtn = document.getElementById(`music-play-${windowId}`);
        if (playBtn) playBtn.textContent = audio.paused ? '▶' : '⏸';
        const visualizer = document.getElementById(`music-visualizer-${windowId}`);
        if (visualizer) visualizer.classList.toggle('paused', audio.paused);
    }

    deleteMusicTrack(windowId, index) {
        const tracks = this.musicTracks[windowId] || [];
        if (index < 0 || index >= tracks.length) return;
        if (!confirm(`Eliminare "${tracks[index].name}"?`)) return;

        const wasPlaying = (this.musicCurrentIndex[windowId] === index) && this.musicAudio[windowId] && !this.musicAudio[windowId].paused;
        if (wasPlaying) this.pauseMusic(windowId);

        tracks.splice(index, 1);
        if (this.musicCurrentIndex[windowId] >= tracks.length) {
            this.musicCurrentIndex[windowId] = Math.max(0, tracks.length - 1);
        }
        this.saveMusic(windowId);
        this.renderMusicPlaylist(windowId);
        this.playSound('success');
        this.showToast('Eliminato', 'Brano eliminato dalla playlist.', 'info');
    }

    formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // ===== Desktop Widgets System =====
    initWidgets() {
        const container = document.getElementById('widgets-container');
        if (!container) return;
        container.innerHTML = '';
        this.state.widgets = [];
        const saved = localStorage.getItem('auraos_widgets');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    parsed.forEach(w => {
                        if (w.type === 'weather') this.createWeatherWidget(w.x, w.y);
                        else if (w.type === 'system') this.createSystemMonitorWidget(w.x, w.y);
                        else if (w.type === 'clock') this.createClockWidget(w.x, w.y);
                        else if (w.type === 'notes') this.createStickyNotesWidget(w.x, w.y);
                        else if (w.type === 'quick-note') this.createQuickNoteWidget(w.x, w.y);
                    });
                }
            } catch (e) { this.state.widgets = []; }
        }
    }

    getDefaultWidgetPositions() {
        return {
            weather: { x: 'calc(100vw - 280px)', y: 'calc(var(--top-bar-height) + 18px)' },
            system: { x: '18px', y: 'calc(var(--top-bar-height) + 18px)' },
            clock: { x: 'calc(100vw - 230px)', y: 'calc(100vh - var(--dock-height) - 230px)' },
            notes: { x: '18px', y: 'calc(var(--top-bar-height) + 200px)' },
            'quick-note': { x: 'calc(100vw - 275px)', y: 'calc(var(--top-bar-height) + 200px)' },
        };
    }

    getWidgetPosition(type) {
        const defaults = this.getDefaultWidgetPositions();
        const widget = this.state.widgets.find(w => w.type === type);
        if (widget && widget.x != null && widget.y != null) {
            return { x: widget.x, y: widget.y };
        }
        return defaults[type] || { x: '18px', y: '100px' };
    }

    createWeatherWidget(x, y) {
        const pos = this.getWidgetPosition('weather');
        const finalX = x != null ? x : pos.x;
        const finalY = y != null ? y : pos.y;
        const id = 'widget-weather-' + Date.now();
        const widget = {
            id, type: 'weather', x: finalX, y: finalY,
            data: JSON.parse(localStorage.getItem('auraos_weather') || 'null'),
        };
        if (!widget.data) widget.data = this.generateWeatherData();
        this.state.widgets.push(widget);

        const el = document.createElement('div');
        el.className = 'widget widget-weather';
        el.id = id;
        el.style.left = finalX;
        el.style.top = finalY;
        el.innerHTML = this.getWeatherWidgetHTML(widget.data);
        document.getElementById('widgets-container').appendChild(el);
        this.attachWidgetListeners(el, id);

        const refreshBtn = el.querySelector('.weather-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                widget.data = this.generateWeatherData();
                localStorage.setItem('auraos_weather', JSON.stringify(widget.data));
                el.innerHTML = this.getWeatherWidgetHTML(widget.data);
                this.attachWidgetListeners(el, id);
                this.playSound('success');
            });
        }

        const hourlyToggle = el.querySelector('.weather-hourly-toggle');
        if (hourlyToggle) {
            hourlyToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const forecast = el.querySelector('.weather-hourly-forecast');
                if (forecast) forecast.classList.toggle('visible');
            });
        }
        this.saveWidgetsPosition();
    }

    getWeatherWidgetHTML(data) {
        const forecastHTML = data.forecast.map(d => `
            <div class="weather-forecast-day">
                <span class="weather-forecast-day-name">${d.day}</span>
                <span class="weather-forecast-icon">${d.icon}</span>
                <span class="weather-forecast-temps">${d.tempHigh}°/${d.tempLow}°</span>
            </div>
        `).join('');
        const hourlyHTML = (data.hourly || []).map(h => `
            <div class="weather-hourly-row">
                <span class="weather-hourly-time">${h.time}</span>
                <span class="weather-hourly-icon">${h.icon}</span>
                <span class="weather-hourly-temp">${h.temp}°C</span>
            </div>
        `).join('');
        return `
            <div class="widget-header">
                <div class="widget-header-left">
                    <span class="widget-header-icon">🌤️</span>
                    <span class="widget-title">Meteo</span>
                </div>
                <div class="widget-controls">
                    <button class="widget-ctrl-btn weather-refresh-btn" title="Aggiorna">🔄</button>
                    <button class="widget-ctrl-btn widget-close-btn" title="Rimuovi" data-action="remove">✕</button>
                </div>
            </div>
            <div class="widget-content">
                <div class="weather-main">
                    <span class="weather-icon">${data.icon}</span>
                    <span class="weather-temp">${data.temp}°C</span>
                    <span class="weather-condition">${data.condition}</span>
                </div>
                <div class="weather-location">📍 ${data.city}, ${data.country}</div>
                <div class="weather-details">
                    <span>💧 ${data.humidity}%</span>
                    <span>💨 ${data.wind} km/h</span>
                </div>
                <div class="weather-forecast-title">Previsioni</div>
                <div class="weather-forecast-days">${forecastHTML}</div>
                ${data.hourly && data.hourly.length > 0 ? `
                    <button class="weather-hourly-toggle">🕐 Orarie</button>
                    <div class="weather-hourly-forecast">${hourlyHTML}</div>
                ` : ''}
            </div>
        `;
    }

    generateWeatherData() {
        const conditions = [
            { icon: '☀️', label: 'Soleggiato', tempRange: [22, 35] },
            { icon: '⛅', label: 'Nuvoloso', tempRange: [18, 28] },
            { icon: '🌧️', label: 'Pioggia', tempRange: [12, 22] },
            { icon: '⛈️', label: 'Temporale', tempRange: [15, 25] },
            { icon: '❄️', label: 'Neve', tempRange: [-5, 5] },
        ];
        const cities = [
            { name: 'Roma', country: 'Italia' },
            { name: 'Milano', country: 'Italia' },
            { name: 'Napoli', country: 'Italia' },
            { name: 'Torino', country: 'Italia' },
            { name: 'Firenze', country: 'Italia' },
        ];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const temp = Math.floor(Math.random() * (condition.tempRange[1] - condition.tempRange[0])) + condition.tempRange[0];
        const forecast = [];
        const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
        const today = new Date().getDay();
        for (let i = 1; i <= 5; i++) {
            const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];
            forecast.push({
                day: days[(today + i) % 7],
                icon: dayCondition.icon,
                tempHigh: Math.floor(Math.random() * (dayCondition.tempRange[1] - dayCondition.tempRange[0])) + dayCondition.tempRange[0],
                tempLow: Math.floor(Math.random() * 5) + Math.floor(condition.tempRange[0] / 2),
            });
        }
        const hourly = [];
        const now = new Date().getHours();
        const hourIcons = { morning: '🌅', midday: '☀️', afternoon: '⛅', evening: '🌙', night: '🌙' };
        for (let i = 0; i < 6; i++) {
            const h = (now + i) % 24;
            const hTemp = temp + Math.floor(Math.random() * 5) - 2;
            const icon = h >= 6 && h < 12 ? hourIcons.morning : h >= 12 && h < 17 ? hourIcons.midday : h >= 17 && h < 20 ? hourIcons.evening : h >= 20 || h < 6 ? hourIcons.night : hourIcons.midday;
            hourly.push({ time: `${h.toString().padStart(2, '0')}:00`, icon, temp: hTemp });
        }
        return {
            city: city.name, country: city.country,
            condition: condition.label, icon: condition.icon, temp,
            humidity: Math.floor(Math.random() * 60) + 30,
            wind: Math.floor(Math.random() * 20) + 5,
            forecast, hourly,
        };
    }

    createSystemMonitorWidget(x, y) {
        const pos = this.getWidgetPosition('system');
        const finalX = x != null ? x : pos.x;
        const finalY = y != null ? y : pos.y;
        const id = 'widget-system-' + Date.now();
        const widget = { id, type: 'system', x: finalX, y: finalY };
        this.state.widgets.push(widget);

        const el = document.createElement('div');
        el.className = 'widget widget-system';
        el.id = id;
        el.style.left = finalX;
        el.style.top = finalY;
        el.innerHTML = `
            <div class="widget-header">
                <div class="widget-header-left">
                    <span class="widget-header-icon">📊</span>
                    <span class="widget-title">Sistema</span>
                </div>
                <div class="widget-controls">
                    <button class="widget-ctrl-btn widget-close-btn" title="Rimuovi" data-action="remove">✕</button>
                </div>
            </div>
            <div class="widget-content">
                <div class="sys-stat">
                    <div class="sys-stat-header">
                        <span class="sys-stat-label">CPU</span>
                        <span class="sys-stat-value" id="${id}-cpu">0%</span>
                    </div>
                    <div class="sys-stat-bar-bg">
                        <div class="sys-stat-bar" id="${id}-cpu-bar" style="width:0%"></div>
                    </div>
                </div>
                <div class="sys-stat">
                    <div class="sys-stat-header">
                        <span class="sys-stat-label">RAM</span>
                        <span class="sys-stat-value" id="${id}-ram">0%</span>
                    </div>
                    <div class="sys-stat-bar-bg">
                        <div class="sys-stat-bar" id="${id}-ram-bar" style="width:0%"></div>
                    </div>
                </div>
                <div class="sys-stat">
                    <div class="sys-stat-header">
                        <span class="sys-stat-label">Disco</span>
                        <span class="sys-stat-value" id="${id}-disk">0%</span>
                    </div>
                    <div class="sys-stat-bar-bg">
                        <div class="sys-stat-bar" id="${id}-disk-bar" style="width:0%"></div>
                    </div>
                </div>
                <div class="sys-network">
                    <span>⬇ <span class="sys-network-speed" id="${id}-down">0 KB/s</span></span>
                    <span>⬆ <span class="sys-network-speed" id="${id}-up">0 KB/s</span></span>
                </div>
            </div>
        `;
        document.getElementById('widgets-container').appendChild(el);
        this.attachWidgetListeners(el, id);

        const updateStats = () => {
            const cpuVal = Math.floor(Math.random() * 60 + 10);
            const ramVal = Math.floor(Math.random() * 50 + 30);
            const diskVal = Math.floor(Math.random() * 30 + 40);
            const downSpeed = (Math.random() * 5 + 0.1).toFixed(1);
            const upSpeed = (Math.random() * 2 + 0.05).toFixed(1);

            const cpuEl = document.getElementById(`${id}-cpu`);
            const ramEl = document.getElementById(`${id}-ram`);
            const diskEl = document.getElementById(`${id}-disk`);
            const cpuBar = document.getElementById(`${id}-cpu-bar`);
            const ramBar = document.getElementById(`${id}-ram-bar`);
            const diskBar = document.getElementById(`${id}-disk-bar`);
            const downEl = document.getElementById(`${id}-down`);
            const upEl = document.getElementById(`${id}-up`);

            if (cpuEl) cpuEl.textContent = cpuVal + '%';
            if (ramEl) ramEl.textContent = ramVal + '%';
            if (diskEl) diskEl.textContent = diskVal + '%';
            if (cpuBar) { cpuBar.style.width = cpuVal + '%'; cpuBar.className = 'sys-stat-bar' + (cpuVal > 80 ? ' critical' : cpuVal > 60 ? ' warning' : ''); }
            if (ramBar) { ramBar.style.width = ramVal + '%'; ramBar.className = 'sys-stat-bar' + (ramVal > 85 ? ' critical' : ramVal > 70 ? ' warning' : ''); }
            if (diskBar) { diskBar.style.width = diskVal + '%'; diskBar.className = 'sys-stat-bar' + (diskVal > 90 ? ' critical' : diskVal > 75 ? ' warning' : ''); }
            if (downEl) downEl.textContent = downSpeed + ' MB/s';
            if (upEl) upEl.textContent = upSpeed + ' MB/s';
        };
        updateStats();
        this['_sysInterval_' + id] = setInterval(() => {
            if (document.getElementById(id)) updateStats();
            else clearInterval(this['_sysInterval_' + id]);
        }, 2000);
        this.saveWidgetsPosition();
    }

    createClockWidget(x, y) {
        const pos = this.getWidgetPosition('clock');
        const finalX = x != null ? x : pos.x;
        const finalY = y != null ? y : pos.y;
        const id = 'widget-clock-' + Date.now();
        const widget = { id, type: 'clock', x: finalX, y: finalY };
        this.state.widgets.push(widget);

        const el = document.createElement('div');
        el.className = 'widget widget-clock';
        el.id = id;
        el.style.left = finalX;
        el.style.top = finalY;
        el.innerHTML = `
            <div class="widget-header">
                <div class="widget-header-left">
                    <span class="widget-header-icon">🕐</span>
                    <span class="widget-title">Ora</span>
                </div>
                <div class="widget-controls">
                    <button class="widget-ctrl-btn widget-close-btn" title="Rimuovi" data-action="remove">✕</button>
                </div>
            </div>
            <div class="widget-content">
                <div class="clock-time" id="${id}-time"></div>
                <div class="clock-date" id="${id}-date"></div>
                <div class="clock-calendar" id="${id}-calendar"></div>
            </div>
        `;
        document.getElementById('widgets-container').appendChild(el);
        this.attachWidgetListeners(el, id);

        const update = () => {
            const now = new Date();
            const timeEl = document.getElementById(`${id}-time`);
            const dateEl = document.getElementById(`${id}-date`);
            if (timeEl) timeEl.textContent = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            if (dateEl) dateEl.textContent = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
        };
        update();
        this['_clockInterval_' + id] = setInterval(() => { if (document.getElementById(id)) update(); else clearInterval(this['_clockInterval_' + id]); }, 1000);

        el.querySelector('.widget-content').addEventListener('click', (e) => {
            e.stopPropagation();
            const cal = document.getElementById(`${id}-calendar`);
            if (!cal) return;
            cal.classList.toggle('visible');
            if (cal.classList.contains('visible')) this.renderWidgetCalendar(id);
        });
        this.saveWidgetsPosition();
    }

    renderWidgetCalendar(widgetId) {
        const cal = document.getElementById(`${widgetId}-calendar`);
        if (!cal) return;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const monthNames = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];
        const dayNames = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
        let cells = '';
        for (let i = 0; i < firstDay; i++) cells += '<div class="cal-cell cal-empty"></div>';
        for (let d = 1; d <= daysInMonth; d++) {
            const cls = d === today ? 'cal-cell cal-today' : 'cal-cell';
            cells += `<div class="${cls}">${d}</div>`;
        }
        cal.innerHTML = `
            <div class="calendar-month">${monthNames[month]} ${year}</div>
            <div class="calendar-weekdays">${dayNames.map(d => `<div class="cal-weekday">${d}</div>`).join('')}</div>
            <div class="calendar-grid">${cells}</div>
        `;
    }

    createStickyNotesWidget(x, y) {
        const pos = this.getWidgetPosition('notes');
        const finalX = x != null ? x : pos.x;
        const finalY = y != null ? y : pos.y;
        const id = 'widget-notes-' + Date.now();
        const widget = { id, type: 'notes', x: finalX, y: finalY, data: { notes: [], color: 'yellow' } };
        const savedNotes = localStorage.getItem('auraos_widget_notes');
        if (savedNotes) {
            try { widget.data.notes = JSON.parse(savedNotes); } catch (e) { widget.data.notes = []; }
        }
        this.state.widgets.push(widget);

        const el = document.createElement('div');
        el.className = 'widget widget-notes';
        el.id = id;
        el.style.left = finalX;
        el.style.top = finalY;
        el.innerHTML = `
            <div class="widget-header">
                <div class="widget-header-left">
                    <span class="widget-header-icon">📝</span>
                    <span class="widget-title">Note</span>
                </div>
                <div class="widget-controls">
                    <button class="widget-ctrl-btn widget-close-btn" title="Rimuovi" data-action="remove">✕</button>
                </div>
            </div>
            <div class="widget-content">
                <div class="notes-color-picker">
                    <div class="notes-color-swatch active" data-color="yellow" style="background:#fef9c3;" title="Giallo"></div>
                    <div class="notes-color-swatch" data-color="blue" style="background:#dbeafe;" title="Blu"></div>
                    <div class="notes-color-swatch" data-color="green" style="background:#dcfce7;" title="Verde"></div>
                    <div class="notes-color-swatch" data-color="pink" style="background:#fce7f3;" title="Rosa"></div>
                </div>
                <div class="notes-list" id="${id}-list"></div>
                <div class="note-add-row">
                    <input type="text" class="note-input" id="${id}-input" placeholder="Nuova nota..." maxlength="200">
                    <button class="note-add-btn" id="${id}-add-btn" title="Aggiungi">+</button>
                </div>
            </div>
        `;
        document.getElementById('widgets-container').appendChild(el);
        this.attachWidgetListeners(el, id);

        const w = this.state.widgets.find(w => w.id === id);
        const renderNotes = () => {
            const list = document.getElementById(`${id}-list`);
            if (!list || !w) return;
            if (w.data.notes.length === 0) {
                list.innerHTML = '<div class="notes-empty">Nessuna nota</div>';
                return;
            }
            list.innerHTML = w.data.notes.map((note, idx) => `
                <div class="sticky-note note-${note.color || 'yellow'}" data-idx="${idx}">
                    <div style="padding-right:16px;cursor:default;">${this.escapeHtml(note.text)}</div>
                    <button class="note-delete-btn" data-delete="${idx}" title="Elimina">✕</button>
                </div>
            `).join('');
            list.querySelectorAll('.note-delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.dataset.delete);
                    if (w && w.data.notes[idx]) {
                        w.data.notes.splice(idx, 1);
                        this.saveWidgetNotes(id);
                        renderNotes();
                    }
                });
            });
        };
        renderNotes();

        const input = document.getElementById(`${id}-input`);
        const addBtn = document.getElementById(`${id}-add-btn`);
        const addNote = () => {
            if (!input || !w) return;
            const text = input.value.trim();
            if (!text) return;
            w.data.notes.unshift({ text, color: w.data.color || 'yellow', createdAt: Date.now() });
            input.value = '';
            this.saveWidgetNotes(id);
            renderNotes();
            this.playSound('success');
        };
        if (addBtn) addBtn.addEventListener('click', (e) => { e.stopPropagation(); addNote(); });
        if (input) {
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.stopPropagation(); addNote(); } });
            input.addEventListener('click', (e) => e.stopPropagation());
        }

        el.querySelectorAll('.notes-color-swatch').forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!w) return;
                w.data.color = swatch.dataset.color;
                el.querySelectorAll('.notes-color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                this.saveWidgetNotes(id);
            });
        });
        this.saveWidgetsPosition();
    }

    createQuickNoteWidget(x, y) {
        const pos = this.getWidgetPosition('quick-note');
        const finalX = x != null ? x : pos.x;
        const finalY = y != null ? y : pos.y;
        const id = 'widget-quicknote-' + Date.now();
        const widget = { id, type: 'quick-note', x: finalX, y: finalY, data: { text: '' } };
        const saved = localStorage.getItem('auraos_quick_note');
        if (saved) widget.data.text = saved;
        this.state.widgets.push(widget);

        const el = document.createElement('div');
        el.className = 'widget widget-quick-note';
        el.id = id;
        el.style.left = finalX;
        el.style.top = finalY;
        el.innerHTML = `
            <div class="widget-header">
                <div class="widget-header-left">
                    <span class="widget-header-icon">📌</span>
                    <span class="widget-title">Nota rapida</span>
                </div>
                <div class="widget-controls">
                    <button class="widget-ctrl-btn widget-close-btn" title="Rimuovi" data-action="remove">✕</button>
                </div>
            </div>
            <div class="widget-content">
                <textarea class="quick-note-area" id="${id}-area" placeholder="Scrivi la tua nota...">${widget.data.text || ''}</textarea>
                <div class="quick-note-status" id="${id}-status">Salvato automaticamente</div>
            </div>
        `;
        document.getElementById('widgets-container').appendChild(el);
        this.attachWidgetListeners(el, id);

        const area = document.getElementById(`${id}-area`);
        if (area) {
            let saveTimeout;
            area.addEventListener('input', () => {
                const statusEl = document.getElementById(`${id}-status`);
                if (statusEl) statusEl.textContent = 'Salvataggio...';
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    const w2 = this.state.widgets.find(w => w.id === id);
                    if (w2) w2.data.text = area.value;
                    localStorage.setItem('auraos_quick_note', area.value);
                    if (statusEl) statusEl.textContent = 'Salvato ✓';
                }, 600);
            });
            area.addEventListener('click', (e) => e.stopPropagation());
        }
        this.saveWidgetsPosition();
    }

    attachWidgetListeners(el, widgetId) {
        this.makeWidgetDraggable(el, widgetId);
        el.querySelectorAll('[data-action="remove"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeWidget(widgetId);
            });
        });
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showWidgetContextMenu(e.clientX, e.clientY, widgetId);
        });
    }

    makeWidgetDraggable(widgetEl, widgetId) {
        const header = widgetEl.querySelector('.widget-header');
        if (!header) return;

        const existing = widgetEl._dragHandlers;
        if (existing) {
            document.removeEventListener('mousemove', existing.onMouseMove);
            document.removeEventListener('mouseup', existing.onMouseUp);
        }

        let isDragging = false;
        let startX, startY, initialX, initialY;
        let hasMoved = false;

        const onMouseMove = (e) => {
            if (!isDragging) return;
            hasMoved = true;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            widgetEl.style.left = Math.max(0, initialX + dx) + 'px';
            widgetEl.style.top = Math.max(36, initialY + dy) + 'px';
        };

        const onMouseUp = () => {
            if (!isDragging) return;
            isDragging = false;
            widgetEl.style.transition = '';
            widgetEl.style.zIndex = '';
            if (hasMoved) {
                const w = this.state.widgets.find(w => w.id === widgetId);
                if (w) { w.x = widgetEl.style.left; w.y = widgetEl.style.top; }
                this.saveWidgetsPosition();
            }
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.widget-ctrl-btn') || e.target.closest('.notes-color-swatch') || e.target.closest('.note-input') || e.target.closest('.note-add-btn') || e.target.closest('.note-delete-btn')) return;
            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            initialX = widgetEl.offsetLeft;
            initialY = widgetEl.offsetTop;
            widgetEl.style.transition = 'none';
            widgetEl.style.zIndex = '50';
            e.preventDefault();
        });

        widgetEl._dragHandlers = { onMouseMove, onMouseUp };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    saveWidgetsPosition() {
        try {
            localStorage.setItem('auraos_widgets', JSON.stringify(this.state.widgets || []));
        } catch (e) {}
    }

    loadWidgetsPosition() {
        this.initWidgets();
    }

    removeWidget(widgetId) {
        const el = document.getElementById(widgetId);
        if (el) {
            el.classList.add('widget-removing');
            if (this['_sysInterval_' + widgetId]) { clearInterval(this['_sysInterval_' + widgetId]); delete this['_sysInterval_' + widgetId]; }
            if (this['_clockInterval_' + widgetId]) { clearInterval(this['_clockInterval_' + widgetId]); delete this['_clockInterval_' + widgetId]; }
            setTimeout(() => el.remove(), 250);
        }
        this.state.widgets = (this.state.widgets || []).filter(w => w.id !== widgetId);
        this.saveWidgetsPosition();
    }

    showWidgetContextMenu(x, y, widgetId) {
        this.hideContextMenu();
        const menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.className = 'context-menu';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.innerHTML = `
            <div class="context-menu-item danger" data-action="remove-widget" data-wid="${widgetId}">🗑️ Rimuovi widget</div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="bring-front" data-wid="${widgetId}">⬆️ Porta in primo piano</div>
        `;
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                const wid = item.dataset.wid;
                if (action === 'remove-widget') this.removeWidget(wid);
                else if (action === 'bring-front') {
                    const widgetEl = document.getElementById(wid);
                    if (widgetEl) { widgetEl.style.zIndex = '60'; setTimeout(() => widgetEl.style.zIndex = '', 1000); }
                }
                this.hideContextMenu();
            });
        });
        document.body.appendChild(menu);
        this.state.contextMenuOpen = true;
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 5) + 'px';
        if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 5) + 'px';
    }

    saveWidgetNotes(widgetId) {
        const w = this.state.widgets.find(w => w.id === widgetId);
        if (w && w.data && w.data.notes) {
            try { localStorage.setItem('auraos_widget_notes', JSON.stringify(w.data.notes)); } catch (e) {}
        }
    }

    // ===== Widget Start Menu Section =====
    addWidgetStartMenuItems() {
        const container = document.getElementById('start-menu-items');
        if (!container) return;
        const separator = container.querySelector('.start-menu-separator');
        if (!separator) return;
        if (container.querySelector('.widget-start-menu-section')) return;

        const section = document.createElement('div');
        section.className = 'widget-start-menu-section';
        section.innerHTML = `
            <div style="padding:6px 14px 4px;font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;font-family:var(--font-family);">Widget</div>
            <button class="start-menu-item" data-widget-type="weather" onclick="app.createWeatherWidget()">
                <span class="start-menu-icon">🌤️</span>
                <span>Meteo</span>
            </button>
            <button class="start-menu-item" data-widget-type="system" onclick="app.createSystemMonitorWidget()">
                <span class="start-menu-icon">📊</span>
                <span>Monitor Sistema</span>
            </button>
            <button class="start-menu-item" data-widget-type="clock" onclick="app.createClockWidget()">
                <span class="start-menu-icon">🕐</span>
                <span>Orologio</span>
            </button>
            <button class="start-menu-item" data-widget-type="notes" onclick="app.createStickyNotesWidget()">
                <span class="start-menu-icon">📝</span>
                <span>Note Adesive</span>
            </button>
            <button class="start-menu-item" data-widget-type="quick-note" onclick="app.createQuickNoteWidget()">
                <span class="start-menu-icon">📌</span>
                <span>Nota Rapida</span>
            </button>
        `;
        container.insertBefore(section, separator);
    }

    // ===== Existing methods continued below... =====
    toggleActivities(forceState = null) {
        const overlay = document.getElementById('activities-overlay');
        if (forceState !== null) {
            this.state.activitiesOpen = forceState;
        } else {
            this.state.activitiesOpen = !this.state.activitiesOpen;
        }
        if (this.state.activitiesOpen) {
            if (overlay) overlay.classList.remove('hidden');
            this.renderActivitiesWindows();
            this.renderWorkspaceOverview();
            this.playSound('open');
        } else {
            if (overlay) overlay.classList.add('hidden');
            this.hideWorkspaceContextMenu();
        }
    }

    renderActivitiesWindows() {
        const container = document.getElementById('activities-windows');
        if (!container) return;
        const workspaceWindows = this.state.openWindows.filter(w => w.workspaceId === this.state.currentWorkspace);
        if (workspaceWindows.length === 0) {
            container.innerHTML = '<div class="activities-empty">Nessuna finestra aperta in questo spazio</div>';
            return;
        }
        container.innerHTML = workspaceWindows.map(w => {
            const isActive = this.state.activeWindow === w.id;
            return `
                <div class="activities-window-thumb ${isActive ? 'active' : ''}" onclick="app.focusWindow('${w.id}'); app.toggleActivities(false);">
                    <div class="activities-window-thumb-header">
                        <span>${w.icon}</span>
                        <span>${w.title}</span>
                    </div>
                    <div class="activities-window-thumb-body"></div>
                </div>
            `;
        }).join('');
    }

    renderActivitiesWorkspaces() {
        // Legacy method - workspace switching now handled by renderWorkspaceOverview
    }

    switchWorkspace(num) {
        if (num < 1 || num > this.state.workspaces.length) return;
        this.state.currentWorkspace = num;
        this.renderActivitiesWindows();
        this.renderWorkspaceOverview();
        this.addNotification('Spazio di lavoro', `Spazio di lavoro ${num} selezionato.`, 'info');
        this.showToast('Spazio di lavoro', `Spazio di lavoro ${num} selezionato.`, 'info', 2000);
    }

    renderWorkspaceOverview() {
        const grid = document.getElementById('workspace-grid');
        if (!grid) return;
        grid.innerHTML = this.state.workspaces.map(ws => {
            const isActive = ws.id === this.state.currentWorkspace;
            const windows = this.state.openWindows.filter(w => w.workspaceId === ws.id);
            const thumbs = windows.length > 0
                ? windows.map(w => this.getWindowThumbnail(w.id)).join('')
                : `<div class="workspace-empty-state">
                        <span class="workspace-empty-icon">＋</span>
                        <span>Nessuna finestra</span>
                   </div>`;
            return `
                <div class="workspace-thumbnail ${isActive ? 'active' : ''}"
                     data-ws="${ws.id}"
                     draggable="false"
                     onclick="app.switchWorkspaceFromOverview(${ws.id})"
                     oncontextmenu="app.showWorkspaceContextMenu(event, ${ws.id})"
                     ondragover="app.handleWorkspaceDragOver(event, ${ws.id})"
                     ondragleave="app.handleWorkspaceDragLeave(event, ${ws.id})"
                     ondrop="app.handleWorkspaceDrop(event, ${ws.id})">
                    <div class="workspace-thumbnail-header">
                        <span class="workspace-thumbnail-name" title="${this.escapeHtml(ws.name)}">${this.escapeHtml(ws.name)}</span>
                        <div class="workspace-thumbnail-controls">
                            <button class="workspace-thumbnail-btn" onclick="event.stopPropagation(); app.startRenameWorkspace(${ws.id})" title="Rinomina">✎</button>
                            ${this.state.workspaces.length > 1 ? `<button class="workspace-thumbnail-btn danger" onclick="event.stopPropagation(); app.removeWorkspace(${ws.id})" title="Elimina">✕</button>` : ''}
                        </div>
                    </div>
                    <div class="workspace-thumbnail-preview">
                        ${thumbs}
                    </div>
                </div>
            `;
        }).join('');
        this.attachWorkspaceMiniWindowDragListeners();
    }

    getWorkspaceThumbnails(workspaceId) {
        const ws = this.state.workspaces.find(w => w.id === workspaceId);
        if (!ws) return '';
        const windows = this.state.openWindows.filter(w => w.workspaceId === workspaceId);
        return windows.map(w => this.getWindowThumbnail(w.id)).join('');
    }

    getWindowThumbnail(windowId) {
        const winData = this.state.openWindows.find(w => w.id === windowId);
        if (!winData) return '';
        return `
            <div class="workspace-mini-window"
                 draggable="true"
                 data-window-id="${winData.id}"
                 ondragstart="app.handleMiniWindowDragStart(event, '${winData.id}')"
                 ondragend="app.handleMiniWindowDragEnd(event)"
                 title="${this.escapeHtml(winData.title)}">
                <span class="workspace-mini-icon">${winData.icon || '📦'}</span>
                <span class="workspace-mini-title">${this.escapeHtml(winData.title)}</span>
            </div>
        `;
    }

    switchWorkspaceFromOverview(workspaceId) {
        if (workspaceId < 1 || workspaceId > this.state.workspaces.length) return;
        this.state.currentWorkspace = workspaceId;
        const ws = this.state.workspaces.find(w => w.id === workspaceId);
        if (!ws) return;
        this.animateWorkspaceSwitch(workspaceId);
        this.renderActivitiesWindows();
        this.renderWorkspaceOverview();
        this.addNotification('Spazio di lavoro', `Sei passato a "${ws.name}".`, 'info');
        this.showToast('Spazio di lavoro', `Sei passato a "${ws.name}".`, 'info', 2000);
        this.saveWorkspaceConfig();
    }

    animateWorkspaceSwitch(workspaceId) {
        const wsThumbs = document.querySelectorAll('.workspace-thumbnail');
        wsThumbs.forEach(el => {
            const wsId = parseInt(el.dataset.ws);
            if (wsId === workspaceId) {
                el.style.transition = 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease';
                el.style.transform = 'scale(1.04)';
                setTimeout(() => {
                    el.style.transform = '';
                }, 250);
            }
        });
        const desktop = document.getElementById('desktop');
        if (desktop) {
            desktop.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            desktop.style.opacity = '0.85';
            desktop.style.transform = 'scale(0.995)';
            setTimeout(() => {
                desktop.style.opacity = '1';
                desktop.style.transform = '';
            }, 220);
        }
    }

    addNewWorkspace() {
        if (this.state.workspaces.length >= 9) {
            this.showToast('Spazi di lavoro', 'Puoi creare al massimo 9 spazi di lavoro.', 'warning', 2500);
            return;
        }
        const nextId = this.state.workspaces.length > 0 ? Math.max(...this.state.workspaces.map(w => w.id)) + 1 : 1;
        const num = this.state.workspaces.length + 1;
        const newWs = {
            id: nextId,
            name: `Spazio ${num}`,
            windows: []
        };
        this.state.workspaces.push(newWs);
        this.renderWorkspaceOverview();
        this.saveWorkspaceConfig();
        this.showToast('Spazio di lavoro', `"${newWs.name}" creato.`, 'success', 2000);
        this.addNotification('Spazio di lavoro', `"${newWs.name}" è stato creato.`, 'info');
        setTimeout(() => this.switchWorkspaceFromOverview(nextId), 100);
    }

    removeWorkspace(workspaceId) {
        if (this.state.workspaces.length <= 1) {
            this.showToast('Spazio di lavoro', 'Devi mantenere almeno uno spazio di lavoro.', 'warning', 2500);
            return;
        }
        const ws = this.state.workspaces.find(w => w.id === workspaceId);
        if (!ws) return;
        const wsWindows = this.state.openWindows.filter(w => w.workspaceId === workspaceId);
        if (wsWindows.length > 0) {
            if (!confirm(`"${ws.name}" ha ${wsWindows.length} finestra(e) aperta(e). Eliminare lo spazio di lavoro? Le finestre verranno spostate.`)) {
                return;
            }
            wsWindows.forEach(w => {
                w.workspaceId = this.state.currentWorkspace;
                const wsData = this.state.workspaces.find(ws => ws.id === this.state.currentWorkspace);
                if (wsData && !wsData.windows.includes(w.id)) {
                    wsData.windows.push(w.id);
                }
            });
        }
        this.state.workspaces = this.state.workspaces.filter(w => w.id !== workspaceId);
        if (this.state.currentWorkspace === workspaceId) {
            this.state.currentWorkspace = this.state.workspaces[0]?.id || 1;
        } else if (this.state.currentWorkspace > workspaceId) {
            this.state.currentWorkspace--;
        }
        this.renderActivitiesWindows();
        this.renderWorkspaceOverview();
        this.saveWorkspaceConfig();
        this.showToast('Spazio di lavoro', `"${ws.name}" eliminato.`, 'info', 2000);
    }

    startRenameWorkspace(workspaceId) {
        const ws = this.state.workspaces.find(w => w.id === workspaceId);
        if (!ws) return;
        const nameEl = document.querySelector(`.workspace-thumbnail[data-ws="${workspaceId}"] .workspace-thumbnail-name`);
        if (!nameEl) return;
        nameEl.contentEditable = 'true';
        nameEl.focus();
        const range = document.createRange();
        range.selectNodeContents(nameEl);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        const finishRename = () => {
            nameEl.contentEditable = 'false';
            const newName = nameEl.textContent.trim();
            if (newName && newName !== ws.name) {
                this.renameWorkspace(workspaceId, newName);
            } else {
                nameEl.textContent = ws.name;
            }
            nameEl.removeEventListener('blur', finishRename);
            nameEl.removeEventListener('keydown', keyHandler);
        };
        const keyHandler = (e) => {
            if (e.key === 'Enter') { e.preventDefault(); nameEl.blur(); }
            if (e.key === 'Escape') { nameEl.textContent = ws.name; nameEl.blur(); }
        };
        nameEl.addEventListener('blur', finishRename);
        nameEl.addEventListener('keydown', keyHandler);
    }

    renameWorkspace(workspaceId, newName) {
        const ws = this.state.workspaces.find(w => w.id === workspaceId);
        if (!ws || !newName) return;
        ws.name = newName;
        this.renderWorkspaceOverview();
        this.saveWorkspaceConfig();
        this.showToast('Spazio di lavoro', `Rinominato in "${newName}".`, 'success', 2000);
    }

    showWorkspaceContextMenu(e, workspaceId) {
        e.preventDefault();
        e.stopPropagation();
        this.hideWorkspaceContextMenu();
        const ws = this.state.workspaces.find(w => w.id === workspaceId);
        if (!ws) return;
        const menu = document.createElement('div');
        menu.className = 'workspace-context-menu';
        menu.id = 'workspace-context-menu';
        menu.style.left = e.clientX + 'px';
        menu.style.top = e.clientY + 'px';
        menu.innerHTML = `
            <div class="workspace-context-menu-item" data-action="rename" data-ws="${workspaceId}">✎ Rinomina</div>
            ${this.state.workspaces.length > 1 ? `<div class="workspace-context-separator"></div>
            <div class="workspace-context-menu-item danger" data-action="delete" data-ws="${workspaceId}">🗑 Elimina</div>` : ''}
        `;
        menu.querySelectorAll('.workspace-context-menu-item').forEach(item => {
            item.addEventListener('click', (ev) => {
                ev.stopPropagation();
                const action = item.dataset.action;
                const wsId = parseInt(item.dataset.ws);
                if (action === 'rename') this.startRenameWorkspace(wsId);
                else if (action === 'delete') this.removeWorkspace(wsId);
                this.hideWorkspaceContextMenu();
            });
        });
        document.body.appendChild(menu);
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) menu.style.left = (window.innerWidth - rect.width - 5) + 'px';
        if (rect.bottom > window.innerHeight) menu.style.top = (window.innerHeight - rect.height - 5) + 'px';
    }

    hideWorkspaceContextMenu() {
        const existing = document.getElementById('workspace-context-menu');
        if (existing) existing.remove();
    }

    handleMiniWindowDragStart(e, windowId) {
        e.dataTransfer.setData('text/plain', windowId);
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('dragging');
        this._draggedWindowId = windowId;
    }

    handleMiniWindowDragEnd(e) {
        e.target.classList.remove('dragging');
        this._draggedWindowId = null;
        document.querySelectorAll('.workspace-thumbnail.drag-over').forEach(el => el.classList.remove('drag-over'));
    }

    handleWorkspaceDragOver(e, workspaceId) {
        e.preventDefault();
        if (this._draggedWindowId) {
            e.dataTransfer.dropEffect = 'move';
            const thumb = document.querySelector(`.workspace-thumbnail[data-ws="${workspaceId}"]`);
            if (thumb) thumb.classList.add('drag-over');
        }
    }

    handleWorkspaceDragLeave(e, workspaceId) {
        const thumb = document.querySelector(`.workspace-thumbnail[data-ws="${workspaceId}"]`);
        if (thumb) thumb.classList.remove('drag-over');
    }

    handleWorkspaceDrop(e, workspaceId) {
        e.preventDefault();
        const thumb = document.querySelector(`.workspace-thumbnail[data-ws="${workspaceId}"]`);
        if (thumb) thumb.classList.remove('drag-over');
        const windowId = e.dataTransfer.getData('text/plain');
        if (!windowId) return;
        const winData = this.state.openWindows.find(w => w.id === windowId);
        if (!winData) return;
        const oldWorkspaceId = winData.workspaceId;
        winData.workspaceId = workspaceId;
        const oldWs = this.state.workspaces.find(w => w.id === oldWorkspaceId);
        const newWs = this.state.workspaces.find(w => w.id === workspaceId);
        if (oldWs) oldWs.windows = oldWs.windows.filter(id => id !== windowId);
        if (newWs && !newWs.windows.includes(windowId)) newWs.windows.push(windowId);
        this.renderWorkspaceOverview();
        this.renderActivitiesWindows();
        this.saveWorkspaceConfig();
        this.showToast('Spazio di lavoro', `"${winData.title}" spostato in "${newWs?.name || 'spazio'}".`, 'info', 2000);
    }

    attachWorkspaceMiniWindowDragListeners() {
        document.querySelectorAll('.workspace-mini-window').forEach(el => {
            if (!el._dragListenerAttached) {
                el._dragListenerAttached = true;
            }
        });
    }

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    saveWorkspaceConfig() {
        try {
            const config = {
                workspaces: this.state.workspaces,
                currentWorkspace: this.state.currentWorkspace,
                windowAssignments: {}
            };
            this.state.openWindows.forEach(w => {
                config.windowAssignments[w.id] = w.workspaceId;
            });
            localStorage.setItem('auraos_workspaces', JSON.stringify(config));
        } catch (e) {
            // Storage full or unavailable
        }
    }

    loadWorkspaceConfig() {
        try {
            const saved = localStorage.getItem('auraos_workspaces');
            if (saved) {
                const config = JSON.parse(saved);
                if (config.workspaces && config.workspaces.length > 0) {
                    this.state.workspaces = config.workspaces;
                }
                if (config.currentWorkspace) {
                    this.state.currentWorkspace = config.currentWorkspace;
                }
                if (config.windowAssignments) {
                    this.state.openWindows.forEach(w => {
                        if (config.windowAssignments[w.id]) {
                            w.workspaceId = config.windowAssignments[w.id];
                        } else {
                            w.workspaceId = this.state.currentWorkspace;
                        }
                    });
                }
            }
            this.state.workspaces.forEach(ws => {
                if (!ws.windows) ws.windows = [];
            });
        } catch (e) {
            this.state.workspaces.forEach(ws => { ws.windows = []; });
        }
    }

    handleActivitiesSearch(query) {
        const container = document.getElementById('activities-windows');
        if (!container) return;
        const q = query.toLowerCase().trim();
        if (!q) {
            this.renderActivitiesWindows();
            return;
        }
        const matched = this.state.openWindows.filter(w => {
            return w.title.toLowerCase().includes(q) || w.appId.toLowerCase().includes(q);
        });
        if (matched.length === 0) {
            container.innerHTML = '<div class="activities-empty">Nessuna finestra trovata</div>';
            return;
        }
        container.innerHTML = matched.map(w => {
            const isActive = this.state.activeWindow === w.id;
            return `
                <div class="activities-window-thumb ${isActive ? 'active' : ''}" onclick="app.focusWindow('${w.id}'); app.toggleActivities(false);">
                    <div class="activities-window-thumb-header">
                        <span>${w.icon}</span>
                        <span>${w.title}</span>
                    </div>
                    <div class="activities-window-thumb-body"></div>
                </div>
            `;
        }).join('');
    }

    handleActivitiesKeydown(event) {
        if (event.key === 'Escape') {
            this.toggleActivities(false);
        }
    }

    // ===== New Shell: Top Bar =====
    updateTopBar() {
        const center = document.getElementById('top-bar-center');
        if (!center) return;
        const activeWin = this.state.openWindows.find(w => w.id === this.state.activeWindow && !w.minimized);
        if (activeWin) {
            center.textContent = activeWin.title;
            center.classList.add('active');
        } else {
            center.textContent = '';
            center.classList.remove('active');
        }
    }

    // ===== New Shell: Dock =====
    updateDock() {
        const container = document.getElementById('dock');
        if (!container) return;
        const items = container.querySelectorAll('.dock-item[data-app]:not([data-app="app-launcher"])');
        items.forEach(item => {
            const appId = item.dataset.app;
            const indicator = item.querySelector('.dock-indicator');
            if (!indicator) return;
            const isRunning = this.state.openWindows.some(w => w.appId === appId && !w.minimized);
            indicator.classList.toggle('running', isRunning);
            item.classList.toggle('running', isRunning);
        });
    }

    // ===== Appearance / Settings =====
    getAppearanceContent(windowId) {
        const a = this.state.appearance;
        const themes = [
            { id: 'light', name: 'JeadOS Light', icon: '☀️', desc: 'Tema chiaro pulito' },
            { id: 'dark', name: 'JeadOS Dark', icon: '🌙', desc: 'Tema scuro con accenti blu' },
            { id: 'zorin-blue', name: 'Zorin Blue', icon: '💙', desc: 'Ispirato a Zorin OS' },
            { id: 'aurora', name: 'Aurora', icon: '🌈', desc: 'Tema viola/rosa gradiente' },
            { id: 'matrix', name: 'Matrix', icon: '🟢', desc: 'Tema verde/nero hacker' },
            { id: 'auto', name: 'Auto', icon: '💻', desc: 'Segue le preferenze di sistema' },
        ];
        const themePreview = (themeId) => {
            const colors = {
                'light': 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                'dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                'zorin-blue': 'linear-gradient(135deg, #1a3a5c 0%, #2193b0 50%, #6dd5ed 100%)',
                'aurora': 'linear-gradient(135deg, #834d9b 0%, #d04ed6 50%, #667eea 100%)',
                'matrix': 'linear-gradient(135deg, #0a0a0a 0%, #0f2027 50%, #003b00 100%)',
                'auto': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            };
            return `<div style="width: 40px; height: 40px; border-radius: 10px; background: ${colors[themeId] || colors.light}; border: 2px solid var(--auraos-border); box-shadow: 0 2px 8px rgba(0,0,0,0.15);"></div>`;
        };
        return `
            <div class="settings-section">
                <h3>🎨 Aspetto</h3>
                <div class="settings-option">
                    <span class="settings-label">Tema</span>
                    <div class="settings-control" style="flex-direction: column; gap: 8px; align-items: flex-start;">
                        ${themes.map(t => `
                            <button class="settings-btn ${a.theme === t.id ? 'active' : ''}" onclick="app.setAppearance('theme', '${t.id}')" style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: flex-start;">
                                ${themePreview(t.id)}
                                <div style="text-align: left;">
                                    <div style="font-weight: 600;">${t.icon} ${t.name}</div>
                                    <div style="font-size: 10px; opacity: 0.7; font-weight: normal;">${t.desc}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="settings-option">
                    <span class="settings-label">Posizione dock</span>
                    <div class="settings-control">
                        ${['bottom', 'left', 'right'].map(p => `
                            <button class="settings-btn ${a.dockPosition === p ? 'active' : ''}" onclick="app.setAppearance('dockPosition', '${p}')">${p === 'bottom' ? 'In basso' : p === 'left' ? 'A sinistra' : 'A destra'}</button>
                        `).join('')}
                    </div>
                </div>
                <div class="settings-option">
                    <span class="settings-label">Dimensione dock</span>
                    <div class="settings-control">
                        ${['small', 'medium', 'large'].map(s => `
                            <button class="settings-btn ${a.dockSize === s ? 'active' : ''}" onclick="app.setAppearance('dockSize', '${s}')">${s === 'small' ? 'Piccola' : s === 'medium' ? 'Media' : 'Grande'}</button>
                        `).join('')}
                    </div>
                </div>
                <div class="settings-option">
                    <span class="settings-label">Barra superiore</span>
                    <div class="settings-control">
                        <button class="settings-btn ${a.topBarVisible ? 'active' : ''}" onclick="app.setAppearance('topBarVisible', true)">Visibile</button>
                        <button class="settings-btn ${!a.topBarVisible ? 'active' : ''}" onclick="app.setAppearance('topBarVisible', false)">Nascosta</button>
                    </div>
                </div>
                <div class="settings-option">
                    <span class="settings-label">Animazioni</span>
                    <div class="settings-control">
                        <button class="settings-btn ${a.animationsEnabled ? 'active' : ''}" onclick="app.setAppearance('animationsEnabled', true)">Attive</button>
                        <button class="settings-btn ${!a.animationsEnabled ? 'active' : ''}" onclick="app.setAppearance('animationsEnabled', false)">Disattivate</button>
                    </div>
                </div>
                <div class="settings-option">
                    <span class="settings-label">Dimensione caratteri</span>
                    <div class="settings-control">
                        ${['small', 'medium', 'large'].map(s => `
                            <button class="settings-btn ${a.fontSize === s ? 'active' : ''}" onclick="app.setAppearance('fontSize', '${s}')">${s === 'small' ? 'Piccola' : s === 'medium' ? 'Media' : 'Grande'}</button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    initAppearance(windowId) {
        this.applyAppearanceSettings();
    }

    setAppearance(key, value) {
        this.state.appearance[key] = value;
        const lsKey = 'auraos_' + key;
        localStorage.setItem(lsKey, value);
        this.applyAppearanceSettings();
        this.showToast('Aspetto', 'Impostazioni aspetto aggiornate.', 'info', 2000);
        this.playSound('success');
    }

    applyAppearanceSettings() {
        const a = this.state.appearance;
        const topBar = document.getElementById('top-bar');
        const dock = document.getElementById('dock');
        if (topBar) {
            topBar.classList.toggle('hidden', !a.topBarVisible);
        }
        if (dock) {
            dock.classList.toggle('hidden', false);
            dock.classList.remove('dock-left', 'dock-right');
            if (a.dockPosition === 'left') dock.classList.add('dock-left');
            else if (a.dockPosition === 'right') dock.classList.add('dock-right');
        }
        const fontSizes = { small: '12px', medium: '14px', large: '16px' };
        document.body.style.fontSize = fontSizes[a.fontSize] || '14px';
        if (a.animationsEnabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let theme = a.theme;
        if (theme === 'auto') theme = prefersDark ? 'dark' : 'light';
        document.body.classList.remove('dark-theme', 'theme-zorin-blue', 'theme-aurora', 'theme-matrix');
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'zorin-blue') {
            document.body.classList.add('theme-zorin-blue');
        } else if (theme === 'aurora') {
            document.body.classList.add('theme-aurora');
        } else if (theme === 'matrix') {
            document.body.classList.add('theme-matrix');
        }
    }

    // ===== Plugin Manager =====
    getPluginManagerContent(windowId) {
        const plugins = this.getAvailablePlugins();
        const installed = this.getInstalledPlugins();
        const enabled = this.getEnabledPlugins();
        
        return `
            <div class="plugin-manager-container" id="plugin-manager-${windowId}">
                <div class="plugin-manager-header">
                    <h3>🧩 Gestore Plugin</h3>
                    <p style="color: var(--auraos-text-secondary); font-size: 13px;">Estendi AuraOS con plugin aggiuntivi</p>
                </div>
                <div class="plugin-manager-grid">
                    ${plugins.map(plugin => {
                        const isInstalled = installed.includes(plugin.id);
                        const isEnabled = enabled.includes(plugin.id);
                        return `
                            <div class="plugin-card">
                                <div class="plugin-card-icon">${plugin.icon}</div>
                                <div class="plugin-card-name">${plugin.name}</div>
                                <div class="plugin-card-desc">${plugin.description}</div>
                                <div class="plugin-card-meta">
                                    <span>v${plugin.version}</span>
                                    <span>${plugin.author}</span>
                                </div>
                                <div class="plugin-card-actions">
                                    ${!isInstalled ? 
                                        `<button class="plugin-btn plugin-install" onclick="app.installPlugin('${plugin.id}', '${windowId}')">Installa</button>` :
                                        isEnabled ?
                                            `<button class="plugin-btn plugin-disable" onclick="app.disablePlugin('${plugin.id}', '${windowId}')">Disabilita</button>` :
                                            `<button class="plugin-btn plugin-enable" onclick="app.enablePlugin('${plugin.id}', '${windowId}')">Abilita</button>
                                             <button class="plugin-btn plugin-uninstall" onclick="app.uninstallPlugin('${plugin.id}', '${windowId}')">Disinstalla</button>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    initPluginManager(windowId) {
    }

    getAvailablePlugins() {
        return [
            {
                id: 'hello-world',
                name: 'Hello World',
                icon: '👋',
                description: 'Plugin di esempio che aggiunge una semplice app Hello World',
                version: '1.0.0',
                author: 'AuraOS Team',
                category: 'Esempi'
            },
            {
                id: 'extra-themes',
                name: 'Temi Extra',
                icon: '🎨',
                description: 'Aggiunge 3 nuovi temi: Ocean, Sunset, Forest',
                version: '1.0.0',
                author: 'AuraOS Team',
                category: 'Temi'
            },
            {
                id: 'terminal-extras',
                name: 'Terminal Extras',
                icon: '⌨️',
                description: 'Aggiunge 10 nuovi comandi al terminale',
                version: '1.0.0',
                author: 'AuraOS Team',
                category: 'Produttività'
            },
            {
                id: 'weather-pro',
                name: 'Meteo Pro',
                icon: '🌤️',
                description: 'Previsioni meteo più dettagliate con dati orari',
                version: '1.0.0',
                author: 'AuraOS Team',
                category: 'Utilità'
            },
            {
                id: 'system-info',
                name: 'Informazioni Sistema',
                icon: '📊',
                description: 'Mostra informazioni dettagliate sul sistema',
                version: '1.0.0',
                author: 'AuraOS Team',
                category: 'Utilità'
            },
            {
                id: 'quick-notes',
                name: 'Note Rapide',
                icon: '📝',
                description: 'Aggiungi note rapide al desktop',
                version: '1.0.0',
                author: 'AuraOS Team',
                category: 'Produttività'
            },
        ];
    }

    getInstalledPlugins() {
        try {
            const saved = localStorage.getItem('jeados_plugins');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveInstalledPlugins(plugins) {
        localStorage.setItem('jeados_plugins', JSON.stringify(plugins));
    }

    getEnabledPlugins() {
        try {
            const saved = localStorage.getItem('jeados_plugins_enabled');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveEnabledPlugins(plugins) {
        localStorage.setItem('jeados_plugins_enabled', JSON.stringify(plugins));
    }

    installPlugin(pluginId, windowId) {
        const installed = this.getInstalledPlugins();
        if (!installed.includes(pluginId)) {
            installed.push(pluginId);
            this.saveInstalledPlugins(installed);
        }
        const plugin = this.getAvailablePlugins().find(p => p.id === pluginId);
        const pluginName = plugin ? plugin.name : pluginId;
        this.showToast('Plugin Installato', `"${pluginName}" è stato installato.`, 'success');
        this.addNotification('Plugin', `"${pluginName}" installato.`, 'info');
        if (windowId) {
            this.renderPluginManager(windowId);
        }
    }

    uninstallPlugin(pluginId, windowId) {
        const plugin = this.getAvailablePlugins().find(p => p.id === pluginId);
        const pluginName = plugin ? plugin.name : pluginId;
        if (!confirm(`Sei sicuro di voler disinstallare "${pluginName}"?`)) return;
        let installed = this.getInstalledPlugins();
        installed = installed.filter(id => id !== pluginId);
        this.saveInstalledPlugins(installed);
        let enabled = this.getEnabledPlugins();
        enabled = enabled.filter(id => id !== pluginId);
        this.saveEnabledPlugins(enabled);
        this.showToast('Plugin Disinstallato', `"${pluginName}" è stato disinstallato.`, 'info');
        if (windowId) {
            this.renderPluginManager(windowId);
        }
    }

    enablePlugin(pluginId, windowId) {
        const enabled = this.getEnabledPlugins();
        if (!enabled.includes(pluginId)) {
            enabled.push(pluginId);
            this.saveEnabledPlugins(enabled);
        }
        const plugin = this.getAvailablePlugins().find(p => p.id === pluginId);
        const pluginName = plugin ? plugin.name : pluginId;
        this.showToast('Plugin Abilitato', `"${pluginName}" è stato abilitato.`, 'success');
        if (windowId) {
            this.renderPluginManager(windowId);
        }
    }

    disablePlugin(pluginId, windowId) {
        let enabled = this.getEnabledPlugins();
        enabled = enabled.filter(id => id !== pluginId);
        this.saveEnabledPlugins(enabled);
        const plugin = this.getAvailablePlugins().find(p => p.id === pluginId);
        const pluginName = plugin ? plugin.name : pluginId;
        this.showToast('Plugin Disabilitato', `"${pluginName}" è stato disabilitato.`, 'info');
        if (windowId) {
            this.renderPluginManager(windowId);
        }
    }

    renderPluginManager(windowId) {
        const container = document.getElementById(`plugin-manager-${windowId}`);
        if (!container) return;
        const plugins = this.getAvailablePlugins();
        const installed = this.getInstalledPlugins();
        const enabled = this.getEnabledPlugins();
        
        container.innerHTML = `
            <div class="plugin-manager-container" id="plugin-manager-${windowId}">
                <div class="plugin-manager-header">
                    <h3>🧩 Gestore Plugin</h3>
                    <p style="color: var(--auraos-text-secondary); font-size: 13px;">Estendi AuraOS con plugin aggiuntivi</p>
                </div>
                <div class="plugin-manager-grid">
                    ${plugins.map(plugin => {
                        const isInstalled = installed.includes(plugin.id);
                        const isEnabled = enabled.includes(plugin.id);
                        return `
                            <div class="plugin-card">
                                <div class="plugin-card-icon">${plugin.icon}</div>
                                <div class="plugin-card-name">${plugin.name}</div>
                                <div class="plugin-card-desc">${plugin.description}</div>
                                <div class="plugin-card-meta">
                                    <span>v${plugin.version}</span>
                                    <span>${plugin.author}</span>
                                </div>
                                <div class="plugin-card-actions">
                                    ${!isInstalled ? 
                                        `<button class="plugin-btn plugin-install" onclick="app.installPlugin('${plugin.id}', '${windowId}')">Installa</button>` :
                                        isEnabled ?
                                            `<button class="plugin-btn plugin-disable" onclick="app.disablePlugin('${plugin.id}', '${windowId}')">Disabilita</button>` :
                                            `<button class="plugin-btn plugin-enable" onclick="app.enablePlugin('${plugin.id}', '${windowId}')">Abilita</button>
                                             <button class="plugin-btn plugin-uninstall" onclick="app.uninstallPlugin('${plugin.id}', '${windowId}')">Disinstalla</button>`
                                    }
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    // ===== App Store =====
    getInstalledApps() {
        try {
            const saved = localStorage.getItem('auraos_installed_apps');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    saveInstalledApps(installed) {
        localStorage.setItem('auraos_installed_apps', JSON.stringify(installed));
    }

    installApp(appId, windowId) {
        const appData = this.getAppStoreApps().find(a => a.id === appId);
        const appName = appData ? appData.name : appId;
        const installBtn = document.querySelector(`#app-store-grid-${windowId} .app-store-card[onclick*="${appId}"] .app-store-card-btn.install, #app-store-featured-${windowId} .app-store-featured-btn[onclick*="${appId}"]`);
        const originalText = installBtn ? installBtn.textContent : '';
        
        if (installBtn) {
            installBtn.textContent = 'Installazione...';
            installBtn.disabled = true;
            installBtn.style.opacity = '0.7';
        }
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 25) + 10;
            if (progress > 95) progress = 95;
            if (installBtn) {
                installBtn.textContent = `Installazione... ${progress}%`;
            }
        }, 200);
        
        setTimeout(() => {
            clearInterval(progressInterval);
            const installed = this.getInstalledApps();
            if (!installed.includes(appId)) {
                installed.push(appId);
                this.saveInstalledApps(installed);
            }
            if (appData && !this.desktopApps.find(a => a.id === appId)) {
                this.desktopApps.push({
                    id: appData.id,
                    name: appData.name,
                    icon: appData.icon,
                    description: appData.description,
                });
            }
            this.createDesktopIcons();
            this.addStartMenuItem(appId);
            if (installBtn) {
                installBtn.textContent = 'Apri';
                installBtn.className = 'app-store-card-btn open';
                installBtn.disabled = false;
                installBtn.style.opacity = '1';
                installBtn.setAttribute('onclick', `app.openApp('${appId}')`);
                const extraBtn = installBtn.parentElement.querySelector('.app-store-card-btn.uninstall');
                if (!extraBtn) {
                    const uninstallBtn = document.createElement('button');
                    uninstallBtn.className = 'app-store-card-btn uninstall';
                    uninstallBtn.textContent = 'Disinstalla';
                    uninstallBtn.setAttribute('onclick', `app.uninstallApp('${appId}', '${windowId}')`);
                    installBtn.parentElement.appendChild(uninstallBtn);
                }
            }
            this.showToast('App Installata', `"${appName}" è stata installata con successo.`, 'success');
            this.addNotification('Installazione', `"${appName}" installata.`, 'info');
            this.playSound('success');
        }, 1500);
    }

    uninstallApp(appId, windowId) {
        const appData = this.getAppStoreApps().find(a => a.id === appId);
        const appName = appData ? appData.name : appId;
        if (!confirm(`Sei sicuro di voler disinstallare "${appName}"?`)) return;
        let installed = this.getInstalledApps();
        installed = installed.filter(id => id !== appId);
        this.saveInstalledApps(installed);
        this.desktopApps = this.desktopApps.filter(a => a.id !== appId);
        this.createDesktopIcons();
        this.removeStartMenuItem(appId);
        this.showToast('App Disinstallata', `"${appName}" è stata disinstallata.`, 'info');
        this.addNotification('Disinstallazione', `"${appName}" disinstallata.`, 'info');
        this.playSound('success');
        if (windowId) {
            this.renderAppStore(windowId);
        }
    }

    isAppInstalled(appId) {
        return this.getInstalledApps().includes(appId);
    }

    getAppStoreApps() {
        return [
            { id: 'file-manager', name: 'File e cartelle', icon: '📁', description: 'Gestisci i tuoi file in modo semplice e veloce', category: 'Utilità', rating: 5, size: '12 MB', version: '1.0.0' },
            { id: 'notepad', name: 'Blocco Note', icon: '📝', description: 'Scrivi appunti e note veloci', category: 'Produttività', rating: 4, size: '8 MB', version: '1.0.0' },
            { id: 'terminal', name: 'Terminale', icon: '💻', description: 'Usa la riga di comando come un professionista', category: 'Utilità', rating: 5, size: '15 MB', version: '1.0.0' },
            { id: 'browser', name: 'Internet', icon: '🌐', description: 'Esplora il web in modo sicuro', category: 'Utilità', rating: 4, size: '45 MB', version: '1.0.0' },
            { id: 'tutor', name: 'Tutor AI', icon: '🤖', description: 'Il tuo assistente virtuale intelligente', category: 'Educazione', rating: 5, size: '25 MB', version: '1.0.0' },
            { id: 'settings', name: 'Impostazioni', icon: '⚙️', description: 'Personalizza il tuo sistema', category: 'Utilità', rating: 4, size: '5 MB', version: '1.0.0' },
            { id: 'guide', name: 'Guida', icon: '📖', description: 'Impara come usare AuraOS', category: 'Educazione', rating: 5, size: '10 MB', version: '1.0.0' },
            { id: 'games', name: 'Giochi', icon: '🎮', description: 'Impara divertendoti con i giochi', category: 'Intrattenimento', rating: 4, size: '30 MB', version: '1.0.0' },
            { id: 'calculator', name: 'Calcolatrice', icon: '🧮', description: 'Fai calcoli veloci e complessi', category: 'Produttività', rating: 5, size: '4 MB', version: '1.0.0' },
            { id: 'gallery', name: 'Galleria', icon: '🖼️', description: 'Guarda le tue immagini', category: 'Grafica', rating: 4, size: '18 MB', version: '1.0.0' },
            { id: 'music', name: 'Musica', icon: '🎵', description: 'Ascolta la tua musica preferita', category: 'Intrattenimento', rating: 5, size: '22 MB', version: '1.0.0' },
            { id: 'app-store', name: 'App Store', icon: '🛒', description: 'Scarica nuove app e giochi', category: 'Utilità', rating: 5, size: '35 MB', version: '1.0.0' },
            { id: 'text-editor', name: 'Editor di Testo', icon: '📄', description: 'Editor avanzato con syntax highlighting', category: 'Produttività', rating: 4, size: '16 MB', version: '1.0.0' },
            { id: 'image-viewer', name: 'Visualizzatore Immagini', icon: '🖼️', description: 'Visualizza e modifica immagini', category: 'Grafica', rating: 4, size: '20 MB', version: '1.0.0' },
            { id: 'video-player', name: 'Video Player', icon: '🎬', description: 'Riproduci i tuoi video', category: 'Intrattenimento', rating: 4, size: '28 MB', version: '1.0.0' },
            { id: 'pdf-viewer', name: 'PDF Viewer', icon: '📕', description: 'Visualizza file PDF', category: 'Produttività', rating: 4, size: '14 MB', version: '1.0.0' },
            { id: 'archive-manager', name: 'Gestore Archivi', icon: '🗜️', description: 'Comprimi e decomprimi file', category: 'Utilità', rating: 4, size: '10 MB', version: '1.0.0' },
            { id: 'system-monitor', name: 'Monitor di Sistema', icon: '📈', description: 'Monitora CPU, RAM e disco', category: 'Utilità', rating: 5, size: '8 MB', version: '1.0.0' },
            { id: 'disk-usage', name: 'Utilizzo Disco', icon: '💾', description: 'Analizza lo spazio su disco', category: 'Utilità', rating: 4, size: '6 MB', version: '1.0.0' },
            { id: 'font-viewer', name: 'Visualizzatore Font', icon: '🔤', description: 'Esplora i font installati', category: 'Grafica', rating: 3, size: '9 MB', version: '1.0.0' },
            { id: 'screenshot', name: 'Screenshot', icon: '📸', description: 'Cattura schermate del desktop', category: 'Utilità', rating: 4, size: '7 MB', version: '1.0.0' },
            { id: 'screen-recorder', name: 'Registratore Schermo', icon: '🎥', description: 'Registra il tuo desktop', category: 'Intrattenimento', rating: 4, size: '24 MB', version: '1.0.0' },
            { id: 'weather-app', name: 'Meteo', icon: '🌤️', description: 'Previsioni meteo dettagliate', category: 'Utilità', rating: 4, size: '11 MB', version: '1.0.0' },
            { id: 'calendar', name: 'Calendario', icon: '📅', description: 'Gestisci eventi e appuntamenti', category: 'Produttività', rating: 4, size: '13 MB', version: '1.0.0' },
            { id: 'contacts', name: 'Contatti', icon: '👥', description: 'Gestisci i tuoi contatti', category: 'Produttività', rating: 4, size: '9 MB', version: '1.0.0' },
            { id: 'notes-app', name: 'Note', icon: '📓', description: 'Note avanzate con markdown', category: 'Produttività', rating: 4, size: '12 MB', version: '1.0.0' },
            { id: 'tasks', name: 'Attività', icon: '✅', description: 'Gestisci i tuoi task', category: 'Produttività', rating: 4, size: '8 MB', version: '1.0.0' },
            { id: 'code-editor', name: 'Editor di Codice', icon: '💻', description: 'Editor di codice professionale con evidenziazione della sintassi', category: 'Produttività', rating: 5, size: '35 MB', version: '2.0.0' },
            { id: 'password-manager', name: 'Gestore Password', icon: '🔐', description: 'Gestisci le tue password in sicurezza', category: 'Utilità', rating: 4, size: '10 MB', version: '1.0.0' },
            { id: 'email-client', name: 'Client Email', icon: '📧', description: 'Leggi e invia email', category: 'Produttività', rating: 4, size: '20 MB', version: '1.0.0' },
            { id: 'chat-app', name: 'Chat', icon: '💬', description: 'Messaggistica istantanea', category: 'Intrattenimento', rating: 4, size: '18 MB', version: '1.0.0' },
            { id: 'photo-editor', name: 'Editor Foto', icon: '🎨', description: 'Modifica e ritocca le tue foto', category: 'Grafica', rating: 5, size: '40 MB', version: '2.0.0' },
            { id: 'video-editor', name: 'Editor Video', icon: '🎬', description: 'Monta e modifica i tuoi video', category: 'Grafica', rating: 4, size: '55 MB', version: '1.0.0' },
            { id: '3d-viewer', name: 'Visualizzatore 3D', icon: '🧊', description: 'Visualizza modelli 3D', category: 'Grafica', rating: 3, size: '30 MB', version: '1.0.0' },
            { id: 'clock-app', name: 'Sveglia', icon: '⏰', description: 'Sveglia, timer e cronometro', category: 'Utilità', rating: 4, size: '5 MB', version: '1.0.0' },
            { id: 'map-app', name: 'Mappe', icon: '🗺️', description: 'Naviga e esplora le mappe', category: 'Utilità', rating: 4, size: '25 MB', version: '1.0.0' },
            { id: 'notes-pro', name: 'Note Pro', icon: '📒', description: 'Note professionali con organizzazione avanzata', category: 'Produttività', rating: 5, size: '15 MB', version: '2.0.0' },
            { id: 'whiteboard', name: 'Lavagna', icon: '📋', description: 'Lavagna digitale per disegnare e annotare', category: 'Educazione', rating: 4, size: '18 MB', version: '1.0.0' },
            { id: 'calibre', name: 'Lettore eBook', icon: '📚', description: 'Leggi i tuoi eBook preferiti', category: 'Intrattenimento', rating: 4, size: '22 MB', version: '1.0.0' },
            { id: 'scan-app', name: 'Scanner', icon: '📠', description: 'Scansiona documenti e immagini', category: 'Utilità', rating: 3, size: '12 MB', version: '1.0.0' },
            { id: 'remote-desktop', name: 'Desktop Remoto', icon: '🖥️', description: 'Connettiti a computer remoti', category: 'Utilità', rating: 3, size: '20 MB', version: '1.0.0' },
            { id: 'backup-app', name: 'Backup', icon: '💿', description: 'Esegui il backup dei tuoi dati', category: 'Utilità', rating: 4, size: '15 MB', version: '1.0.0' },
            { id: 'paint-app', name: 'Paint', icon: '🖌️', description: 'Disegna e crea opere d\'arte digitale', category: 'Grafica', rating: 4, size: '16 MB', version: '1.0.0' },
            { id: 'fitness-app', name: 'Fitness', icon: '💪', description: 'Traccia i tuoi allenamenti e rimani in forma', category: 'Utilità', rating: 4, size: '12 MB', version: '1.0.0' },
            { id: 'camera-app', name: 'Fotocamera', icon: '📷', description: 'Scatta foto e registra video', category: 'Intrattenimento', rating: 4, size: '10 MB', version: '1.0.0' },
            { id: 'reminder-app', name: 'Promemoria', icon: '⏰', description: 'Imposta promemoria e non dimenticare più nulla', category: 'Produttività', rating: 4, size: '6 MB', version: '1.0.0' },
            { id: 'plugin-manager', name: 'Gestore Plugin', icon: '🧩', description: 'Gestisci e installa plugin per AuraOS' },
        ];
    }

    getAppStoreContent(windowId) {
        const installed = this.getInstalledApps();
        const apps = this.getAppStoreApps();
        const featuredApp = apps.find(a => a.id === 'app-store') || apps[0];
        const featuredStars = this.getStarsHTML(featuredApp.rating);

        const categories = ['Tutte', 'Produttività', 'Educazione', 'Intrattenimento', 'Utilità', 'Grafica'];
        const categoryButtons = categories.map((cat, idx) => {
            const count = cat === 'Tutte' ? apps.length : apps.filter(a => a.category === cat).length;
            return `<button class="app-store-category-btn${idx === 0 ? ' active' : ''}" onclick="app.filterAppStore('${cat}', '${windowId}')">${cat} (${count})</button>`;
        }).join('');

        const appCards = apps.map(app => {
            const isInstalled = installed.includes(app.id);
            const stars = this.getStarsHTML(app.rating);
            const btnClass = isInstalled ? 'open' : 'install';
            const btnText = isInstalled ? 'Apri' : 'Installa';
            const btnAction = isInstalled
                ? `app.openApp('${app.id}')`
                : `app.installApp('${app.id}', '${windowId}')`;
            const extraBtn = isInstalled
                ? `<button class="app-store-card-btn uninstall" onclick="event.stopPropagation(); app.uninstallApp('${app.id}', '${windowId}')">Disinstalla</button>`
                : '';

            return `
                <div class="app-store-card" onclick="app.showAppDetails('${app.id}', '${windowId}')">
                    <div class="app-store-card-icon">${app.icon}</div>
                    <div class="app-store-card-name">${app.name}</div>
                    <div class="app-store-card-desc">${app.description}</div>
                    <div class="app-store-card-meta">
                        <span class="app-store-card-rating">${stars}</span>
                        <span class="app-store-card-category">${app.category}</span>
                    </div>
                    <button class="app-store-card-btn ${btnClass}" onclick="event.stopPropagation(); ${btnAction}">${btnText}</button>
                    ${extraBtn}
                </div>
            `;
        }).join('');

        return `
            <div class="app-store-container" id="app-store-container-${windowId}">
                <div class="app-store-header">
                    <input type="text" class="app-store-search" id="app-store-search-${windowId}" placeholder="🔍 Cerca app..." oninput="app.searchAppStore(this.value, '${windowId}')">
                    <div class="app-store-categories" id="app-store-categories-${windowId}">
                        ${categoryButtons}
                    </div>
                </div>
                <div class="app-store-featured" id="app-store-featured-${windowId}" onclick="app.openApp('${featuredApp.id}')">
                    <div class="app-store-featured-icon">${featuredApp.icon}</div>
                    <div class="app-store-featured-info">
                        <div class="app-store-featured-name">${featuredApp.name}</div>
                        <div class="app-store-featured-desc">${featuredApp.description}</div>
                        <div class="app-store-featured-rating">${featuredStars} ${featuredApp.rating}.0</div>
                    </div>
                    <button class="app-store-featured-btn" onclick="event.stopPropagation(); app.installApp('${featuredApp.id}', '${windowId}')">${installed.includes(featuredApp.id) ? 'Apri' : 'Installa'}</button>
                </div>
                <div class="app-store-grid" id="app-store-grid-${windowId}">
                    ${appCards}
                </div>
            </div>
        `;
    }

    getStarsHTML(rating) {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5 ? 1 : 0;
        const empty = 5 - full - half;
        return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
    }

    initAppStore(windowId) {
        this.appStoreState = this.appStoreState || {};
        this.appStoreState[windowId] = {
            currentCategory: 'Tutte',
            searchQuery: '',
        };
    }

    renderAppStore(windowId) {
        const installed = this.getInstalledApps();
        const apps = this.getAppStoreApps();
        const state = this.appStoreState[windowId] || { currentCategory: 'Tutte', searchQuery: '' };

        let filtered = apps;
        if (state.currentCategory !== 'Tutte') {
            filtered = filtered.filter(a => a.category === state.currentCategory);
        }
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase().trim();
            filtered = filtered.filter(a =>
                a.name.toLowerCase().includes(q) ||
                a.description.toLowerCase().includes(q) ||
                a.category.toLowerCase().includes(q)
            );
        }

        const grid = document.getElementById(`app-store-grid-${windowId}`);
        if (!grid) return;

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="app-store-no-results">Nessuna app trovata</div>';
            return;
        }

        grid.innerHTML = filtered.map(app => {
            const isInstalled = installed.includes(app.id);
            const stars = this.getStarsHTML(app.rating);
            const btnClass = isInstalled ? 'open' : 'install';
            const btnText = isInstalled ? 'Apri' : 'Installa';
            const btnAction = isInstalled
                ? `app.openApp('${app.id}')`
                : `app.installApp('${app.id}', '${windowId}')`;
            const extraBtn = isInstalled
                ? `<button class="app-store-card-btn uninstall" onclick="event.stopPropagation(); app.uninstallApp('${app.id}', '${windowId}')">Disinstalla</button>`
                : '';

            return `
                <div class="app-store-card" onclick="app.showAppDetails('${app.id}', '${windowId}')">
                    <div class="app-store-card-icon">${app.icon}</div>
                    <div class="app-store-card-name">${app.name}</div>
                    <div class="app-store-card-desc">${app.description}</div>
                    <div class="app-store-card-meta">
                        <span class="app-store-card-rating">${stars}</span>
                        <span class="app-store-card-category">${app.category}</span>
                    </div>
                    <button class="app-store-card-btn ${btnClass}" onclick="event.stopPropagation(); ${btnAction}">${btnText}</button>
                    ${extraBtn}
                </div>
            `;
        }).join('');
    }

    showAppDetails(appId, windowId) {
        const appData = this.getAppStoreApps().find(a => a.id === appId);
        if (!appData) return;
        const installed = this.getInstalledApps();
        const isInstalled = installed.includes(appId);
        const stars = this.getStarsHTML(appData.rating);
        
        const container = document.getElementById(`app-store-grid-${windowId}`);
        if (!container) return;
        
        container.innerHTML = `
            <div class="app-store-card" style="grid-column: 1 / -1; cursor: default;">
                <div style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
                    <div class="app-store-card-icon" style="font-size: 64px; width: 80px; height: 80px;">${appData.icon}</div>
                    <div style="flex: 1; min-width: 200px;">
                        <div class="app-store-card-name" style="font-size: 20px; margin-bottom: 8px;">${appData.name}</div>
                        <div class="app-store-card-desc" style="font-size: 14px; margin-bottom: 12px;">${appData.description}</div>
                        <div class="app-store-card-meta" style="margin-bottom: 12px;">
                            <span class="app-store-card-rating" style="font-size: 16px;">${stars} ${appData.rating}.0</span>
                            <span class="app-store-card-category">${appData.category}</span>
                            <span style="font-size: 11px; color: #64748b;">${appData.size || 'N/A'}</span>
                            <span style="font-size: 11px; color: #64748b;">v${appData.version || '1.0.0'}</span>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px;">
                            <button class="app-store-card-btn ${isInstalled ? 'open' : 'install'}" onclick="app.installApp('${appId}', '${windowId}')">${isInstalled ? 'Apri' : 'Installa'}</button>
                            ${isInstalled ? `<button class="app-store-card-btn uninstall" onclick="app.uninstallApp('${appId}', '${windowId}')">Disinstalla</button>` : ''}
                            <button class="app-store-card-btn" onclick="app.renderAppStore('${windowId}')" style="background: rgba(255,255,255,0.7); color: #64748b; border: 1px solid var(--auraos-border);">← Torna all'elenco</button>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--auraos-border);">
                    <h4 style="color: var(--auraos-text); margin-bottom: 12px; font-size: 14px;">📋 Descrizione</h4>
                    <p style="color: var(--auraos-text-secondary); font-size: 13px; line-height: 1.7; margin-bottom: 16px;">${appData.description}</p>
                    <h4 style="color: var(--auraos-text); margin-bottom: 12px; font-size: 14px;">📊 Informazioni</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 12px; color: var(--auraos-text-secondary);">
                        <div><strong>Versione:</strong> ${appData.version || '1.0.0'}</div>
                        <div><strong>Dimensione:</strong> ${appData.size || 'N/A'}</div>
                        <div><strong>Categoria:</strong> ${appData.category}</div>
                        <div><strong>Valutazione:</strong> ${stars} ${appData.rating}.0</div>
                        <div><strong>Stato:</strong> ${isInstalled ? '✅ Installata' : '⬇ Disponibile'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    filterAppStore(category, windowId) {
        if (!this.appStoreState[windowId]) {
            this.appStoreState[windowId] = { currentCategory: 'Tutte', searchQuery: '' };
        }
        this.appStoreState[windowId].currentCategory = category;

        const container = document.getElementById(`app-store-categories-${windowId}`);
        if (container) {
            container.querySelectorAll('.app-store-category-btn').forEach(btn => {
                btn.classList.toggle('active', btn.textContent === category);
            });
        }

        this.renderAppStore(windowId);
    }

    searchAppStore(query, windowId) {
        if (!this.appStoreState[windowId]) {
            this.appStoreState[windowId] = { currentCategory: 'Tutte', searchQuery: '' };
        }
        this.appStoreState[windowId].searchQuery = query;
        this.renderAppStore(windowId);
    }

    addStartMenuItem(appId) {
        const appData = this.getAppStoreApps().find(a => a.id === appId);
        if (!appData) return;
        const container = document.getElementById('start-menu-items');
        if (!container) return;
        const existing = container.querySelector(`[data-app-id="${appId}"]`);
        if (existing) {
            existing.style.display = '';
            return;
        }
        const separator = container.querySelector('.start-menu-separator');
        const btn = document.createElement('button');
        btn.className = 'start-menu-item';
        btn.dataset.appId = appId;
        btn.onclick = () => this.openApp(appId);
        btn.innerHTML = `
            <span class="start-menu-icon">${appData.icon}</span>
            <span>${appData.name}</span>
        `;
        if (separator) {
            container.insertBefore(btn, separator);
        } else {
            container.appendChild(btn);
        }
    }

    removeStartMenuItem(appId) {
        const container = document.getElementById('start-menu-items');
        if (!container) return;
        const btn = container.querySelector(`[data-app-id="${appId}"]`);
        if (btn) {
            btn.style.display = 'none';
        }
    }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AuraOSApp();
});
