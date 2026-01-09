---
description: Build the current game for App Store submission using EAS Build
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Build for App Store

Build the current game for App Store submission using EAS Build.

## Usage

```
/build
```

## What This Does

1. Identifies the current game project from `expo-games/apps/`
2. Verifies all required assets exist (icon, splash, app.json metadata)
3. Runs `eas build --platform ios --profile production`
4. Waits for build completion (~10-15 minutes)
5. Provides download link for .ipa file

## Prerequisites

- EAS CLI installed: `npm install -g eas-cli`
- Logged into EAS: `eas login`
- Apple Developer credentials configured: `eas credentials`

## Build Profiles

The default `eas.json` includes:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

## Steps

### Step 1: Identify Project

```bash
# Find current game
ls expo-games/apps/
```

Ask user which game to build if multiple exist.

### Step 2: Verify Assets

Check these files exist:
- `expo-games/apps/[game]/assets/icon.png` (1024x1024)
- `expo-games/apps/[game]/assets/splash.png`
- `expo-games/apps/[game]/app.json` with valid bundleIdentifier

### Step 3: Run Build

```bash
cd expo-games/apps/[game]
eas build --platform ios --profile production --non-interactive
```

### Step 4: Report Status

```
═══════════════════════════════════════════════════════════════
█ BUILD STARTED
═══════════════════════════════════════════════════════════════

Game: [game-name]
Platform: iOS
Profile: production

Build URL: https://expo.dev/accounts/[account]/builds/[id]

The build typically takes 10-15 minutes.
You'll receive a notification when complete.

When ready, run /submit to publish to App Store Connect.
═══════════════════════════════════════════════════════════════
```

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Not logged in | EAS session expired | Run `eas login` |
| Missing credentials | Apple creds not configured | Run `eas credentials` |
| Invalid bundleIdentifier | Incorrect format in app.json | Use reverse domain (com.company.app) |
| Missing icon | No 1024x1024 icon.png | Add proper icon to assets/ |
| Build queue | High demand on EAS servers | Wait for queue position |

## After Build Completes

Once the build finishes successfully:

1. Download the .ipa from the build URL
2. Run `/submit` to submit to App Store Connect
3. Or install on device via TestFlight for testing
