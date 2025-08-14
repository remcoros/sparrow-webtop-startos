FROM node:12-bullseye AS wwwstage

ARG TARGETARCH
ARG KASMWEB_RELEASE="46412d23aff1f45dffa83fafb04a683282c8db58"

# Install phantomjs only for ARM64 and build noVNC
RUN \
    if [ "$TARGETARCH" = "arm64" ]; then \
    apt-get update && \
    wget https://snapshot.debian.org/archive/debian/20191203T043825Z/pool/main/p/phantomjs/phantomjs_2.1.1%2Bdfsg-2%2Bb2_arm64.deb -O /phantomjs.deb && \
    apt-get install -y --no-install-recommends /phantomjs.deb; \
    fi && \
    echo "**** build clientside ****" && \
    mkdir /src && \
    cd /src && \
    wget https://github.com/kasmtech/noVNC/tarball/${KASMWEB_RELEASE} -O - | tar --strip-components=1 -xz

COPY ./assets/patches/novnc.patch /src/
RUN export QT_QPA_PLATFORM=offscreen QT_QPA_FONTDIR=/usr/share/fonts && \
    echo "apply novnc.patch" && \
    cd /src && \
    patch -p1 -i novnc.patch && \
    npm install && \
    npm run-script build && \
    echo "**** organize output ****" && \
    mkdir /build-out && \
    rm -rf node_modules/ && \
    cp -R ./* /build-out/ && \
    cd /build-out && \
    rm *.md AUTHORS && \
    cp index.html vnc.html && \
    mkdir Downloads

# Single buildstage with architecture-aware base image selection
FROM ghcr.io/linuxserver/baseimage-kasmvnc:debianbookworm-876361b9-ls121 AS buildstage
ARG TARGETARCH
ARG SPARROW_VERSION=2.2.3
ARG SPARROW_DEBVERSION=2.2.3-1
ARG SPARROW_PGP_SIG=E94618334C674B40

# Architecture-specific base image handling
RUN if [ "$TARGETARCH" = "arm64" ]; then \
    echo "Note: Using default base image - ARM64 variant should be handled by buildx platform selection"; \
    fi

RUN echo "**** install packages ****" && \
    apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get remove -y dunst && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    exo-utils mousepad xfce4-terminal tumbler thunar thunar-archive-plugin \
    librsvg2-common python3-xdg hsetroot gnome-themes-extra compton \
    xfce4-notifyd libnotify-bin xclip wget socat gnupg && \
    DEBIAN_FRONTEND=noninteractive apt-get remove --purge --autoremove -y \
    containerd.io cpp cpp-12 docker-ce docker-ce-cli docker-buildx-plugin \
    docker-compose-plugin fonts-noto-color-emoji fonts-noto-core \
    intel-media-va-driver mesa-va-drivers mesa-vulkan-drivers x11-apps \
    xserver-xorg-video-amdgpu xserver-xorg-video-ati xserver-xorg-video-intel \
    xserver-xorg-video-nouveau xserver-xorg-video-qxl xserver-xorg-video-radeon \
    perl locales-all && \
    rm -rf $(ls -d /usr/share/locale/* | grep -vw /usr/share/locale/en) && \
    localedef -i en_US -f UTF-8 en_US.UTF-8 && \
    DEBIAN_FRONTEND=noninteractive apt-get upgrade -y && \
    echo "**** xfce tweaks ****" && \
    rm -f /etc/xdg/autostart/xscreensaver.desktop && \
    echo "Starting Sparrow on Webtop for StartOS..." > /etc/s6-overlay/s6-rc.d/init-adduser/branding && \
    sed -i '/run_branding() {/,/}/d' /docker-mods && \
    echo "**** cleanup ****" && \
    rm /kasmbins/kasm_webcam_server && \
    apt-get autoclean && \
    rm -rf /config/.cache /var/lib/apt/lists/* /var/tmp/* /tmp/*

# Install Sparrow - architecture-specific
RUN echo "**** install Sparrow ****" && \
    mkdir -p /usr/share/desktop-directories/ && \
    SPARROW_ARCH=$([ "$TARGETARCH" = "arm64" ] && echo "arm64" || echo "amd64") && \
    wget --quiet \
    https://github.com/sparrowwallet/sparrow/releases/download/${SPARROW_VERSION}/sparrowwallet_${SPARROW_DEBVERSION}_${SPARROW_ARCH}.deb \
    https://github.com/sparrowwallet/sparrow/releases/download/${SPARROW_VERSION}/sparrow-${SPARROW_VERSION}-manifest.txt \
    https://github.com/sparrowwallet/sparrow/releases/download/${SPARROW_VERSION}/sparrow-${SPARROW_VERSION}-manifest.txt.asc \
    https://keybase.io/craigraw/pgp_keys.asc && \
    gpg --import pgp_keys.asc && \
    gpg --status-fd 1 --verify sparrow-${SPARROW_VERSION}-manifest.txt.asc | grep -q "GOODSIG ${SPARROW_PGP_SIG} Craig Raw <craig@sparrowwallet.com>" && \
    sha256sum --check sparrow-${SPARROW_VERSION}-manifest.txt --ignore-missing && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y ./sparrowwallet_${SPARROW_DEBVERSION}_${SPARROW_ARCH}.deb && \
    rm ./sparrow* ./pgp_keys.asc

FROM scratch

COPY --from=buildstage / .
COPY --from=wwwstage /build-out /usr/local/share/kasmvnc/www

# Environment variables (consolidated)
ENV HOME="/config" \
    LANGUAGE="en_US.UTF-8" \
    LANG="en_US.UTF-8" \
    TERM="xterm" \
    S6_CMD_WAIT_FOR_SERVICES_MAXTIME="0" \
    S6_VERBOSITY=1 \
    S6_STAGE2_HOOK=/docker-mods \
    VIRTUAL_ENV=/lsiopy \
    PATH="/lsiopy/bin:$PATH" \
    DISPLAY=:1 \
    PERL5LIB=/usr/local/bin \
    OMP_WAIT_POLICY=PASSIVE \
    GOMP_SPINCOUNT=0 \
    START_DOCKER=false \
    PULSE_RUNTIME_PATH=/defaults \
    NVIDIA_DRIVER_CAPABILITIES=all \
    GTK_THEME=Adwaita:dark \
    GTK2_RC_FILES=/usr/share/themes/Adwaita-dark/gtk-2.0/gtkrc \
    NO_FULL=1

# Copy local files and fix index.html
COPY /assets/root /
COPY --chmod=755 ./assets/docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
COPY --chmod=664 icon.png /kclient/public/icon.png
COPY --chmod=664 icon.png /kclient/public/favicon.ico

RUN sed -i '/<script src="public\/js\/pcm-player\.js"><\/script>/d' /kclient/public/index.html

EXPOSE 3000 3001
VOLUME /config

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
