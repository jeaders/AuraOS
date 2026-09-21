#!/bin/bash
# Create AuraOS live system configuration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOTFS_DIR="${SCRIPT_DIR}/../rootfs"

echo "=== Configuring AuraOS Live System ==="

# Create live system config
sudo mkdir -p "${ROOTFS_DIR}/etc/live"

cat << EOF | sudo tee "${ROOTFS_DIR}/etc/live/config" > /dev/null
# AuraOS Live System Configuration
LIVE_CONFIG="auraos"
LIVE_USER="auraos"
LIVE_HOSTNAME="auraos"
PERSISTENT=0
PERSISTENT_PASSWORD=""
PERSISTENT_ENCRYPTION=0
EOF

# Configure casper (Ubuntu live system framework)
sudo mkdir -p "${ROOTFS_DIR}/etc/casper"
cat << EOF | sudo tee "${ROOTFS_DIR}/etc/casper.conf" > /dev/null
# AuraOS Live System Configuration
export LIVE_USER=auraos
export LIVE_USER_FULLNAME="AuraOS User"
export LIVE_HOSTNAME=auraos
export UBUNTU_KERNEL_CMDLINE="quiet splash"
export LANG=it_IT.UTF-8
export LANGUAGE=it_IT:it
export LC_ALL=it_IT.UTF-8
EOF

# Create live script
sudo mkdir -p "${ROOTFS_DIR}/usr/bin"
cat << 'EOF' | sudo tee "${ROOTFS_DIR}/usr/bin/auraos-live" > /dev/null
#!/bin/bash
# AuraOS Live System Script

# Set up live environment
export HOME=/home/auraos
export USER=auraos
export LOGNAME=auraos
export DISPLAY=:0

# Start Chromium in kiosk mode
if [ -f /usr/share/auraos/index.html ]; then
    /usr/bin/chromium \
        --kiosk \
        --no-first-run \
        --disable-infobars \
        --disable-session-crashed-bubble \
        --disable-restore-session-state \
        --disable-translate \
        --disable-sync \
        --no-default-browser-check \
        file:///usr/share/auraos/index.html
fi
EOF

sudo chmod +x "${ROOTFS_DIR}/usr/bin/auraos-live"

echo "=== Live system configured ==="
