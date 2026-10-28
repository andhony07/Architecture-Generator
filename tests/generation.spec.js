// Architecture Generation Integration Test
import { test, expect } from "@playwright/test";

// Helper to obtain auth token (login)
async function loginAndGetToken(page) {
  // Use existing test user credentials (create once if needed)
  const email = "test_user@example.com";
  const password = "TestPass123!";

  // Ensure user exists – attempt registration (ignore if duplicate)
  try {
    await page.request.post("http://localhost:5000/api/auth/register", {
      data: { name: "Test User", email, password, confirmPassword: password },
    });
  } catch (e) {
    // ignore duplicate errors
  }

  const loginRes = await page.request.post("http://localhost:5000/api/auth/login", {
    data: { email, password },
  });
  expect(loginRes.ok()).toBeTruthy();
  const body = await loginRes.json();
  return body.data?.token;
}

test("AI Architecture Generation succeeds", async ({ page }) => {
  const token = await loginAndGetToken(page);
  const payload = {
    title: "Test Project",
    description: "A simple web app that lists items.",
    projectType: "Web Application",
    expectedScale: "Small",
    preferredCloud: "No Preference",
    preferredDatabase: "MongoDB",
    constraints: "",
  };

  const res = await page.request.post("http://localhost:5000/api/projects/generate", {
    data: payload,
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('Response status:', res.status(), 'ok?', res.ok());
  const body = await res.json();
  console.log('Response body:', JSON.stringify(body));
  expect(res.ok()).toBeTruthy();

  // The API should return a Project document with architecture field
  expect(body.data).toBeDefined();
  expect(body.data.architecture).toBeDefined();
  expect(body.data.aiMetadata).toBeDefined();
});
