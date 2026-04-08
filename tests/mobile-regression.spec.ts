import { expect, test, type Page } from '@playwright/test';

async function gotoLanding(page: Page) {
  await page.context().clearCookies();
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.goto('/landing-page', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 90_000 });
  await expect(page.locator('#home')).toBeVisible({ timeout: 90_000 });
}

async function ensureNdaNotBlocking(page: Page) {
  const backdrop = page.locator('.ndaModalBackdrop');
  const ndaModal = page.locator('.ndaModal');
  const acceptButton = page
    .locator('.ndaModalActions button')
    .filter({ hasText: /^ACCEPT$/i })
    .first();

  // NDA can appear shortly after landing paint and animation completion.
  // Keep a wider settle window to avoid click races in mobile projects.
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const isBlocking = await backdrop.isVisible().catch(() => false);
    if (!isBlocking) {
      await page.waitForTimeout(250);
      continue;
    }
    await ndaModal.waitFor({ state: 'visible', timeout: 3_000 }).catch(() => {});
    const canAccept = await acceptButton.isVisible().catch(() => false);
    if (!canAccept) {
      await page.waitForTimeout(250);
      continue;
    }

    await acceptButton.click({ force: true });
    await expect(backdrop).toBeHidden({ timeout: 15_000 });
  }

  await expect(backdrop).toBeHidden({ timeout: 20_000 });
}

async function clickWithNdaRecovery(
  page: Page,
  action: () => Promise<void>,
  retries = 6,
) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    await ensureNdaNotBlocking(page);
    try {
      await action();
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const wasNdaIntercept =
        message.includes('ndaModalBackdrop') ||
        message.includes('intercepts pointer events');
      if (!wasNdaIntercept || attempt === retries - 1) {
        throw error;
      }
      await ensureNdaNotBlocking(page);
      await page.waitForTimeout(150);
    }
  }
}

test.describe('Mobile Regression Matrix', () => {
  test('mobile nav opens and closes via toggle', async ({ page }) => {
    test.skip(test.info().project.name === 'desktop-resize', 'Navigation toggle is mobile/tablet only.');

    await gotoLanding(page);
    await ensureNdaNotBlocking(page);

    const toggle = page.getByRole('button', { name: /open navigation menu|close navigation menu/i });
    const panel = page.locator('#official-mobile-nav-panel');

    await expect(toggle).toBeVisible();
    await expect(panel).toBeHidden();

    await clickWithNdaRecovery(page, () => toggle.click());
    await expect(panel).toBeVisible();

    await clickWithNdaRecovery(page, () => toggle.click());
    await expect(panel).toBeHidden();
  });

  test('desktop to mobile resize keeps nav operable', async ({ page }) => {
    test.skip(test.info().project.name !== 'desktop-resize', 'Resize flow only runs in desktop project.');

    await gotoLanding(page);
    await ensureNdaNotBlocking(page);

    await page.setViewportSize({ width: 1366, height: 900 });
    await expect(page.getByRole('button', { name: /open navigation menu|close navigation menu/i })).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });

    const toggle = page.getByRole('button', { name: /open navigation menu|close navigation menu/i });
    const panel = page.locator('#official-mobile-nav-panel');

    await expect(toggle).toBeVisible();
    await clickWithNdaRecovery(page, () => toggle.click());
    await expect(panel).toBeVisible();

    await page.setViewportSize({ width: 1366, height: 900 });
    await expect(toggle).toBeHidden();
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(toggle).toBeVisible();
    if (await panel.isVisible().catch(() => false)) {
      await clickWithNdaRecovery(page, () => toggle.click());
      await expect(panel).toBeHidden();
    } else {
      await clickWithNdaRecovery(page, () => toggle.click());
      await expect(panel).toBeVisible();
      await clickWithNdaRecovery(page, () => toggle.click());
      await expect(panel).toBeHidden();
    }
  });

  test('request-password dialog opens and closes with controls', async ({ page }) => {
    test.skip(test.info().project.name === 'desktop-resize', 'Dialog flow validated on mobile/tablet matrix.');

    await gotoLanding(page);
    await ensureNdaNotBlocking(page);

    const openButton = page.getByRole('button', { name: 'REQUEST PASSWORD' });
    const dialog = page.locator('.officialPasswordModal');
    const firstInput = page.locator('#request-full-name');
    const cancelButton = dialog.getByRole('button', { name: 'Cancel' });

    await expect(openButton).toBeVisible();
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await clickWithNdaRecovery(page, () => openButton.click());
      if (await dialog.isVisible().catch(() => false)) break;
      await ensureNdaNotBlocking(page);
      await page.waitForTimeout(150);
    }

    await expect(dialog).toBeVisible();
    await expect(firstInput).toBeVisible();

    await cancelButton.click();
    await expect(dialog).toBeHidden();
  });

  test('investor media lightbox opens and closes with controls', async ({ page }) => {
    test.skip(test.info().project.name === 'desktop-resize', 'Dialog flow validated on mobile/tablet matrix.');

    await gotoLanding(page);
    await ensureNdaNotBlocking(page);

    const firstMediaImage = page.locator('.investorMediaCard img').first();
    await firstMediaImage.scrollIntoViewIfNeeded();
    const lightbox = page.locator('.mediaLightboxDialog');
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await clickWithNdaRecovery(page, () => firstMediaImage.click());
      if (await lightbox.isVisible().catch(() => false)) break;
      await ensureNdaNotBlocking(page);
      await page.waitForTimeout(150);
    }

    const closeButton = lightbox.getByRole('button', { name: 'Close' });
    await expect(lightbox).toBeVisible();

    await closeButton.click();
    await expect(lightbox).toBeHidden();
  });
});
