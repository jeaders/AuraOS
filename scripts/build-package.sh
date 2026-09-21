#!/bin/bash
# Create AuraOS .deb package for installation on Debian/Ubuntu systems

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOTFS_DIR="${SCRIPT_DIR}/../rootfs"
PACKAGE_DIR="${SCRIPT_DIR}/../package-deb"
VERSION="1.0.0"

echo "=== Creating AuraOS .deb package ==="

# Clean previous package
rm -rf "${PACKAGE_DIR}"
mkdir -p "${PACKAGE_DIR}/DEBIAN"
mkdir -p "${PACKAGE_DIR}/usr/share/auraos"
mkdir -p "${PACKAGE_DIR}/usr/share/applications"
mkdir -p "${PACKAGE_DIR}/usr/share/icons/hicolor/192x192/apps"
mkdir -p "${PACKAGE_DIR}/etc/systemd/system"

# Copy desktop files
cp -r "${SCRIPT_DIR}/../desktop"/* "${PACKAGE_DIR}/usr/share/auraos/"

# Copy systemd service
cp "${ROOTFS_DIR}/etc/systemd/system/auraos.service" "${PACKAGE_DIR}/etc/systemd/system/auraos.service"

# Create desktop entry
cat << EOF | sudo tee "${PACKAGE_DIR}/usr/share/applications/auraos.desktop" > /dev/null
[Desktop Entry]
Type=Application
Name=AuraOS
Comment=AuraOS Desktop Environment
Exec=chromium --kiosk --no-first-run --disable-infobars file:///usr/share/auraos/index.html
Icon=auraos
Terminal=false
Categories=System;Desktop;
EOF

# Create control file
cat << EOF | sudo tee "${PACKAGE_DIR}/DEBIAN/control" > /dev/null
Package: auraos
Version: ${VERSION}
Section: x11
Priority: optional
Architecture: all
Depends: chromium, xorg, lightdm
Maintainer: AuraOS Team <team@auraos.dev>
Description: AuraOS Desktop Environment
 AuraOS is an educational Linux distribution with a modern web-based desktop.
 This package installs the AuraOS desktop environment.
EOF

# Create postinst script
cat << 'EOF' | sudo tee "${PACKAGE_DIR}/DEBIAN/postinst" > /dev/null
#!/bin/bash
set -e

# Enable AuraOS service
systemctl enable auraos.service || true

# Update desktop database
update-desktop-database || true

echo "AuraOS installed successfully!"
echo "Run 'systemctl start auraos' to start AuraOS"
EOF

sudo chmod +x "${PACKAGE_DIR}/DEBIAN/postinst"

# Build package
echo "Building .deb package..."
dpkg-deb --build "${PACKAGE_DIR}" "${SCRIPT_DIR}/../AuraOS-${VERSION}.deb"

echo "=== Package created ==="
echo "Package: ${SCRIPT_DIR}/../AuraOS-${VERSION}.deb"
