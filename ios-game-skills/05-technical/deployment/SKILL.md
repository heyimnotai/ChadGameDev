---
name: deployment
description: Use when building for App Store, submitting to TestFlight, or setting up CI/CD. Triggers on EAS Build, app distribution, submission workflows, or deployment automation.
---

# Deployment

## Purpose

Build and distribute iOS games through EAS Build, TestFlight, and App Store Connect with proper versioning and automation.

## When to Use

- Building production iOS binary
- Submitting to TestFlight for beta testing
- Submitting to App Store for review
- Setting up automated build pipelines
- Managing app versions and credentials

## Core Process

### First-Time Setup

1. `npm install -g eas-cli`
2. `eas login`
3. `eas build:configure` (creates eas.json)
4. `eas credentials` (link Apple Developer account)

### Build & Submit

1. **Build**: `eas build --platform ios --profile production`
2. **Wait**: Build runs in Expo cloud (~15-30 min)
3. **Submit**: `eas submit --platform ios`
4. **Monitor**: Check App Store Connect for review status

## Key Rules

**Before Building**:
- Increment version in app.json
- Verify all assets are final
- Run verification-before-completion skill
- Check privacy manifest exists

**Credentials**:
- Never commit credentials to git
- Use EAS Secrets for sensitive values
- Rotate credentials if compromised

**Versioning**:
- Semver: MAJOR.MINOR.PATCH
- Increment buildNumber for each submission
- App Store rejects duplicate buildNumbers

## Quick Reference

```json
// eas.json production profile
{
  "build": {
    "production": {
      "ios": {
        "distribution": "store",
        "autoIncrement": "buildNumber"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "123456789"
      }
    }
  }
}
```

### Commands

| Command | Purpose |
|---------|---------|
| `eas build -p ios` | Build iOS binary |
| `eas build:list` | Check build status |
| `eas submit -p ios` | Submit to App Store |
| `eas credentials` | Manage signing |

See `references/eas-config.md` for full configuration options.
See `references/cicd-workflows.md` for automation setup.

## Adjacent Skills

- **verification-before-completion**: Verify before building
- **app-store-review**: Compliance check before submit
- **app-store-optimization**: Metadata before submit
