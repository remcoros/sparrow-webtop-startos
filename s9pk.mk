# ** Plumbing. DO NOT EDIT **.
# This file is imported by ./Makefile. Make edits there

PACKAGE_ID := $(shell awk -F"'" '/id:/ {print $$2}' startos/manifest/index.ts)
INGREDIENTS := $(shell start-cli s9pk list-ingredients 2>/dev/null)
ARCHES ?= x86 arm riscv
TARGETS ?= arches

# INSTALL_S9PK can be set explicitly to pin the file used by the install target.
# The arch shim targets (x86/arm/riscv) set it automatically so that
# 'make x86 install' or 'make arm install' always installs the correct arch.
# When called standalone ('make install'), it falls back to the most-recently
# modified .s9pk.
INSTALL_S9PK ?=

# Propagate INSTALL_S9PK from arch goals found in MAKECMDGOALS.
# Note: BASE_NAME is not yet defined here, so we derive the prefix directly.
_INSTALL_PREFIX := $(if $(VARIANT),$(PACKAGE_ID)_$(VARIANT),$(PACKAGE_ID))
ifeq ($(INSTALL_S9PK),)
  ifneq ($(filter x86 x86_64,$(MAKECMDGOALS)),)
    INSTALL_S9PK := $(_INSTALL_PREFIX)_x86_64.s9pk
  else ifneq ($(filter arm arm64 aarch64,$(MAKECMDGOALS)),)
    INSTALL_S9PK := $(_INSTALL_PREFIX)_aarch64.s9pk
  else ifneq ($(filter riscv riscv64,$(MAKECMDGOALS)),)
    INSTALL_S9PK := $(_INSTALL_PREFIX)_riscv64.s9pk
  endif
endif
ifdef VARIANT
BASE_NAME := $(PACKAGE_ID)_$(VARIANT)
else
BASE_NAME := $(PACKAGE_ID)
endif

.PHONY: all arches aarch64 x86_64 riscv64 arm arm64 x86 riscv arch/* clean install check-deps check-init package ingredients
.DELETE_ON_ERROR:
.SECONDARY:

define SUMMARY
	@manifest=$$(start-cli s9pk inspect $(1) manifest); \
	size=$$(du -h $(1) | awk '{print $$1}'); \
	title=$$(printf '%s' "$$manifest" | jq -r .title); \
	version=$$(printf '%s' "$$manifest" | jq -r .version); \
	arches=$$(printf '%s' "$$manifest" | jq -r '[.images[].arch // []] | flatten | unique | join(", ")'); \
	sdkv=$$(printf '%s' "$$manifest" | jq -r .sdkVersion); \
	gitHash=$$(printf '%s' "$$manifest" | jq -r .gitHash | sed -E 's/(.*-modified)$$/\x1b[0;31m\1\x1b[0m/'); \
	printf "\n"; \
	printf "\033[1;32m✅ Build Complete!\033[0m\n"; \
	printf "\n"; \
	printf "\033[1;37m📦 $$title\033[0m   \033[36mv$$version\033[0m\n"; \
	printf "───────────────────────────────\n"; \
	printf " \033[1;36mFilename:\033[0m   %s\n" "$(1)"; \
	printf " \033[1;36mSize:\033[0m       %s\n" "$$size"; \
	printf " \033[1;36mArch:\033[0m       %s\n" "$$arches"; \
	printf " \033[1;36mSDK:\033[0m        %s\n" "$$sdkv"; \
	printf " \033[1;36mGit:\033[0m        %s\n" "$$gitHash"; \
	echo ""
endef

all: $(TARGETS)

arches: $(ARCHES)

universal: $(BASE_NAME).s9pk
	$(call SUMMARY,$<)

arch/%: $(BASE_NAME)_%.s9pk
	$(call SUMMARY,$<)

x86 x86_64: arch/x86_64
arm arm64 aarch64: arch/aarch64
riscv riscv64: arch/riscv64

$(BASE_NAME).s9pk: $(INGREDIENTS) .git/HEAD .git/index
	@$(MAKE) --no-print-directory ingredients
	@echo "   Packing '$@'..."
	start-cli s9pk pack -o $@

$(BASE_NAME)_%.s9pk: $(INGREDIENTS) .git/HEAD .git/index
	@$(MAKE) --no-print-directory ingredients
	@echo "   Packing '$@'..."
	start-cli s9pk pack --arch=$* -o $@

ingredients: $(INGREDIENTS)
	@echo "   Re-evaluating ingredients..."

install: | check-deps check-init
	@HOST=$$(awk -F'/' '/^host:/ {print $$3}' ~/.startos/config.yaml); \
	if [ -z "$$HOST" ]; then \
		echo "Error: You must define \"host: http://server-name.local\" in ~/.startos/config.yaml"; \
		exit 1; \
	fi; \
	if [ -n "$(INSTALL_S9PK)" ]; then \
		S9PK="$(INSTALL_S9PK)"; \
	else \
		S9PK=$$(ls -t *.s9pk 2>/dev/null | head -1); \
	fi; \
	if [ -z "$$S9PK" ]; then \
		echo "Error: No .s9pk file found. Run 'make' first."; \
		exit 1; \
	fi; \
	printf "\n🚀 Installing %s to %s ...\n" "$$S9PK" "$$HOST"; \
	start-cli package install -s "$$S9PK"

check-deps:
	@command -v start-cli >/dev/null || \
		(echo "Error: start-cli not found. Please see https://docs.start9.com/latest/developer-guide/sdk/installing-the-sdk" && exit 1)
	@command -v npm >/dev/null || \
		(echo "Error: npm not found. Please install Node.js and npm." && exit 1)

check-init:
	@if [ ! -f ~/.startos/developer.key.pem ]; then \
		echo "Initializing StartOS developer environment..."; \
		start-cli init-key; \
	fi

javascript/index.js: $(shell find startos -type f) tsconfig.json node_modules
	npm run build

node_modules: package-lock.json
	npm ci

package-lock.json: package.json
	npm i

clean:
	@echo "Cleaning up build artifacts..."
	@rm -rf $(PACKAGE_ID).s9pk $(PACKAGE_ID)_x86_64.s9pk $(PACKAGE_ID)_aarch64.s9pk $(PACKAGE_ID)_riscv64.s9pk javascript node_modules