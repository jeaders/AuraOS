#!/bin/bash
# Post-installation script for AuraOS Real Distro

set -e

echo "=== AuraOS Post-Installation ==="

# Update system
apt-get update
apt-get upgrade -y

# Install AuraOS branding
cp -r /usr/share/auraos/distro/branding/* /usr/share/ 2>/dev/null || true

# Install AuraOS desktop overlay
mkdir -p /opt/auraos
cp -r /usr/share/auraos/distro/auraos-desktop/* /opt/auraos/ 2>/dev/null || true

# Create desktop entry
cat > /usr/share/applications/auraos.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=AuraOS Desktop
Comment=AuraOS Modern Desktop Environment
Exec=chromium --kiosk --no-first-run --disable-infobars --disable-translate --disable-sync --no-default-browser-check file:///opt/auraos/index.html
Icon=auraos
Terminal=false
Categories=System;Desktop;
EOF

# Create AuraOS session
mkdir -p /usr/share/xsessions
cat > /usr/share/xsessions/auraos.desktop << 'EOF'
[Desktop Entry]
Name=AuraOS
Comment=AuraOS Desktop Environment
Exec=chromium --kiosk --no-first-run --disable-infobars --disable-translate --disable-sync --no-default-browser-check file:///opt/auraos/index.html
Type=Application
EOF

# Enable AuraOS services
systemctl enable auraos-desktop 2>/dev/null || true

# Configure Chromium for kiosk mode
mkdir -p /etc/chromium.d
cat > /etc/chromium.d/auraos << 'EOF'
CHROMIUM_FLAGS="--kiosk --no-first-run --disable-infobars --disable-translate --disable-sync --no-default-browser-check --disable-session-crashed-bubble --disable-restore-session-state"
EOF

# Set up AuraOS user session
mkdir -p /home/auraos/.config/autostart
cat > /home/auraos/.config/autostart/auraos.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=AuraOS Desktop
Exec=chromium --kiosk --no-first-run --disable-infobars --disable-translate --disable-sync --no-default-browser-check file:///opt/auraos/index.html
EOF

chmod +x /home/auraos/.config/autostart/auraos.desktop
chown -R auraos:auraos /home/auraos/.config

# Install AuraOS web apps
mkdir -p /usr/share/auraos/web-apps
cp -r /usr/share/auraos/distro/web-apps/* /usr/share/auraos/web-apps/ 2>/dev/null || true

# Create application menu entries
mkdir -p /usr/share/applications
for app in file-manager terminal browser settings; do
    cat > /usr/share/applications/auraos-${app}.desktop << EOF
[Desktop Entry]
Type=Application
Name=AuraOS ${app^}
Exec=chromium --app=file:///opt/auraos/apps/${app}/index.html
Icon=auraos-${app}
Terminal=false
Categories=System;Desktop;
EOF
done

echo "=== Post-installation complete ==="
echo "Please reboot to start AuraOS Desktop"
