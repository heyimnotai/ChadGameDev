# EAS Configuration Reference

## Full eas.json Template

```json
{
  "cli": {
    "version": ">= 5.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "distribution": "store",
        "resourceClass": "m-medium",
        "autoIncrement": "buildNumber"
      },
      "env": {
        "NODE_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your@email.com",
        "ascAppId": "123456789",
        "appleTeamId": "XXXXXXXXXX"
      }
    }
  }
}
```

## Build Profiles

### development
- For local testing with Expo Dev Client
- Includes development tools
- Can run on simulator

### preview
- For internal testing (TestFlight internal)
- Stripped debug code
- Ad-hoc distribution

### production
- For App Store submission
- Fully optimized
- Store distribution

## Environment Variables

### In eas.json

```json
{
  "build": {
    "production": {
      "env": {
        "API_URL": "https://api.production.com",
        "SENTRY_DSN": "@sentry-dsn"
      }
    }
  }
}
```

### EAS Secrets (sensitive values)

```bash
# Set secret
eas secret:create --name SENTRY_DSN --value "https://xxx@sentry.io/123"

# Reference in eas.json with @
"SENTRY_DSN": "@sentry-dsn"
```

## Resource Classes

| Class | vCPU | RAM | Build Time | Cost |
|-------|------|-----|------------|------|
| default | 2 | 4GB | ~25min | Free |
| m-medium | 4 | 12GB | ~15min | Paid |
| m-large | 8 | 32GB | ~10min | Paid |

## Auto-Versioning

```json
{
  "cli": {
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": "buildNumber"
    }
  }
}
```

This increments buildNumber automatically, avoiding duplicate submission errors.

## Credentials Management

```bash
# View current credentials
eas credentials

# Set up new credentials
eas credentials --platform ios

# Sync with local Xcode
eas credentials --platform ios --environment production
```

### Credential Types

| Type | Purpose | Managed By |
|------|---------|------------|
| Distribution Cert | Sign for App Store | EAS (recommended) |
| Provisioning Profile | Link app to cert | EAS (recommended) |
| Push Key | Push notifications | Manual setup |

## Common Issues

### "Build failed: Missing provisioning profile"
```bash
eas credentials --platform ios
# Select "Build Credentials" > "Set up"
```

### "Duplicate buildNumber"
- Enable `autoIncrement` in eas.json
- Or manually increment in app.json

### "Apple ID requires 2FA"
- Use app-specific password
- Or use ASC API Key (preferred)
