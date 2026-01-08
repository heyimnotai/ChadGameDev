---
name: quality-validator
description: Comprehensive quality validation for iOS games across all dimensions. Use when completing a development phase, before App Store submission, or whenever you need to verify game quality meets top 10% App Store standards. This skill validates polish (animation, audio, haptics), performance (60fps, launch time, memory, thermals), retention mechanics, monetization ethics, accessibility, and platform compliance. Triggers on phase completion gates, pre-submission reviews, or explicit quality audits.
---

# Quality Validator

## Purpose

The Quality Validator skill provides systematic validation of iOS game quality across every dimension that impacts player experience and App Store success. An agent with this skill can audit a game against concrete, measurable criteria that distinguish top 10% App Store games from the rest. This skill enforces the quality bar required for commercial success and long-term player satisfaction.

## Domain Boundaries

**This skill handles:**
- Polish validation (animation, audio, haptics, visual feedback)
- Performance benchmarking (frame rate, launch time, memory, thermals)
- Retention mechanics audit (daily loops, hooks, FTUE)
- Monetization ethics review (fair progression, disclosure, no predatory patterns)
- Accessibility compliance (VoiceOver, touch targets, motion sensitivity)
- Platform compliance validation (HIG, technical requirements)
- Quality scoring and reporting

**This skill does NOT handle:**
- Implementing fixes for failed validations (delegates to specialized skills)
- App Store submission mechanics (see `ship-readiness-checker`)
- Deep technical profiling (see `performance-optimizer`)
- Specific polish implementation (see `04-polish/*` skills)
- Core gameplay design (see `02-core-design/*` skills)

---

## Core Specifications

### Performance Benchmarks

| Metric | Minimum | Target | Top 10% |
|--------|---------|--------|---------|
| Frame Rate | 60 fps | 60 fps stable | 120 fps on ProMotion |
| Launch Time | <500ms | <400ms | <300ms |
| Memory Peak | <1.25GB | <1GB | <750MB |
| Memory Stable | <1GB | <800MB | <600MB |
| CPU Usage (idle) | <30% | <20% | <10% |
| Battery Drain (1hr) | <25% | <15% | <10% |

### Animation Timing Standards

| Animation Type | Duration | Tolerance |
|----------------|----------|-----------|
| Button feedback | 100-150ms | +/- 20ms |
| Item collection | 50-200ms | +/- 30ms |
| Screen transition | 200-400ms | +/- 50ms |
| Score increment | 500-1000ms | +/- 100ms |
| Reward reveal | 1-2s | +/- 200ms |

### Audio Latency Standards

| Metric | Maximum | Target |
|--------|---------|--------|
| SFX latency | 50ms | <20ms |
| Haptic-audio sync | 15ms | <5ms |
| Music fade | 500ms | 300ms |

### Touch Target Standards

| Element Type | Minimum Size | Recommended Size |
|--------------|--------------|------------------|
| Standard button | 44x44 pt | 48x48 pt |
| Frequent action | 44x44 pt | 56x56 pt |
| Primary CTA | 48x48 pt | 60x60 pt |
| Spacing between targets | 8 pt | 12 pt |

---

## Validation Checklists

### 1. Polish Checklist

#### Animation Quality

```
- [ ] Every button has press feedback (scale to 0.95x in 100-150ms)
- [ ] Every button has release feedback (return to 1.0x with ease-out)
- [ ] Item collection has fly-to-counter animation (200ms, ease-in-out)
- [ ] Score changes animate incrementally (500-1000ms)
- [ ] Screen transitions use appropriate easing (ease-in-out for navigation)
- [ ] Transitions match platform conventions (slide for push, fade for modal)
- [ ] Character/object movement has squash and stretch
- [ ] Landing impacts show squash (1.3x width, 0.7x height, 50ms)
- [ ] Jump anticipation shows stretch (0.8x width, 1.2x height)
- [ ] Reward moments have celebratory animation (particles + scale + glow)
- [ ] No animation exceeds 400ms for game-critical actions
- [ ] No jarring cuts between states (always transition)
- [ ] Loading states have animation (spinner or progress)
- [ ] Empty states have subtle motion (not static)
```

#### Audio Quality

```
- [ ] Every button tap has sound feedback
- [ ] No silent interactive elements (all touchables produce sound)
- [ ] Audio latency measured at <50ms (target <20ms)
- [ ] Sound effects use CAF/IMA4 format (not AAC for SFX)
- [ ] Background music loops seamlessly (no gap or click)
- [ ] Music uses AAC format (hardware decoded)
- [ ] Volume controls provided (SFX and Music separate)
- [ ] Audio respects device silent mode appropriately
- [ ] Sound frequency range accounts for phone speakers (800Hz-10kHz safe)
- [ ] Simultaneous sounds limited to prevent cacophony (<32 concurrent)
- [ ] Reward sounds are distinct and satisfying
- [ ] Error/failure sounds are appropriate (not harsh)
- [ ] UI sounds do not fatigue on repetition
- [ ] Audio ducks appropriately during important events
```

#### Haptic Quality

```
- [ ] Light impact (.light) used for subtle interactions (selection, hover)
- [ ] Medium impact (.medium) used for standard actions (button press)
- [ ] Heavy impact (.heavy) used for significant events (collision, hit)
- [ ] Notification haptics used for outcomes (.success/.warning/.error)
- [ ] Selection feedback used for scrolling through items
- [ ] prepare() called before expected haptics (reduce latency)
- [ ] Haptics synchronized with audio (<15ms offset)
- [ ] Haptics synchronized with visual feedback (<20ms offset)
- [ ] No haptic spam (minimum 50ms between haptics)
- [ ] Haptics fail gracefully on unsupported devices
- [ ] Intense haptics reserved for high-impact moments
- [ ] Haptic intensity scales with action magnitude
```

#### Visual Polish

```
- [ ] Particle effects for significant events (collection, explosion, level up)
- [ ] Particle count within budget (<500 total active)
- [ ] Screen shake for impacts (trauma-based, 2-20 pixels based on intensity)
- [ ] Screen shake can be disabled (accessibility)
- [ ] Hit stop/freeze frames for combat impacts (33-200ms based on weight)
- [ ] Color palette is cohesive (max 5-6 core colors)
- [ ] UI has consistent visual language
- [ ] Icons are clear at small sizes (test at 1x scale)
- [ ] Text is readable on all backgrounds (contrast ratio >= 4.5:1)
- [ ] No placeholder art or temporary assets remain
```

### 2. Performance Checklist

#### Frame Rate Validation

```swift
// Validation implementation
import QuartzCore

final class FrameRateValidator {
    private var frameTimestamps: [CFTimeInterval] = []
    private let sampleWindow: Int = 300 // 5 seconds at 60fps

    func recordFrame(_ timestamp: CFTimeInterval) {
        frameTimestamps.append(timestamp)
        if frameTimestamps.count > sampleWindow {
            frameTimestamps.removeFirst()
        }
    }

    var averageFPS: Double {
        guard frameTimestamps.count >= 2 else { return 0 }
        let duration = frameTimestamps.last! - frameTimestamps.first!
        return Double(frameTimestamps.count - 1) / duration
    }

    var minimumFPS: Double {
        guard frameTimestamps.count >= 2 else { return 0 }
        var maxFrameTime: CFTimeInterval = 0
        for i in 1..<frameTimestamps.count {
            let frameTime = frameTimestamps[i] - frameTimestamps[i-1]
            maxFrameTime = max(maxFrameTime, frameTime)
        }
        return maxFrameTime > 0 ? 1.0 / maxFrameTime : 0
    }

    var droppedFramePercentage: Double {
        guard frameTimestamps.count >= 2 else { return 0 }
        var droppedFrames = 0
        let targetFrameTime: CFTimeInterval = 1.0 / 60.0
        for i in 1..<frameTimestamps.count {
            let frameTime = frameTimestamps[i] - frameTimestamps[i-1]
            if frameTime > targetFrameTime * 1.5 {
                droppedFrames += Int(frameTime / targetFrameTime) - 1
            }
        }
        return Double(droppedFrames) / Double(frameTimestamps.count) * 100
    }

    func validate() -> ValidationResult {
        let avgFPS = averageFPS
        let minFPS = minimumFPS
        let dropped = droppedFramePercentage

        var issues: [String] = []

        if avgFPS < 60 {
            issues.append("Average FPS \(String(format: "%.1f", avgFPS)) below 60fps minimum")
        }
        if minFPS < 30 {
            issues.append("Frame rate dropped to \(String(format: "%.1f", minFPS))fps")
        }
        if dropped > 5 {
            issues.append("Dropped frame rate \(String(format: "%.1f", dropped))% exceeds 5% threshold")
        }

        return ValidationResult(
            passed: issues.isEmpty,
            score: issues.isEmpty ? 100 : max(0, 100 - issues.count * 20),
            issues: issues
        )
    }
}
```

#### Launch Time Validation

```swift
import os.signpost

final class LaunchTimeValidator {
    static let shared = LaunchTimeValidator()

    private let log = OSLog(subsystem: Bundle.main.bundleIdentifier!, category: "Launch")
    private var processStartTime: CFAbsoluteTime = 0
    private var firstFrameTime: CFAbsoluteTime = 0

    func markProcessStart() {
        processStartTime = CFAbsoluteTimeGetCurrent()
        os_signpost(.begin, log: log, name: "AppLaunch")
    }

    func markFirstFrame() {
        firstFrameTime = CFAbsoluteTimeGetCurrent()
        os_signpost(.end, log: log, name: "AppLaunch")
    }

    var launchDuration: TimeInterval {
        return firstFrameTime - processStartTime
    }

    func validate() -> ValidationResult {
        let duration = launchDuration * 1000 // Convert to ms
        var issues: [String] = []
        var score = 100

        if duration > 500 {
            issues.append("Launch time \(Int(duration))ms exceeds 500ms maximum")
            score = 0
        } else if duration > 400 {
            issues.append("Launch time \(Int(duration))ms exceeds 400ms target")
            score = 50
        } else if duration > 300 {
            score = 80
        }

        return ValidationResult(
            passed: duration <= 500,
            score: score,
            issues: issues
        )
    }
}
```

#### Memory Validation

```swift
import Foundation

final class MemoryValidator {

    var currentMemoryUsageMB: Double {
        var info = mach_task_basic_info()
        var count = mach_msg_type_number_t(MemoryLayout<mach_task_basic_info>.size) / 4
        let result = withUnsafeMutablePointer(to: &info) {
            $0.withMemoryRebound(to: integer_t.self, capacity: 1) {
                task_info(mach_task_self_, task_flavor_t(MACH_TASK_BASIC_INFO), $0, &count)
            }
        }
        guard result == KERN_SUCCESS else { return 0 }
        return Double(info.resident_size) / 1024.0 / 1024.0
    }

    func validate() -> ValidationResult {
        let memoryMB = currentMemoryUsageMB
        var issues: [String] = []
        var score = 100

        if memoryMB > 1250 {
            issues.append("Memory usage \(Int(memoryMB))MB exceeds 1.25GB crash threshold")
            score = 0
        } else if memoryMB > 1000 {
            issues.append("Memory usage \(Int(memoryMB))MB exceeds 1GB target")
            score = 40
        } else if memoryMB > 750 {
            score = 70
        }

        return ValidationResult(
            passed: memoryMB <= 1000,
            score: score,
            issues: issues
        )
    }
}
```

#### Thermal State Handling

```swift
import Foundation

final class ThermalValidator {

    func validateThermalHandling() -> ValidationResult {
        var issues: [String] = []

        // Check if thermal state monitoring is implemented
        let thermalState = ProcessInfo.processInfo.thermalState

        // Validation requires checking implementation exists
        // This is a structural check - implementation must handle all states

        return ValidationResult(
            passed: true,
            score: 100,
            issues: issues,
            recommendations: [
                "Verify .nominal state: Full quality rendering",
                "Verify .fair state: Maintain quality, monitor",
                "Verify .serious state: Reduce frame rate to 30fps, disable particles",
                "Verify .critical state: Minimal rendering, pause non-essential work"
            ]
        )
    }
}

// Required implementation pattern
extension GameScene {
    func setupThermalMonitoring() {
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(thermalStateChanged),
            name: ProcessInfo.thermalStateDidChangeNotification,
            object: nil
        )
    }

    @objc func thermalStateChanged() {
        switch ProcessInfo.processInfo.thermalState {
        case .nominal:
            targetFrameRate = 60
            particlesEnabled = true
            qualityLevel = .high
        case .fair:
            targetFrameRate = 60
            particlesEnabled = true
            qualityLevel = .high
        case .serious:
            targetFrameRate = 30
            particlesEnabled = false
            qualityLevel = .medium
        case .critical:
            targetFrameRate = 30
            particlesEnabled = false
            qualityLevel = .low
        @unknown default:
            targetFrameRate = 30
            qualityLevel = .medium
        }
    }
}
```

### Performance Checklist

```
- [ ] Frame rate maintains 60fps minimum during gameplay
- [ ] Frame rate maintains 60fps during UI transitions
- [ ] No frame drops below 30fps at any point
- [ ] Dropped frame percentage <5% over 5-minute session
- [ ] Launch time to first frame <400ms
- [ ] Peak memory usage <1GB
- [ ] Stable memory usage <800MB (no leaks)
- [ ] Memory profiled with no leaks detected
- [ ] CPU usage <30% during idle states
- [ ] Thermal state changes handled gracefully
- [ ] ProMotion (120Hz) supported if targeting it (Info.plist key set)
- [ ] Game pauses appropriately on thermal .critical
```

### 3. Retention Mechanics Checklist

#### Daily Engagement Loop

```
- [ ] Daily reward system implemented
- [ ] Daily rewards escalate over 7-day cycle
- [ ] Daily reset time is consistent (same time each day)
- [ ] Player notified of daily reset (in-app or push)
- [ ] Missing a day does not catastrophically reset progress
- [ ] Daily quests/tasks available (3-5 quick tasks)
- [ ] Streak mechanics present with recovery option
- [ ] Streak recovery costs reasonable (not punitive)
```

#### Retention Hooks (Minimum 3 Required)

```
Verify at least 3 of these are implemented:

- [ ] Daily login rewards
- [ ] Streak mechanics
- [ ] Energy/lives system (regenerates over time)
- [ ] Time-limited events
- [ ] Battle pass / seasonal content
- [ ] Collection system with incremental progress
- [ ] Social competition (leaderboards refresh)
- [ ] Push notifications for re-engagement
- [ ] Offline progress to collect
- [ ] "Almost there" progress indicators
```

#### FTUE (First Time User Experience)

```
- [ ] Core loop reachable within 60 seconds
- [ ] First meaningful reward within 2 minutes
- [ ] Tutorial completable in <5 minutes
- [ ] Learn by doing (not text walls)
- [ ] Each step introduces only one mechanic
- [ ] Early levels guarantee success (beginner's luck)
- [ ] Skip option available for experienced players
- [ ] Progress saved at each FTUE step
- [ ] FTUE completion tracked in analytics
- [ ] Drop-off points identified and optimized
```

#### Retention Metrics Targets

| Metric | Minimum | Target | Validation |
|--------|---------|--------|------------|
| FTUE Completion | 70% | 85% | Analytics |
| D1 Retention | 30% | 45% | Analytics |
| D7 Retention | 10% | 20% | Analytics |
| D30 Retention | 3% | 10% | Analytics |
| Sessions/Day | 1.5 | 3+ | Analytics |
| Session Length | 2min | 5min | Analytics |

### 4. Monetization Ethics Checklist

#### Fair F2P Progression

```
- [ ] Game completable without spending money
- [ ] F2P progression speed is reasonable (not deliberately frustrating)
- [ ] Paying accelerates by 3-5x maximum (not 100x)
- [ ] No hard paywalls blocking content
- [ ] Skill matters more than spending for core gameplay
- [ ] Non-paying players can compete meaningfully
- [ ] Time-gated content has reasonable wait times (<4 hours typical)
- [ ] Energy/lives regenerate at playable rate (1 life per 15-30 min)
```

#### Loot Box / Gacha Compliance

```
- [ ] Odds disclosed BEFORE purchase (Apple requirement)
- [ ] Odds displayed clearly (not hidden in menus)
- [ ] Pity system implemented (guaranteed after N pulls)
- [ ] Soft pity starts at reasonable threshold (<50 pulls)
- [ ] Hard pity guarantees at reasonable threshold (<90 pulls)
- [ ] Pull currency earnable through gameplay
- [ ] No mechanism resembling gambling for minors
- [ ] Regional restrictions for banned regions (Belgium, Netherlands)
```

#### No Predatory Patterns

```
- [ ] No dark patterns in purchase flow
- [ ] Cancel/close button clearly visible on purchase screens
- [ ] No fake urgency ("Only 2 left!" when unlimited)
- [ ] No misleading comparisons (fake "original" prices)
- [ ] No notification spam for purchases
- [ ] No targeting lapsed players with aggressive offers
- [ ] No pay-to-skip difficulty spikes (difficulty should be fair)
- [ ] No loss aversion exploitation beyond reasonable streaks
- [ ] No predatory targeting of vulnerable populations
- [ ] Purchase confirmation required for large amounts
- [ ] Spending limits or warnings available
```

#### IAP Compliance

```
- [ ] All purchasable content uses Apple IAP
- [ ] No external payment links
- [ ] IAP items clearly described
- [ ] Restore purchases button present and functional
- [ ] Subscription terms clear if applicable
- [ ] Price localization appropriate
```

### 5. Accessibility Checklist

#### VoiceOver Support

```
- [ ] All interactive elements have accessibility labels
- [ ] Labels are descriptive (not just "button")
- [ ] Custom actions provided where appropriate
- [ ] Accessibility traits set correctly (.button, .image, etc.)
- [ ] Reading order is logical
- [ ] Game state changes announced
- [ ] VoiceOver tested end-to-end
```

```swift
// VoiceOver validation pattern
func validateAccessibilityLabels(in view: UIView) -> [String] {
    var issues: [String] = []

    for subview in view.subviews {
        if subview.isUserInteractionEnabled {
            if subview.accessibilityLabel == nil || subview.accessibilityLabel?.isEmpty == true {
                issues.append("Missing accessibility label: \(type(of: subview))")
            }
        }
        issues.append(contentsOf: validateAccessibilityLabels(in: subview))
    }

    return issues
}
```

#### Touch Targets

```
- [ ] All touch targets minimum 44x44 pt
- [ ] Frequently-tapped elements 48-60 pt
- [ ] Touch targets don't overlap
- [ ] Minimum 8pt spacing between adjacent targets
- [ ] Touch target size verified programmatically
```

```swift
// Touch target validation
func validateTouchTargets(in view: UIView) -> [String] {
    var issues: [String] = []
    let minimumSize: CGFloat = 44.0

    for subview in view.subviews {
        if subview.isUserInteractionEnabled {
            let size = subview.bounds.size
            if size.width < minimumSize || size.height < minimumSize {
                issues.append("Touch target too small: \(type(of: subview)) is \(Int(size.width))x\(Int(size.height))pt (minimum 44x44pt)")
            }
        }
        issues.append(contentsOf: validateTouchTargets(in: subview))
    }

    return issues
}
```

#### Motion Sensitivity

```
- [ ] Screen shake can be disabled in settings
- [ ] Parallax effects can be disabled
- [ ] Reduce Motion system setting respected
- [ ] Flashing effects limited (<3 flashes per second)
- [ ] Alternative feedback for motion-disabled mode
```

```swift
// Motion sensitivity check
var reduceMotionEnabled: Bool {
    UIAccessibility.isReduceMotionEnabled
}

func screenShakeIfAllowed(intensity: CGFloat, duration: TimeInterval) {
    guard !UIAccessibility.isReduceMotionEnabled else {
        // Alternative feedback for accessibility
        provideHapticFeedback(intensity: intensity)
        return
    }
    performScreenShake(intensity: intensity, duration: duration)
}
```

#### Additional Accessibility

```
- [ ] Dynamic Type supported for text elements
- [ ] Color contrast ratio >= 4.5:1 for text
- [ ] Information not conveyed by color alone
- [ ] Captions/subtitles for important audio
- [ ] Adjustable game speed option considered
- [ ] One-handed play mode if appropriate
```

### 6. Platform Compliance Checklist

#### Human Interface Guidelines

```
- [ ] Safe areas respected (notch, Dynamic Island, home indicator)
- [ ] Interactive elements not in safe area margins
- [ ] Game content can extend to edges appropriately
- [ ] iPad supports all orientations (or justified limitation)
- [ ] iPad supports pointer/trackpad (iPadOS 13.4+)
- [ ] iPad handles Split View gracefully
- [ ] Keyboard shortcuts for iPad where appropriate
```

#### Technical Requirements

```
- [ ] Built with Xcode 16+ (April 2025 requirement)
- [ ] Uses iOS 18 SDK (April 2025 requirement)
- [ ] PrivacyInfo.xcprivacy included and complete
- [ ] Universal app supports iPhone AND iPad
- [ ] @1x, @2x, @3x assets provided
- [ ] ASTC texture compression used (A8+ devices)
- [ ] On-Demand Resources used if app >200MB
- [ ] App Thinning enabled
```

#### Controller Support (If Applicable)

```
- [ ] MFi controller supported
- [ ] All controller actions have on-screen alternatives
- [ ] Controller input latency tested
- [ ] Controller connection/disconnection handled
```

---

## Validation Implementation

### Complete Validation Runner

```swift
import Foundation

struct ValidationResult {
    let passed: Bool
    let score: Int // 0-100
    let issues: [String]
    var recommendations: [String] = []
}

struct CategoryValidation {
    let category: String
    let results: [String: ValidationResult]

    var overallScore: Int {
        guard !results.isEmpty else { return 0 }
        return results.values.reduce(0) { $0 + $1.score } / results.count
    }

    var passed: Bool {
        results.values.allSatisfy { $0.passed }
    }
}

final class QualityValidator {

    func runFullValidation() -> QualityReport {
        let polish = validatePolish()
        let performance = validatePerformance()
        let retention = validateRetention()
        let monetization = validateMonetization()
        let accessibility = validateAccessibility()
        let platform = validatePlatformCompliance()

        let categories = [polish, performance, retention, monetization, accessibility, platform]
        let overallScore = categories.reduce(0) { $0 + $1.overallScore } / categories.count
        let allPassed = categories.allSatisfy { $0.passed }

        return QualityReport(
            timestamp: Date(),
            overallScore: overallScore,
            passed: allPassed,
            categories: categories,
            grade: calculateGrade(score: overallScore)
        )
    }

    private func calculateGrade(score: Int) -> String {
        switch score {
        case 95...100: return "A+"
        case 90..<95: return "A"
        case 85..<90: return "B+"
        case 80..<85: return "B"
        case 70..<80: return "C"
        case 60..<70: return "D"
        default: return "F"
        }
    }

    // Category validators would call individual checklist validators
    private func validatePolish() -> CategoryValidation {
        // Implementation validates each polish subcategory
        fatalError("Implement with actual game reference")
    }

    private func validatePerformance() -> CategoryValidation {
        let frameRate = FrameRateValidator().validate()
        let launch = LaunchTimeValidator.shared.validate()
        let memory = MemoryValidator().validate()

        return CategoryValidation(
            category: "Performance",
            results: [
                "Frame Rate": frameRate,
                "Launch Time": launch,
                "Memory": memory
            ]
        )
    }

    private func validateRetention() -> CategoryValidation {
        // Implementation validates retention mechanics
        fatalError("Implement with actual game reference")
    }

    private func validateMonetization() -> CategoryValidation {
        // Implementation validates monetization ethics
        fatalError("Implement with actual game reference")
    }

    private func validateAccessibility() -> CategoryValidation {
        // Implementation validates accessibility compliance
        fatalError("Implement with actual game reference")
    }

    private func validatePlatformCompliance() -> CategoryValidation {
        // Implementation validates platform requirements
        fatalError("Implement with actual game reference")
    }
}

struct QualityReport {
    let timestamp: Date
    let overallScore: Int
    let passed: Bool
    let categories: [CategoryValidation]
    let grade: String

    func printReport() {
        print("=== QUALITY VALIDATION REPORT ===")
        print("Date: \(timestamp)")
        print("Overall Score: \(overallScore)/100 (Grade: \(grade))")
        print("Status: \(passed ? "PASSED" : "FAILED")")
        print("")

        for category in categories {
            print("[\(category.passed ? "PASS" : "FAIL")] \(category.category): \(category.overallScore)/100")
            for (name, result) in category.results {
                let status = result.passed ? "OK" : "ISSUE"
                print("  [\(status)] \(name): \(result.score)/100")
                for issue in result.issues {
                    print("    - \(issue)")
                }
            }
            print("")
        }
    }
}
```

---

## Decision Trees

### When to Run Full Validation

```
Is this a phase completion checkpoint?
├── YES → Run full validation for completed phase domains
└── NO
    └── Is this pre-submission?
        ├── YES → Run FULL validation across ALL categories
        └── NO
            └── Is there a specific quality concern?
                ├── YES → Run targeted category validation
                └── NO → Skip (validation not needed)
```

### Handling Validation Failures

```
Validation failed?
├── Critical failure (score = 0)?
│   ├── YES → BLOCK PROGRESSION - Must fix before continuing
│   └── NO → Continue with remediation plan
│
├── Category failed but individual items passed?
│   └── Address failed items, re-run category validation
│
└── Overall passed but low score (<80)?
    └── Create improvement backlog, prioritize by impact
```

### Quality Score Interpretation

| Score | Grade | Interpretation | Action |
|-------|-------|----------------|--------|
| 95-100 | A+ | Top 10% quality | Ship ready |
| 90-94 | A | Excellent | Ship ready with minor polish |
| 85-89 | B+ | Good | Ship after addressing issues |
| 80-84 | B | Acceptable | Address issues before ship |
| 70-79 | C | Below target | Significant work needed |
| 60-69 | D | Poor | Major quality issues |
| <60 | F | Failing | Do not ship |

---

## Anti-Patterns

**Don't**: Skip validation because "it feels ready"
**Why**: Subjective assessment misses measurable deficiencies
**Instead**: Run quantitative validation even when confident

**Don't**: Validate only at the end of development
**Why**: Late discovery of issues requires expensive rework
**Instead**: Validate at each phase checkpoint

**Don't**: Ignore accessibility validation
**Why**: Legal risk, excludes users, App Store rejection possible
**Instead**: Accessibility is required, not optional

**Don't**: Accept "mostly 60fps" as passing
**Why**: Frame drops are jarring and indicate performance issues
**Instead**: Require consistent 60fps with <5% dropped frames

**Don't**: Skip monetization ethics review for "standard" practices
**Why**: Industry standard can still be predatory
**Instead**: Validate against ethical checklist regardless of common practice

**Don't**: Treat validation failures as suggestions
**Why**: Quality bar exists for commercial success
**Instead**: Treat validation failures as requirements

---

## Quality Checklist (Meta)

Before completing quality validation work, verify:

- [ ] All six validation categories assessed
- [ ] Quantitative metrics measured (not estimated)
- [ ] All critical failures identified and flagged
- [ ] Remediation recommendations provided for failures
- [ ] Quality score calculated and grade assigned
- [ ] Report generated with actionable items
- [ ] Blocking issues clearly distinguished from improvements
- [ ] Validation results documented for tracking

---

## Adjacent Skills

**For fixing validation failures:**
- `animation-system` - Animation timing and easing fixes
- `audio-designer` - Audio latency and quality fixes
- `haptic-optimizer` - Haptic feedback implementation
- `performance-optimizer` - Frame rate and memory optimization
- `retention-engineer` - Retention mechanics implementation
- `onboarding-architect` - FTUE improvements

**For proceeding after validation:**
- `ship-readiness-checker` - Pre-submission final checklist
- `game-architect` - Overall development orchestration

**For compliance issues:**
- `app-store-review` - App Store compliance
- `privacy-manifest` - Privacy requirement compliance
- `iap-implementation` - IAP compliance
