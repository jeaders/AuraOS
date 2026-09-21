.PHONY: help clean build kernel rootfs iso initramfs package test install-deps validate

VERSION = 1.0.0
ISO = AuraOS-$(VERSION).iso
DEB = AuraOS-$(VERSION).deb

help:
	@echo "AuraOS Build System"
	@echo ""
	@echo "Targets:"
	@echo "  build        - Build complete ISO (default)"
	@echo "  kernel       - Build kernel only"
	@echo "  initramfs    - Build initramfs only"
	@echo "  rootfs       - Build root filesystem only"
	@echo "  iso          - Build ISO only"
	@echo "  package      - Create .deb package"
	@echo "  test         - Test ISO in QEMU"
	@echo "  validate     - Validate all files"
	@echo "  install-deps - Install build dependencies"
	@echo "  clean        - Clean build artifacts"
	@echo "  help         - Show this help"
	@echo ""
	@echo "Examples:"
	@echo "  make build              # Build complete ISO"
	@echo "  make test               # Test ISO in QEMU"
	@echo "  make validate           # Validate files"

build: kernel initramfs rootfs iso

kernel:
	bash scripts/build-kernel.sh

initramfs:
	bash scripts/build-initramfs.sh

rootfs:
	bash scripts/build-rootfs.sh

iso:
	bash scripts/build-iso.sh

package:
	bash scripts/build-package.sh

test:
	qemu-system-x86_64 -cdrom $(ISO) -m 2G -enable-kvm

test-no-kvm:
	qemu-system-x86_64 -cdrom $(ISO) -m 2G

validate:
	@echo "Validating files..."
	@node --check desktop/js/app.js && echo "desktop/js/app.js OK" || echo "desktop/js/app.js ERROR"
	@node --check main.js && echo "main.js OK" || echo "main.js ERROR"
	@node --check preload.js && echo "preload.js OK" || echo "preload.js ERROR"
	@python3 -c "import json; json.load(open('package.json')); print('package.json OK')"
	@python3 -c "import json; json.load(open('desktop/manifest.json')); print('manifest.json OK')"
	@bash -n scripts/build-all.sh && echo "scripts OK" || echo "scripts ERROR"
	@test -f kernel/config && echo "kernel config OK" || echo "kernel config MISSING"
	@test -f boot/grub/grub.cfg && echo "grub config OK" || echo "grub config MISSING"
	@test -f rootfs/etc/passwd && echo "rootfs passwd OK" || echo "rootfs passwd MISSING"

install-deps:
	bash scripts/setup-dev.sh

clean:
	rm -rf kernel/build iso/build rootfs/build
	rm -f $(ISO) $(ISO).sha256 $(DEB)
	rm -rf package-deb
	rm -rf *.iso *.iso.sha256 *.deb
	find . -name "*.log" -delete
	find . -name "*~" -delete

.DEFAULT_GOAL := help
