type LogLevel = 'info' | 'warn' | 'error';

const isDev = import.meta.env.DEV;

export const logger = {
  info: (message: string, data?: any) => {
    if (isDev) console.log(`%c[INFO]: ${message}`, 'color: #6366f1; font-weight: bold', data ?? '');
  },
  warn: (message: string, data?: any) => {
    if (isDev) console.warn(`[WARN]: ${message}`, data ?? '');
  },
  error: (message: string, error?: any) => {
    console.error(`%c[ERROR]: ${message}`, 'color: #ef4444; font-weight: bold', error ?? '');
  }
};