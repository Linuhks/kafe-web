import { expect, type Locator, type Page } from '@playwright/test';

const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith('__reactProps'));

/**
 * Server-rendered controls are interactive before React attaches its handlers, so a fast
 * fill/click can be silently lost. Wait until React props are on the element (= hydrated).
 */
export async function waitForHydration(page: Page, target: string | Locator) {
  if (typeof target === 'string') {
    await page.waitForFunction(
      ([sel]) => {
        const el = document.querySelector(sel);
        return !!el && Object.keys(el).some((k) => k.startsWith('__reactProps'));
      },
      [target],
    );
    return;
  }
  await expect.poll(() => target.evaluate(isHydrated)).toBe(true);
}
