# Blog List E2E Tests

This directory contains end-to-end tests for the Blog List application using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install system dependencies (for WSL):
```bash
sudo apt-get install -y libasound2
```

3. Install Playwright browsers:
```bash
npx playwright install chromium
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests with specific browser:
```bash
npx playwright test --project=chromium
```

## Test Structure

- `tests/blog.spec.js`: Contains tests for the blog application
  - Login form visibility
  - User authentication
  - Blog creation and interaction

## Configuration

Tests are configured in `playwright.config.js`:
- Uses Chromium browser
- Runs in headless mode
- Base URL: http://localhost:5173
- Timeout: 3 seconds

## Notes

- Make sure the frontend application is running on http://localhost:5173 before running tests
- Tests are written using Playwright's testing framework
- Uses headless mode for faster execution 