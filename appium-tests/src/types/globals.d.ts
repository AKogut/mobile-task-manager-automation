import type { Browser, ChainablePromiseElement } from 'webdriverio';

declare global {
  const browser: Browser;

  function $(selector: string): ChainablePromiseElement;
}
