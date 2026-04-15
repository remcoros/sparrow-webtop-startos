<p align="center">
  <img src="icon.png" alt="Sparrow Logo" width="21%">
</p>

# Sparrow on StartOS

> **Upstream docs:** <https://sparrowwallet.com/docs/>
>
> Everything not listed in this document should behave the same as upstream
> Sparrow 2.4.2. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable.

[Sparrow Wallet](https://sparrowwallet.com/) is a feature-rich Bitcoin desktop wallet focused on security and privacy. This package runs Sparrow inside a lightweight [Webtop](https://docs.linuxserver.io/images/docker-webtop/) Linux desktop environment, making it accessible directly from any web browser — no local software installation required.

Wrapper repo: <https://github.com/remcoros/sparrow-webtop-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions](#actions)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

- **Image:** `ghcr.io/remcoros/sparrow-webtop:2.4.2` (custom image based on [linuxserver/webtop](https://docs.linuxserver.io/images/docker-webtop/))
- **Architectures:** x86_64, aarch64 (aarch64 emulated via x86_64 image)
- **Entrypoint:** Custom `docker_entrypoint.sh` (mounted from assets at runtime) wraps the upstream entrypoint. It sets the browser tab title, handles reconnect behavior, and starts `socat` proxies for local Bitcoin/Electrum connections.

---

## Volume and Data Layout

| Volume   | Mount Point  | Contents                                                    |
|----------|-------------|-------------------------------------------------------------|
| `main`   | `/root/data` | StartOS service data, including `start9/config.yaml`        |
| `userdir`| `/config`    | Webtop user home directory — Sparrow wallet data, settings  |

Sparrow stores its wallet files and configuration under `/config/.sparrow/` (within the `userdir` volume).

---

## Installation and First-Run Flow

On first install, StartOS will create a critical task prompting you to open **Settings** and configure your Webtop credentials (username and password). The service will not be fully usable until this is completed.

---

## Configuration Management

All settings below are managed via the StartOS **Settings** action. Changes restart the service automatically.

| Setting | Managed By | Notes |
|---|---|---|
| Webtop title | StartOS | Browser tab title |
| Webtop username | StartOS | Login username for the web UI |
| Webtop password | StartOS | Login password for the web UI |
| Auto-reconnect | StartOS | Reconnects on idle/disconnect |
| Bitcoin server | StartOS | Which server Sparrow connects to |
| Proxy | StartOS | Whether to route traffic through Tor |

When **Apply settings on startup** is enabled (default), StartOS writes Sparrow's server and proxy configuration on every start. Disable this to manage Sparrow's own server/proxy settings manually inside the app.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose |
|---|---|---|---|
| Web UI | 3000 (internal) | HTTP (SSL added by StartOS) | Webtop desktop in the browser |

The web UI is accessible via `.local`, `.onion`, and any other gateway configured on your StartOS server.

---

## Actions

### Settings

- **Purpose:** Configure Webtop login credentials, Bitcoin server, and proxy settings.
- **Availability:** Any status.
- **Inputs:** Title, username, password, auto-reconnect toggle, server selection, proxy selection.
- **Outputs:** None (saves and restarts service).

### Show UI Credentials

- **Purpose:** Display the current Webtop username and password.
- **Availability:** Any status. Hidden until settings have been saved once.
- **Inputs:** None.
- **Outputs:** Username and password (copyable, password masked).

---

## Backups and Restore

Both volumes are backed up:

- `main` — service configuration
- `userdir` — Sparrow wallet data (wallets, transaction history, settings)

Restore re-imports all wallet data and settings exactly as they were at backup time.

---

## Health Checks

| Check | Method | Success Message | Failure Message |
|---|---|---|---|
| Web Interface | HTTP GET `http://sparrow-webtop.startos:3000` | The web interface is ready | The web interface is unreachable |
| Connected Node | RPC/connection check (when managing settings) | Connected to local Bitcoin node / Using local electrum server | Failed to connect / Using a public electrum server |

---

## Dependencies

| Service | Required/Optional | Version | Purpose |
|---|---|---|---|
| Bitcoin Core (`bitcoind`) | Optional | `>= 28.1:3-alpha.4` | Direct Bitcoin Core RPC connection. Cookie file mounted read-only for authentication. |
| Electrs (`electrs`) | Optional | `>= 0.10.9:1-alpha.1` | Electrum server connection via local socat proxy on port 50001. |
| Fulcrum (`fulcrum`) | Optional | `>= 2.1.0:1` | Electrum server connection via local socat proxy on port 50002. |
| Tor (`tor`) | Optional | `>= 0.4.9.5:0` | Routes Sparrow's outbound traffic through Tor. Becomes a dependency when proxy is set to Tor. |

Only one of `bitcoind`, `electrs`, or `fulcrum` is active as a dependency at a time, depending on the selected server type. If no local server is available, Sparrow can be configured to use a public Electrum server (not recommended).

---

## Limitations and Differences

1. **Clipboard integration is limited** — copy/paste between the Webtop desktop and the host browser depends on browser clipboard permissions and may not work reliably in all browsers.
2. **No hardware wallet support** — USB hardware wallet passthrough is not available in the containerized environment.
3. **Single user only** — the Webtop session supports one concurrent user.
4. **PSBT files** — file import/export works within the Webtop session; sharing files with the host requires using Sparrow's network-based signing flows or copying via the browser's download mechanism.
5. **Cookie auth only for Bitcoin Core** — RPC username/password authentication is not supported; Sparrow connects using Bitcoin Core's `.cookie` file, which is mounted read-only from the `bitcoind` package.

---

## What Is Unchanged from Upstream

- All Sparrow wallet features (coin control, PSBT, multisig, watch-only wallets, etc.) work exactly as documented in the [Sparrow docs](https://sparrowwallet.com/docs/).
- The Tor proxy integration within Sparrow (for whirlpool and other outbound connections) works as upstream.
- Sparrow's own server configuration UI is available inside the app when **Apply settings on startup** is disabled.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for environment setup and build instructions.

---

## Quick Reference for AI Consumers

```yaml
package_id: sparrow-webtop
upstream_version: "2.4.2"
image: ghcr.io/remcoros/sparrow-webtop:2.4.2
architectures:
  - x86_64
  - aarch64
volumes:
  main: /root/data
  userdir: /config
ports:
  ui: 3000
dependencies:
  - bitcoind (optional)
  - electrs (optional)
  - fulcrum (optional)
  - tor (optional)
startos_managed_env_vars:
  - TITLE
  - CUSTOM_USER
  - PASSWORD
  - RECONNECT
  - PUID
  - PGID
  - TZ
actions:
  - config
  - ui-credentials
```
