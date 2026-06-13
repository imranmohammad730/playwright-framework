# Playwright TypeScript Framework

A production-ready Playwright + TypeScript test automation framework designed for SaaS teams that need test suites which survive past 1,000 tests without falling over.

Built around the patterns that actually hold up at scale: typed page objects, custom fixtures, environment-aware config, parallel sharding in CI, API + UI testing in one suite, and reporting that tells you why a test failed instead of just that it did.

## Why this framework

Most Playwright starter repos look great with 10 tests and turn into a maintenance nightmare at 200. This one is built around the failure modes I have hit while shipping QA across SaaS, healthcare, and fintech products over the last 8 years.

What is in here:

- **TypeScript end to end.** Type safety in fixtures, page objects, test data, and API responses.
- **Custom fixtures** for authenticated sessions, API client, and seeded test data so individual tests stay small.
- **Page Object Model** with a clean BasePage that handles common waits, screenshots on failure, and retry logic.
- **API testing alongside E2E** using the same Playwright runner. No separate Postman/Newman setup.
- **Multi-environment config** with type-checked env loading. Dev, staging, and production isolated, no surprises.
- **Tagged tests** for smoke, regression, and critical paths. Run what you need, when you need it.
- **GitHub Actions CI** with sharded parallel execution, browser caching, and HTML report upload.
- **Slack notifications** on failure with direct links to the failing test report.
- **Visual regression ready** with sensible defaults and a way to opt in per test.

## Quick start

```bash
git clone https://github.com/<your-username>/playwright-framework.git
cd playwright-framework
npm install
npx playwright install --with-deps
cp .env.example .env
npm test
```

You should see the smoke suite pass in under 30 seconds.

## Project structure

```
.
├── src/
│   ├── config/
│   │   └── environments.ts        # Type-safe env loading
│   ├── fixtures/
│   │   └── test-fixtures.ts       # Custom fixtures (auth, api, data)
│   ├── pages/
│   │   ├── BasePage.ts            # Shared page behavior
│   │   └── LoginPage.ts           # Example page object
│   └── utils/
│       ├── api-client.ts          # Typed API helper
│       └── test-data.ts           # Faker-based data factory
├── tests/
│   ├── api/
│   │   └── users.spec.ts          # API-only tests
│   ├── e2e/
│   │   └── login.spec.ts          # Full E2E flows
│   └── smoke/
│       └── health-check.spec.ts   # Sub-30s smoke suite
├── .github/
│   └── workflows/
│       └── playwright.yml         # Sharded CI pipeline
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

## Running tests

```bash
# Run everything
npm test

# Run by tag
npm run test:smoke
npm run test:regression
npm run test:critical

# Run a single file
npx playwright test tests/e2e/login.spec.ts

# Run against a specific environment
TEST_ENV=staging npm test

# Headed mode for debugging
npm run test:headed

# Open the HTML report after a run
npm run report
```

## Tagging tests

Tag tests with the suite they belong to. The runner uses these to scope what gets executed.

```ts
test('user can log in with valid credentials @smoke @critical', async ({ page }) => {
  // ...
});
```

Available tags: `@smoke`, `@regression`, `@critical`, `@visual`, `@flaky`.

## Environments

Three environments configured in `src/config/environments.ts`. Add a new one by extending the `Environment` enum and adding a matching block.

| Env       | URL example                    | Used for                  |
| --------- | ------------------------------ | ------------------------- |
| dev       | https://dev.yourapp.com        | Local development         |
| staging   | https://staging.yourapp.com    | Pre-prod validation       |
| production| https://yourapp.com            | Smoke + critical only     |

Switch with `TEST_ENV=staging npm test`.

## CI/CD

The included GitHub Actions workflow shards tests across 4 parallel runners by default, caches the browser binaries, and uploads the HTML report as an artifact. Slack notifications fire on failure if `SLACK_WEBHOOK_URL` is set in repo secrets.

To enable Slack:

1. Create an incoming webhook in your Slack workspace.
2. Add it as a repo secret named `SLACK_WEBHOOK_URL`.
3. Done. Failures will post automatically.

## Writing your first test

```ts
import { test, expect } from '../../src/fixtures/test-fixtures';

test('signed in user can update their profile @regression', async ({ authenticatedPage, apiClient }) => {
  // authenticatedPage is already logged in via the fixture
  await authenticatedPage.goto('/profile');
  await authenticatedPage.fill('[data-testid="bio"]', 'Updated bio');
  await authenticatedPage.click('[data-testid="save"]');

  // Verify via API to avoid relying on UI state
  const profile = await apiClient.getProfile();
  expect(profile.bio).toBe('Updated bio');
});
```

## Design decisions

A few choices worth calling out, in case you want to adapt them:

- **No `getByTestId` wrapper.** Playwright's locators are already good. Wrapping them adds indirection for no real gain. Use them directly.
- **Page objects expose user actions, not selectors.** `loginPage.signIn(user)` not `loginPage.emailInput.fill(user.email)`.
- **API client uses the same auth as the UI.** One source of truth for sessions, no parallel login flows.
- **Test data is generated, not hardcoded.** Faker keeps tests independent and prevents data collisions in parallel runs.
- **Soft assertions are explicit.** Use `expect.soft()` only when you genuinely want multiple failures reported. Default is hard fail.

## Common patterns

### Logged-in test without writing login code

```ts
test('shows dashboard after login', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  await expect(authenticatedPage.locator('h1')).toContainText('Welcome');
});
```

### API test for a CRUD flow

```ts
test('user CRUD via API', async ({ apiClient }) => {
  const user = await apiClient.createUser({ email: faker.internet.email() });
  expect(user.id).toBeDefined();

  const fetched = await apiClient.getUser(user.id);
  expect(fetched.email).toBe(user.email);

  await apiClient.deleteUser(user.id);
});
```

### Visual regression for a critical page

```ts
test('homepage visual @visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', { maxDiffPixels: 100 });
});
```

## What this framework deliberately does NOT do

- **Does not abstract Playwright away.** You should know Playwright. The framework adds patterns, not a new API.
- **Does not include BDD/Cucumber.** Gherkin slows you down at scale and adds a translation layer between PMs and engineers that rarely pays off. If your team needs it, fork and add it. Default is straight TypeScript.
- **Does not auto-heal selectors.** Brittle selectors are a code smell. Fix them, do not paper over them.

## License

MIT. Use it, fork it, ship it.

## Contact

Built and maintained by Imran Muhammad. Available for QA automation work via [Upwork](https://www.upwork.com/freelancers/~01939fc1459ca877ee).
