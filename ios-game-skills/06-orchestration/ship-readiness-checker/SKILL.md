---
name: ship-readiness-checker
description: Final pre-submission validation and launch readiness assessment for iOS games. Use when preparing for App Store submission, after completing quality validation, or when determining if a game is ready to ship. This skill validates App Store metadata, build configuration, TestFlight process completion, phased release strategy, launch monitoring setup, and provides definitive ship/no-ship criteria with hard gates. Triggers on submission preparation, final review before upload, or explicit ship readiness assessment.
---

# Ship Readiness Checker

## Purpose

The Ship Readiness Checker skill provides the definitive final validation gate before App Store submission. An agent with this skill can assess whether a game meets all requirements for successful App Store approval and commercial launch. This skill enforces hard gates that must pass before submission and provides comprehensive checklists covering metadata, build configuration, testing requirements, release strategy, and launch operations.

## Domain Boundaries

**This skill handles:**
- App Store Connect metadata validation
- Build configuration verification
- TestFlight testing requirements
- Phased release strategy planning
- Launch day monitoring setup
- Post-launch iteration planning
- Ship/no-ship decision criteria
- Submission timing recommendations

**This skill does NOT handle:**
- Quality validation across game dimensions (see `quality-validator`)
- Implementation fixes for failed checks (delegates to specialized skills)
- App Store Review Guidelines interpretation (see `app-store-review`)
- Privacy manifest implementation (see `privacy-manifest`)
- IAP product configuration (see `iap-implementation`)

---

## Core Specifications

### App Store Requirements (2025)

| Requirement | Specification | Enforcement |
|-------------|---------------|-------------|
| Xcode Version | 16.0+ | Hard gate (April 2025) |
| iOS SDK | 18.0 | Hard gate (April 2025) |
| Privacy Manifest | PrivacyInfo.xcprivacy required | Hard gate |
| Launch Time | <400ms to first frame | Soft gate (affects user experience) |
| Binary Size | No limit, but affects conversion | Optimization target |

### TestFlight Requirements

| Phase | Minimum Duration | Minimum Testers | Crash-Free Target |
|-------|------------------|-----------------|-------------------|
| Internal | 3 days | 5 testers | 99% |
| External Beta | 7 days | 25 testers | 99.5% |
| Pre-Launch | 3 days (soak) | 10+ active sessions | 99.9% |

### Review Timeline Expectations

| Submission Type | Typical Review | Maximum Wait |
|-----------------|----------------|--------------|
| New App | 24-48 hours | 7 days |
| Update | 24 hours | 5 days |
| Expedited Review | 24 hours | 48 hours |
| Rejection Resubmit | 24-48 hours | 7 days |

---

## Validation Checklists

### 1. App Store Metadata Checklist

#### App Information

```
- [ ] App name finalized (max 30 characters)
- [ ] Subtitle set (max 30 characters)
- [ ] Primary category: Games
- [ ] Secondary category selected (if applicable)
- [ ] Bundle ID matches production build
- [ ] SKU set and documented
```

#### Screenshots

```
Requirement: Screenshots must show ACTUAL GAMEPLAY, not just splash screens

- [ ] iPhone 6.7" screenshots (1290x2796 or 2796x1290) - Required
- [ ] iPhone 6.5" screenshots (1242x2688 or 2688x1242) - Required
- [ ] iPhone 5.5" screenshots (1242x2208 or 2208x1242) - Required
- [ ] iPad Pro 12.9" screenshots (2048x2732 or 2732x2048) - Required for Universal
- [ ] iPad Pro 12.9" (6th gen) screenshots (2048x2732) - Required for Universal

Screenshot Content Validation:
- [ ] First screenshot shows core gameplay (not menu/splash)
- [ ] Screenshots accurately represent game content
- [ ] No misleading or enhanced graphics
- [ ] No placeholder or "coming soon" content shown
- [ ] UI elements visible match current build
- [ ] If portrait game, all screenshots portrait
- [ ] If landscape game, all screenshots landscape
- [ ] Text in screenshots localized for each market
```

#### App Preview Videos (Optional but Recommended)

```
- [ ] 15-30 seconds duration (30s max)
- [ ] Shows actual gameplay (screen recording)
- [ ] No misleading content
- [ ] Audio is game audio (not music overlay that misrepresents)
- [ ] Matches screenshot orientation
- [ ] Resolution matches screenshot requirements
```

#### Description

```
- [ ] Description accurately describes gameplay (max 4000 characters)
- [ ] First sentence is compelling (appears in search)
- [ ] Key features listed clearly
- [ ] No mention of pricing/discounts in description
- [ ] No references to other platforms
- [ ] No direct competitor mentions
- [ ] Contact information included
- [ ] Grammar and spelling checked
- [ ] Localized for target markets
```

#### Keywords

```
- [ ] Keywords set (max 100 characters, comma-separated)
- [ ] No competitor names in keywords
- [ ] No trademarked terms not owned
- [ ] Keywords relevant to game content
- [ ] Consider long-tail keywords for discovery
```

#### Age Rating

```
Age Rating Questionnaire Accuracy:
- [ ] Violence level accurately declared
- [ ] Horror/fear themes accurately declared
- [ ] Gambling/simulated gambling declared if present
- [ ] User-generated content declared if present
- [ ] In-app purchases (Unlimited) declared
- [ ] Medical information declared if present
- [ ] Profanity/crude humor declared if present

Age Rating Verification:
- [ ] Resulting age rating appropriate for content
- [ ] Age rating consistent across regions
- [ ] Mini-game content doesn't exceed app rating
```

#### Privacy

```
- [ ] Privacy Policy URL provided
- [ ] Privacy Policy URL is live and accessible
- [ ] Privacy Policy covers all data collection
- [ ] Data collection disclosed in App Privacy section
- [ ] Third-party data sharing disclosed
- [ ] Tracking disclosure accurate
- [ ] Privacy Nutrition Labels complete
```

#### Demo Account (If Required)

```
If app requires sign-in or account features:
- [ ] Demo account credentials provided
- [ ] Demo account has full access to features
- [ ] Demo account is functional (tested before submission)
- [ ] Demo account clearly labeled in App Review Information
- [ ] Demo account does not require purchase to access content
- [ ] Demo account works without additional verification
```

#### Contact Information

```
- [ ] Support URL provided and live
- [ ] Marketing URL provided (optional but recommended)
- [ ] Contact email valid and monitored
- [ ] App Review contact info current
```

### 2. Build Configuration Checklist

#### Release Build Verification

```
- [ ] Archive build (not debug)
- [ ] Release configuration selected
- [ ] Optimization level set to -O (Release)
- [ ] Debug symbols stripped for release
- [ ] Testability disabled for release
- [ ] Code signing identity is Distribution
- [ ] Provisioning profile is App Store
```

#### Debug Code Removal

```
- [ ] No DEBUG-only code in release build
- [ ] No test credentials in release build
- [ ] No localhost/development URLs
- [ ] No console logging in release (or disabled)
- [ ] No test IAP products referenced
- [ ] No simulator-only code paths
- [ ] No placeholder content or "TODO" markers
- [ ] No developer-only features accessible
```

```swift
// Validation pattern for debug code
#if DEBUG
// This code should NOT appear in release builds
// Verify with: Build Settings > Active Compilation Conditions
#endif

// Check for release configuration
#if !DEBUG
// Release-only assertions
assert(Environment.current == .production, "Must use production environment")
#endif
```

#### Xcode and SDK Compliance

```
- [ ] Built with Xcode 16.0 or later
- [ ] Uses iOS 18 SDK
- [ ] Minimum deployment target appropriate (iOS 15+ recommended)
- [ ] Swift version current (Swift 5.9+)
- [ ] No deprecated API warnings
- [ ] No analyzer warnings
```

#### Privacy Manifest

```
PrivacyInfo.xcprivacy Completeness:
- [ ] File exists in app bundle
- [ ] NSPrivacyTracking declared (true/false)
- [ ] NSPrivacyTrackingDomains listed if tracking
- [ ] NSPrivacyCollectedDataTypes complete
- [ ] NSPrivacyAccessedAPITypes declared

Required API Categories for Games:
- [ ] NSPrivacyAccessedAPICategoryUserDefaults (if using UserDefaults)
- [ ] NSPrivacyAccessedAPICategoryFileTimestamp (if using file timestamps)
- [ ] NSPrivacyAccessedAPICategorySystemBootTime (if using boot time)
- [ ] NSPrivacyAccessedAPICategoryDiskSpace (if checking disk space)
```

```xml
<!-- Example PrivacyInfo.xcprivacy structure -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <!-- Declare each data type collected -->
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
    </array>
</dict>
</plist>
```

#### App Capabilities

```
- [ ] Only required capabilities enabled
- [ ] Game Center enabled (if using)
- [ ] Push Notifications enabled (if using)
- [ ] In-App Purchase enabled
- [ ] Sign in with Apple enabled (if using third-party login)
- [ ] Background Modes only if necessary
- [ ] All capabilities have proper entitlements
```

#### Binary Validation

```
- [ ] App uploads successfully to App Store Connect
- [ ] No binary validation errors
- [ ] No signing issues
- [ ] No missing required icons
- [ ] No missing required launch images/storyboard
- [ ] Binary size acceptable (<200MB for cellular download)
- [ ] Bitcode enabled (if required) or disabled (current default)
```

### 3. TestFlight Process Checklist

#### Internal Testing

```
Minimum Requirements:
- Duration: 3 days minimum
- Testers: 5 internal testers minimum
- Coverage: All supported devices

Checklist:
- [ ] Internal build uploaded and processing complete
- [ ] Test group created with internal testers
- [ ] All testers have installed and launched
- [ ] Core loop played by all testers
- [ ] IAP flow tested (sandbox)
- [ ] All game modes tested
- [ ] Edge cases tested (poor network, interruptions)
- [ ] Crash rate <1% in MetricKit
- [ ] No critical bugs reported
```

#### External Beta Testing

```
Minimum Requirements:
- Duration: 7 days minimum
- Testers: 25 external testers minimum
- Coverage: Diverse device types

Checklist:
- [ ] Beta App Review approved
- [ ] External test group created
- [ ] Public link created (if using)
- [ ] Testers recruited and active
- [ ] Feedback collection mechanism in place
- [ ] Crash rate monitored daily
- [ ] Critical feedback addressed
- [ ] No build-blocking bugs
```

#### Pre-Launch Soak

```
Final validation period (3 days):
- [ ] Final release candidate uploaded
- [ ] Internal team actively playing
- [ ] No crashes in 10+ session hours
- [ ] Analytics data validating correctly
- [ ] Push notifications working (if applicable)
- [ ] Server-side configuration verified (if applicable)
- [ ] App Review submission preparation complete
```

#### Crash-Free Rate Targets

```
Validation Script:
- [ ] Internal: 99.0% crash-free sessions (< 1 crash per 100 sessions)
- [ ] External: 99.5% crash-free sessions (< 1 crash per 200 sessions)
- [ ] Pre-Launch: 99.9% crash-free sessions (< 1 crash per 1000 sessions)

Monitoring:
- [ ] Xcode Organizer crashes reviewed
- [ ] MetricKit data analyzed
- [ ] Crash symbolication working
- [ ] Top crash signatures identified and fixed
```

### 4. Phased Release Strategy

#### Release Options

| Strategy | Description | Use When |
|----------|-------------|----------|
| Immediate (100%) | All users get update immediately | Small updates, confident quality |
| 7-Day Phased | 1%, 2%, 5%, 10%, 20%, 50%, 100% | New apps, major updates |
| Manual Phased | Control percentage manually | Risk mitigation, A/B testing |
| Pause Phased | Stop rollout if issues | Emergency brake |

#### Recommended Phased Release Schedule

```
Day 1: 1% of users
- Monitor crash rates, critical metrics
- Success criteria: <1% crash rate, no critical bugs

Day 2: 2% of users
- Continue monitoring
- Review initial feedback

Day 3: 5% of users
- Check retention metrics beginning to form
- Address any emerging issues

Day 4: 10% of users
- Significant user base for data
- Validate economy/progression at scale

Day 5: 20% of users
- Half-way point decision
- Go/no-go for full release

Day 6: 50% of users
- Near-full release
- Final validation

Day 7: 100% of users
- Full release
- Transition to maintenance monitoring
```

#### Phased Release Checklist

```
- [ ] Phased release selected in App Store Connect
- [ ] Monitoring dashboard configured
- [ ] Crash threshold defined (auto-pause trigger)
- [ ] Communication plan for issues
- [ ] Rollback build prepared (previous version ready)
- [ ] On-call schedule for launch week
- [ ] Escalation path documented
```

### 5. Launch Day Monitoring Setup

#### Analytics Dashboard

```
Required Metrics (Real-Time):
- [ ] Session count
- [ ] New users
- [ ] Crash rate
- [ ] ANR (App Not Responding) rate
- [ ] Launch success rate

Required Metrics (Hourly):
- [ ] D0 retention (same-day return)
- [ ] FTUE completion rate
- [ ] First session length
- [ ] Revenue (if F2P)

Required Metrics (Daily):
- [ ] D1 retention
- [ ] ARPDAU (Average Revenue Per Daily Active User)
- [ ] Conversion rate (if F2P)
```

#### Alerting Configuration

```
Critical Alerts (Immediate):
- [ ] Crash rate > 2% triggers alert
- [ ] Server errors > 5% triggers alert
- [ ] IAP failures > 10% triggers alert
- [ ] Zero sessions for 15+ minutes triggers alert

Warning Alerts (Hourly):
- [ ] FTUE completion < 70%
- [ ] Session length < 2 minutes
- [ ] High uninstall rate

Monitoring Checklist:
- [ ] Alert destinations configured (Slack, email, PagerDuty)
- [ ] On-call rotation set
- [ ] Alert thresholds tested
- [ ] Runbooks created for common issues
```

#### App Store Monitoring

```
- [ ] App Store Connect notifications enabled
- [ ] Review status monitoring active
- [ ] Rating/review monitoring configured
- [ ] Keyword ranking tracking set up
- [ ] Competitor monitoring (optional)
```

#### Server-Side (If Applicable)

```
- [ ] Server capacity scaled for launch
- [ ] Database indexes optimized
- [ ] CDN configured for asset delivery
- [ ] Rate limiting in place
- [ ] DDoS protection active
- [ ] Monitoring dashboards ready
- [ ] Incident response plan documented
```

### 6. Post-Launch Iteration Plan

#### Week 1 Focus

```
Days 1-3:
- [ ] Monitor crash rate hourly
- [ ] Address critical bugs immediately
- [ ] Hot-fix process ready
- [ ] Review user feedback

Days 4-7:
- [ ] Analyze D1-D7 retention
- [ ] Identify FTUE drop-off points
- [ ] Plan first optimization update
- [ ] Respond to App Store reviews
```

#### First Update Planning

```
Target: 7-14 days post-launch

Content:
- [ ] Critical bug fixes
- [ ] FTUE optimizations based on data
- [ ] Performance improvements
- [ ] Balance adjustments

Preparation:
- [ ] Analytics data analyzed
- [ ] Player feedback categorized
- [ ] Priority bugs identified
- [ ] Update scope defined
```

#### Ongoing Cadence

```
Recommended Update Schedule:
- Bug fixes: As needed (hot-fix process)
- Balance updates: Every 2 weeks
- Content updates: Monthly
- Major features: Quarterly

Checklist:
- [ ] Update calendar created
- [ ] Content pipeline planned
- [ ] Live ops capability ready (if applicable)
- [ ] A/B testing framework active
```

---

## Ship/No-Ship Criteria

### Hard Gates (Must Pass)

These criteria are non-negotiable. Failure of ANY hard gate means DO NOT SHIP.

```
HARD GATE 1: Build Requirements
- [ ] Built with Xcode 16+ ....................................... REQUIRED
- [ ] Uses iOS 18 SDK ........................................... REQUIRED
- [ ] PrivacyInfo.xcprivacy included ............................ REQUIRED
- [ ] Release build (not debug) ................................. REQUIRED
- [ ] No debug code in release .................................. REQUIRED

HARD GATE 2: App Store Compliance
- [ ] Screenshots show actual gameplay .......................... REQUIRED
- [ ] Privacy policy linked and live ............................ REQUIRED
- [ ] Age rating accurate ....................................... REQUIRED
- [ ] IAP products configured (if F2P) .......................... REQUIRED
- [ ] Loot box odds disclosed (if applicable) ................... REQUIRED

HARD GATE 3: Quality Validation
- [ ] quality-validator overall score >= 80 ..................... REQUIRED
- [ ] No critical failures in quality validation ................ REQUIRED
- [ ] Frame rate 60fps minimum .................................. REQUIRED
- [ ] Launch time <500ms ........................................ REQUIRED

HARD GATE 4: Testing
- [ ] Internal testing completed (3+ days) ...................... REQUIRED
- [ ] Crash-free rate >= 99% .................................... REQUIRED
- [ ] No known crash bugs ....................................... REQUIRED
- [ ] Core loop playable end-to-end ............................. REQUIRED

HARD GATE 5: Metadata
- [ ] All required screenshots uploaded ......................... REQUIRED
- [ ] Description accurate and complete ......................... REQUIRED
- [ ] Demo account provided (if sign-in required) ............... REQUIRED
```

### Soft Gates (Should Pass)

These criteria strongly impact success. Failure should trigger serious review.

```
SOFT GATE 1: Quality Excellence
- [ ] quality-validator score >= 90 .............. Recommended for top 10%
- [ ] External beta testing completed ............ Recommended for confidence
- [ ] Crash-free rate >= 99.5% ................... Recommended for reviews

SOFT GATE 2: Retention Readiness
- [ ] FTUE completable in <5 minutes ............. Recommended
- [ ] At least 3 retention hooks ................. Recommended for D7+
- [ ] Daily engagement loop present .............. Recommended for retention

SOFT GATE 3: Launch Preparation
- [ ] Phased release configured .................. Recommended for new apps
- [ ] Monitoring dashboard ready ................. Recommended
- [ ] On-call schedule set ....................... Recommended
```

### Decision Matrix

```
ALL Hard Gates Pass + ALL Soft Gates Pass
└── SHIP: Ready for submission

ALL Hard Gates Pass + SOME Soft Gates Fail
└── CONDITIONAL SHIP: Review failed soft gates, ship if acceptable risk

ANY Hard Gate Fails
└── NO SHIP: Address failures before submission

Decision Documentation:
- [ ] All gate statuses recorded
- [ ] Any soft gate failures documented with rationale
- [ ] Ship decision approved by stakeholder
- [ ] Submission date scheduled
```

---

## Implementation Patterns

### Ship Readiness Report Generator

```swift
import Foundation

struct ShipReadinessReport {
    let timestamp: Date
    let hardGatesPassed: Bool
    let softGatesPassed: Bool
    let recommendation: ShipRecommendation
    let hardGates: [Gate]
    let softGates: [Gate]
    let blockers: [String]
    let warnings: [String]

    enum ShipRecommendation: String {
        case ship = "SHIP"
        case conditionalShip = "CONDITIONAL_SHIP"
        case noShip = "NO_SHIP"
    }
}

struct Gate {
    let name: String
    let category: String
    let passed: Bool
    let details: String
}

final class ShipReadinessChecker {

    func generateReport() -> ShipReadinessReport {
        let hardGates = evaluateHardGates()
        let softGates = evaluateSoftGates()

        let hardGatesPassed = hardGates.allSatisfy { $0.passed }
        let softGatesPassed = softGates.allSatisfy { $0.passed }

        let recommendation: ShipReadinessReport.ShipRecommendation
        if !hardGatesPassed {
            recommendation = .noShip
        } else if softGatesPassed {
            recommendation = .ship
        } else {
            recommendation = .conditionalShip
        }

        let blockers = hardGates.filter { !$0.passed }.map { $0.details }
        let warnings = softGates.filter { !$0.passed }.map { $0.details }

        return ShipReadinessReport(
            timestamp: Date(),
            hardGatesPassed: hardGatesPassed,
            softGatesPassed: softGatesPassed,
            recommendation: recommendation,
            hardGates: hardGates,
            softGates: softGates,
            blockers: blockers,
            warnings: warnings
        )
    }

    private func evaluateHardGates() -> [Gate] {
        return [
            evaluateBuildRequirements(),
            evaluateAppStoreCompliance(),
            evaluateQualityValidation(),
            evaluateTestingRequirements(),
            evaluateMetadataRequirements()
        ]
    }

    private func evaluateSoftGates() -> [Gate] {
        return [
            evaluateQualityExcellence(),
            evaluateRetentionReadiness(),
            evaluateLaunchPreparation()
        ]
    }

    // Individual gate evaluations
    private func evaluateBuildRequirements() -> Gate {
        // Check Xcode version, SDK, privacy manifest, build config
        let passed = true // Implementation would check actual build
        return Gate(
            name: "Build Requirements",
            category: "Hard Gate",
            passed: passed,
            details: passed ? "All build requirements met" : "Build requirements not met"
        )
    }

    private func evaluateAppStoreCompliance() -> Gate {
        // Check screenshots, privacy, age rating, IAP
        let passed = true
        return Gate(
            name: "App Store Compliance",
            category: "Hard Gate",
            passed: passed,
            details: passed ? "App Store compliance verified" : "App Store compliance issues"
        )
    }

    private func evaluateQualityValidation() -> Gate {
        // Check quality-validator score
        let passed = true
        return Gate(
            name: "Quality Validation",
            category: "Hard Gate",
            passed: passed,
            details: passed ? "Quality score >= 80" : "Quality score below threshold"
        )
    }

    private func evaluateTestingRequirements() -> Gate {
        // Check TestFlight data
        let passed = true
        return Gate(
            name: "Testing Requirements",
            category: "Hard Gate",
            passed: passed,
            details: passed ? "Testing requirements met" : "Insufficient testing"
        )
    }

    private func evaluateMetadataRequirements() -> Gate {
        // Check App Store Connect metadata
        let passed = true
        return Gate(
            name: "Metadata Requirements",
            category: "Hard Gate",
            passed: passed,
            details: passed ? "All metadata complete" : "Missing required metadata"
        )
    }

    private func evaluateQualityExcellence() -> Gate {
        let passed = true
        return Gate(
            name: "Quality Excellence",
            category: "Soft Gate",
            passed: passed,
            details: passed ? "Exceeds quality bar" : "Quality could be improved"
        )
    }

    private func evaluateRetentionReadiness() -> Gate {
        let passed = true
        return Gate(
            name: "Retention Readiness",
            category: "Soft Gate",
            passed: passed,
            details: passed ? "Retention systems in place" : "Retention systems incomplete"
        )
    }

    private func evaluateLaunchPreparation() -> Gate {
        let passed = true
        return Gate(
            name: "Launch Preparation",
            category: "Soft Gate",
            passed: passed,
            details: passed ? "Launch operations ready" : "Launch preparation incomplete"
        )
    }
}
```

### Report Output Format

```
╔══════════════════════════════════════════════════════════════════╗
║                    SHIP READINESS REPORT                         ║
╠══════════════════════════════════════════════════════════════════╣
║ Generated: 2026-01-07 14:30:00                                   ║
║ Recommendation: SHIP                                              ║
╠══════════════════════════════════════════════════════════════════╣
║ HARD GATES                                                        ║
╠══════════════════════════════════════════════════════════════════╣
║ [PASS] Build Requirements                                         ║
║        Xcode 16.2, iOS 18 SDK, Privacy Manifest included         ║
║ [PASS] App Store Compliance                                       ║
║        Screenshots verified, privacy policy live                  ║
║ [PASS] Quality Validation                                         ║
║        Score: 92/100 (Grade: A)                                   ║
║ [PASS] Testing Requirements                                       ║
║        Internal: 5 days, External: 10 days, 99.7% crash-free     ║
║ [PASS] Metadata Requirements                                      ║
║        All required fields complete                               ║
╠══════════════════════════════════════════════════════════════════╣
║ SOFT GATES                                                        ║
╠══════════════════════════════════════════════════════════════════╣
║ [PASS] Quality Excellence                                         ║
║        Score exceeds 90 threshold                                 ║
║ [PASS] Retention Readiness                                        ║
║        4 retention hooks implemented                              ║
║ [WARN] Launch Preparation                                         ║
║        Monitoring dashboard incomplete                            ║
╠══════════════════════════════════════════════════════════════════╣
║ BLOCKERS: 0                                                       ║
║ WARNINGS: 1                                                       ║
║ - Monitoring dashboard not fully configured                       ║
╠══════════════════════════════════════════════════════════════════╣
║ DECISION: Ready for App Store submission                          ║
║           Address monitoring setup before launch day              ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Decision Trees

### When to Run Ship Readiness Check

```
Is development complete?
├── NO → Continue development, run quality-validator at phase gates
└── YES
    └── Has quality-validator passed (score >= 80)?
        ├── NO → Address quality issues first
        └── YES
            └── Is TestFlight testing complete?
                ├── NO → Complete TestFlight process
                └── YES → RUN SHIP READINESS CHECK
```

### Handling Blockers

```
Blocker identified?
├── Build Requirements
│   ├── Wrong Xcode → Rebuild with Xcode 16+
│   ├── Wrong SDK → Update to iOS 18 SDK
│   ├── Missing Privacy Manifest → Add PrivacyInfo.xcprivacy
│   └── Debug code present → Remove and rebuild
│
├── App Store Compliance
│   ├── Screenshot issues → Capture new gameplay screenshots
│   ├── Privacy policy missing → Create and host privacy policy
│   ├── Age rating wrong → Redo questionnaire accurately
│   └── IAP not configured → Configure in App Store Connect
│
├── Quality Validation
│   ├── Score < 80 → Run quality-validator, fix issues
│   ├── Critical failure → Address specific domain
│   └── Performance failure → Run performance-optimizer
│
├── Testing Requirements
│   ├── Insufficient duration → Extend TestFlight
│   ├── Crash rate high → Fix crashes, re-test
│   └── Not enough testers → Recruit more testers
│
└── Metadata Requirements
    ├── Missing screenshots → Upload all required sizes
    ├── Description incomplete → Complete description
    └── Demo account missing → Create and document
```

### Submission Timing

```
All gates passed?
├── NO → Do not submit, address issues
└── YES
    └── Is timing optimal?
        ├── Monday-Wednesday → SUBMIT (review during business week)
        ├── Thursday → SUBMIT if not urgent (may push to Monday)
        ├── Friday → WAIT until Monday (weekend reviews slower)
        └── Weekend → WAIT until Monday
```

---

## Anti-Patterns

**Don't**: Submit without completing TestFlight testing
**Why**: Undiscovered crashes lead to 1-star reviews and poor retention
**Instead**: Complete full TestFlight cycle (internal + external) before submission

**Don't**: Use placeholder screenshots "to be updated later"
**Why**: Screenshots are often forgotten; misleading images cause rejection
**Instead**: Capture final gameplay screenshots before submission

**Don't**: Skip phased release for new apps
**Why**: Full release amplifies any undiscovered issues
**Instead**: Use 7-day phased release for new apps, immediate only for confident updates

**Don't**: Submit on Friday afternoon
**Why**: Weekend review times are longer; issues discovered Friday delay until Monday
**Instead**: Submit Monday-Wednesday for fastest review and response

**Don't**: Ignore soft gate failures
**Why**: Soft gates predict commercial success, not just App Store approval
**Instead**: Document rationale for shipping with soft gate failures

**Don't**: Submit without monitoring setup
**Why**: Unable to detect and respond to launch issues
**Instead**: Configure monitoring before submission, test alerts

**Don't**: Assume App Review will find all issues
**Why**: Review checks compliance, not quality; your responsibility
**Instead**: Run comprehensive validation before submission

---

## Quality Checklist (Meta)

Before completing ship readiness check, verify:

- [ ] All hard gates evaluated with evidence
- [ ] All soft gates evaluated with status
- [ ] Blockers clearly identified
- [ ] Warnings documented with risk assessment
- [ ] Ship recommendation clearly stated
- [ ] Report generated and saved
- [ ] Submission date scheduled (if shipping)
- [ ] Post-launch plan documented

---

## Adjacent Skills

**Pre-requisites before this skill:**
- `quality-validator` - Must pass with score >= 80 before ship readiness
- `app-store-review` - Compliance validation
- `iap-implementation` - IAP configuration (if F2P)
- `privacy-manifest` - Privacy compliance
- `analytics-integration` - Monitoring setup

**For addressing failures:**
- `performance-optimizer` - Performance issues
- `game-architect` - Major structural issues
- Any `04-polish/*` skill - Polish issues

**Post-submission:**
- No adjacent skill - monitoring and iteration are operational, not skill-based

**Orchestration:**
- `game-architect` - Overall development workflow coordination
