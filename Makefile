SPARROW_VERSION := 2.2.3
SPARROW_DEBVERSION := 2.2.3-1
SPARROW_PGP_SIG := E94618334C674B40
# sha256 hashes can be found in https://github.com/mikefarah/yq/releases/download/v4.40.7/checksums-bsd
YQ_VERSION := 4.40.7
YQ_SHA_AMD64 := 4f13ee9303a49f7e8f61e7d9c87402e07cc920ae8dfaaa8c10d7ea1b8f9f48ed
YQ_SHA_ARM64 := a84f2c8f105b70cd348c3bf14048aeb1665c2e7314cbe9aaff15479f268b8412

PKG_ID := $(shell yq e ".id" manifest.yaml)
PKG_VERSION := $(shell yq e ".version" manifest.yaml)
TS_FILES := $(shell find ./ -name \*.ts)
ROOT_FILES := $(shell find ./root)
ASSET_FILES := $(shell find ./assets/compat)
PATCH_FILES := $(shell find ./patches)

.DELETE_ON_ERROR:

all: verify

arm:
	@rm -f docker-images/x86_64.tar
	@ARCH=aarch64 $(MAKE)

x86:
	@rm -f docker-images/aarch64.tar
	@ARCH=x86_64 $(MAKE)

verify: $(PKG_ID).s9pk
	@start-sdk verify s9pk $(PKG_ID).s9pk
	@echo " Done!"
	@echo "   Filesize: $(shell du -h $(PKG_ID).s9pk) is ready"

install:
	@if [ ! -f ~/.embassy/config.yaml ]; then echo "You must define \"host: http://server-name.local\" in ~/.embassy/config.yaml config file first."; exit 1; fi
	@echo "\nInstalling to $$(grep -v '^#' ~/.embassy/config.yaml | cut -d'/' -f3) ...\n"
	@[ -f $(PKG_ID).s9pk ] || ( $(MAKE) && echo "\nInstalling to $$(grep -v '^#' ~/.embassy/config.yaml | cut -d'/' -f3) ...\n" )
	@start-cli package install $(PKG_ID).s9pk

clean:
	rm -rf docker-images
	rm -f $(PKG_ID).s9pk
	rm -f scripts/*.js

scripts/embassy.js: $(TS_FILES)
	deno run --allow-read --allow-write --allow-env --allow-net scripts/bundle.ts

docker-images/aarch64.tar: manifest.yaml Dockerfile.aarch64 docker_entrypoint.sh $(ROOT_FILES) $(PATCH_FILES)
ifeq ($(ARCH),x86_64)
else
	mkdir -p docker-images
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) \
		--build-arg ARCH=aarch64 \
		--build-arg PLATFORM=arm64 \
		--build-arg SPARROW_VERSION=$(SPARROW_VERSION) \
		--build-arg SPARROW_DEBVERSION=$(SPARROW_DEBVERSION) \
		--build-arg SPARROW_PGP_SIG=$(SPARROW_PGP_SIG) \
		--build-arg YQ_VERSION=$(YQ_VERSION) \
		--build-arg YQ_SHA=$(YQ_SHA_ARM64) \
		--platform=linux/arm64 -o type=docker,dest=docker-images/aarch64.tar -f Dockerfile.aarch64 .
endif

docker-images/x86_64.tar: manifest.yaml Dockerfile docker_entrypoint.sh $(ROOT_FILES) $(PATCH_FILES)
ifeq ($(ARCH),aarch64)
else
	mkdir -p docker-images
	docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) \
		--build-arg ARCH=x86_64 \
		--build-arg PLATFORM=amd64 \
		--build-arg SPARROW_VERSION=$(SPARROW_VERSION) \
		--build-arg SPARROW_DEBVERSION=$(SPARROW_DEBVERSION) \
		--build-arg SPARROW_PGP_SIG=$(SPARROW_PGP_SIG) \
		--build-arg YQ_VERSION=$(YQ_VERSION) \
		--build-arg YQ_SHA=$(YQ_SHA_AMD64) \
		--platform=linux/amd64 -o type=docker,dest=docker-images/x86_64.tar .
endif

$(PKG_ID).s9pk: manifest.yaml instructions.md icon.png LICENSE scripts/embassy.js docker-images/aarch64.tar docker-images/x86_64.tar $(ASSET_FILES)
ifeq ($(ARCH),aarch64)
	@echo "start-sdk: Preparing aarch64 package ..."
else ifeq ($(ARCH),x86_64)
	@echo "start-sdk: Preparing x86_64 package ..."
else
	@echo "start-sdk: Preparing Universal Package ..."
endif
	@start-sdk pack
