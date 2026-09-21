#!/bin/bash
# AuraOS Post-Installation Script
# Configures geolocation, weather, browser, app store

set -e

echo "=== AuraOS Post-Installation ==="

# Update system
echo "Updating system..."
apt-get update
apt-get upgrade -y

# Enable services
echo "Enabling services..."
systemctl enable NetworkManager
systemctl enable lightdm
systemctl enable geoclue
systemctl enable fwupd

# Configure geolocation
echo "Configuring geolocation..."
cat > /etc/geoclue/geoclue.conf << 'EOF'
[general]
wifi=true
wifi-ssids=Cell/WiFi
wifi-ssids-psk=Cell/WiFi
wifi-ssids-psk2=Cell/WiFi
wifi-ssids-psk3=Cell/WiFi
wifi-ssids-psk4=Cell/WiFi
wifi-ssids-psk5=Cell/WiFi
wifi-ssids-psk6=Cell/WiFi
wifi-ssids-psk7=Cell/WiFi
wifi-ssids-psk8=Cell/WiFi
wifi-ssids-psk9=Cell/WiFi
wifi-ssids-psk10=Cell/WiFi
wifi-ssids-psk11=Cell/WiFi
wifi-ssids-psk12=Cell/WiFi
wifi-ssids-psk13=Cell/WiFi
wifi-ssids-psk14=Cell/WiFi
wifi-ssids-psk15=Cell/WiFi
wifi-ssids-psk16=Cell/WiFi
wifi-ssids-psk17=Cell/WiFi
wifi-ssids-psk18=Cell/WiFi
wifi-ssids-psk19=Cell/WiFi
wifi-ssids-psk20=Cell/WiFi
wifi-ssids-psk21=Cell/WiFi
wifi-ssids-psk22=Cell/WiFi
wifi-ssids-psk23=Cell/WiFi
wifi-ssids-psk24=Cell/WiFi
wifi-ssids-psk25=Cell/WiFi
wifi-ssids-psk26=Cell/WiFi
wifi-ssids-psk27=Cell/WiFi
wifi-ssids-psk28=Cell/WiFi
wifi-ssids-psk29=Cell/WiFi
wifi-ssids-psk30=Cell/WiFi
wifi-ssids-psk31=Cell/WiFi
wifi-ssids-psk32=Cell/WiFi
wifi-ssids-psk33=Cell/WiFi
wifi-ssids-psk34=Cell/WiFi
wifi-ssids-psk35=Cell/WiFi
wifi-ssids-psk36=Cell/WiFi
wifi-ssids-psk37=Cell/WiFi
wifi-ssids-psk38=Cell/WiFi
wifi-ssids-psk39=Cell/WiFi
wifi-ssids-psk40=Cell/WiFi
wifi-ssids-psk41=Cell/WiFi
wifi-ssids-psk42=Cell/WiFi
wifi-ssids-psk43=Cell/WiFi
wifi-ssids-psk44=Cell/WiFi
wifi-ssids-psk45=Cell/WiFi
wifi-ssids-psk46=Cell/WiFi
wifi-ssids-psk47=Cell/WiFi
wifi-ssids-psk48=Cell/WiFi
wifi-ssids-psk49=Cell/WiFi
wifi-ssids-psk50=Cell/WiFi
wifi-ssids-psk51=Cell/WiFi
wifi-ssids-psk52=Cell/WiFi
wifi-ssids-psk53=Cell/WiFi
wifi-ssids-psk54=Cell/WiFi
wifi-ssids-psk55=Cell/WiFi
wifi-ssids-psk56=Cell/WiFi
wifi-ssids-psk57=Cell/WiFi
wifi-ssids-psk58=Cell/WiFi
wifi-ssids-psk59=Cell/WiFi
wifi-ssids-psk60=Cell/WiFi
wifi-ssids-psk61=Cell/WiFi
wifi-ssids-psk62=Cell/WiFi
wifi-ssids-psk63=Cell/WiFi
wifi-ssids-psk64=Cell/WiFi
EOF

# Install browser extensions for weather
echo "Configuring browser..."
mkdir -p /usr/share/auraos/browser-extensions

# Configure Chromium
mkdir -p /etc/chromium.d
cat > /etc/chromium.d/auraos << 'EOF'
CHROMIUM_FLAGS="--no-first-run --disable-infobars --disable-translate --disable-sync --no-default-browser-check"
EOF

# Install app store data
echo "Setting up app store..."
mkdir -p /usr/share/auraos/app-store
cat > /usr/share/auraos/app-store/apps.json << 'EOF'
{
  "apps": [
    {
      "id": "chromium",
      "name": "Chromium",
      "description": "Fast, secure web browser",
      "category": "Internet",
      "icon": "🌐",
      "package": "chromium",
      "installed": true
    },
    {
      "id": "firefox",
      "name": "Firefox",
      "description": "Open source web browser",
      "category": "Internet",
      "icon": "🦊",
      "package": "firefox-esr",
      "installed": true
    },
    {
      "id": "libreoffice",
      "name": "LibreOffice",
      "description": "Office suite",
      "category": "Office",
      "icon": "📄",
      "package": "libreoffice",
      "installed": true
    },
    {
      "id": "gimp",
      "name": "GIMP",
      "description": "Image editor",
      "category": "Graphics",
      "icon": "🎨",
      "package": "gimp",
      "installed": true
    },
    {
      "id": "vlc",
      "name": "VLC",
      "description": "Media player",
      "category": "Multimedia",
      "icon": "🎬",
      "package": "vlc",
      "installed": true
    }
  ]
}
EOF

# Configure meteo widget
echo "Configuring weather..."
cat > /usr/share/auraos/weather-config.json << 'EOF'
{
  "provider": "openweathermap",
  "api_key": "",
  "location": "Roma,IT",
  "units": "metric",
  "language": "it"
}
EOF

# Create desktop entry for AuraOS
cat > /usr/share/applications/auraos-desktop.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=AuraOS Desktop
Comment=Modern web-based desktop overlay
Exec=chromium --kiosk --no-first-run --disable-infobars --disable-translate --disable-sync --no-default-browser-check file:///usr/share/auraos/index.html
Icon=auraos
Terminal=false
Categories=System;Desktop;
EOF

# Install AuraOS branding
mkdir -p /usr/share/auraos
cp -r /usr/share/auraos/distro/branding/* /usr/share/ 2>/dev/null || true

# Enable AuraOS desktop autostart
mkdir -p /home/auraos/.config/autostart
cp /usr/share/applications/auraos-desktop.desktop /home/auraos/.config/autostart/
chmod +x /home/auraos/.config/autostart/auraos-desktop.desktop
chown -R auraos:auraos /home/auraos/.config

echo ""
echo "========================================="
echo "  Post-installation complete"
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Reboot the system"
echo "  2. Configure your location for weather"
echo "  3. Install additional apps from App Store"
echo "  4. Enjoy AuraOS!"
echo ""
