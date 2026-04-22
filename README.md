<p align="center">
  <img src="icon.svg" alt="Electrs Logo" width="21%">
</p>

# Mempool Electrs on StartOS

> **Upstream docs:** <https://github.com/mempool/electrs/blob/master/README.md>
> **Upstream version:** 3.3.0
>
> Everything not listed in this document should behave the same as upstream
> Electrs. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

[Mempool Electrs](https://github.com/mempool/electrs) is a blockchain index engine and HTTP API written in Rust, based on [romanz/electrs](https://github.com/romanz/electrs) and [Blockstream/electrs](https://github.com/Blockstream/electrs). Used as the backend for the [mempool block explorer](https://github.com/mempool/mempool) powering [mempool.space](https://mempool.space/).

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| Image | Custom `dockerBuild` (built from source) |
| Architectures | x86_64, aarch64 |
| Entrypoint | `electrs` |

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | `/data` | Configuration and index database |
| (bitcoind dependency) | `/mnt/bitcoind` | Read-only access to Bitcoin Core data for cookie auth |

**StartOS-specific files:**

- `config.json` — configuration file managed by StartOS (seeded with defaults on install)
- `db/` — RocksDB index database (excluded from backups)

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Bitcoin connection | Manual configuration (RPC address, cookie path) | Auto-configured via dependency |
| Configuration | CLI arguments or config file | Configure action in StartOS UI |
| Initial sync | Several hours for full blockchain | Same (depends on hardware) |

**Key difference:** On StartOS, the Bitcoin Core connection is fully automatic — Electrs connects to `bitcoind.startos:8332` for RPC using cookie authentication from the mounted dependency volume.

**First run:** On install, `config.json` is seeded with defaults. Initial indexing takes several hours depending on your hardware. The service will show "loading" status until sync completes.

---

## Configuration Management

| Setting | Upstream Method | StartOS Method |
|---------|-----------------|----------------|
| `cookie_file` | Config/CLI | Fixed: `/mnt/bitcoind/.cookie` |
| `daemon_rpc_addr` | Config/CLI | Fixed: `bitcoind.startos:8332` |
| `network` | Config/CLI | Fixed: `mainnet` |
| `electrum_rpc_addr` | Config/CLI | Fixed: `0.0.0.0:50001` |
| `http_addr` | Config/CLI | Fixed: `0.0.0.0:3000` |
| `db_dir` | Config/CLI | Fixed: `/data/db` |
| `log_filters` | Config/CLI | Configure action: "Log Level" |
| `electrum_txs_limit` | Config/CLI | Configure action: "Electrum Transaction Limit" |

**Upstream options not exposed on StartOS:**

| Flag | Upstream Default | Reason not exposed |
|------|-----------------|-------------------|
| `--lightmode` | off | Not yet implemented; reduces storage but omits some index data |
| `--utxos-limit` | 500 | Not yet implemented; caps UTXOs per address for Electrum and REST API |
| `--address-search` | off | Not yet implemented; enables prefix address search |
| `--cors` | none | Not yet implemented; allows cross-origin requests to the REST API |
| `--electrum-banner` | version string | Not yet implemented; custom welcome message for Electrum clients |
| `--jsonrpc-import` | off | Not applicable; direct block file access is faster and the bitcoind volume is mounted |
| `--main-loop-delay` | 500ms | Advanced tuning; default is suitable for all users |
| `--mempool-backlog-stats-ttl` | 10s | Advanced tuning; default is suitable for all users |
| `--mempool-recent-txs-size` | 10 | Advanced tuning; default is suitable for all users |
| `--rest-default-*` / `--rest-max-*` | various | Advanced REST API pagination tuning; defaults are suitable for all users |
| `--precache-scripts` / `--precache-threads` | — | Niche pre-warming feature; not applicable for typical use |
| `--index-unspendables` | off | Niche; indexes OP_RETURN and other provably unspendable outputs |

---

## Network Access and Interfaces

| Interface | Internal Port | External Port | Protocol | Purpose |
|-----------|--------------|---------------|----------|---------|
| Electrum | 50001 | 50002 | TCP + SSL | Wallet connections (Electrum protocol) |
| REST API | 3000 | 443 | HTTP + SSL | Blockchain data queries |

**Access methods (StartOS 0.4.0):**

- LAN IP with unique port
- `<hostname>.local` with unique port
- Tor `.onion` address
- Custom domains (if configured)

SSL termination for both interfaces is handled by the StartOS platform (nginx). The electrs binary receives plain TCP/HTTP internally.

---

## Actions (StartOS UI)

### Configure

| Property | Value |
|----------|-------|
| ID | `config` |
| Name | Configure |
| Visibility | Enabled (always visible) |
| Availability | Any status |
| Purpose | Adjust Electrs settings |

**Options:**

| Setting | Default | Description |
|---------|---------|-------------|
| Log Level | INFO | Verbosity: ERROR, WARN, INFO, DEBUG, TRACE |
| Electrum Transaction Limit | 500 | Max transactions to lookup before returning an error (0 = unlimited) |

---

## Dependencies

### Bitcoin Core (required)

| Property | Value |
|----------|-------|
| Version constraint | `>= 28.3:5` |
| Required state | Running |
| Health checks | `bitcoind` |
| Mounted volume | `main` → `/mnt/bitcoind` (read-only) |
| Purpose | Blockchain data via RPC, cookie authentication |

The service automatically:
- Connects to Bitcoin Core RPC at `bitcoind.startos:8332`
- Uses cookie authentication from the mounted dependency volume
- Restarts if the Bitcoin Core cookie file changes

**Auto-configuration:** On install, a critical task auto-configures Bitcoin Core to disable pruning (`prune: null`), since Electrs requires an archival node.

**Bitcoin Core requirements:**
- `server=1` must be enabled (default on StartOS)
- `txindex=1` is NOT required (unlike some other Electrum servers)
- Pruning must be disabled (archival node required)

---

## Backups and Restore

**Included in backup:**

- `main` volume (excluding `db/`) — preserves `config.json`

**Excluded from backup:**

- `db/` directory — the RocksDB index database

**Restore behavior:**

- Configuration is restored
- Index database must be rebuilt from scratch (will re-sync on first start)
- Re-indexing takes several hours

---

## Health Checks

| Check | ID | Display | Method | Messages |
|-------|----|---------|--------|----------|
| Daemon ready | `electrs` | Electrum Server | Port 50001 listening | Ready: "Electrum server is ready and accepting connections" / Error: "Electrum server is unreachable" |
| Sync progress | `sync` | Sync Progress | Bitcoin RPC + Prometheus metrics (`localhost:4224`) | See below |

**Sync Progress details:**

The sync check runs only after the `electrs` daemon is ready. It performs multiple steps: verifies the Bitcoin cookie file, checks Bitcoin sync status via RPC, scrapes Electrs Prometheus metrics for `index_height`, and detects active database compaction. Messages include:

- "Bitcoin blockchain is not fully synced yet: X of Y blocks (Z%)"
- "Catching up to blocks from bitcoind… Progress: X of Y blocks (Z%)"
- "Finishing database compaction… This could take some hours…"
- "Fully synced" (success)

---

## Limitations and Differences

1. **Mainnet only** — network is fixed to `mainnet`; testnet/signet not supported
2. **Fixed Bitcoin connection** — must use the StartOS Bitcoin Core dependency; cannot connect to external Bitcoin nodes
3. **Custom-built image** — built from source rather than using pre-built binaries
4. **Index excluded from backups** — restoring from backup requires full re-indexing
5. **Partial configuration exposure** — several upstream flags are available but not yet exposed in the StartOS UI; see the full list in [Configuration Management](#configuration-management)

---

## What Is Unchanged from Upstream

- Full Electrum protocol v1.4 support
- Full HTTP REST API (same as mempool.space backend)
- RocksDB index storage
- Fast synchronization performance
- Low CPU/memory usage after initial sync
- Efficient mempool tracking
- All standard Electrum wallet compatibility
- Query functionality (balance, history, transactions)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: mempool-electrs
upstream_version: 3.3.0
image: dockerBuild (custom)
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  electrum_internal: 50001
  electrum_ssl: 50002
  rest_internal: 3000
  rest_ssl: 443
dependencies:
  - bitcoind (required, >=28.3:5)
fixed_config:
  cookie_file: /mnt/bitcoind/.cookie
  daemon_rpc_addr: bitcoind.startos:8332
  network: mainnet
  electrum_rpc_addr: 0.0.0.0:50001
  http_addr: 0.0.0.0:3000
  db_dir: /data/db
startos_managed_config:
  - log_level
  - electrum_txs_limit
actions:
  - config (enabled, any)
health_checks:
  - electrs: port_listening 50001
  - sync: bitcoin_rpc + prometheus localhost:4224
backup_volumes:
  - main (excludes /db)
```
