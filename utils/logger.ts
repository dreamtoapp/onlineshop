// utils/logger.ts

// (Optional) Flag to disable logging (e.g. in production or via env var)
const disableLogging = (process.env.NODE_ENV === 'production' || process.env.DISABLE_LOGGING === 'true');

// Helper (logger) functions that (if disableLogging is true) do nothing, otherwise call the corresponding console method.
export const log = (disableLogging ? (() => {}) : (console.log.bind(console)));
export const error = (disableLogging ? (() => {}) : (console.error.bind(console)));
export const warn = (disableLogging ? (() => {}) : (console.warn.bind(console)));
export const info = (disableLogging ? (() => {}) : (console.info.bind(console))); 