---
description: Submit the latest build to App Store Connect for review
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Submit to App Store

Submit the latest build to App Store Connect for review.

## Usage

```
/submit
```

## What This Does

1. Finds the latest successful production build
2. Submits it to App Store Connect
3. Provides link to review in App Store Connect

## Prerequisites

- Completed production build (run `/build` first)
- Apple Developer credentials configured in EAS

## Steps

### Step 1: Identify Latest Build

```bash
cd expo-games/apps/[game]
eas build:list --platform ios --status finished --limit 1
```

### Step 2: Submit to App Store

```bash
eas submit --platform ios --latest
```

### Step 3: Report Status

```
═══════════════════════════════════════════════════════════════
█ SUBMITTED TO APP STORE CONNECT
═══════════════════════════════════════════════════════════════

Game: [game-name]
Version: [version]

Next Steps:
1. Open App Store Connect: https://appstoreconnect.apple.com
2. Navigate to your app
3. Complete App Information (description, keywords, screenshots)
4. Submit for Review

Apple review typically takes 1-2 days.
═══════════════════════════════════════════════════════════════
```

## App Store Checklist

Before submitting for review, ensure you have:

- [ ] App description (store/description.txt)
- [ ] Keywords (store/keywords.txt)
- [ ] Screenshots for required device sizes
- [ ] Privacy policy URL
- [ ] App category selected
- [ ] Age rating completed

## Required Screenshots

App Store requires screenshots for these device sizes:

| Device | Size | Required |
|--------|------|----------|
| iPhone 6.7" | 1290 x 2796 | Yes |
| iPhone 6.5" | 1284 x 2778 | Yes |
| iPhone 5.5" | 1242 x 2208 | Yes |
| iPad Pro 12.9" | 2048 x 2732 | If universal |

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| No builds found | Build not finished | Wait for /build to complete |
| Missing metadata | App Store info incomplete | Complete in App Store Connect |
| Rejected submission | Apple guidelines violation | Review rejection notes and fix |
| Credentials expired | Apple session timeout | Run `eas credentials` again |

## After Submission

1. **Processing** - Apple processes the build (few minutes to hours)
2. **Ready for Review** - Complete metadata in App Store Connect
3. **In Review** - Apple reviews your app (1-2 days typical)
4. **Approved** - App ready for release
5. **Released** - Available on App Store

## App Store Connect URLs

- Dashboard: https://appstoreconnect.apple.com
- App Analytics: https://appstoreconnect.apple.com/analytics
- Sales & Trends: https://appstoreconnect.apple.com/trends
