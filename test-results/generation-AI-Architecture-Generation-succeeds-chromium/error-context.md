# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: generation.spec.js >> AI Architecture Generation succeeds
- Location: tests\generation.spec.js:27:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | // Architecture Generation Integration Test
  2  | import { test, expect } from "@playwright/test";
  3  | 
  4  | // Helper to obtain auth token (login)
  5  | async function loginAndGetToken(page) {
  6  |   // Use existing test user credentials (create once if needed)
  7  |   const email = "test_user@example.com";
  8  |   const password = "TestPass123!";
  9  | 
  10 |   // Ensure user exists – attempt registration (ignore if duplicate)
  11 |   try {
  12 |     await page.request.post("http://localhost:5000/api/auth/register", {
  13 |       data: { name: "Test User", email, password, confirmPassword: password },
  14 |     });
  15 |   } catch (e) {
  16 |     // ignore duplicate errors
  17 |   }
  18 | 
  19 |   const loginRes = await page.request.post("http://localhost:5000/api/auth/login", {
  20 |     data: { email, password },
  21 |   });
  22 |   expect(loginRes.ok()).toBeTruthy();
  23 |   const body = await loginRes.json();
  24 |   return body.data?.token;
  25 | }
  26 | 
  27 | test("AI Architecture Generation succeeds", async ({ page }) => {
  28 |   const token = await loginAndGetToken(page);
  29 |   const payload = {
  30 |     title: "Test Project",
  31 |     description: "A simple web app that lists items.",
  32 |     projectType: "Web Application",
  33 |     expectedScale: "Small",
  34 |     preferredCloud: "No Preference",
  35 |     preferredDatabase: "MongoDB",
  36 |     constraints: "",
  37 |   };
  38 | 
  39 |   const res = await page.request.post("http://localhost:5000/api/projects/generate", {
  40 |     data: payload,
  41 |     headers: { Authorization: `Bearer ${token}` },
  42 |   });
  43 |   console.log('Response status:', res.status(), 'ok?', res.ok());
  44 |   const body = await res.json();
  45 |   console.log('Response body:', JSON.stringify(body));
> 46 |   expect(res.ok()).toBeTruthy();
     |                    ^ Error: expect(received).toBeTruthy()
  47 | 
  48 |   // The API should return a Project document with architecture field
  49 |   expect(body.data).toBeDefined();
  50 |   expect(body.data.architecture).toBeDefined();
  51 |   expect(body.data.aiMetadata).toBeDefined();
  52 | });
  53 | 
```