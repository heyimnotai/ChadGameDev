# CI/CD Workflows Reference

## EAS Workflow Basics

Workflows live in `.eas/workflows/*.yml`

## Production Deployment Workflow

```yaml
# .eas/workflows/deploy-production.yml
name: Deploy to App Store

on:
  push:
    branches: [main]
    paths:
      - 'expo-games/apps/**'

jobs:
  build-ios:
    name: Build iOS
    runs-on: eas-build
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build iOS
        run: eas build --platform ios --profile production --non-interactive

  submit-ios:
    name: Submit to App Store
    needs: build-ios
    runs-on: eas-build
    steps:
      - name: Submit
        run: eas submit --platform ios --latest --non-interactive
```

## TestFlight Preview Workflow

```yaml
# .eas/workflows/preview.yml
name: Deploy to TestFlight

on:
  push:
    branches: [develop]

jobs:
  build-preview:
    name: Build Preview
    runs-on: eas-build
    steps:
      - uses: actions/checkout@v4

      - name: Build
        run: eas build --platform ios --profile preview --non-interactive

      - name: Submit to TestFlight
        run: eas submit --platform ios --latest --non-interactive
```

## PR Preview Workflow

```yaml
# .eas/workflows/pr-preview.yml
name: PR Preview

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  build-dev:
    name: Development Build
    runs-on: eas-build
    steps:
      - uses: actions/checkout@v4

      - name: Build Dev Client
        run: eas build --platform ios --profile development --non-interactive

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '📱 Dev build ready! Check EAS dashboard for QR code.'
            })
```

## Validation Workflow

```yaml
# .eas/workflows/validate.yml
name: Validate

on:
  pull_request:

jobs:
  lint-test:
    name: Lint & Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm test

      - name: Type Check
        run: npm run typecheck
```

## Required Secrets

Set in EAS dashboard or GitHub:

| Secret | Purpose |
|--------|---------|
| EXPO_TOKEN | EAS authentication |
| APPLE_ID | App Store Connect |
| ASC_API_KEY | App Store Connect API |
| ASC_KEY_ID | API Key ID |
| ASC_ISSUER_ID | API Issuer ID |

## Workflow Commands

```bash
# List workflows
eas workflow:list

# Run workflow manually
eas workflow:run deploy-production

# View workflow logs
eas workflow:logs <workflow-id>

# Cancel running workflow
eas workflow:cancel <workflow-id>
```
