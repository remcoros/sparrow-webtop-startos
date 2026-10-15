# Sparrow Instructions

Welcome to Sparrow on Webtop, your favourite desktop wallet in an Immutable Linux Desktop, running 24/7 on your StartOS server!

This package requires StartOS 0.4.0.2 or later.

## Initial Configuration

The initial configuration of Sparrow is straightforward. You have two options:

1. **Go with the Defaults**: If you prefer simplicity, you can use the default settings for `Webtop title`, `Username`, `Password`, and rendering. Simply click save and start the service.

2. **Customize Settings**: If you want to personalize your Webtop experience, you can customize the `Webtop title`, `Username`, `Password`, and rendering options to your liking. After making your changes, click save and start the service.

Now your Sparrow on Webtop is ready to be visited in your browser!

## Important Notes

1. Only files and settings saved in your Webtop home folder are kept after a restart or update. Changes elsewhere in the desktop may be lost.

2. Sparrow keeps your wallet files, settings and logs in its home folder, so they remain available after a restart or update and are included in StartOS backups.

3. Webtop uses HTTPS Basic Authentication. Your browser asks you to log in on the first visit and remembers the credentials until they change.

4. The Webtop desktop is based on Debian Linux. Sparrow creates a default configuration on first start. Use **Settings** to choose the Bitcoin or Electrum server and optional Tor proxy.

5. StartOS keeps the selected local server and Tor connection up to date automatically.

6. You can run a text editor, file manager, terminal or a second instance of Sparrow by right-clicking the desktop. Sparrow opens maximized; double-click its title bar to reveal the desktop.

7. USB devices are not available. For QR scanning, use your browser camera as described below. Desktop audio output, microphone forwarding and the third-party application gallery are disabled.

8. Leave **Enable Wayland** on and **Force Software Rendering** off for normal hardware-accelerated operation. You can turn **Enable Wayland** off to use the older X11 desktop backend while retaining normal graphics-device detection.

9. If the Web UI stays blank, flickers, or crashes because the server or virtual machine exposes incompatible graphics hardware, turn **Force Software Rendering** on and restart the service. It takes precedence over **Enable Wayland** and uses the slower CPU-only X11 compatibility path. It does not change Sparrow's wallet or server settings.

## QR scanning with your camera

Open the Web UI over trusted HTTPS in a browser that supports camera access. Open the wallet's QR scanner and allow camera access when your browser asks. The camera on the machine running your browser is forwarded only when requested by the scanner. If the scanner times out while you grant permission, close and reopen it.

Tor Browser can display and control the desktop but does not provide camera access. Paste addresses or import files when a camera is unavailable.

## Control Panel

The control panel on the left side of the Webtop interface provides options for controlling and interacting with your session.

The desktop automatically follows your browser size. Streaming starts at 30 fps with Turbo off; you can adjust the frame rate from 8–120 fps and change Turbo mode in the control panel. Your browser retains any choices you previously saved.

Camera forwarding works independently of microphone access; microphone forwarding and desktop audio output are disabled. The application gallery is unavailable. Your desktop file manager, editor and terminal remain available.

## Good Luck!

Enjoy your Sparrow on Webtop experience and happy experimenting!
