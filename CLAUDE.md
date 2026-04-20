## How the upstream version is pulled
- Git submodule `electrs/` → `https://github.com/mempool/electrs`
- Current upstream: `v3.3.0` (commit `141215c`)
- To update: `cd electrs && git fetch origin <new-tag> && git checkout <new-tag>`, then update the version string in `startos/versions/`
- Image is `dockerBuild` from root (no dockerTag to update)

## Config architecture
- The upstream binary (`mempool-electrs`) takes all config via CLI arguments — there is no config file read by the binary
- User-configurable settings (`log_level`, `electrum_txs_limit`) are stored in `startos/fileModels/config.json.ts` (`/data/config.json` on the volume)
- `startos/main.ts` reads `config.json` at startup and builds the full CLI args array passed to the daemon
- Fixed values (network, RPC address, ports, db path) are hardcoded in the `command` array in `main.ts`

## Key paths (inside container)
- Config: `/data/config.json`
- RocksDB index: `/data/db/mainnet/newindex/`
- Bitcoin cookie: `/mnt/bitcoind/.cookie`
- Bitcoin RPC: `bitcoind.startos:8332`

## Interfaces
- Electrum protocol: port `50001` (with SSL termination on `50002`)
- HTTP REST API: port `3000` (with SSL termination on `443`)
