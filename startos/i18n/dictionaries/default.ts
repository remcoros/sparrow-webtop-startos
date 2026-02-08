export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'The web interface is ready': 1,
  'The web interface is not ready': 2,
  'Password is required': 3,
  'The web interface is unreachable': 4,
  'Connected Node': 5,
  'Invalid RPC credentials, Recreate them in the Action menu': 6,
  'Failed to connect to local Bitcoin node': 7,
  'Connected to local Bitcoin node': 8,
  'Using local electrum server': 9,
  'Change settings to not use a public electrum server': 10,
  'Using a public electrum server': 11,

  // interfaces.ts
  'Web Interface': 100,

  // actions/uiCredentials.ts
  'Show the credentials for the web UI.': 200,
  'Username for the web UI': 201,
  'Password for the web UI': 202,

  // actions/config.ts  
  'The username for logging into your Webtop.': 300,
  'The password for logging into your Webtop.': 301,
  'Sparrow settings': 302,
  'Bitcoin/Electrum Server': 303,
  'Proxy settings': 304,
  'Webtop username/password and connection settings': 305,

  // manifest/index.ts
  'Used to connect to your Bitcoin node.': 400,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
