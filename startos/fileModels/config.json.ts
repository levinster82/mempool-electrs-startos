import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const shape = z.object({
  log_level: z.enum(['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE']).catch('INFO'),
  electrum_txs_limit: z.number().int().min(0).catch(500),
  utxos_limit: z.number().int().min(0).catch(500),
  index_unspendables: z.boolean().catch(false),
  address_search: z.boolean().catch(false),
})

export const configFile = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: 'config.json',
  },
  shape,
)
