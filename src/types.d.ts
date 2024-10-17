import { serial } from 'web-serial-polyfill';

declare global {
  interface Navigator {
    serial: typeof serial;
  }
}

// This empty export is necessary to make this a module
export {};
