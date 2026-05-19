import { HomePage } from '../page-objects/home.page.js';

describe('Home screen', () => {
  it('displays the portfolio bootstrap message', async () => {
    const home = new HomePage();
    await home.waitForVisible();
    await expect(home.root).toBeDisplayed();
  });
});
