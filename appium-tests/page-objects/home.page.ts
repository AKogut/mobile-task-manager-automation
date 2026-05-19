import { $ } from '@wdio/globals';

export class HomePage {
  get root() {
    return $('~home-screen');
  }

  async waitForVisible(): Promise<void> {
    await this.root.waitForDisplayed({ timeout: 15_000 });
  }
}
