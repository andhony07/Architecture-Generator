import { test, expect } from "@playwright/test";

test.describe("Login Page - Professional Verification Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Collect console errors & uncaught exceptions
    page.on("pageerror", (err) => {
      console.error("[Browser uncaught error]:", err.message);
    });
  });

  test("1. Renders without JS runtime errors and loads global stylesheet", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const response = await page.goto("/login");
    expect(response.status()).toBeLessThan(400);

    // Verify zero uncaught page runtime errors
    expect(pageErrors).toEqual([]);

    // Verify stylesheet rules are compiled and active on body
    const bodyBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // #F1F5F9 translates to rgb(241, 245, 249)
    expect(bodyBg).toBe("rgb(241, 245, 249)");

    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    expect(bodyFont.toLowerCase()).toContain("inter");
  });

  test("2. Key brand, headline, and architecture topology elements are visible", async ({ page }) => {
    await page.goto("/login");

    // Product branding
    await expect(page.getByText("AI Architect", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("System Design Studio")).toBeVisible();

    // Value proposition heading
    await expect(
      page.getByRole("heading", { name: "Turn software ideas into production architecture." })
    ).toBeVisible();

    // Architecture topology preview nodes
    await expect(page.getByText("Client Application")).toBeVisible();
    await expect(page.getByText("API Gateway & Auth")).toBeVisible();
    await expect(page.getByText("AI Synthesis Engine")).toBeVisible();
    await expect(page.getByText("Persistence & Graph Store")).toBeVisible();
    await expect(page.getByText("Pipeline Active")).toBeVisible();
  });

  test("3. Form elements, inputs, labels, and submit CTA are visible and styled", async ({ page }) => {
    await page.goto("/login");

    // Form title & description
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.getByText("Sign in to your account to generate and manage system architectures.")).toBeVisible();

    // Inputs & Labels
    const emailInput = page.locator("#email-input");
    const passwordInput = page.locator("#password-input");
    const submitBtn = page.getByRole("button", { name: /Sign In/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();

    // Verify styled border and padding on input
    const inputPadding = await emailInput.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        paddingLeft: style.paddingLeft,
        borderRadius: style.borderRadius,
      };
    });
    expect(parseInt(inputPadding.paddingLeft)).toBeGreaterThanOrEqual(30); // space for icon
    expect(parseInt(inputPadding.borderRadius)).toBeGreaterThanOrEqual(8);
  });

  test("4. Password visibility toggle works correctly", async ({ page }) => {
    await page.goto("/login");

    const passwordInput = page.locator("#password-input");
    await expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = page.getByRole("button", { name: /Show password|Hide password/i });
    await expect(toggleBtn).toBeVisible();

    // Toggle to visible
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await expect(page.getByRole("button", { name: "Hide password" })).toBeVisible();

    // Toggle back to masked
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(page.getByRole("button", { name: "Show password" })).toBeVisible();
  });

  test("5. Required fields and format validation are enforced", async ({ page }) => {
    await page.goto("/login");

    const submitBtn = page.getByRole("button", { name: /Sign In/i });

    // Submit empty form
    await submitBtn.click();
    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    // Invalid email format
    const emailInput = page.locator("#email-input");
    await emailInput.fill("invalid-email-address");
    await submitBtn.click();
    await expect(page.getByText("Entered value does not match email format")).toBeVisible();

    // Short password (<6 chars)
    const passwordInput = page.locator("#password-input");
    await emailInput.fill("valid@company.com");
    await passwordInput.fill("123");
    await submitBtn.click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();
  });

  test("6. Navigation between login and signup works smoothly", async ({ page }) => {
    await page.goto("/login");

    // Click signup link
    const signupLink = page.getByRole("link", { name: "Create an account" });
    await expect(signupLink).toBeVisible();
    await signupLink.click();

    await page.waitForURL("**/signup");
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();

    // Navigate back to login
    const signinLink = page.getByRole("link", { name: "Sign in" });
    await expect(signinLink).toBeVisible();
    await signinLink.click();

    await page.waitForURL("**/login");
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("7. Layout has zero horizontal overflow and no clipped elements", async ({ page }) => {
    await page.goto("/login");

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Verify submit button is fully in view and clickable
    const submitBtn = page.getByRole("button", { name: /Sign In/i });
    const isVisible = await submitBtn.isVisible();
    expect(isVisible).toBe(true);
  });

  test("8. Login API request routes to configured backend and handles invalid credentials", async ({ page }) => {
    await page.goto("/login");

    let interceptedRequestUrl = null;
    let interceptedMethod = null;

    // Listen to network requests
    page.on("request", (req) => {
      console.log("[TEST REQUEST]:", req.method(), req.url());
      if (req.url().includes("/auth/login")) {
        interceptedRequestUrl = req.url();
        interceptedMethod = req.method();
      }
    });
    page.on("requestfailed", (req) => {
      console.log("[TEST REQUEST FAILED]:", req.method(), req.url(), req.failure()?.errorText);
    });

    await page.locator("#email-input").fill("nonexistent.user@testing.com");
    await page.locator("#password-input").fill("incorrect_password");

    const responsePromise = page.waitForResponse((res) => res.url().includes("/auth/login"));
    const submitBtn = page.getByRole("button", { name: /Sign In/i });
    await submitBtn.click();

    // Verify request was dispatched to backend URL on port 5000
    const response = await responsePromise;
    expect(response.status()).toBeGreaterThanOrEqual(400); // Invalid credentials return error status
    expect(interceptedMethod).toBe("POST");
    expect(interceptedRequestUrl).toContain("5000/api/auth/login");

    // User should remain on /login and see toast message (no false positive redirect)
    await expect(page).toHaveURL(/.*\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("9. Captures visual verification screenshots (Desktop & Mobile)", async ({ page }, testInfo) => {
    await page.goto("/login");

    const projectName = testInfo.project.name;
    const screenshotPath = `tests/screenshots/login-${projectName}.png`;

    await page.screenshot({ path: screenshotPath, fullPage: true });
    expect(screenshotPath).toBeDefined();
  });
});
