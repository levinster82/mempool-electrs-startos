import { setupManifest } from '@start9labs/start-sdk'
import { bitcoindDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'mempool-electrs',
  title: 'Mempool Electrs',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/mempool-electrs-startos',
  upstreamRepo: 'https://github.com/mempool/electrs',
  marketingUrl: 'https://github.com/mempool/electrs',
  docsUrls: ['https://github.com/mempool/electrs/blob/master/README.md'],
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    electrs: {
      source: {
        dockerBuild: {
          dockerfile: 'Dockerfile',
          workdir: '.',
        },
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    bitcoind: {
      description: bitcoindDescription,
      optional: false,
      metadata: {
        title: 'Bitcoin',
        icon: 'https://raw.githubusercontent.com/Start9Labs/bitcoin-core-startos/refs/heads/30.x/dep-icon.svg',
      },
    },
  },
})
