# Privacy Manifest API Reference

## Privacy Manifest Keys

| Key | Type | Purpose |
|-----|------|---------|
| `NSPrivacyTracking` | Boolean | Whether app engages in tracking |
| `NSPrivacyTrackingDomains` | Array | Domains used for tracking |
| `NSPrivacyCollectedDataTypes` | Array | Data types collected |
| `NSPrivacyAccessedAPITypes` | Array | Required reason APIs used |

## Required Reason APIs

### UserDefaults

| Reason | Description | Game Use |
|--------|-------------|----------|
| `CA92.1` | Access from same app | Settings, game state |
| `1C8F.1` | Access from same developer's apps | Shared preferences |

### File Timestamp

| Reason | Description | Game Use |
|--------|-------------|----------|
| `C617.1` | Access in app's container | Save file management |
| `3B52.1` | Document management UI | Level editor, replays |
| `0A2A.1` | User-chosen files | User-imported content |
| `DDA9.1` | Calculate file hashes | Save integrity checks |

### System Boot Time

| Reason | Description | Game Use |
|--------|-------------|----------|
| `35F9.1` | Calculate elapsed time | Game timers, frame timing |
| `8FFB.1` | Calculate app timers | Cooldowns, session length |

### Disk Space

| Reason | Description | Game Use |
|--------|-------------|----------|
| `E174.1` | Check space before writing | Asset downloads, saves |
| `85F4.1` | Display to user | Download manager UI |

## Data Types Collected

| Key | NSPrivacyCollectedDataType | Common in Games |
|-----|---------------------------|-----------------|
| Name | `...TypeName` | Leaderboards, profiles |
| Email | `...TypeEmailAddress` | Account systems |
| User ID | `...TypeUserID` | Always (anonymous IDs) |
| Device ID | `...TypeDeviceID` | Analytics, anti-cheat |
| Gameplay | `...TypeGameplayContent` | Replays, custom levels |
| Purchases | `...TypePurchaseHistory` | IAP tracking |
| Crash Data | `...TypeCrashData` | Crash reporting |
| Performance | `...TypePerformanceData` | Analytics |
| Advertising | `...TypeAdvertisingData` | Ad networks |

## Collection Purposes

| Key | Purpose |
|-----|---------|
| `...PurposeAnalytics` | Understanding usage patterns |
| `...PurposeAppFunctionality` | Core game features |
| `...PurposeDeveloperAdvertising` | Your own ads |
| `...PurposeThirdPartyAdvertising` | Ad network ads |
| `...PurposeProductPersonalization` | Custom experience |
| `...PurposeOther` | Other (must explain) |

## Decision Trees

### Need Privacy Manifest?

```
App Store submission?
├── No → Optional but recommended
└── Yes → Uses UserDefaults/timestamps/boot time/disk space?
    ├── No → Minimal manifest recommended
    └── Yes → REQUIRED with API declarations
        └── Third-party SDKs?
            ├── No → Declare own usage
            └── Yes → Check SDK manifests
                └── SDKs WITHOUT → YOU declare their APIs
```

### Need ATT?

```
Displays ads?
├── No → Shares data with third parties for tracking?
│   ├── No → ATT NOT required
│   └── Yes → ATT REQUIRED
└── Yes → Ads personalized using device ID?
    ├── No (contextual) → ATT NOT required
    └── Yes → ATT REQUIRED + NSPrivacyTracking = true
```

## ATT Timing Guidelines

**NEVER show at**:
- First app launch
- Before user sees value

**WHEN to show**:
- After first core loop completion
- Before first interstitial ad
- After 2+ sessions minimum

## Checklist

### Manifest Completeness
- [ ] PrivacyInfo.xcprivacy in main target
- [ ] All required APIs declared with valid reasons
- [ ] NSPrivacyTracking accurate
- [ ] Tracking domains listed (if tracking)
- [ ] All data types documented
- [ ] Linked/tracking flags accurate

### ATT (If Required)
- [ ] NSUserTrackingUsageDescription in Info.plist
- [ ] Prompt after user sees app value
- [ ] NOT at first launch
- [ ] App works when denied
- [ ] Status checked before IDFA access

### Third-Party SDKs
- [ ] All SDKs audited for manifests
- [ ] SDKs updated to versions with manifests
- [ ] SDK domains in tracking domains
- [ ] SDK data collection documented

## Common SDK Tracking Domains

| SDK | Domains |
|-----|---------|
| Firebase | firebase-settings.crashlytics.com, app-measurement.com |
| Unity Ads | unityads.unity3d.com, prd-lbs.ads.unity3d.com |
| AdMob | googleads.g.doubleclick.net, pagead2.googlesyndication.com |
| Adjust | adjust.com, app.adjust.com |
| GameAnalytics | api.gameanalytics.com |
