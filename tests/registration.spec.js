import { test, expect } from "@playwright/test";

test.describe("Registration Page - Verification Suite", () => {
  test.beforeEach(async ({ page }) => {
    page.on("pageerror", (err) => {
      console.error("[Browser uncaught error]:", err.message);
    });
  });

  test("1. Renders registration page elements and styling", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const response = await page.goto("/signup");
    expect(response.status()).toBeLessThan(400);
    expect(pageErrors).toEqual([]);

    // Brand and headline
    await expect(page.getByText("AI Architect", { exact: false }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();

    // Inputs
    await expect(page.locator('input[placeholder="Alex Mercer"]')).toBeVisible();
    await expect(page.locator('input[placeholder="architect@domain.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="At least 6 characters"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Repeat password"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /Create Account/i })).toBeVisible();
  });

  test("2. Enforces client-side validation rules", async ({ page }) => {
    await page.goto("/signup");

    const submitBtn = page.getByRole("button", { name: /Create Account/i });

    // Submit empty form (terms is true by default)
    await submitBtn.click();
    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Email address is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();

    // Invalid email format
    const nameInput = page.locator('input[placeholder="Alex Mercer"]');
    const emailInput = page.locator('input[placeholder="architect@domain.com"]');
    const passwordInput = page.locator('input[placeholder="At least 6 characters"]');
    const confirmInput = page.locator('input[placeholder="Repeat password"]');

    await nameInput.fill("Test User");
    await emailInput.fill("invalid-email");
    await submitBtn.click();
    await expect(page.getByText("Invalid email address format")).toBeVisible();

    // Password length under 6 chars
    await emailInput.fill("valid.email@example.com");
    await passwordInput.fill("12345");
    await submitBtn.click();
    await expect(page.getByText("Password must be at least 6 characters")).toBeVisible();

    // Passwords mismatch
    await passwordInput.fill("password123");
    await confirmInput.fill("differentPassword");
    await submitBtn.click();
    await expect(page.getByText("Passwords do not match")).toBeVisible();

    // Unchecked terms
    await confirmInput.fill("password123");
    const termsCheckbox = page.locator('input[type="checkbox"]');
    await termsCheckbox.uncheck();
    await submitBtn.click();
    await expect(page.getByText("You must accept terms to create an account")).toBeVisible();
  });

  test("3. Password visibility toggle functions correctly", async ({ page }) => {
    await page.goto("/signup");

    const passwordInput = page.locator('input[placeholder="At least 6 characters"]');
    const confirmInput = page.locator('input[placeholder="Repeat password"]');

    await expect(passwordInput).toHaveAttribute("type", "password");
    await expect(confirmInput).toHaveAttribute("type", "password");

    const toggleButtons = page.getByRole("button", { name: /Show password|Hide password/i });
    expect(await toggleButtons.count()).toBe(2);

    // Toggle main password
    await toggleButtons.nth(0).click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await toggleButtons.nth(0).click();
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Toggle confirm password
    await toggleButtons.nth(1).click();
    await expect(confirmInput).toHaveAttribute("type", "text");
    await toggleButtons.nth(1).click();
    await expect(confirmInput).toHaveAttribute("type", "password");
  });

  test("4. Duplicate email registration displays inline banner without duplicate toasts", async ({ page }) => {
    await page.goto("/signup");

    let interceptedRequestUrl = null;
    let interceptedMethod = null;
    let responseStatus = null;

    page.on("request", (req) => {
      if (req.url().includes("/auth/register")) {
        interceptedRequestUrl = req.url();
        interceptedMethod = req.method();
      }
    });

    page.on("response", (res) => {
      if (res.url().includes("/auth/register")) {
        responseStatus = res.status();
      }
    });

    await page.locator('input[placeholder="Alex Mercer"]').fill("Captain User");
    await page.locator('input[placeholder="architect@domain.com"]').fill("captain@example.com");
    await page.locator('input[placeholder="At least 6 characters"]').fill("123456");
    await page.locator('input[placeholder="Repeat password"]').fill("123456");

    const responsePromise = page.waitForResponse((res) => res.url().includes("/auth/register"));
    await page.getByRole("button", { name: /Create Account/i }).click();
    await responsePromise;

    // Verify correct endpoint, method, and HTTP 409 Conflict status
    expect(interceptedMethod).toBe("POST");
    expect(interceptedRequestUrl).toContain("/api/auth/register");
    expect(responseStatus).toBe(409);

    // Verify inline error banner is displayed
    const inlineBanner = page.locator(".bg-red-50");
    await expect(inlineBanner).toBeVisible();
    await expect(inlineBanner).toContainText("Email already exists");

    // Verify NO duplicate error toasts are displayed
    const toasts = page.locator('[role="status"]');
    await expect(toasts).toHaveCount(0);
  });

  test("5. Successful account registration completes flow and redirects to /login", async ({ page }) => {
    await page.goto("/signup");

    const uniqueId = Date.now() + "_" + Math.random().toString(36).substring(2, 6);
    const newEmail = `architect_${uniqueId}@example.com`;
    const newName = `New Architect ${uniqueId}`;

    let requestBody = null;

    page.on("request", (req) => {
      if (req.url().includes("/auth/register")) {
        try {
          requestBody = JSON.parse(req.postData() || "{}");
        } catch {}
      }
    });

    await page.locator('input[placeholder="Alex Mercer"]').fill(newName);
    await page.locator('input[placeholder="architect@domain.com"]').fill(newEmail);
    await page.locator('input[placeholder="At least 6 characters"]').fill("Password123!");
    await page.locator('input[placeholder="Repeat password"]').fill("Password123!");

    const responsePromise = page.waitForResponse((res) => res.url().includes("/auth/register"));
    await page.getByRole("button", { name: /Create Account/i }).click();
    const response = await responsePromise;

    expect(response.status()).toBe(201);
    expect(requestBody).toEqual({
      name: newName,
      email: newEmail,
      password: "Password123!",
    });

    // Should redirect to /login
    await page.waitForURL(/.*\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/login/);

    // Success toast notification appears
    await expect(page.getByText("Account created successfully! Please sign in.")).toBeVisible();

    // Verify user can now login with these credentials
    await page.locator("#email-input").fill(newEmail);
    await page.locator("#password-input").fill("Password123!");
    await page.getByRole("button", { name: /Sign In/i }).click();

    await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});

