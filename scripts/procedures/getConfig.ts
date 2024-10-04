import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
  title: {
    type: "string",
    nullable: false,
    name: "Webtop Title",
    description:
      "This value will be displayed as the title of your browser tab.",
    default: "Start9 Sparrow on Webtop",
    pattern: '^[^\\n"]*$',
    "pattern-description": "Must not contain newline or quote characters.",
    masked: false,
    copyable: true,
  },
  username: {
    type: "string",
    nullable: false,
    name: "Username",
    description: "The username for logging into your Webtop.",
    default: "webtop",
    pattern: '^[^\\n"]*$',
    "pattern-description": "Must not contain newline or quote characters.",
    masked: false,
    copyable: true,
  },
  password: {
    type: "string",
    name: "Password",
    description: "The password for logging into your Webtop.",
    nullable: false,
    masked: true,
    default: {
      charset: "a-z,1-9",
      len: 20,
    },
    pattern: '^[^\\n"]*$',
    "pattern-description": "Must not contain newline or quote characters.",
    copyable: true,
  },
  reconnect: {
    type: "boolean",
    name: "Automatically reconnect",
    description: "Automatically reconnect when the connection to the desktop is lost or the browser tab has been idle for too long.",
    default: false,
  },
  sparrow: {
    type: "object",
    name: "Sparrow settings",
    description: "Sparrow settings",
    spec: {
      managesettings: {
        type: "boolean",
        name: "Apply settings on startup",
        description:
          "Disable to manage your own server and proxy settings in Sparrow",
        default: true,
      },
      server: {
        type: "union",
        name: "Bitcoin/Electrum Server",
        description:
          "<p>The Bitcoin Core or Electrum node to connect to:</p><ul><li><strong>Electrs</strong>: Use the electrs service installed on your server.</li><li><strong>Bitcoin Core</strong>: Use the Bitcoin Core service installed on your server.</li><li><strong>Public</strong>: Use a public Bitcoin node (not recommended!).</li></ul>",
        tag: {
          id: "type",
          name: "Bitcoin Node Type",
          "variant-names": {
            electrs: "Electrs (recommended)",
            bitcoind: "Bitcoin Core",
            public: "Public (not recommended)",
          },
          description:
            "<p>The Bitcoin Core or Electrum node to connect to:</p><ul><li><strong>Electrs</strong>: Use the electrs service installed on your server.</li><li><strong>Bitcoin Core</strong>: Use the Bitcoin Core service installed on your server.</li><li><strong>Public</strong>: Use a public Bitcoin node (not recommended!).</li></ul>",
        },
        warning:
          "If using 'Public', please switch to using Bitcoin Core or electrs as soon as possible. Using a public node can expose your IP address and transactions done using this node.",
        default: "electrs",
        variants: {
          electrs: {},
          bitcoind: {
            user: {
              type: "pointer",
              name: "RPC Username",
              description: "The username for Bitcoin Core's RPC interface",
              subtype: "package",
              "package-id": "bitcoind",
              target: "config",
              multi: false,
              selector: "$.rpc.username",
            },
            password: {
              type: "pointer",
              name: "RPC Password",
              description: "The password for Bitcoin Core's RPC interface",
              subtype: "package",
              "package-id": "bitcoind",
              target: "config",
              multi: false,
              selector: "$.rpc.password",
            },
          },
          public: {},
        },
      },
      proxy: {
        name: "Use a proxy",
        description:
          "<p>Use a proxy for external connections (like whirlpool)</p><ul><li><strong>Tor</strong>: Use the Tor Proxy of StartOS (recommended)</li><li><strong>None</strong>: do not use a proxy</li></ul>",
        type: "union",
        tag: {
          id: "type",
          name: "Proxy Type",
          "variant-names": {
            tor: "Tor (recommended)",
            none: "None (not recommended)",
          },
          description:
            "<p>Use a proxy for external connections (like whirlpool)</p><ul><li><strong>Tor</strong>: Use the Tor Proxy of StartOS (recommended)</li><li><strong>None</strong>: do not use a proxy</li></ul>",
        },
        default: "tor",
        variants: {
          tor: {},
          none: {},
        },
      },
    },
  },
});
