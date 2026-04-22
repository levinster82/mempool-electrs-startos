export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting Electrs!': 0,
  'Electrum Server': 1,
  'Electrum server is ready and accepting connections': 2,
  'Electrum server is unreachable': 3,
  'Sync Progress': 4,
  'Main': 5,
  'The main interface for accessing electrs': 6,
  'Electrs requires an archival bitcoin node.': 7,
  'Log Level': 8,
  'Select the level of log verbosity. Less is usually better.': 9,
  "Number of transactions to lookup before returning an error, to prevent 'too popular' addresses from causing the RPC server to time out. Enter '0' for no limit.": 14,
  'transactions': 15,
  'Configure': 16,
  'Customize your electrs Electrum server': 17,
  'Error': 18,
  'Warning': 19,
  'Info': 20,
  'Debug': 21,
  'Trace': 22,
  'Electrum Transaction Limit': 23,
  'REST API': 24,
  'HTTP REST API for blockchain data queries': 25,
  'UTXO Limit': 26,
  'Maximum number of UTXOs to process per address. Lookups for addresses with more UTXOs will fail. Applies to both the Electrum and REST APIs. Enter \'0\' for no limit.': 27,
  'utxos': 28,
  'Index Unspendable Outputs': 29,
  'Index OP_RETURN and other provably unspendable outputs. Required for Ordinals, Counterparty, and other data-embedding protocols. Increases index size.': 30,
  'Address Search': 31,
  'Enable prefix address search, allowing partial address lookups via the REST API.': 32,
  'Changing this setting requires a full reindex. Delete the db/ directory and restart the service to trigger a reindex.': 33,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
