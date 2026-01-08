---
name: privacy-manifest
description: Implements correct PrivacyInfo.xcprivacy manifests for iOS games including required API declarations, privacy nutrition labels, and App Tracking Transparency. Use this skill when creating a new game project, adding third-party SDKs, preparing for App Store submission, responding to privacy-related rejections, or auditing data collection practices. Triggers include: new project setup, SDK integration, pre-submission review, privacy audit, ATT implementation.
---

# Privacy Manifest Implementation

## Purpose

This skill enables Claude agents to implement complete and accurate privacy manifests for iOS games. It ensures compliance with Apple's privacy requirements (mandatory since May 2024) by providing exact API declarations, privacy nutrition label mappings, and App Tracking Transparency implementation. Games following this skill pass privacy review on first submission and maintain user trust through transparent data practices.

## Domain Boundaries

- **This skill handles**: PrivacyInfo.xcprivacy file creation, required API declarations, privacy nutrition label configuration, App Tracking Transparency implementation, third-party SDK privacy audits, data collection documentation
- **This skill does NOT handle**: App Store submission process (see `app-store-review` skill), user authentication flows (see `game-center-integration` skill), analytics architecture decisions (see `analytics-integration` skill)

## Core Specifications

### Privacy Manifest File Structure

File location: `[ProjectName]/PrivacyInfo.xcprivacy`

The privacy manifest is a property list (plist) with four main keys:

| Key | Type | Purpose |
|-----|------|---------|
| `NSPrivacyTracking` | Boolean | Whether app engages in tracking |
| `NSPrivacyTrackingDomains` | Array of Strings | Domains used for tracking |
| `NSPrivacyCollectedDataTypes` | Array of Dictionaries | Data types collected and their purposes |
| `NSPrivacyAccessedAPITypes` | Array of Dictionaries | Required reason APIs used |

### Required Reason APIs for Games

These APIs require declaration with specific reason codes:

#### NSPrivacyAccessedAPICategoryUserDefaults

**API**: `UserDefaults` and related APIs

| Reason Code | Description | Typical Game Use |
|-------------|-------------|------------------|
| `CA92.1` | Access info from same app | Settings, preferences, game state |
| `1C8F.1` | Access info from same developer's apps | Shared user preferences |

**When Required**: Almost all games use UserDefaults for settings/progress.

#### NSPrivacyAccessedAPICategoryFileTimestamp

**API**: File metadata APIs (creation date, modification date)

| Reason Code | Description | Typical Game Use |
|-------------|-------------|------------------|
| `C617.1` | Access timestamps in app's container | Save file management |
| `3B52.1` | Access for document management UI | Level editor, replay files |
| `0A2A.1` | Access to support files user explicitly chose | User-imported content |
| `DDA9.1` | Access to calculate file hashes | Save file integrity checks |

**When Required**: Games that check save file dates or manage user content.

#### NSPrivacyAccessedAPICategorySystemBootTime

**API**: `systemUptime`, `mach_absolute_time`, related timing APIs

| Reason Code | Description | Typical Game Use |
|-------------|-------------|------------------|
| `35F9.1` | Calculate time elapsed between events | Game timers, frame timing |
| `8FFB.1` | Access for calculating timers in app | Cooldowns, session length |

**When Required**: Most games using CADisplayLink or game loops.

#### NSPrivacyAccessedAPICategoryDiskSpace

**API**: Disk space APIs (`FileManager` volume capacity)

| Reason Code | Description | Typical Game Use |
|-------------|-------------|------------------|
| `E174.1` | Check if sufficient space before writing | Asset downloads, save files |
| `85F4.1` | Display disk space to user | Download manager UI |

**When Required**: Games downloading on-demand resources or large saves.

#### NSPrivacyAccessedAPICategoryActiveKeyboards

**API**: Active keyboard list APIs

| Reason Code | Description | Typical Game Use |
|-------------|-------------|------------------|
| `3EC4.1` | Customize app UI for keyboards | Custom text input (rare for games) |

**When Required**: Games with custom keyboard handling (usually not needed).

### Privacy Nutrition Labels

#### Data Types Collected by Games

| Data Type Key | NSPrivacyCollectedDataType | Common in Games |
|---------------|---------------------------|-----------------|
| Name | `NSPrivacyCollectedDataTypeName` | Leaderboards, profiles |
| Email | `NSPrivacyCollectedDataTypeEmailAddress` | Account systems |
| Phone Number | `NSPrivacyCollectedDataTypePhoneNumber` | Rare |
| User ID | `NSPrivacyCollectedDataTypeUserID` | Always (anonymous IDs) |
| Device ID | `NSPrivacyCollectedDataTypeDeviceID` | Analytics, anti-cheat |
| Gameplay Content | `NSPrivacyCollectedDataTypeGameplayContent` | Replays, custom levels |
| Purchase History | `NSPrivacyCollectedDataTypePurchaseHistory` | IAP tracking |
| Crash Data | `NSPrivacyCollectedDataTypeCrashData` | Crash reporting |
| Performance Data | `NSPrivacyCollectedDataTypePerformanceData` | Analytics |
| Advertising Data | `NSPrivacyCollectedDataTypeAdvertisingData` | Ad networks |

#### Collection Purposes

| Purpose Key | NSPrivacyCollectedDataTypePurpose | Description |
|-------------|----------------------------------|-------------|
| Analytics | `NSPrivacyCollectedDataTypePurposeAnalytics` | Understanding usage patterns |
| App Functionality | `NSPrivacyCollectedDataTypePurposeAppFunctionality` | Core game features |
| Developer Advertising | `NSPrivacyCollectedDataTypePurposeDeveloperAdvertising` | Your own ads |
| Third-Party Advertising | `NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising` | Ad network ads |
| Product Personalization | `NSPrivacyCollectedDataTypePurposeProductPersonalization` | Custom experience |
| Other | `NSPrivacyCollectedDataTypePurposeOther` | Other purposes (must explain) |

#### Linked/Tracking Flags

| Flag | Key | When True |
|------|-----|-----------|
| Linked to Identity | `NSPrivacyCollectedDataTypeLinked` | Data associated with user account |
| Used for Tracking | `NSPrivacyCollectedDataTypeTracking` | Data used to track users across apps/websites |

### App Tracking Transparency (ATT)

**Required when**: Sharing device or user data with third parties for advertising/tracking purposes.

**Not required when**:
- First-party analytics only
- Data stays on device
- Aggregated/anonymized data only
- No advertising SDKs

## Implementation Patterns

### Complete Privacy Manifest Template for Games

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Tracking Declaration -->
    <key>NSPrivacyTracking</key>
    <false/>

    <!-- Tracking Domains (if NSPrivacyTracking is true) -->
    <key>NSPrivacyTrackingDomains</key>
    <array/>

    <!-- Required Reason APIs -->
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <!-- UserDefaults - Almost all games need this -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>

        <!-- System Boot Time - For game timing -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategorySystemBootTime</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>35F9.1</string>
            </array>
        </dict>

        <!-- File Timestamps - For save file management -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>C617.1</string>
            </array>
        </dict>

        <!-- Disk Space - For downloads/saves -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryDiskSpace</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>E174.1</string>
            </array>
        </dict>
    </array>

    <!-- Collected Data Types -->
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <!-- Anonymous User ID (for save sync, leaderboards) -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeUserID</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>

        <!-- Gameplay Content (save data) -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeGameplayContent</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

### Privacy Manifest with Advertising

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- TRACKING ENABLED - Requires ATT prompt -->
    <key>NSPrivacyTracking</key>
    <true/>

    <!-- Tracking Domains - List all ad network domains -->
    <key>NSPrivacyTrackingDomains</key>
    <array>
        <string>analytics.example.com</string>
        <string>ads.adnetwork.com</string>
        <string>attribution.mobileanalytics.com</string>
    </array>

    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <!-- Standard game APIs -->
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategorySystemBootTime</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>35F9.1</string>
            </array>
        </dict>
    </array>

    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <!-- Device ID for advertising -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeDeviceID</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <true/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising</string>
            </array>
        </dict>

        <!-- Advertising Data -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeAdvertisingData</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <true/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeThirdPartyAdvertising</string>
            </array>
        </dict>

        <!-- Purchase History (for ad optimization) -->
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypePurchaseHistory</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <false/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

### App Tracking Transparency Implementation

#### Info.plist Entry

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This allows us to provide you with personalized ads and measure the effectiveness of ad campaigns. Your data is not sold to third parties.</string>
```

#### ATT Request Implementation

```swift
import AppTrackingTransparency
import AdSupport

final class TrackingManager {

    static let shared = TrackingManager()

    /// Current tracking authorization status
    var trackingStatus: ATTrackingManager.AuthorizationStatus {
        ATTrackingManager.trackingAuthorizationStatus
    }

    /// Whether tracking is authorized
    var isTrackingAuthorized: Bool {
        trackingStatus == .authorized
    }

    /// The advertising identifier (only valid if tracking authorized)
    var advertisingIdentifier: String? {
        guard isTrackingAuthorized else { return nil }
        let idfa = ASIdentifierManager.shared().advertisingIdentifier
        // Check for zeroed IDFA (user opted out at system level)
        guard idfa.uuidString != "00000000-0000-0000-0000-000000000000" else {
            return nil
        }
        return idfa.uuidString
    }

    /// Request tracking authorization
    /// IMPORTANT: Call AFTER user sees value in the app (not at first launch)
    func requestTrackingAuthorization() async -> ATTrackingManager.AuthorizationStatus {
        // Check if already determined
        if trackingStatus != .notDetermined {
            return trackingStatus
        }

        // Request authorization
        return await withCheckedContinuation { continuation in
            ATTrackingManager.requestTrackingAuthorization { status in
                continuation.resume(returning: status)
            }
        }
    }

    /// Configure ad SDKs based on tracking status
    func configureAdSDKs() {
        switch trackingStatus {
        case .authorized:
            // Full ad personalization enabled
            configurePersonalizedAds()
        case .denied, .restricted:
            // Contextual ads only
            configureContextualAds()
        case .notDetermined:
            // Will need to request later
            // Use contextual ads until determined
            configureContextualAds()
        @unknown default:
            configureContextualAds()
        }
    }

    private func configurePersonalizedAds() {
        // Pass IDFA to ad networks
        // Enable user-level ad targeting
    }

    private func configureContextualAds() {
        // Disable IDFA-based targeting
        // Use only contextual/content-based ads
    }
}
```

#### ATT Best Practices

```swift
import SwiftUI

struct ATTPermissionView: View {
    @State private var showingSystemPrompt = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "megaphone.fill")
                .font(.system(size: 64))
                .foregroundColor(.accentColor)

            Text("Support Free Games")
                .font(.title)
                .fontWeight(.bold)

            Text("Allow tracking to help us show you relevant ads and keep this game free. We never sell your personal data.")
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)

            VStack(spacing: 12) {
                Button("Continue") {
                    requestTracking()
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)

                Button("Maybe Later") {
                    dismiss()
                }
                .foregroundColor(.secondary)
            }
        }
        .padding(32)
    }

    private func requestTracking() {
        Task {
            let status = await TrackingManager.shared.requestTrackingAuthorization()
            await MainActor.run {
                // Handle result
                dismiss()
            }
        }
    }
}

// WHEN TO SHOW ATT:
// - NEVER at first app launch
// - After user completes first core loop (played a level, etc.)
// - Before showing first interstitial ad
// - When user accesses personalized features

final class ATTTimingManager {

    private let defaults = UserDefaults.standard
    private let hasSeenATTKey = "hasSeenATTPrompt"
    private let sessionsBeforeATTKey = "sessionsBeforeATT"

    /// Minimum sessions before showing ATT (let user see value first)
    private let minimumSessionsBeforeATT = 2

    var shouldShowATTPrompt: Bool {
        // Already shown
        guard !defaults.bool(forKey: hasSeenATTKey) else { return false }

        // Not enough sessions yet
        let sessions = defaults.integer(forKey: sessionsBeforeATTKey)
        guard sessions >= minimumSessionsBeforeATT else { return false }

        // Status already determined
        guard TrackingManager.shared.trackingStatus == .notDetermined else {
            return false
        }

        return true
    }

    func incrementSessionCount() {
        let current = defaults.integer(forKey: sessionsBeforeATTKey)
        defaults.set(current + 1, forKey: sessionsBeforeATTKey)
    }

    func markATTShown() {
        defaults.set(true, forKey: hasSeenATTKey)
    }
}
```

### Third-Party SDK Privacy Audit

```swift
/// Document third-party SDKs and their privacy requirements
struct ThirdPartySDKAudit {

    struct SDKPrivacyProfile {
        let name: String
        let hasOwnPrivacyManifest: Bool
        let requiredAPITypes: [String]
        let collectedDataTypes: [String]
        let trackingDomains: [String]
        let requiresATT: Bool
    }

    /// Common game SDKs and their privacy profiles
    static let commonSDKs: [SDKPrivacyProfile] = [
        // Firebase/Google Analytics
        SDKPrivacyProfile(
            name: "Firebase Analytics",
            hasOwnPrivacyManifest: true, // As of Firebase 10.22+
            requiredAPITypes: ["UserDefaults", "SystemBootTime"],
            collectedDataTypes: ["DeviceID", "ProductInteraction", "AdvertisingData"],
            trackingDomains: ["firebase-settings.crashlytics.com", "app-measurement.com"],
            requiresATT: true // If using Google Ads integration
        ),

        // Unity Ads
        SDKPrivacyProfile(
            name: "Unity Ads",
            hasOwnPrivacyManifest: true, // Check SDK version
            requiredAPITypes: ["UserDefaults", "SystemBootTime", "DiskSpace"],
            collectedDataTypes: ["DeviceID", "AdvertisingData", "ProductInteraction"],
            trackingDomains: ["unityads.unity3d.com", "prd-lbs.ads.unity3d.com"],
            requiresATT: true
        ),

        // AdMob
        SDKPrivacyProfile(
            name: "Google AdMob",
            hasOwnPrivacyManifest: true,
            requiredAPITypes: ["UserDefaults", "SystemBootTime"],
            collectedDataTypes: ["DeviceID", "AdvertisingData", "Location"],
            trackingDomains: ["googleads.g.doubleclick.net", "pagead2.googlesyndication.com"],
            requiresATT: true
        ),

        // GameAnalytics
        SDKPrivacyProfile(
            name: "GameAnalytics",
            hasOwnPrivacyManifest: true,
            requiredAPITypes: ["UserDefaults", "SystemBootTime"],
            collectedDataTypes: ["DeviceID", "ProductInteraction", "PerformanceData"],
            trackingDomains: ["api.gameanalytics.com"],
            requiresATT: false // First-party analytics only
        ),

        // Adjust
        SDKPrivacyProfile(
            name: "Adjust SDK",
            hasOwnPrivacyManifest: true,
            requiredAPITypes: ["UserDefaults", "SystemBootTime"],
            collectedDataTypes: ["DeviceID", "AdvertisingData"],
            trackingDomains: ["adjust.com", "app.adjust.com"],
            requiresATT: true
        )
    ]

    /// Generate combined privacy manifest requirements
    static func auditSDKs(_ sdks: [SDKPrivacyProfile]) -> AuditResult {
        var allAPIs = Set<String>()
        var allDataTypes = Set<String>()
        var allTrackingDomains = Set<String>()
        var requiresATT = false
        var sdksWithoutManifest: [String] = []

        for sdk in sdks {
            allAPIs.formUnion(sdk.requiredAPITypes)
            allDataTypes.formUnion(sdk.collectedDataTypes)
            allTrackingDomains.formUnion(sdk.trackingDomains)

            if sdk.requiresATT {
                requiresATT = true
            }

            if !sdk.hasOwnPrivacyManifest {
                sdksWithoutManifest.append(sdk.name)
            }
        }

        return AuditResult(
            requiredAPIs: Array(allAPIs),
            collectedDataTypes: Array(allDataTypes),
            trackingDomains: Array(allTrackingDomains),
            requiresATT: requiresATT,
            sdksNeedingManifestEntries: sdksWithoutManifest
        )
    }

    struct AuditResult {
        let requiredAPIs: [String]
        let collectedDataTypes: [String]
        let trackingDomains: [String]
        let requiresATT: Bool
        let sdksNeedingManifestEntries: [String]
    }
}
```

## Decision Trees

### Do I Need a Privacy Manifest?

```
Is app being submitted to App Store?
├── No → Privacy manifest optional but recommended
└── Yes → Does app use ANY of these APIs?
    - UserDefaults
    - File timestamp APIs
    - System boot time / mach_absolute_time
    - Disk space APIs
    - Active keyboard APIs
    ├── No → Minimal manifest still recommended
    └── Yes → REQUIRED: Privacy manifest with API declarations
        └── Does app use third-party SDKs?
            ├── No → Declare only your own API usage
            └── Yes → Check each SDK for privacy manifest
                └── SDKs WITHOUT manifests → YOU must declare their API usage
```

### Do I Need ATT?

```
Does app display ads?
├── No → Does app share data with third parties?
│   ├── No → ATT NOT required
│   └── Yes → Is data used for tracking users across apps?
│       ├── No (analytics only) → ATT NOT required
│       └── Yes → ATT REQUIRED
└── Yes → Are ads personalized using device ID?
    ├── No (contextual ads only) → ATT NOT required
    └── Yes → ATT REQUIRED
        └── Is user data shared with ad network?
            └── Yes → Must declare NSPrivacyTracking = true
```

### Tracking Domains Decision

```
NSPrivacyTracking = true?
├── No → NSPrivacyTrackingDomains can be empty
└── Yes → List ALL domains that receive tracking data
    └── For each third-party SDK:
        └── Which domains does it connect to?
            └── Does it send device/user identifiers?
                ├── No → Not a tracking domain
                └── Yes → ADD to NSPrivacyTrackingDomains
```

## Quality Checklist

### Privacy Manifest Completeness

- [ ] PrivacyInfo.xcprivacy file exists in main app target
- [ ] All required reason APIs declared with valid reason codes
- [ ] NSPrivacyTracking accurately reflects tracking behavior
- [ ] NSPrivacyTrackingDomains lists all tracking endpoints (if tracking enabled)
- [ ] All collected data types documented
- [ ] Each data type has accurate linked/tracking flags
- [ ] Collection purposes match actual usage

### ATT Implementation (If Required)

- [ ] NSUserTrackingUsageDescription in Info.plist
- [ ] Usage description is clear and honest (not manipulative)
- [ ] ATT prompt shown AFTER user experiences app value
- [ ] ATT prompt NOT shown at first launch
- [ ] App functions correctly when tracking denied
- [ ] Tracking status checked before accessing IDFA
- [ ] Ad SDKs configured based on authorization status

### Third-Party SDK Compliance

- [ ] All SDKs audited for privacy manifest inclusion
- [ ] SDKs updated to versions with privacy manifests
- [ ] SDK tracking domains included in manifest
- [ ] SDK data collection documented
- [ ] SDK API usage covered in manifest

### Data Minimization

- [ ] Only necessary data collected
- [ ] Data retention periods defined
- [ ] User data deletion mechanism exists
- [ ] Anonymous identifiers used where possible
- [ ] Linked to identity only when required for features

## Anti-Patterns

### 1. Missing API Declarations

**What NOT to do**:
```xml
<!-- Empty or missing API declarations when using UserDefaults -->
<key>NSPrivacyAccessedAPITypes</key>
<array/>
```

**Consequence**: App rejection stating "Missing required reason API declarations"

**Correct Approach**:
```xml
<key>NSPrivacyAccessedAPITypes</key>
<array>
    <dict>
        <key>NSPrivacyAccessedAPIType</key>
        <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
        <key>NSPrivacyAccessedAPITypeReasons</key>
        <array>
            <string>CA92.1</string>
        </array>
    </dict>
</array>
```

### 2. Premature ATT Request

**What NOT to do**:
```swift
// In AppDelegate.didFinishLaunching or first view
func application(_ application: UIApplication, didFinishLaunchingWithOptions...) {
    ATTrackingManager.requestTrackingAuthorization { _ in }  // WRONG!
}
```

**Consequence**: Poor opt-in rates (users haven't seen value), potential rejection for dark patterns

**Correct Approach**:
```swift
// After user completes first level or sees first ad opportunity
class GameProgressManager {
    func onLevelComplete(level: Int) {
        if level == 3 && ATTTimingManager.shared.shouldShowATTPrompt {
            showATTExplanationThenPrompt()
        }
    }
}
```

### 3. Inaccurate Tracking Declaration

**What NOT to do**:
```xml
<!-- Claiming no tracking while using ad SDKs with IDFA -->
<key>NSPrivacyTracking</key>
<false/>

<!-- But including AdMob, Unity Ads, etc. that use IDFA -->
```

**Consequence**: Policy violation, potential app removal, legal exposure

**Correct Approach**:
```xml
<!-- Honest declaration matching actual SDK behavior -->
<key>NSPrivacyTracking</key>
<true/>
<key>NSPrivacyTrackingDomains</key>
<array>
    <string>googleads.g.doubleclick.net</string>
    <string>pagead2.googlesyndication.com</string>
</array>
```

### 4. Ignoring SDK Privacy Manifests

**What NOT to do**:
- Using old SDK versions without privacy manifests
- Not checking if SDKs include their own declarations
- Duplicating SDK declarations incorrectly

**Consequence**: App rejection for missing declarations or conflicting manifests

**Correct Approach**:
```swift
// Before adding any SDK, check:
// 1. Does SDK version include PrivacyInfo.xcprivacy?
// 2. What APIs does SDK use?
// 3. What data does SDK collect?
// 4. Does SDK require ATT?

// Document in project:
/*
 SDK Audit - January 2026

 Firebase 10.22+ ✓ Has privacy manifest
 Unity Ads 4.9+ ✓ Has privacy manifest
 CustomSDK 2.1 ✗ NO manifest - added to app manifest
*/
```

### 5. Wrong Reason Codes

**What NOT to do**:
```xml
<!-- Using wrong reason code for the actual usage -->
<dict>
    <key>NSPrivacyAccessedAPIType</key>
    <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
    <key>NSPrivacyAccessedAPITypeReasons</key>
    <array>
        <string>1C8F.1</string>  <!-- Cross-app access when only using within app -->
    </array>
</dict>
```

**Consequence**: Inconsistency may trigger review, potential rejection

**Correct Approach**:
```xml
<!-- Match reason code to actual usage -->
<dict>
    <key>NSPrivacyAccessedAPIType</key>
    <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
    <key>NSPrivacyAccessedAPITypeReasons</key>
    <array>
        <string>CA92.1</string>  <!-- Correct: within-app access -->
    </array>
</dict>
```

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `app-store-review` | Privacy manifest is required for submission compliance |
| `analytics-integration` | Analytics SDKs require privacy manifest declarations |
| `iap-implementation` | Purchase tracking requires data collection disclosure |
| `game-center-integration` | Game Center uses Apple infrastructure (minimal privacy impact) |
