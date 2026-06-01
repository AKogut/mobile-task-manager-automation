import type { Browser, ChainablePromiseElement } from 'webdriverio';

type WdioExpect = import('expect-webdriverio').Expect;

declare global {
  const browser: Browser;
  const driver: Browser;
  const expect: WdioExpect;

  function $(selector: string): ChainablePromiseElement;
}
