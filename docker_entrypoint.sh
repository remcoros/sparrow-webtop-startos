#!/bin/sh
echo
echo "Initialising Sparrow on Webtop..."
echo
export PUID=1000
export PGID=1000
export TZ=Etc/UTC
export TITLE="$(yq e '.title' /root/data/start9/config.yaml)"
export CUSTOM_USER="$(yq e '.username' /root/data/start9/config.yaml)"
export PASSWORD="$(yq e '.password' /root/data/start9/config.yaml)"

cat <<EOF >/root/data/start9/stats.yaml
version: 2
data:
  "Username":
    type: string
    value: "$CUSTOM_USER"
    description: "Username for logging into your Webtop."
    copyable: true
    qr: false
    masked: false
  "Password":
    type: string
    value: "$PASSWORD"
    description: "Password for logging into your Webtop."
    copyable: true
    qr: false
    masked: true
EOF

# Copy default files
if [ ! -f /config/.sparrow/config ]; then
  echo "No Sparrow config file found, creating default"
  mkdir -p /config/.sparrow
  cp /defaults/.sparrow/config /config/.sparrow/config
  chown -R $PUID:$PGID /config/.sparrow
fi

# always overwrite autostart in case we change it
mkdir -p /config/.config/openbox
cp /defaults/autostart /config/.config/openbox/autostart
chown -R abc:abc /config/.config/openbox

# Manage Sparrow settings?
if [ $(yq e '.sparrow.managesettings' /root/data/start9/config.yaml) = "true" ]; then
  # private bitcoin/electrum server
  case "$(yq e '.sparrow.server.type' /root/data/start9/config.yaml)" in
  "bitcoind")
    echo "Configuring Sparrow for Bitcoin Core"
    #export BITCOIND_USER=$(yq e '.sparrow.server.user' /root/data/start9/config.yaml)
    #export BITCOIND_PASS=$(yq e '.sparrow.server.password' /root/data/start9/config.yaml)
    # yq e -i '
    #   .serverType = "BITCOIN_CORE" |
    #   .coreServer = "http://127.0.0.1:8332" |
    #   .coreAuthType = "USERPASS" |
    #   .coreAuth = strenv(BITCOIND_USER) + ":" + strenv(BITCOIND_PASS)' -o=json /config/.sparrow/config
    # TODO: remove this when .cookie file has correct permissions
    chmod 644 /mnt/bitcoind/.cookie
    yq e -i '
      .serverType = "BITCOIN_CORE" |
      .coreServer = "http://127.0.0.1:8332" |
      .coreAuthType = "COOKIE" |
      .coreDataDir = "/mnt/bitcoind"' -o=json /config/.sparrow/config
    ;;
  "electrs")
    echo "Configuring Sparrow for Electrs"
    yq e -i '
      .serverType = "ELECTRUM_SERVER" |
      .coreServer = "tcp://127.0.0.1:50001"' -o=json /config/.sparrow/config
    ;;
  "public")
    echo "Configuring Sparrow for Public electrum server"
    yq e -i '.serverType = "PUBLIC_ELECTRUM_SERVER"' -o=json /config/.sparrow/config
    ;;
  *)
    echo "Unknown server selected, not configuring Sparrow"
    ;;
  esac

  # proxy
  case "$(yq e '.sparrow.proxy.type' /root/data/start9/config.yaml)" in
  "tor")
    echo "Configuring Sparrow for Tor"
    export EMBASSY_IP=$(ip -4 route list match 0/0 | awk '{print $3}')
    yq e -i '
      .useProxy = true |
      .proxyServer = strenv(EMBASSY_IP) + ":9050"' -o=json /config/.sparrow/config
    ;;
  "none")
    echo "Configuring Sparrow for 'no proxy'"
    yq e -i '.useProxy = false' -o=json /config/.sparrow/config
    ;;
  *)
    echo "Unknown proxy selected, not configuring Sparrow"
    ;;
  esac
fi

# remove reference to non-existing file, see: https://github.com/linuxserver/kclient/issues/8
sed -i '/<script src="public\/js\/pcm-player\.js"><\/script>/d' /kclient/public/index.html

# add '&reconnect=' setting to kclient html
RECONNECT=$(yq e '.reconnect' /root/data/start9/config.yaml)
sed -i "s/\(index\.html?autoconnect=1\)/&\&reconnect=$RECONNECT/" /kclient/public/index.html

# setup a proxy on localhost, Sparrow will not use Tor for local addresses
# this means we can connect straight to bitcoind/electrs and use Tor for everything else (whirlpool)
/usr/bin/socat tcp-l:8332,fork,reuseaddr,su=nobody,bind=127.0.0.1 tcp:bitcoind.startos:8332 &
/usr/bin/socat tcp-l:50001,fork,reuseaddr,su=nobody,bind=127.0.0.1 tcp:electrs.startos:50001 &

exec /init
