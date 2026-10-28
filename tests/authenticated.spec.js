import { test, expect } from "@playwright/test";

const generateTestUser = () => {
  const rand = Math.random().toString(36).substring(2, 8);
  return {
    name: `Architect Tester ${rand}`,
    email: `qa_user_${Date.now()}_${rand}@architect.io`,
    password: "Password123!@#",
  };
};

/**
 * Registers a user via backend API and signs in through the UI
 */
async function registerAndLogin(page) {
  const user = generateTestUser();
  const regRes = await page.request.post("http://localhost:5000/api/auth/register", {
    data: {
      name: user.name,
      email: user.email,
      password: user.password,
    },
  });
  expect(regRes.ok()).toBeTruthy();

  await page.goto("/login");
  await page.locator("#email-input").fill(user.email);
  await page.locator("#password-input").fill(user.password);
  await page.getByRole("button", { name: /Sign In/i }).click();
  await expect(page).toHaveURL(/.*\/dashboard/);
  return user;
}

test.describe("Authenticated User Workflow Verification", () => {
  test("1. Full User Lifecycle: Registration, Login, and Dashboard Access", async ({ page }) => {
    const testUser = generateTestUser();

    // 1. Visit signup page
    await page.goto("/signup");
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();

    // 2. Fill registration form
    await page.locator('input[placeholder*="Alex" i], input[name="name"]').fill(testUser.name);
    await page.locator('input[type="email"], input[name="email"]').fill(testUser.email);
    await page.locator('input[type="password"]').first().fill(testUser.password);
    
    // If confirm password input exists
    const confirmInput = page.locator('input[placeholder*="Confirm" i], input[name="confirmPassword"]');
    if (await confirmInput.isVisible()) {
      await confirmInput.fill(testUser.password);
    }

    // Submit registration
    const registerBtn = page.getByRole("button", { name: /Create Account|Sign Up/i });
    await registerBtn.click();

    // Expect navigation to /login
    await page.waitForURL(/.*\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/login/);

    // 3. Perform Login
    await page.locator("#email-input").fill(testUser.email);
    await page.locator("#password-input").fill(testUser.password);
    await page.getByRole("button", { name: /Sign In/i }).click();

    // 4. Expect navigation to /dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);

    // Verify dashboard elements in main content
    await expect(page.getByText(/Total Projects|Active Projects/i).first()).toBeVisible();
    await expect(page.locator("main").getByText(/Create Architecture/i).first()).toBeVisible();

    // Capture dashboard screenshot
    await page.screenshot({ path: "tests/screenshots/dashboard-desktop.png", fullPage: true });
  });

  test("2. Navigation across internal dashboard pages", async ({ page }) => {
    await registerAndLogin(page);

    // Navigate to Projects page
    await page.goto("/dashboard/projects");
    await expect(page).toHaveURL(/.*\/dashboard\/projects/);
    await expect(page.locator("main").getByText(/Project|Architecture/i).first()).toBeVisible();

    // Navigate to Templates page
    await page.goto("/dashboard/templates");
    await expect(page).toHaveURL(/.*\/dashboard\/templates/);
    await expect(page.locator("main").getByText(/Template/i).first()).toBeVisible();

    // Navigate to Settings page
    await page.goto("/dashboard/settings");
    await expect(page).toHaveURL(/.*\/dashboard\/settings/);
    await expect(page.locator("main").getByText(/Setting|Theme|Preference/i).first()).toBeVisible();

    // Navigate to Profile page
    await page.goto("/dashboard/profile");
    await expect(page).toHaveURL(/.*\/dashboard\/profile/);
    await expect(page.locator("main").getByText(/Projects Created|Member since|Architecture/i).first()).toBeVisible();
  });

  test("3. Protected route blocks unauthenticated access and redirects to /login", async ({ page }) => {
    // Ensure clean state without token
    await page.goto("/login");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Try navigating directly to /dashboard
    await page.goto("/dashboard");

    // Should be redirected to /login
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("4. Architecture Creation Form renders with options", async ({ page }) => {
    await registerAndLogin(page);

    // Navigate to /dashboard/new
    await page.goto("/dashboard/new");
    await expect(page).toHaveURL(/.*\/dashboard\/new/);
    await expect(page.getByText(/Create New Architecture/i)).toBeVisible();

    // Verify form elements exist
    await expect(page.locator('input[name="title"], input[placeholder*="Project" i]').first()).toBeVisible();
    await expect(page.locator('textarea[name="description"], textarea[placeholder*="Describe" i]').first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Generate Architecture|Synthesize/i })).toBeVisible();

    // Capture screenshot of new project form
    await page.screenshot({ path: "tests/screenshots/new-project-desktop.png", fullPage: true });
  });
});
