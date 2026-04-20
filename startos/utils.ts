import { i18n } from './i18n'

export const port = 50001
export const httpPort = 3000

export const logFilters = {
  ERROR: i18n('Error'),
  WARN: i18n('Warning'),
  INFO: i18n('Info'),
  DEBUG: i18n('Debug'),
  TRACE: i18n('Trace'),
}

export type LogLevel = keyof typeof logFilters

export const logLevelToVerbosityFlags = (level: LogLevel): string[] => {
  const counts: Record<LogLevel, number> = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4,
  }
  return Array(counts[level]).fill('-v')
}
