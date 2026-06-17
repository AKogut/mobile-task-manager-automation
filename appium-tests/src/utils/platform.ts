export function isIos(): boolean {
  return browser.capabilities.platformName === 'iOS';
}

export function isAndroid(): boolean {
  return browser.capabilities.platformName === 'Android';
}
