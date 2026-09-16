# Playwright POM Tests

This project uses Playwright with page objects and discovers tests recursively from `tests/`. Tests can be grouped in folders such as `tests/e2e/` and `tests/smoke/`; both are picked up by the default Playwright test matcher.

## Local execution

Install dependencies and browsers:

```bash
npm ci
npx playwright install
```

Run the complete suite:

```bash
npx playwright test
```

The framework runs headed and records video by default. The HTML report is written to `playwright-report/` and can be opened with:

```bash
npx playwright show-report
```

## GitHub Actions

The `Playwright Tests` workflow runs on pushes and pull requests targeting `main` or `master`. It can also be started manually from the **Actions** tab with **Run workflow**.

Manual runs provide these text inputs:

- `branch`: branch to check out, default `main`
- `retries`: retries for a failed test, default `1`
- `workers`: Playwright workers, default `1`

The workflow installs browsers, runs the suite under `xvfb` so headed mode works on Ubuntu, and uploads the HTML report both as a workflow artifact and as a GitHub Pages artifact. The report deployment runs even when tests fail, and the deployed URL is shown in the workflow's **Environment** section and job summary.

### Enable GitHub Pages

In the repository, open **Settings > Pages**, set **Source** to **GitHub Actions**, and run the workflow once. The `github-pages` environment URL will then point to the latest published Playwright report.

## Configuration overrides

The Playwright config accepts these environment variables for local or CI runs:

```bash
PW_RETRIES=1 PW_WORKERS=1 npx playwright test
```

The GitHub Actions workflow supplies these values from its manual-run inputs. Test discovery remains rooted at `tests/` and includes JavaScript and TypeScript Playwright specs in nested `e2e` or `smoke` folders.