// ===== WebOS Educativo - Main Application =====
class WebOSApp {
    constructor() {
        this.state = {
            profile: localStorage.getItem('webos_profile') || null,
            userMode: localStorage.getItem('webos_mode') || 'adulto',
            iconSize: localStorage.getItem('webos_iconSize') || 'medium',
            wallpaper: localStorage.getItem('webos_wallpaper') || 'gradient',
            soundsEnabled: localStorage.getItem('webos_sounds') !== 'false',
            openWindows: [],
            windowZIndex: 100,
            activeWindow: null,
            startMenuOpen: false,
            filesystem: null,
            tutorAI: null,
            contextMenuOpen: false,
            currentSnapWindow: null,
            bootTime: Date.now(),
            fmView: localStorage.getItem('webos_fm_view') || 'grid',
            fmSort: { field: 'name', direction: 'asc' },
            clipboard: { type: null, items: [] },
            fmSelectedItems: [],
            trash: [],
            notifications: [],
            launcherOpen: false,
            launcherSelectedIndex: -1,
            launcherCategory: 'all',
            recentApps: [],
            recentFiles: [],
            fmCurrentPath: {},
            notificationCenterOpen: false,
        };

        try {
            const savedTrash = localStorage.getItem('webos_trash');
            if (savedTrash) this.state.trash = JSON.parse(savedTrash);
        } catch (e) { this.state.trash = []; }

        try {
            const savedNotifs = localStorage.getItem('webos_notifications');
            if (savedNotifs) this.state.notifications = JSON.parse(savedNotifs);
        } catch (e) { this.state.notifications = []; }

        try {
            const savedRecentApps = localStorage.getItem('webos_recent_apps');
            if (savedRecentApps) this.state.recentApps = JSON.parse(savedRecentApps);
        } catch (e) { this.state.recentApps = []; }

        try {
            const savedRecentFiles = localStorage.getItem('webos_recent_files');
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
        this.initFilesystem();
        this.initSoundEngine();
        this.setupEventListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.updateNotificationBadge();
        if (this.state.profile) {
            this.boot();
        } else {
            this.showProfileSelection();
        }
    }

    initFilesystem() {
        const saved = localStorage.getItem('webos_filesystem');
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
            localStorage.setItem('webos_filesystem', JSON.stringify(this.state.filesystem));
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
                    this.updateTaskbarApps();
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
                this.closeLauncher();
                this.closeNotificationCenter();
            }
            if (e.key === 'F10' && e.ctrlKey) {
                e.preventDefault();
                this.minimizeAllWindows();
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
    showProfileSelection() {
        const bootScreen = document.getElementById('boot-screen');
        const progressBar = document.getElementById('boot-progress-bar');
        const profileSelect = document.getElementById('profile-select');
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
        this.addNotification('Accesso effettuato', `Profilo "${profile}" selezionato.`, 'success');
    }

    boot() {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
            bootScreen.classList.add('hidden');
        }
        const desktop = document.getElementById('desktop');
        const taskbar = document.getElementById('taskbar');
        const startMenuUser = document.getElementById('start-menu-user');
        desktop.classList.remove('hidden');
        taskbar.classList.remove('hidden');
        const names = {
            bambino: '👦 Bambino',
            adulto: '👤 Utente',
            anziano: '👴 Nonno'
        };
        startMenuUser.textContent = names[this.state.profile] || '👤 Utente';
        this.applySettings();
        this.createDesktopIcons();
        this.initWeatherWidget();
        this.initParallax();
        this.initClockWidget();
        setTimeout(() => {
            this.showTutorMessage('Ciao! Benvenuto nel WebOS Educativo! Sono il tuo Tutor AI. Clicca su "Guida" per iniziare un tour, oppure esplora pure le app!');
        }, 1000);
        if (this.state.userMode === 'anziano') {
            document.getElementById('voice-btn').classList.remove('hidden');
        }
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

    // ===== Weather Widget =====
    initWeatherWidget() {
        const existing = document.getElementById('weather-widget');
        if (existing) existing.remove();
        const widget = document.createElement('div');
        widget.id = 'weather-widget';
        widget.className = 'weather-widget';
        const cached = localStorage.getItem('webos_weather');
        let weatherData;
        try {
            weatherData = cached ? JSON.parse(cached) : this.generateWeatherData();
        } catch (e) {
            weatherData = this.generateWeatherData();
        }
        localStorage.setItem('webos_weather', JSON.stringify(weatherData));
        widget.innerHTML = this.getWeatherWidgetHTML(weatherData);
        const desktop = document.getElementById('desktop');
        desktop.appendChild(widget);
        const refreshBtn = document.getElementById('weather-refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newData = this.generateWeatherData();
                localStorage.setItem('webos_weather', JSON.stringify(newData));
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
                    <p><strong>Sistema:</strong> WebOS Educativo v1.0</p>
                    <p><strong>Utente:</strong> ${this.state.profile || 'Non selezionato'}</p>
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
            win.style.left = '0px';
            win.style.top = '0px';
            win.style.width = window.innerWidth / 2 + 'px';
            win.style.height = (window.innerHeight - 48) + 'px';
            win.style.borderRadius = '0px';
            this.state.currentSnapWindow = windowId;
            this.state.snapState = 'left';
            this.playSound('success');
            return;
        }
        if (Math.abs(rect.right - window.innerWidth) < edgeThreshold && rect.width > 300) {
            win.style.left = (window.innerWidth / 2) + 'px';
            win.style.top = '0px';
            win.style.width = window.innerWidth / 2 + 'px';
            win.style.height = (window.innerHeight - 48) + 'px';
            win.style.borderRadius = '0px';
            this.state.currentSnapWindow = windowId;
            this.state.snapState = 'right';
            this.playSound('success');
            return;
        }
        if (rect.top < snapThreshold && !windowData.maximized) {
            win.style.left = '0px';
            win.style.top = '0px';
            win.style.width = window.innerWidth + 'px';
            win.style.height = (window.innerHeight - 48) + 'px';
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
            win.style.left = windowData.prevX || '50px';
            win.style.top = windowData.prevY || '50px';
            win.style.width = windowData.prevWidth || '600px';
            win.style.height = windowData.prevHeight || '450px';
            win.style.borderRadius = '10px';
            windowData.x = parseInt(windowData.prevX || '50');
            windowData.y = parseInt(windowData.prevY || '50');
            windowData.width = parseInt(windowData.prevWidth || '600');
            windowData.height = parseInt(windowData.prevHeight || '450');
        }
        if (this.state.snapState === 'maximized' && windowData) {
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
        this.updateTaskbarApps();
    }

    // ===== Sound Engine =====
    initSoundEngine() {
        this.audioContext = null;
        this.state.soundsEnabled = localStorage.getItem('webos_sounds') !== 'false';
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
        localStorage.setItem('webos_sounds', enabled);
        this.showToast('Audio', enabled ? 'Effetti sonori attivati.' : 'Effetti sonori disattivati.', 'info', 2000);
        if (enabled) this.playSound('success');
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
        const windowData = {
            id: windowId,
            appId: appId,
            title: appConfig.name,
            icon: appConfig.icon,
            x: 50 + (this.state.openWindows.length * 30),
            y: 50 + (this.state.openWindows.length * 30),
            width: appId === 'tutor' ? 400 : appId === 'notepad' ? 550 : appId === 'terminal' ? 700 : appId === 'task-manager' ? 600 : 600,
            height: appId === 'tutor' ? 500 : appId === 'notepad' ? 500 : appId === 'terminal' ? 450 : appId === 'task-manager' ? 500 : 450,
            minimized: false,
            maximized: false,
            prevX: null,
            prevY: null,
            prevWidth: null,
            prevHeight: null,
        };
        this.state.openWindows.push(windowData);
        this.renderWindow(windowData);
        this.updateTaskbarApps();
        this.focusWindow(windowId);
        this.playSound('open');
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
            default:
                return '<p>App in caricamento...</p>';
        }
    }

    focusWindow(windowId) {
        document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
        const win = document.getElementById(windowId);
        if (win) {
            win.classList.add('active');
            win.style.zIndex = ++this.state.windowZIndex;
            this.state.activeWindow = windowId;
            this.updateTaskbarApps();
        }
    }

    minimizeWindow(windowId) {
        this.playSound('close');
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
            win.style.left = '0px';
            win.style.top = '0px';
            win.style.width = '100%';
            win.style.height = '100%';
            win.style.borderRadius = '0px';
        } else {
            win.classList.remove('maximized');
            win.style.left = windowData.prevX || '50px';
            win.style.top = windowData.prevY || '50px';
            win.style.width = windowData.prevWidth || '600px';
            win.style.height = windowData.prevHeight || '450px';
            win.style.borderRadius = '10px';
        }
        this.state.currentSnapWindow = null;
        this.state.snapState = null;
    }

    closeWindow(windowId) {
        this.playSound('close');
        const win = document.getElementById(windowId);
        if (win) {
            win.style.animation = 'windowClose 0.15s ease forwards';
            setTimeout(() => {
                win.remove();
                this.state.openWindows = this.state.openWindows.filter(w => w.id !== windowId);
                this.updateTaskbarApps();
            }, 150);
        }
        const winData = this.state.openWindows.find(w => w.id === windowId);
        if (winData) {
            this.showToast('Chiusa', `"${winData.title}" chiusa.`, 'info', 2000);
            this.addNotification('Finestra chiusa', `"${winData.title}" è stata chiusa.`, 'info');
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
                this.playSound('click');
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
            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (this.state.openWindows.length > 1) {
                    this.minimizeAllWindows();
                }
            });
            container.appendChild(btn);
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
            win.style.top = Math.max(0, initialY + dy) + 'px';
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
        const notes = localStorage.getItem('webos_notes');
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
                localStorage.setItem('webos_notes', textarea.value);
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
            localStorage.removeItem('webos_notes');
            if (statusEl) statusEl.textContent = 'Pronto';
            if (wordcountEl) wordcountEl.textContent = '0 parole';
            this.playSound('success');
        }
    }

    // ===== Terminal App =====
    getTerminalContent(windowId) {
        return `
            <div class="terminal-wrapper" id="terminal-wrapper-${windowId}">
                <div class="terminal-header">
                    <span class="terminal-header-dot red"></span>
                    <span class="terminal-header-dot yellow"></span>
                    <span class="terminal-header-dot green"></span>
                    <span class="terminal-header-title">Terminale - bash</span>
                </div>
                <div class="terminal-body" id="terminal-body-${windowId}">
                    <div class="terminal-output" id="terminal-output-${windowId}"></div>
                    <div class="terminal-input-line">
                        <span class="terminal-prompt" id="terminal-prompt-${windowId}">utente@webos:~$&nbsp;</span>
                        <input type="text" class="terminal-input" id="terminal-input-${windowId}" autocomplete="off" spellcheck="false" autofocus>
                    </div>
                </div>
            </div>
        `;
    }

    initTerminal(windowId) {
        const input = document.getElementById(`terminal-input-${windowId}`);
        const output = document.getElementById(`terminal-output-${windowId}`);
        const body = document.getElementById(`terminal-body-${windowId}`);
        if (!input || !output) return;

        this.terminalState = this.terminalState || {};
        this.terminalState[windowId] = {
            cwd: '/',
            history: [],
            historyIndex: -1,
        };
        const ts = this.terminalState[windowId];

        const welcomeLines = [
            { type: 'welcome', text: 'WebOS Educativo - Terminale v1.0' },
            { type: 'welcome', text: 'Digita "help" per vedere i comandi disponibili.' },
            { type: 'blank' },
        ];
        welcomeLines.forEach(l => this.terminalPrint(windowId, l.text, l.type));

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                input.value = '';
                if (cmd) {
                    ts.history.push(cmd);
                    ts.historyIndex = ts.history.length;
                    this.terminalPrint(windowId, `utente@webos:${ts.cwd === '/' ? '~' : ts.cwd}$ ${cmd}`, 'command');
                }
                this.terminalExecute(windowId, cmd);
                input.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (ts.historyIndex > 0) {
                    ts.historyIndex--;
                    input.value = ts.history[ts.historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (ts.historyIndex < ts.history.length - 1) {
                    ts.historyIndex++;
                    input.value = ts.history[ts.historyIndex];
                } else {
                    ts.historyIndex = ts.history.length;
                    input.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                this.terminalTabComplete(windowId, input.value);
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
        const ts = this.terminalState[windowId];
        if (!cmdLine) return;
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
                    ['clear', 'Pulisce lo schermo'],
                    ['whoami', 'Mostra l\'utente corrente'],
                    ['date', 'Mostra data e ora correnti'],
                    ['neofetch', 'Mostra informazioni di sistema'],
                    ['rm <nome>', 'Elimina un file o cartella'],
                    ['history', 'Mostra la cronologia comandi'],
                ];
                cmds.forEach(([c, d]) => this.terminalPrint(windowId, `  ${c.padEnd(20)} ${d}`, 'output'));
                break;

            case 'ls': {
                const folder = this.getFolderByPath(ts.cwd);
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
                    ts.cwd = '/';
                } else if (args[0] === '..') {
                    if (ts.cwd !== '/') {
                        const parts = ts.cwd.split('/').filter(Boolean);
                        parts.pop();
                        ts.cwd = parts.length === 0 ? '/' : '/' + parts.join('/');
                    }
                } else if (args[0].startsWith('/')) {
                    const folder = this.getFolderByPath(args[0]);
                    if (folder && folder.type === 'folder') {
                        ts.cwd = args[0];
                    } else {
                        this.terminalPrint(windowId, `cd: ${args[0]}: Nessuna tale directory`, 'error');
                    }
                } else {
                    const newPath = ts.cwd === '/' ? `/${args[0]}` : `${ts.cwd}/${args[0]}`;
                    const folder = this.getFolderByPath(newPath);
                    if (folder && folder.type === 'folder') {
                        ts.cwd = newPath;
                    } else {
                        this.terminalPrint(windowId, `cd: ${args[0]}: Nessuna tale directory`, 'error');
                    }
                }
                this.terminalUpdatePrompt(windowId);
                break;
            }
            case 'pwd':
                this.terminalPrint(windowId, ts.cwd, 'output');
                break;

            case 'mkdir': {
                if (!args[0]) {
                    this.terminalPrint(windowId, 'mkdir: manca il nome della cartella', 'error');
                    break;
                }
                const folder = this.getFolderByPath(ts.cwd);
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
                const folder = this.getFolderByPath(ts.cwd);
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
                const fPath = args[0].startsWith('/') ? args[0] : ts.cwd === '/' ? `/${args[0]}` : `${ts.cwd}/${args[0]}`;
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
                this.terminalPrint(windowId, this.state.profile || 'utente', 'output');
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
                const targetFolder = this.getFolderByPath(ts.cwd);
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
                ts.history.forEach((h, i) => this.terminalPrint(windowId, `  ${(i + 1).toString().padStart(4)}  ${h}`, 'output'));
                break;

            default:
                this.terminalPrint(windowId, `bash: ${cmd}: comando non trovato`, 'error');
        }
    }

    terminalUpdatePrompt(windowId) {
        const ts = this.terminalState[windowId];
        if (!ts) return;
        const prompt = document.getElementById(`terminal-prompt-${windowId}`);
        if (prompt) {
            const displayPath = ts.cwd === '/' ? '~' : `~${ts.cwd}`;
            prompt.innerHTML = `utente@webos:${displayPath}$&nbsp;`;
        }
    }

    terminalTabComplete(windowId, currentInput) {
        const ts = this.terminalState[windowId];
        const input = document.getElementById(`terminal-input-${windowId}`);
        if (!input || !ts) return;
        const parts = currentInput.split(' ');
        const lastPart = parts[parts.length - 1];
        const isCommand = parts.length === 1;
        const folder = this.getFolderByPath(ts.cwd);

        let matches = [];
        if (isCommand) {
            const commands = ['help', 'ls', 'cd', 'pwd', 'mkdir', 'touch', 'cat', 'echo', 'clear', 'whoami', 'date', 'neofetch', 'rm', 'history'];
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
        const user = this.state.profile || 'utente';
        const hostname = 'webos';
        const os = 'WebOS Educativo v1.0';
        const kernel = '5.15.0-webos';
        const uptime = this.getUptime();
        const shell = 'bash 5.1.16';
        const resolution = `${window.innerWidth}x${window.innerHeight}`;
        const de = 'WebOS Desktop';
        const theme = 'Glassmorphism';
        const icons = 'Noto Color';
        const term = 'WebOS Terminal';
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
            'games': '🎮', 'calculator': '🧮',
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
        const notes = localStorage.getItem('webos_notes');
        const editor = document.getElementById(`notepad-editor-${windowId}`);
        const statusEl = document.getElementById(`notepad-status-${windowId}`);
        const wordcountEl = document.getElementById(`notepad-wordcount-${windowId}`);
        if (!editor) return;
        editor.textContent = notes || '';
        editor.style.fontSize = localStorage.getItem('webos_notes_fontsize') || '14px';
        this.updateNotepadWordCount(windowId);
        let saveTimeout;
        editor.addEventListener('input', () => {
            if (statusEl) statusEl.textContent = 'Non salvato...';
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                localStorage.setItem('webos_notes', editor.textContent);
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
        const current = parseInt(localStorage.getItem('webos_notes_fontsize') || '14');
        const newSize = Math.max(10, Math.min(28, current + delta * 2));
        editor.style.fontSize = newSize + 'px';
        localStorage.setItem('webos_notes_fontsize', newSize + 'px');
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
        localStorage.setItem('webos_fm_view', view);
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
                    <li>Se vedi qualcosa che non ti piace, chiudi la pagina e chiedi a un adulto</li>
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
                    <li>Chiedi a un adulto se vedi qualcosa di strano</li>
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
                    <li>Alcuni contenuti sono per adulti: chiedi a un adulto prima di guardare</li>
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
                    <li>Chiedi a un adulto prima di scaricare cose nuove</li>
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
                    const val = urlInput.value.replace('webos://', '').trim().toLowerCase();
                    const pages = this.getBrowserPages();
                    if (pages.includes(val)) {
                        this.navigateBrowser(val);
                    } else {
                        urlInput.value = 'webos://home';
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
        const response = this.tutorAI.getResponse(message, this.state.userMode);
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
            <div class="settings-section">
                <h3>🎨 Aspetto</h3>
                <div class="settings-option">
                    <span class="settings-label">Sfondo</span>
                    <div class="settings-control">
                        ${Object.keys(this.wallpapers).filter(w => !['aurora','ocean','matrix'].includes(w)).map(w => `
                            <button class="settings-btn ${this.state.wallpaper === w ? 'active' : ''}"
                                    onclick="app.setWallpaper('${w}')">${w.charAt(0).toUpperCase() + w.slice(1)}</button>
                        `).join('')}
                    </div>
                </div>
                <div class="settings-option">
                    <span class="settings-label">Sfondo animato</span>
                    <div class="settings-control">
                        ${['aurora', 'ocean', 'matrix'].map(w => `
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
    }

    setWallpaper(wallpaper) {
        this.state.wallpaper = wallpaper;
        localStorage.setItem('webos_wallpaper', wallpaper);
        this.applySettings();
        this.showToast('Sfondo cambiato', `Nuovo sfondo: "${wallpaper}".`, 'success');
        this.addNotification('Sfondo', `Sfondo cambiato in "${wallpaper}".`, 'info');
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
            localStorage.removeItem('webos_filesystem');
            this.initFilesystem();
            this.showToast('Ripristino', 'File ripristinati ai valori predefiniti.', 'success');
            this.addNotification('File ripristinati', 'Il filesystem è stato ripristinato ai valori predefiniti.', 'info');
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
        this.updateTaskbarApps();
        this.showToast('Spegnimento', 'Il sistema si sta spegnendo.', 'info');
        this.addNotification('Spegnimento', 'Il sistema si sta spegnendo.', 'info');
    }

    wakeUp() {
        const shutdownScreen = document.getElementById('shutdown-screen');
        shutdownScreen.classList.add('hidden');
        this.showToast('Riaccensione', 'Bentornato nel WebOS Educativo!', 'success');
        this.addNotification('Riaccensione', 'Bentornato nel WebOS Educativo!', 'success');
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

    addNotification(title, message, type = 'info') {
        const notif = {
            id: Date.now() + Math.random(),
            title,
            message,
            type,
            time: new Date().toISOString(),
            read: false
        };
        this.state.notifications.unshift(notif);
        if (this.state.notifications.length > 20) this.state.notifications.pop();
        this.saveNotifications();
        this.updateNotificationBadge();
    }

    saveNotifications() {
        try {
            localStorage.setItem('webos_notifications', JSON.stringify(this.state.notifications));
        } catch (e) { }
    }

    saveTrash() {
        try {
            localStorage.setItem('webos_trash', JSON.stringify(this.state.trash));
        } catch (e) { }
    }

    saveRecentApps() {
        try {
            localStorage.setItem('webos_recent_apps', JSON.stringify(this.state.recentApps));
        } catch (e) { }
    }

    saveRecentFiles() {
        try {
            localStorage.setItem('webos_recent_files', JSON.stringify(this.state.recentFiles));
        } catch (e) { }
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        if (!badge) return;
        const unread = this.state.notifications.filter(n => !n.read).length;
        badge.textContent = unread;
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
        if (center) center.classList.add('visible');
        this.state.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationBadge();
        this.renderNotificationList();
    }

    closeNotificationCenter() {
        this.state.notificationCenterOpen = false;
        const center = document.getElementById('notification-center');
        if (center) center.classList.remove('visible');
    }

    renderNotificationList() {
        const list = document.getElementById('notification-list');
        if (!list) return;
        if (this.state.notifications.length === 0) {
            list.innerHTML = '<div class="notification-empty">Nessuna notifica</div>';
            return;
        }
        const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
        list.innerHTML = this.state.notifications.map(n => {
            const time = new Date(n.time);
            const timeStr = time.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
            return `
                <div class="notification-item ${n.read ? '' : 'unread'}">
                    <span class="notification-item-icon">${icons[n.type] || 'ℹ️'}</span>
                    <div class="notification-item-body">
                        <div class="notification-item-title">${n.title}</div>
                        ${n.message ? `<div class="notification-item-text">${n.message}</div>` : ''}
                        <div class="notification-item-time">${timeStr}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    clearAllNotifications() {
        this.state.notifications = [];
        this.saveNotifications();
        this.updateNotificationBadge();
        this.renderNotificationList();
        this.showToast('Notifiche cancellate', 'Tutte le notifiche sono state eliminate.', 'info');
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
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WebOSApp();
});
