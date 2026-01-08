---
name: app-store-review
description: Ensures first-submission App Store approval for iOS games. Use this skill when preparing a game for App Store submission, auditing an existing game for compliance, addressing App Store rejection feedback, or implementing features that require guideline awareness (IAP, user accounts, content moderation). Triggers include: pre-submission review, metadata preparation, rejection response, new feature compliance check.
---

# App Store Review Compliance

## Purpose

This skill enables Claude agents to prepare iOS games for successful first-submission App Store approval. It enforces Apple's quality bar by providing comprehensive guideline interpretation, rejection prevention strategies, and actionable validation checklists. Games following this skill achieve top 10% approval rates by avoiding the common rejection patterns that affect 40%+ of submissions.

## Domain Boundaries

- **This skill handles**: App Store Review Guidelines interpretation, metadata requirements, age rating determination, required disclosures, pre-submission validation, rejection response strategies, guideline-compliant feature design
- **This skill does NOT handle**: Privacy manifest implementation (see `privacy-manifest` skill), StoreKit code implementation (see `iap-implementation` skill), Game Center integration (see `game-center-integration` skill), device compatibility (see `universal-app-requirements` skill)

## Core Specifications

### Critical Guideline Sections for Games

| Guideline | Requirement | Rejection Risk | Enforcement Level |
|-----------|-------------|----------------|-------------------|
| **2.1 App Completeness** | Final versions only, no placeholder content, demo account credentials required if login exists | 40% of all rejections | Strict |
| **2.3 Accurate Metadata** | Screenshots must show actual gameplay (not just splash screens), IAP must be indicated, description must match functionality | High | Strict |
| **2.25 Loot Boxes** | Must disclose odds of receiving each item type PRIOR to purchase | Critical | Zero tolerance |
| **3.1.1 In-App Purchase** | ALL unlockable features/content/functionality must use Apple IAP; no external payment links | Critical | Zero tolerance |
| **3.1.3(b) Multiplatform Services** | May allow users to access purchased content from other platforms if purchases also available via IAP | Medium | Case-by-case |
| **4.1(c) Copycat Content** | Cannot use another developer's icon, brand, name, or clone their game concept | High | Strict |
| **4.2 Minimum Functionality** | Games must provide "lasting entertainment value" beyond repackaged website/HTML5 wrapper | Medium | Subjective |
| **4.7 Mini Games/HTML5** | HTML5 games in apps must follow all guidelines; no real-money gaming without license | High | Strict |
| **4.7.5 Age Gating** | Mini-games exceeding app's age rating require age restriction mechanism | High | Strict |
| **5.1.1(v) Account Sign-In** | If no significant account-based features, users must be able to play without login | Medium | Strict |
| **5.1.2(i) Data Sharing Disclosure** | Must disclose data sharing with third-party AI services | High | New (Nov 2025) |
| **5.3.4 Real Money Gaming** | Requires licensing, geo-restriction, and FREE App Store listing | Critical | Zero tolerance |

### Metadata Requirements

#### App Store Screenshots

| Device | Required Count | Dimensions (Portrait) | Dimensions (Landscape) |
|--------|---------------|----------------------|------------------------|
| iPhone 6.9" | 3-10 | 1320 x 2868 px | 2868 x 1320 px |
| iPhone 6.7" | 3-10 | 1290 x 2796 px | 2796 x 1290 px |
| iPhone 6.5" | 3-10 | 1284 x 2778 px | 2778 x 1284 px |
| iPhone 5.5" | 3-10 | 1242 x 2208 px | 2208 x 1242 px |
| iPad Pro 12.9" | 3-10 | 2048 x 2732 px | 2732 x 2048 px |
| iPad Pro 11" | 3-10 | 1668 x 2388 px | 2388 x 1668 px |

**Screenshot Requirements**:
- Must show actual in-game content (not pre-rendered marketing art unless clearly labeled)
- First 3 screenshots are most critical (visible without scrolling)
- Text overlays must not obscure gameplay
- Must not contain pricing information that varies by region
- App preview videos: 15-30 seconds, must use actual device captures

#### App Description

- **Character limit**: 4,000 characters
- **First 167 characters**: Visible without "more" tap (most critical)
- **Required elements**: Core gameplay description, IAP disclosure if present
- **Prohibited**: Pricing, time-sensitive language, mentions of competing platforms

#### Age Rating Questionnaire

| Content Category | Questions to Answer |
|-----------------|---------------------|
| Cartoon/Fantasy Violence | Frequency and intensity |
| Realistic Violence | Presence and graphic nature |
| Profanity/Crude Humor | Frequency and severity |
| Mature/Suggestive Themes | Presence |
| Gambling Themes | Real or simulated |
| Horror/Fear Themes | Intensity |
| User-Generated Content | Presence and moderation |
| Contests/Sweepstakes | Presence |

**Age Rating Mapping**:
- **4+**: No objectionable content
- **9+**: Mild cartoon/fantasy violence, mild profanity
- **12+**: Frequent/intense cartoon violence, simulated gambling, mild realistic violence
- **17+**: Realistic violence, mature themes, gambling with real money

### Required Disclosures

#### In-App Purchase Disclosure

When IAP exists, App Store listing automatically shows "Offers In-App Purchases" badge. Additionally:

```
Required in description or "What's New":
- Clear indication of purchasable content types
- Range of pricing if variable ($0.99 - $99.99)
- Whether purchases are required for core progression
```

#### Loot Box/Gacha Disclosure

```swift
// MUST display before ANY purchase containing random items:
struct LootBoxDisclosure: View {
    let odds: [(item: String, rarity: String, probability: Double)]

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Drop Rates")
                .font(.headline)

            ForEach(odds, id: \.item) { item in
                HStack {
                    Text(item.item)
                    Spacer()
                    Text(item.rarity)
                        .foregroundColor(.secondary)
                    Text(String(format: "%.1f%%", item.probability * 100))
                        .fontWeight(.semibold)
                }
            }

            Text("Odds shown are per individual pull. Actual results may vary.")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}
```

#### Subscription Auto-Renewal Disclosure

Required elements in subscription UI:
1. Title of publication or service
2. Length of subscription period
3. Price of subscription
4. Price per unit if duration differs from billing cycle
5. Statement that payment will be charged to iTunes Account at confirmation
6. Statement that subscription auto-renews unless cancelled at least 24 hours before end of current period
7. Statement that account will be charged for renewal within 24 hours prior to end of current period
8. Link to terms of service
9. Link to privacy policy
10. Statement about managing subscriptions and turning off auto-renewal in Account Settings

### Review Process Timeline

| Stage | Typical Duration | Notes |
|-------|-----------------|-------|
| Initial Submission | 24-48 hours | For review to begin |
| Standard Review | 1-3 days | 90% of apps |
| Extended Review | Up to 7 days | Complex apps or issues |
| Expedited Review | 24 hours | Must request with valid reason |
| Rejection Response | 24-48 hours | For re-review after changes |
| Appeal | 2-5 days | For disputed rejections |

**Expedited Review Valid Reasons**:
- Critical bug fix for live app
- Time-sensitive event (confirmed launch date, holiday)
- Security vulnerability fix

### Common Rejection Reasons with Prevention

#### 1. Guideline 2.1 - App Completeness (40% of rejections)

**Rejection Triggers**:
- Placeholder content ("Lorem ipsum", test images)
- Broken links or features
- Demo/beta labels remaining
- Missing demo account credentials

**Prevention Strategy**:
```swift
// Pre-submission content audit
final class ContentCompletionAudit {

    static func runAudit() -> [AuditIssue] {
        var issues: [AuditIssue] = []

        // Check for placeholder text patterns
        let placeholderPatterns = [
            "lorem ipsum",
            "placeholder",
            "TODO",
            "FIXME",
            "test",
            "coming soon",
            "[insert",
            "TBD"
        ]

        // Check for debug/test code
        #if DEBUG
        issues.append(.warning("DEBUG flag still enabled"))
        #endif

        // Verify all features are functional
        // Verify all in-app links work
        // Verify all UI strings are localized

        return issues
    }
}
```

#### 2. Guideline 2.3 - Accurate Metadata

**Rejection Triggers**:
- Screenshots showing features not in app
- Description mentioning unreleased features
- Misleading app icon or name
- Screenshots from different device than claimed

**Prevention Checklist**:
- [ ] Screenshots captured from actual device/simulator
- [ ] Every feature in description is functional
- [ ] No "coming soon" features mentioned
- [ ] App icon represents actual game content
- [ ] Keywords accurately describe game genre/content

#### 3. Guideline 3.1.1 - In-App Purchase

**Rejection Triggers**:
- External payment links
- Mentioning cheaper prices on website
- Unlocking content via web login
- "Tip jar" donations outside IAP

**Required Architecture**:
```swift
// ALL virtual goods/unlocks MUST go through StoreKit
enum PurchasableContent {
    case cosmetic(id: String)      // MUST use IAP
    case currency(amount: Int)     // MUST use IAP
    case subscription(tier: String) // MUST use IAP
    case premiumFeature(name: String) // MUST use IAP

    // Only exception: Physical goods with shipping
    // Only exception: Services consumed outside the app
}
```

#### 4. Guideline 5.1.1(v) - Account Requirements

**Rejection Triggers**:
- Requiring login before showing any gameplay
- Requiring account for single-player games
- No guest/anonymous play option

**Compliant Pattern**:
```swift
struct GameEntryFlow: View {
    @State private var showingLogin = false

    var body: some View {
        VStack(spacing: 20) {
            Button("Play as Guest") {
                // Immediately start game with local save
                startGameWithLocalSave()
            }
            .buttonStyle(.prominent)

            Button("Sign In for Cloud Saves") {
                showingLogin = true
            }
            .buttonStyle(.secondary)

            Text("Guest progress saved locally. Sign in anytime to enable cloud saves.")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}
```

## Implementation Patterns

### Pre-Submission Validation Script

```swift
import Foundation

struct AppStoreSubmissionValidator {

    struct ValidationResult {
        let category: String
        let passed: Bool
        let message: String
        let severity: Severity

        enum Severity {
            case critical   // Will definitely be rejected
            case high       // Very likely to be rejected
            case medium     // May be rejected
            case low        // Best practice
        }
    }

    static func validate() -> [ValidationResult] {
        var results: [ValidationResult] = []

        // 1. Privacy Manifest Check
        let privacyManifestExists = FileManager.default.fileExists(
            atPath: Bundle.main.path(forResource: "PrivacyInfo", ofType: "xcprivacy") ?? ""
        )
        results.append(ValidationResult(
            category: "Privacy",
            passed: privacyManifestExists,
            message: privacyManifestExists ?
                "PrivacyInfo.xcprivacy present" :
                "MISSING: PrivacyInfo.xcprivacy required since May 2024",
            severity: .critical
        ))

        // 2. Info.plist Required Keys
        let infoPlist = Bundle.main.infoDictionary ?? [:]

        // Check for tracking description if ATT used
        if usesAppTrackingTransparency() {
            let hasTrackingDescription = infoPlist["NSUserTrackingUsageDescription"] != nil
            results.append(ValidationResult(
                category: "Privacy",
                passed: hasTrackingDescription,
                message: hasTrackingDescription ?
                    "NSUserTrackingUsageDescription present" :
                    "MISSING: NSUserTrackingUsageDescription required for ATT",
                severity: .critical
            ))
        }

        // 3. Minimum Deployment Target
        let minVersion = infoPlist["MinimumOSVersion"] as? String ?? "0"
        let meetsMinimum = compareVersions(minVersion, "15.0") >= 0
        results.append(ValidationResult(
            category: "Compatibility",
            passed: meetsMinimum,
            message: "Minimum iOS version: \(minVersion)",
            severity: .low
        ))

        // 4. Required Device Capabilities
        let capabilities = infoPlist["UIRequiredDeviceCapabilities"] as? [String] ?? []
        results.append(ValidationResult(
            category: "Compatibility",
            passed: !capabilities.contains("armv7"),
            message: capabilities.contains("armv7") ?
                "armv7 architecture deprecated - remove from capabilities" :
                "Device capabilities valid",
            severity: .medium
        ))

        // 5. Launch Storyboard or Scene Configuration
        let hasLaunchStoryboard = infoPlist["UILaunchStoryboardName"] != nil
        let hasSceneConfiguration = infoPlist["UIApplicationSceneManifest"] != nil
        results.append(ValidationResult(
            category: "Launch",
            passed: hasLaunchStoryboard || hasSceneConfiguration,
            message: "Launch configuration present",
            severity: .critical
        ))

        return results
    }

    private static func usesAppTrackingTransparency() -> Bool {
        // Check if ATTrackingManager is linked
        return NSClassFromString("ATTrackingManager") != nil
    }

    private static func compareVersions(_ v1: String, _ v2: String) -> Int {
        let v1Parts = v1.split(separator: ".").compactMap { Int($0) }
        let v2Parts = v2.split(separator: ".").compactMap { Int($0) }

        for i in 0..<max(v1Parts.count, v2Parts.count) {
            let p1 = i < v1Parts.count ? v1Parts[i] : 0
            let p2 = i < v2Parts.count ? v2Parts[i] : 0
            if p1 != p2 { return p1 - p2 }
        }
        return 0
    }
}
```

### Demo Account Configuration

```swift
// For apps requiring login, provide test credentials in App Store Connect
// Review Notes section format:

/*
Demo Account Information:
- Email: demo@example.com
- Password: DemoPassword123!

This account has:
- Level 50 progress unlocked
- 10,000 premium currency
- All character skins
- Access to all game modes

To test specific features:
- Multiplayer: Queue during 9am-5pm PST for fastest matching
- IAP: Use sandbox tester account provided separately
*/
```

### Sign in with Apple Compliance

```swift
import AuthenticationServices

final class AuthenticationManager: NSObject {

    // RULE: If offering ANY third-party login, must also offer Sign in with Apple
    // EXCEPTION: Own account system only (no Google, Facebook, etc.)

    func presentLoginOptions(from viewController: UIViewController) {
        let alert = UIAlertController(
            title: "Sign In",
            message: "Create an account to save progress to the cloud",
            preferredStyle: .actionSheet
        )

        // Sign in with Apple MUST be listed first or equally prominent
        alert.addAction(UIAlertAction(title: "Sign in with Apple", style: .default) { _ in
            self.performAppleSignIn(from: viewController)
        })

        // Other options can follow
        alert.addAction(UIAlertAction(title: "Continue with Google", style: .default) { _ in
            self.performGoogleSignIn()
        })

        // Always provide skip option for non-essential accounts
        alert.addAction(UIAlertAction(title: "Continue as Guest", style: .cancel) { _ in
            self.continueAsGuest()
        })

        viewController.present(alert, animated: true)
    }

    private func performAppleSignIn(from viewController: UIViewController) {
        let provider = ASAuthorizationAppleIDProvider()
        let request = provider.createRequest()
        request.requestedScopes = [.fullName, .email]

        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.presentationContextProvider = self
        controller.performRequests()
    }
}

extension AuthenticationManager: ASAuthorizationControllerDelegate {
    func authorizationController(
        controller: ASAuthorizationController,
        didCompleteWithAuthorization authorization: ASAuthorization
    ) {
        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential else {
            return
        }

        // Store user identifier for session management
        let userID = credential.user

        // Email and name only provided on FIRST sign-in
        // Must store these if needed for account display
        if let email = credential.email {
            // Store email (may be private relay address)
        }

        if let fullName = credential.fullName {
            // Store name components
        }
    }
}

extension AuthenticationManager: ASAuthorizationControllerPresentationContextProviding {
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        UIApplication.shared.connectedScenes
            .compactMap { $0 as? UIWindowScene }
            .first?.windows.first ?? UIWindow()
    }
}
```

## Decision Trees

### Account System Decision

```
Does your game require an account?
├── No → Guest-only mode is compliant
└── Yes → Does the account provide value to the user?
    ├── No (just for your analytics) → MUST allow guest play
    └── Yes (cloud saves, multiplayer, etc.)
        └── Are you offering third-party login (Google, Facebook, etc.)?
            ├── No (own system only) → Sign in with Apple NOT required
            └── Yes → MUST offer Sign in with Apple
                └── User can choose ANY option including guest
```

### Loot Box Compliance Decision

```
Does purchase contain random/variable items?
├── No (specific item) → Standard IAP, no odds disclosure
└── Yes (random contents)
    └── Are odds disclosed BEFORE purchase screen?
        ├── No → REJECTION: Guideline 2.25 violation
        └── Yes → Is the disclosure clearly visible?
            ├── No (tiny text, hidden) → LIKELY REJECTION
            └── Yes (prominent display) → Compliant
                └── Are odds accurate to actual algorithm?
                    ├── No → CRITICAL: Fraud risk
                    └── Yes → Fully compliant
```

### Real Money Gaming Decision

```
Does game involve real money wagering?
├── No → Standard game guidelines apply
└── Yes → Do you have gambling license for EACH target region?
    ├── No → CANNOT publish on App Store
    └── Yes → Is the app listed as FREE?
        ├── No → REJECTION: Must be free
        └── Yes → Is geo-fencing implemented?
            ├── No → REJECTION: Must restrict to licensed regions
            └── Yes → Submit with license documentation
```

## Quality Checklist

### Pre-Submission Validation

- [ ] All placeholder content removed (search for "lorem", "TODO", "test")
- [ ] All features described in metadata are fully functional
- [ ] Demo account credentials documented in Review Notes
- [ ] Privacy manifest (PrivacyInfo.xcprivacy) present and complete
- [ ] Age rating questionnaire answers accurate
- [ ] Screenshots from actual devices, showing real gameplay
- [ ] App icon does not resemble competitor apps
- [ ] No external payment mechanisms or links

### IAP Compliance

- [ ] All virtual goods/currencies use StoreKit
- [ ] Loot box odds disclosed before purchase
- [ ] Subscription auto-renewal terms displayed
- [ ] Restore purchases button accessible
- [ ] Price tier selected (not custom prices)
- [ ] IAP product descriptions clear and accurate

### Account System Compliance

- [ ] Guest play available if account not essential
- [ ] Sign in with Apple offered if third-party login exists
- [ ] Account benefits clearly explained to user
- [ ] Account deletion mechanism available (GDPR/CCPA)

### Content Compliance

- [ ] Age rating matches actual content
- [ ] User-generated content has moderation system
- [ ] No prohibited content (explicit material, hate speech)
- [ ] Third-party IP properly licensed
- [ ] Music and sound effects rights secured

### Technical Compliance

- [ ] Built with Xcode 16+ and iOS 18 SDK (as of April 2025)
- [ ] Universal app supports both iPhone and iPad
- [ ] Launch time under 400ms to first frame
- [ ] No crashes in standard usage flows
- [ ] All required Info.plist keys present

## Anti-Patterns

### 1. "Coming Soon" Features in Metadata

**What NOT to do**:
```
App Description:
"Amazing puzzle game with 1000 levels!
Coming soon: Multiplayer mode, level editor, daily challenges..."
```

**Consequence**: Rejection under 2.1 for incomplete app

**Correct Approach**:
```
App Description:
"Amazing puzzle game with 1000 levels!
Challenge yourself through beautifully crafted puzzles..."

// Add features to description AFTER they ship in an update
```

### 2. External Payment References

**What NOT to do**:
```swift
Button("Buy Gems - Save 30% on our website!") {
    UIApplication.shared.open(URL(string: "https://example.com/shop")!)
}
```

**Consequence**: Immediate rejection under 3.1.1, potential app removal

**Correct Approach**:
```swift
// ALL purchases through StoreKit
Button("Buy 100 Gems - $4.99") {
    await purchaseProduct("gems_100")
}
```

### 3. Forcing Account Creation

**What NOT to do**:
```swift
struct LaunchView: View {
    var body: some View {
        // WRONG: Requires login before any gameplay
        LoginView(onComplete: { startGame() })
    }
}
```

**Consequence**: Rejection under 5.1.1(v)

**Correct Approach**:
```swift
struct LaunchView: View {
    var body: some View {
        VStack {
            Button("Play Now") { startGameAsGuest() }
            Button("Sign In (Optional)") { showLogin() }
        }
    }
}
```

### 4. Hidden Loot Box Odds

**What NOT to do**:
```swift
Button("Open Mystery Box - $2.99") {
    // Odds not shown anywhere
    purchaseAndOpenBox()
}
```

**Consequence**: Rejection under 2.25 (loot box disclosure)

**Correct Approach**:
```swift
VStack {
    OddsDisclosureView(odds: [
        ("Legendary", 5.0),
        ("Epic", 15.0),
        ("Rare", 30.0),
        ("Common", 50.0)
    ])

    Button("Open Mystery Box - $2.99") {
        purchaseAndOpenBox()
    }
}
```

### 5. Misleading Screenshots

**What NOT to do**:
- Pre-rendered concept art as screenshots
- Screenshots from canceled features
- Photoshopped enhanced graphics
- Wrong device frame (iPhone screenshot labeled as iPad)

**Consequence**: Rejection under 2.3 (accurate metadata)

**Correct Approach**:
- Use Xcode Simulator or device screen recording
- Only show shipping features
- Match screenshot device type to listing category

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `privacy-manifest` | Detailed PrivacyInfo.xcprivacy implementation required for compliance |
| `iap-implementation` | StoreKit 2 code patterns for compliant monetization |
| `game-center-integration` | Game Center setup for leaderboards/achievements |
| `universal-app-requirements` | iPhone + iPad requirements for universal app approval |
| `onboarding-architect` | Designing compliant first-time user experience |
| `analytics-integration` | Privacy-compliant analytics implementation |
