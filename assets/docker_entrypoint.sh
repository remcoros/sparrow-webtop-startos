#!/bin/sh
echo
echo "Initialising Sparrow on Webtop..."
echo

# always overwrite autostart in case we change it
mkdir -p /config/.config/openbox
cp /defaults/autostart /config/.config/openbox/autostart
chown -R abc:abc /config/.config/openbox

# add '&reconnect=' setting to kclient html based on RECONNECT env var
sed -i "s/\(index\.html?autoconnect=1\)/&\&reconnect=$RECONNECT/" /kclient/public/index.html

exec /init
