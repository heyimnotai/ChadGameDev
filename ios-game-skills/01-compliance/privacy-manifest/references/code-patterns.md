# Privacy Manifest Code Patterns

## Complete Privacy Manifest Template (No Tracking)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>

    <key>NSPrivacyTrackingDomains</key>
    <array/>

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

    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <!-- Anonymous User ID -->
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

        <!-- Gameplay Content -->
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

## Privacy Manifest with Advertising

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <true/>

    <key>NSPrivacyTrackingDomains</key>
    <array>
        <string>analytics.example.com</string>
        <string>ads.adnetwork.com</string>
        <string>attribution.mobileanalytics.com</string>
    </array>

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
    </array>
</dict>
</plist>
```

## App Tracking Transparency Implementation

### Info.plist Entry

```xml
<key>NSUserTrackingUsageDescription</key>
<string>This allows us to provide you with personalized ads and measure the effectiveness of ad campaigns. Your data is not sold to third parties.</string>
```

### TrackingManager

```swift
import AppTrackingTransparency
import AdSupport

final class TrackingManager {
    static let shared = TrackingManager()

    var trackingStatus: ATTrackingManager.AuthorizationStatus {
        ATTrackingManager.trackingAuthorizationStatus
    }

    var isTrackingAuthorized: Bool {
        trackingStatus == .authorized
    }

    var advertisingIdentifier: String? {
        guard isTrackingAuthorized else { return nil }
        let idfa = ASIdentifierManager.shared().advertisingIdentifier
        guard idfa.uuidString != "00000000-0000-0000-0000-000000000000" else { return nil }
        return idfa.uuidString
    }

    func requestTrackingAuthorization() async -> ATTrackingManager.AuthorizationStatus {
        if trackingStatus != .notDetermined {
            return trackingStatus
        }

        return await withCheckedContinuation { continuation in
            ATTrackingManager.requestTrackingAuthorization { status in
                continuation.resume(returning: status)
            }
        }
    }

    func configureAdSDKs() {
        switch trackingStatus {
        case .authorized:
            configurePersonalizedAds()
        case .denied, .restricted, .notDetermined:
            configureContextualAds()
        @unknown default:
            configureContextualAds()
        }
    }

    private func configurePersonalizedAds() { /* Pass IDFA to ad networks */ }
    private func configureContextualAds() { /* Disable IDFA-based targeting */ }
}
```

### ATT Pre-Prompt View

```swift
import SwiftUI

struct ATTPermissionView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 24) {
            Image(systemName: "megaphone.fill")
                .font(.system(size: 64))
                .foregroundColor(.accentColor)

            Text("Support Free Games")
                .font(.title).fontWeight(.bold)

            Text("Allow tracking to help us show you relevant ads and keep this game free.")
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)

            VStack(spacing: 12) {
                Button("Continue") { requestTracking() }
                    .buttonStyle(.borderedProminent)

                Button("Maybe Later") { dismiss() }
                    .foregroundColor(.secondary)
            }
        }
        .padding(32)
    }

    private func requestTracking() {
        Task {
            await TrackingManager.shared.requestTrackingAuthorization()
            await MainActor.run { dismiss() }
        }
    }
}
```

### ATT Timing Manager

```swift
final class ATTTimingManager {
    private let defaults = UserDefaults.standard
    private let hasSeenATTKey = "hasSeenATTPrompt"
    private let sessionsBeforeATTKey = "sessionsBeforeATT"
    private let minimumSessionsBeforeATT = 2

    var shouldShowATTPrompt: Bool {
        guard !defaults.bool(forKey: hasSeenATTKey) else { return false }
        let sessions = defaults.integer(forKey: sessionsBeforeATTKey)
        guard sessions >= minimumSessionsBeforeATT else { return false }
        guard TrackingManager.shared.trackingStatus == .notDetermined else { return false }
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

// WHEN TO SHOW ATT:
// - NEVER at first app launch
// - After user completes first core loop
// - Before showing first interstitial ad
```

## Third-Party SDK Privacy Audit

```swift
struct ThirdPartySDKAudit {
    struct SDKPrivacyProfile {
        let name: String
        let hasOwnPrivacyManifest: Bool
        let requiredAPITypes: [String]
        let collectedDataTypes: [String]
        let trackingDomains: [String]
        let requiresATT: Bool
    }

    static let commonSDKs: [SDKPrivacyProfile] = [
        SDKPrivacyProfile(
            name: "Firebase Analytics",
            hasOwnPrivacyManifest: true,
            requiredAPITypes: ["UserDefaults", "SystemBootTime"],
            collectedDataTypes: ["DeviceID", "ProductInteraction", "AdvertisingData"],
            trackingDomains: ["firebase-settings.crashlytics.com", "app-measurement.com"],
            requiresATT: true
        ),
        SDKPrivacyProfile(
            name: "Unity Ads",
            hasOwnPrivacyManifest: true,
            requiredAPITypes: ["UserDefaults", "SystemBootTime", "DiskSpace"],
            collectedDataTypes: ["DeviceID", "AdvertisingData", "ProductInteraction"],
            trackingDomains: ["unityads.unity3d.com", "prd-lbs.ads.unity3d.com"],
            requiresATT: true
        ),
        SDKPrivacyProfile(
            name: "Google AdMob",
            hasOwnPrivacyManifest: true,
            requiredAPITypes: ["UserDefaults", "SystemBootTime"],
            collectedDataTypes: ["DeviceID", "AdvertisingData", "Location"],
            trackingDomains: ["googleads.g.doubleclick.net", "pagead2.googlesyndication.com"],
            requiresATT: true
        ),
        SDKPrivacyProfile(
            name: "GameAnalytics",
            hasOwnPrivacyManifest: true,
            requiredAPITypes: ["UserDefaults", "SystemBootTime"],
            collectedDataTypes: ["DeviceID", "ProductInteraction", "PerformanceData"],
            trackingDomains: ["api.gameanalytics.com"],
            requiresATT: false
        )
    ]

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
            if sdk.requiresATT { requiresATT = true }
            if !sdk.hasOwnPrivacyManifest { sdksWithoutManifest.append(sdk.name) }
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
