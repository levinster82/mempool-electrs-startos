import { configFile } from '../fileModels/config.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { logFilters } from '../utils'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  log_level: Value.select({
    name: i18n('Log Level'),
    description: i18n(
      'Select the level of log verbosity. Less is usually better.',
    ),
    values: logFilters,
    default: 'INFO',
  }),
  electrum_txs_limit: Value.number({
    name: i18n('Electrum Transaction Limit'),
    description: i18n(
      "Number of transactions to lookup before returning an error, to prevent 'too popular' addresses from causing the RPC server to time out. Enter '0' for no limit.",
    ),
    required: true,
    default: 500,
    integer: true,
    min: 0,
    placeholder: '500',
    units: i18n('transactions'),
  }),
  utxos_limit: Value.number({
    name: i18n('UTXO Limit'),
    description: i18n(
      "Maximum number of UTXOs to process per address. Lookups for addresses with more UTXOs will fail. Applies to both the Electrum and REST APIs. Enter '0' for no limit.",
    ),
    required: true,
    default: 500,
    integer: true,
    min: 0,
    placeholder: '500',
    units: i18n('utxos'),
  }),
  index_unspendables: Value.toggle({
    name: i18n('Index Unspendable Outputs'),
    description: i18n(
      'Index OP_RETURN and other provably unspendable outputs. Required for Ordinals, Counterparty, and other data-embedding protocols. Increases index size.',
    ),
    warning: i18n('Changing this setting requires a full reindex. Delete the db/ directory and restart the service to trigger a reindex.'),
    default: false,
  }),
  address_search: Value.toggle({
    name: i18n('Address Search'),
    description: i18n(
      'Enable prefix address search, allowing partial address lookups via the REST API.',
    ),
    warning: i18n('Changing this setting requires a full reindex. Delete the db/ directory and restart the service to trigger a reindex.'),
    default: false,
  }),
})

export const config = sdk.Action.withInput(
  // id
  'config',

  // metadata
  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n('Customize your electrs Electrum server'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => configFile.read().once(),

  // the execution function
  async ({ effects, input }) => configFile.merge(effects, input),
)
