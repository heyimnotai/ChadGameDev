---
name: onboarding-architect
description: Designs First-Time User Experience (FTUE) sequences that maximize D1 retention through optimal tutorial flow, progressive disclosure, and early success engineering. Use this skill when designing new player onboarding, tutorial sequences, first-session experiences, or skip/restart flows. Triggers when building the first 30 seconds, first 2 minutes, or first session of gameplay. This skill ensures players understand core mechanics quickly while experiencing success and delight within the critical first minutes.
---

# Onboarding Architect

## Purpose

This skill enables the design of First-Time User Experience (FTUE) flows that maximize D1 retention by getting players to the core loop quickly, teaching through play rather than text, and engineering early success moments. It enforces a quality bar where players understand the game's value proposition within 30 seconds, complete their first rewarding action within 2 minutes, and finish their first session feeling competent and eager to return.

## Domain Boundaries

- **This skill handles**:
  - First 30 seconds design (hook and value proposition)
  - First 2 minutes design (core loop introduction)
  - First session design (complete onboarding arc)
  - Tutorial flow patterns (show don't tell)
  - Progressive disclosure sequences
  - First reward timing and magnitude
  - "Aha moment" engineering
  - Skip and restart handling
  - FTUE funnel tracking requirements
  - Beginner's luck mechanics

- **This skill does NOT handle**:
  - Long-term retention systems (see: retention-engineer)
  - Reward psychology and variable ratios (see: dopamine-optimizer)
  - Achievement and progression pacing (see: reward-scheduler)
  - Daily engagement loops (see: retention-engineer)
  - Core loop design itself (see: core-loop-architect)
  - Difficulty balancing (see: difficulty-tuner)

## Core Specifications

### Critical Timing Targets

| Milestone | Target Time | Failure Threshold |
|-----------|-------------|-------------------|
| First visual response to input | 0-100ms | >200ms |
| Value proposition clear | 5-10 seconds | >30 seconds |
| First player action | 3-5 seconds | >15 seconds |
| First positive feedback | 5-15 seconds | >30 seconds |
| Core loop understood | 30-60 seconds | >120 seconds |
| First reward claimed | 60-120 seconds | >180 seconds |
| "Aha moment" experienced | 2-5 minutes | >10 minutes |
| First session complete | 5-10 minutes | >20 minutes |

### D1 Retention Correlation

| FTUE Element | D1 Impact | Priority |
|--------------|-----------|----------|
| Time to first action | -2% per 5 seconds delay | Critical |
| Tutorial completion rate | +0.5% per 1% completion | High |
| First reward timing | -3% if > 3 minutes | Critical |
| Beginner's luck (first win) | +5-8% if guaranteed | High |
| Text walls in tutorial | -1% per 50 words | Medium |
| Forced waiting | -4% per 30 seconds | Critical |

### First 30 Seconds Blueprint

**Structure**:
```
0-3 seconds:   Title/splash (skip available after 1s)
3-5 seconds:   Immediate visual hook (action on screen)
5-10 seconds:  Player input prompt (highlighted, obvious)
10-15 seconds: First action executed (with satisfying feedback)
15-25 seconds: Result shown (success state)
25-30 seconds: Transition to core loop (or next tutorial step)
```

**Visual Hierarchy** (First Screen):
1. Primary action target (largest, brightest, animated)
2. Character/avatar (medium, draws eye)
3. UI elements (smallest, muted until needed)
4. Background (supports but doesn't distract)

**Input Prompt Requirements**:
- Finger/hand animation showing exact gesture
- Pulsing or glowing highlight on interactive element
- No text required (visual cues only)
- Auto-triggers demo if no input for 5 seconds

### First 2 Minutes Blueprint

**Phase 1: Hook (0-30 seconds)**
```
- Visual spectacle or intriguing scenario
- Single, obvious action available
- Immediate feedback on first tap
- No UI chrome except critical elements
```

**Phase 2: Core Loop Introduction (30-90 seconds)**
```
- One mechanic at a time
- Player performs action 3 times minimum
- Each repetition adds slight variation
- Success guaranteed on first attempts
```

**Phase 3: First Reward (90-120 seconds)**
```
- Reward tied to player action (not time-based)
- Celebratory feedback (particles, sound, haptics)
- Visible progress indicator appears
- Tease of what comes next
```

**Text Budget**:
| Phase | Maximum Words | Delivery |
|-------|---------------|----------|
| First 30s | 0-10 words | Character speech bubble |
| 30-60s | 10-20 words | Contextual hints |
| 60-90s | 15-25 words | Brief instructions |
| 90-120s | 10-15 words | Reward explanation |
| **Total** | **35-70 words** | Spread across 2 minutes |

### First Session Blueprint

**Ideal First Session Structure** (5-10 minutes):
```
Minutes 0-2:    Hook + Core Loop (see above)
Minutes 2-4:    Mechanic Layering
                - Introduce secondary mechanic
                - Combine with primary mechanic
                - Player executes combination 2-3 times
Minutes 4-6:    First Challenge
                - Slightly increased difficulty
                - Success still very likely (85%+ success rate)
                - Failure provides learning moment, not punishment
Minutes 6-8:    Meta-Game Peek
                - Show progression system
                - First upgrade or customization
                - Preview future content
Minutes 8-10:   Session Completion
                - Natural stopping point
                - Clear indication of progress made
                - Tease for next session
                - Push notification permission (optional)
```

**Beginner's Luck Calibration**:
| Session Stage | Target Success Rate | Difficulty Adjustment |
|---------------|---------------------|----------------------|
| First 3 levels/rounds | 95-100% | Maximum assistance |
| Levels 4-7 | 85-90% | Light assistance |
| Levels 8-15 | 70-80% | Normal difficulty |
| Levels 16+ | 50-65% | Full difficulty |

### Progressive Disclosure Sequence

**Mechanic Introduction Order**:
```
Layer 1 (0-2 min):   Core input (tap, swipe, hold)
Layer 2 (2-4 min):   Core objective (collect, destroy, match)
Layer 3 (4-6 min):   Fail state (what to avoid)
Layer 4 (6-10 min):  Power-ups/abilities (enhance core)
Layer 5 (10-15 min): Secondary currency/resource
Layer 6 (15-30 min): Social features
Layer 7 (30+ min):   Advanced mechanics, meta-game depth
```

**Feature Gate Milestones**:
| Feature | Unlock After | Reason |
|---------|--------------|--------|
| Settings menu | Session 1 | Prevent early friction |
| Shop | Level 3 | Establish value first |
| Social features | Level 5 | Personal investment first |
| Leaderboards | Level 10 | Build confidence first |
| Guilds/clans | Level 15 | Committed players only |
| Advanced modes | Level 20+ | Mastery of basics |

### "Aha Moment" Engineering

**Definition**: The moment when a player understands the game's unique value and potential for mastery.

**Aha Moment Patterns by Genre**:
| Genre | Aha Moment | Target Time |
|-------|------------|-------------|
| Puzzle | "I solved a pattern I thought was impossible" | 3-5 minutes |
| Action | "I defeated an enemy that seemed tough" | 2-4 minutes |
| Strategy | "My plan worked better than expected" | 5-8 minutes |
| Casual | "This is relaxing and satisfying" | 1-2 minutes |
| RPG | "My character feels more powerful" | 5-10 minutes |
| Roguelike | "I discovered a powerful combo" | 10-15 minutes |

**Designing Aha Moments**:
```
1. Create a skill gap (player thinks X is hard)
2. Provide subtle scaffolding (hidden assistance)
3. Player succeeds (feels earned, not given)
4. Celebrate achievement (feedback reinforces)
5. Raise the bar (show next challenge)
```

### Tutorial Flow Patterns

**Show Don't Tell Hierarchy**:
1. **Demonstrate** (NPC or animation shows action)
2. **Guide** (Highlight with finger indicator)
3. **Assist** (Auto-complete on first attempt if stuck)
4. **Explain** (Text only if above methods fail)

**Pattern: Learn-by-Doing Loop**
```
Step 1: Highlight interactive element (no text)
Step 2: Wait for player input (max 5s)
Step 3: If no input, show gesture animation
Step 4: Player performs action
Step 5: Immediate success feedback
Step 6: Brief pause (500ms) to register success
Step 7: Next element highlights
```

**Pattern: Contextual Hint System**
```
Conditions for hint appearance:
- Player idle for 3+ seconds
- Player failed same action 2+ times
- Player tapped non-interactive element

Hint escalation:
- First hint: Subtle glow on target
- Second hint: Animated finger indicator
- Third hint: Text bubble with instruction
- Fourth hint: Auto-demo of action
```

### Skip and Restart Handling

**Skip Tutorial Criteria**:
- Player has completed tutorial before (cloud save check)
- Player explicitly requests skip (confirmed with "Are you sure?")
- Player demonstrates proficiency (completes action without prompts)

**Skip Implementation**:
```swift
enum TutorialSkipState {
    case notAvailable      // New player, no skip option
    case availableHidden   // Can skip but not prominently shown
    case availableVisible  // Returning player, skip button shown
    case autoSkipped       // Proficiency detected
}

// Show skip after:
// - Player completes 3 actions without hints
// - Player has cloud save from previous install
// - Player taps skip icon (show after 30s)
```

**Restart Tutorial Access**:
- Always available in Settings menu
- Accessible from Help section
- Consider "tip of the day" for missed features

### FTUE Funnel Tracking Requirements

**Mandatory Tracking Events**:
| Event | When | Data |
|-------|------|------|
| `ftue_start` | First app launch | device_type, os_version |
| `ftue_first_tap` | First player input | time_to_tap, prompted |
| `ftue_step_complete` | Each tutorial step | step_id, time_spent, hints_shown |
| `ftue_first_reward` | First reward claimed | reward_type, time_to_reward |
| `ftue_aha_moment` | Aha moment triggered | moment_type, time_to_aha |
| `ftue_complete` | Tutorial finished | total_time, steps_skipped |
| `ftue_skip` | Tutorial skipped | skip_point, reason |
| `ftue_abandon` | App closed during FTUE | last_step, time_in_step |

**Funnel Analysis Targets**:
| Transition | Healthy Rate | Alert Threshold |
|------------|--------------|-----------------|
| Start → First tap | 98%+ | <95% |
| First tap → Step 2 | 95%+ | <90% |
| Each step → Next | 90%+ | <85% |
| Tutorial → First reward | 85%+ | <75% |
| First reward → Session complete | 80%+ | <70% |
| Session complete → Return (D1) | 45%+ | <35% |

## Implementation Patterns

### Tutorial Step Manager

```swift
import Foundation
import Combine

final class TutorialStepManager: ObservableObject {

    struct TutorialStep {
        let id: String
        let requiredAction: RequiredAction
        let highlightTargets: [String]
        let hintDelay: TimeInterval
        let maxAttempts: Int
        let autoCompleteAfter: TimeInterval?

        enum RequiredAction {
            case tap(targetId: String)
            case swipe(direction: SwipeDirection)
            case hold(targetId: String, duration: TimeInterval)
            case drag(fromId: String, toId: String)
            case any // Any valid input
        }

        enum SwipeDirection {
            case up, down, left, right
        }
    }

    struct StepResult {
        let stepId: String
        let timeSpent: TimeInterval
        let hintsShown: Int
        let attempts: Int
        let wasAutoCompleted: Bool
    }

    @Published var currentStep: TutorialStep?
    @Published var hintLevel: Int = 0
    @Published var isComplete: Bool = false

    private var steps: [TutorialStep] = []
    private var currentStepIndex: Int = 0
    private var stepStartTime: Date?
    private var hintsShownThisStep: Int = 0
    private var attemptsThisStep: Int = 0
    private var hintTimer: Timer?
    private var autoCompleteTimer: Timer?

    private let analytics: AnalyticsTracker

    init(analytics: AnalyticsTracker) {
        self.analytics = analytics
    }

    func loadTutorial(steps: [TutorialStep]) {
        self.steps = steps
        self.currentStepIndex = 0
        advanceToStep(index: 0)
    }

    func attemptAction(_ action: TutorialStep.RequiredAction) {
        guard let step = currentStep else { return }

        attemptsThisStep += 1

        if actionMatchesRequired(action, required: step.requiredAction) {
            completeCurrentStep(wasAutoCompleted: false)
        } else if attemptsThisStep >= step.maxAttempts {
            escalateHint()
        }
    }

    func skipTutorial(reason: String) {
        analytics.track("ftue_skip", properties: [
            "skip_point": currentStep?.id ?? "unknown",
            "reason": reason
        ])

        isComplete = true
        cleanup()
    }

    private func advanceToStep(index: Int) {
        cleanup()

        guard index < steps.count else {
            completeTutorial()
            return
        }

        let step = steps[index]
        currentStep = step
        stepStartTime = Date()
        hintsShownThisStep = 0
        attemptsThisStep = 0
        hintLevel = 0

        analytics.track("ftue_step_start", properties: [
            "step_id": step.id,
            "step_index": index
        ])

        // Schedule hint escalation
        hintTimer = Timer.scheduledTimer(
            withTimeInterval: step.hintDelay,
            repeats: true
        ) { [weak self] _ in
            self?.escalateHint()
        }

        // Schedule auto-complete if configured
        if let autoComplete = step.autoCompleteAfter {
            autoCompleteTimer = Timer.scheduledTimer(
                withTimeInterval: autoComplete,
                repeats: false
            ) { [weak self] _ in
                self?.completeCurrentStep(wasAutoCompleted: true)
            }
        }
    }

    private func completeCurrentStep(wasAutoCompleted: Bool) {
        guard let step = currentStep,
              let startTime = stepStartTime else { return }

        let timeSpent = Date().timeIntervalSince(startTime)

        let result = StepResult(
            stepId: step.id,
            timeSpent: timeSpent,
            hintsShown: hintsShownThisStep,
            attempts: attemptsThisStep,
            wasAutoCompleted: wasAutoCompleted
        )

        analytics.track("ftue_step_complete", properties: [
            "step_id": result.stepId,
            "time_spent": result.timeSpent,
            "hints_shown": result.hintsShown,
            "attempts": result.attempts,
            "auto_completed": wasAutoCompleted
        ])

        currentStepIndex += 1
        advanceToStep(index: currentStepIndex)
    }

    private func escalateHint() {
        hintLevel = min(hintLevel + 1, 4)
        hintsShownThisStep += 1

        // Hint levels:
        // 0: No hint
        // 1: Subtle glow
        // 2: Finger indicator
        // 3: Text bubble
        // 4: Auto-demo
    }

    private func completeTutorial() {
        isComplete = true

        analytics.track("ftue_complete", properties: [
            "total_steps": steps.count,
            "steps_auto_completed": steps.filter { _ in false }.count // Track from results
        ])

        cleanup()
    }

    private func cleanup() {
        hintTimer?.invalidate()
        hintTimer = nil
        autoCompleteTimer?.invalidate()
        autoCompleteTimer = nil
    }

    private func actionMatchesRequired(
        _ performed: TutorialStep.RequiredAction,
        required: TutorialStep.RequiredAction
    ) -> Bool {
        switch (performed, required) {
        case (.any, _), (_, .any):
            return true
        case let (.tap(p), .tap(r)):
            return p == r
        case let (.swipe(p), .swipe(r)):
            return p == r
        case let (.hold(pId, pDur), .hold(rId, rDur)):
            return pId == rId && pDur >= rDur
        case let (.drag(pFrom, pTo), .drag(rFrom, rTo)):
            return pFrom == rFrom && pTo == rTo
        default:
            return false
        }
    }
}

protocol AnalyticsTracker {
    func track(_ event: String, properties: [String: Any])
}
```

### Progressive Disclosure Manager

```swift
import Foundation

final class ProgressiveDisclosureManager {

    struct FeatureGate {
        let featureId: String
        let unlockCondition: UnlockCondition
        let announcementType: AnnouncementType

        enum UnlockCondition {
            case level(Int)
            case sessionCount(Int)
            case achievementUnlocked(String)
            case tutorialComplete
            case timeInGame(TimeInterval)
            case customCondition(() -> Bool)
        }

        enum AnnouncementType {
            case none
            case subtle    // Badge/dot indicator
            case standard  // Toast notification
            case prominent // Modal with explanation
        }
    }

    struct FeatureStatus {
        let featureId: String
        let isUnlocked: Bool
        let wasAnnounced: Bool
        let unlockDate: Date?
    }

    private var featureGates: [FeatureGate] = []
    private var unlockedFeatures: Set<String> = []
    private var announcedFeatures: Set<String> = []

    init() {
        setupDefaultGates()
        loadState()
    }

    private func setupDefaultGates() {
        featureGates = [
            FeatureGate(
                featureId: "settings",
                unlockCondition: .tutorialComplete,
                announcementType: .none
            ),
            FeatureGate(
                featureId: "shop",
                unlockCondition: .level(3),
                announcementType: .prominent
            ),
            FeatureGate(
                featureId: "daily_rewards",
                unlockCondition: .sessionCount(2),
                announcementType: .standard
            ),
            FeatureGate(
                featureId: "social",
                unlockCondition: .level(5),
                announcementType: .prominent
            ),
            FeatureGate(
                featureId: "leaderboards",
                unlockCondition: .level(10),
                announcementType: .standard
            ),
            FeatureGate(
                featureId: "guilds",
                unlockCondition: .level(15),
                announcementType: .prominent
            ),
            FeatureGate(
                featureId: "advanced_mode",
                unlockCondition: .level(20),
                announcementType: .prominent
            )
        ]
    }

    func isFeatureUnlocked(_ featureId: String) -> Bool {
        return unlockedFeatures.contains(featureId)
    }

    func checkUnlocks(
        currentLevel: Int,
        sessionCount: Int,
        tutorialComplete: Bool,
        unlockedAchievements: Set<String>,
        totalTimeInGame: TimeInterval
    ) -> [FeatureGate] {
        var newlyUnlocked: [FeatureGate] = []

        for gate in featureGates {
            guard !unlockedFeatures.contains(gate.featureId) else { continue }

            let shouldUnlock: Bool
            switch gate.unlockCondition {
            case .level(let required):
                shouldUnlock = currentLevel >= required
            case .sessionCount(let required):
                shouldUnlock = sessionCount >= required
            case .achievementUnlocked(let achievementId):
                shouldUnlock = unlockedAchievements.contains(achievementId)
            case .tutorialComplete:
                shouldUnlock = tutorialComplete
            case .timeInGame(let required):
                shouldUnlock = totalTimeInGame >= required
            case .customCondition(let check):
                shouldUnlock = check()
            }

            if shouldUnlock {
                unlockedFeatures.insert(gate.featureId)
                newlyUnlocked.append(gate)
            }
        }

        if !newlyUnlocked.isEmpty {
            saveState()
        }

        return newlyUnlocked
    }

    func markAsAnnounced(_ featureId: String) {
        announcedFeatures.insert(featureId)
        saveState()
    }

    func getFeatureStatus(_ featureId: String) -> FeatureStatus {
        return FeatureStatus(
            featureId: featureId,
            isUnlocked: unlockedFeatures.contains(featureId),
            wasAnnounced: announcedFeatures.contains(featureId),
            unlockDate: nil // Could track this if needed
        )
    }

    func getPendingAnnouncements() -> [FeatureGate] {
        return featureGates.filter { gate in
            unlockedFeatures.contains(gate.featureId) &&
            !announcedFeatures.contains(gate.featureId) &&
            gate.announcementType != .none
        }
    }

    private func loadState() {
        if let data = UserDefaults.standard.stringArray(forKey: "unlockedFeatures") {
            unlockedFeatures = Set(data)
        }
        if let data = UserDefaults.standard.stringArray(forKey: "announcedFeatures") {
            announcedFeatures = Set(data)
        }
    }

    private func saveState() {
        UserDefaults.standard.set(Array(unlockedFeatures), forKey: "unlockedFeatures")
        UserDefaults.standard.set(Array(announcedFeatures), forKey: "announcedFeatures")
    }
}
```

### First Session Coordinator

```swift
import Foundation
import Combine

final class FirstSessionCoordinator: ObservableObject {

    enum SessionPhase {
        case hook           // 0-30 seconds
        case coreLoop       // 30-90 seconds
        case firstReward    // 90-120 seconds
        case mechanicLayer  // 2-4 minutes
        case firstChallenge // 4-6 minutes
        case metaPeek       // 6-8 minutes
        case sessionEnd     // 8-10 minutes
        case postSession    // After completion
    }

    struct PhaseConfig {
        let phase: SessionPhase
        let targetDuration: TimeInterval
        let maxDuration: TimeInterval
        let requiredMilestones: [String]
    }

    @Published var currentPhase: SessionPhase = .hook
    @Published var phaseProgress: Double = 0
    @Published var sessionComplete: Bool = false

    private var phaseStartTime: Date?
    private var sessionStartTime: Date?
    private var completedMilestones: Set<String> = []
    private var analytics: AnalyticsTracker

    private let phaseConfigs: [PhaseConfig] = [
        PhaseConfig(
            phase: .hook,
            targetDuration: 30,
            maxDuration: 45,
            requiredMilestones: ["first_tap", "first_feedback"]
        ),
        PhaseConfig(
            phase: .coreLoop,
            targetDuration: 60,
            maxDuration: 90,
            requiredMilestones: ["core_action_1", "core_action_2", "core_action_3"]
        ),
        PhaseConfig(
            phase: .firstReward,
            targetDuration: 30,
            maxDuration: 45,
            requiredMilestones: ["reward_shown", "reward_claimed"]
        ),
        PhaseConfig(
            phase: .mechanicLayer,
            targetDuration: 120,
            maxDuration: 180,
            requiredMilestones: ["mechanic_2_intro", "mechanic_combo"]
        ),
        PhaseConfig(
            phase: .firstChallenge,
            targetDuration: 120,
            maxDuration: 180,
            requiredMilestones: ["challenge_start", "challenge_complete"]
        ),
        PhaseConfig(
            phase: .metaPeek,
            targetDuration: 120,
            maxDuration: 150,
            requiredMilestones: ["progression_shown", "first_upgrade"]
        ),
        PhaseConfig(
            phase: .sessionEnd,
            targetDuration: 60,
            maxDuration: 120,
            requiredMilestones: ["session_summary", "next_tease"]
        )
    ]

    init(analytics: AnalyticsTracker) {
        self.analytics = analytics
    }

    func startSession() {
        sessionStartTime = Date()
        transitionToPhase(.hook)

        analytics.track("ftue_session_start", properties: [:])
    }

    func completeMilestone(_ milestone: String) {
        completedMilestones.insert(milestone)

        analytics.track("ftue_milestone", properties: [
            "milestone": milestone,
            "phase": String(describing: currentPhase),
            "time_in_session": sessionElapsedTime()
        ])

        checkPhaseCompletion()
    }

    func forceAdvancePhase() {
        // For skip functionality or timeout handling
        if let nextPhase = nextPhase(after: currentPhase) {
            transitionToPhase(nextPhase)
        }
    }

    private func checkPhaseCompletion() {
        guard let config = configForPhase(currentPhase) else { return }

        let allMilestonesComplete = config.requiredMilestones.allSatisfy {
            completedMilestones.contains($0)
        }

        if allMilestonesComplete {
            if let nextPhase = nextPhase(after: currentPhase) {
                transitionToPhase(nextPhase)
            } else {
                completeSession()
            }
        }
    }

    private func transitionToPhase(_ phase: SessionPhase) {
        let previousPhase = currentPhase

        if let startTime = phaseStartTime {
            let duration = Date().timeIntervalSince(startTime)
            analytics.track("ftue_phase_complete", properties: [
                "phase": String(describing: previousPhase),
                "duration": duration
            ])
        }

        currentPhase = phase
        phaseStartTime = Date()
        phaseProgress = 0

        analytics.track("ftue_phase_start", properties: [
            "phase": String(describing: phase)
        ])
    }

    private func completeSession() {
        sessionComplete = true
        currentPhase = .postSession

        let totalDuration = sessionElapsedTime()

        analytics.track("ftue_session_complete", properties: [
            "total_duration": totalDuration,
            "milestones_completed": completedMilestones.count
        ])
    }

    private func sessionElapsedTime() -> TimeInterval {
        guard let start = sessionStartTime else { return 0 }
        return Date().timeIntervalSince(start)
    }

    private func configForPhase(_ phase: SessionPhase) -> PhaseConfig? {
        return phaseConfigs.first { $0.phase == phase }
    }

    private func nextPhase(after phase: SessionPhase) -> SessionPhase? {
        switch phase {
        case .hook: return .coreLoop
        case .coreLoop: return .firstReward
        case .firstReward: return .mechanicLayer
        case .mechanicLayer: return .firstChallenge
        case .firstChallenge: return .metaPeek
        case .metaPeek: return .sessionEnd
        case .sessionEnd: return nil
        case .postSession: return nil
        }
    }
}
```

### Beginner's Luck System

```swift
import Foundation

final class BeginnersLuckSystem {

    struct DifficultyAdjustment {
        let successRateTarget: Double
        let enemyHealthMultiplier: Double
        let enemyDamageMultiplier: Double
        let playerDamageMultiplier: Double
        let dropRateMultiplier: Double
        let hintFrequency: HintFrequency

        enum HintFrequency {
            case aggressive // Hint after 2s idle
            case standard   // Hint after 5s idle
            case minimal    // Hint after 10s idle
            case none       // No automatic hints
        }
    }

    private var currentLevel: Int = 1
    private var consecutiveWins: Int = 0
    private var consecutiveLosses: Int = 0
    private var totalAttempts: Int = 0

    func getAdjustment(forLevel level: Int) -> DifficultyAdjustment {
        switch level {
        case 1...3:
            return DifficultyAdjustment(
                successRateTarget: 0.95,
                enemyHealthMultiplier: 0.6,
                enemyDamageMultiplier: 0.5,
                playerDamageMultiplier: 1.5,
                dropRateMultiplier: 2.0,
                hintFrequency: .aggressive
            )
        case 4...7:
            return DifficultyAdjustment(
                successRateTarget: 0.85,
                enemyHealthMultiplier: 0.8,
                enemyDamageMultiplier: 0.7,
                playerDamageMultiplier: 1.2,
                dropRateMultiplier: 1.5,
                hintFrequency: .standard
            )
        case 8...15:
            return DifficultyAdjustment(
                successRateTarget: 0.75,
                enemyHealthMultiplier: 0.9,
                enemyDamageMultiplier: 0.85,
                playerDamageMultiplier: 1.1,
                dropRateMultiplier: 1.2,
                hintFrequency: .minimal
            )
        default:
            return DifficultyAdjustment(
                successRateTarget: 0.60,
                enemyHealthMultiplier: 1.0,
                enemyDamageMultiplier: 1.0,
                playerDamageMultiplier: 1.0,
                dropRateMultiplier: 1.0,
                hintFrequency: .none
            )
        }
    }

    func recordOutcome(won: Bool, level: Int) {
        currentLevel = level
        totalAttempts += 1

        if won {
            consecutiveWins += 1
            consecutiveLosses = 0
        } else {
            consecutiveLosses += 1
            consecutiveWins = 0
        }
    }

    func getDynamicAdjustment() -> Double {
        // Additional real-time adjustment based on performance
        if consecutiveLosses >= 3 {
            // Player struggling, ease up
            return 0.8 // 20% easier
        } else if consecutiveLosses >= 2 {
            return 0.9 // 10% easier
        } else if consecutiveWins >= 5 && currentLevel > 10 {
            // Player cruising, slight increase
            return 1.1 // 10% harder
        }
        return 1.0 // No adjustment
    }

    func shouldGuaranteeSuccess(level: Int) -> Bool {
        // First 2 levels always succeed
        if level <= 2 && totalAttempts <= 3 {
            return true
        }

        // After 3 consecutive losses on same level, guarantee
        if consecutiveLosses >= 3 {
            return true
        }

        return false
    }
}
```

### FTUE Analytics Tracker

```swift
import Foundation

final class FTUEAnalyticsTracker {

    struct FunnelStep {
        let stepId: String
        let timestamp: Date
        let timeFromPrevious: TimeInterval
        let properties: [String: Any]
    }

    private var funnelSteps: [FunnelStep] = []
    private var sessionStartTime: Date?
    private var lastStepTime: Date?

    func startFTUE() {
        sessionStartTime = Date()
        lastStepTime = sessionStartTime

        trackStep("ftue_start", properties: [
            "device_type": getDeviceType(),
            "os_version": getOSVersion(),
            "is_returning": isReturningPlayer()
        ])
    }

    func trackFirstTap(timeToTap: TimeInterval, wasPrompted: Bool) {
        trackStep("ftue_first_tap", properties: [
            "time_to_tap": timeToTap,
            "was_prompted": wasPrompted
        ])
    }

    func trackStepComplete(stepId: String, timeSpent: TimeInterval, hintsShown: Int) {
        trackStep("ftue_step_complete", properties: [
            "step_id": stepId,
            "time_spent": timeSpent,
            "hints_shown": hintsShown
        ])
    }

    func trackFirstReward(rewardType: String, timeToReward: TimeInterval) {
        trackStep("ftue_first_reward", properties: [
            "reward_type": rewardType,
            "time_to_reward": timeToReward
        ])
    }

    func trackAhaMoment(momentType: String) {
        guard let start = sessionStartTime else { return }
        let timeToAha = Date().timeIntervalSince(start)

        trackStep("ftue_aha_moment", properties: [
            "moment_type": momentType,
            "time_to_aha": timeToAha
        ])
    }

    func trackComplete(totalSteps: Int, stepsSkipped: Int) {
        guard let start = sessionStartTime else { return }
        let totalTime = Date().timeIntervalSince(start)

        trackStep("ftue_complete", properties: [
            "total_time": totalTime,
            "total_steps": totalSteps,
            "steps_skipped": stepsSkipped,
            "completion_rate": Double(totalSteps - stepsSkipped) / Double(totalSteps)
        ])
    }

    func trackSkip(skipPoint: String, reason: String) {
        trackStep("ftue_skip", properties: [
            "skip_point": skipPoint,
            "reason": reason
        ])
    }

    func trackAbandon(lastStep: String) {
        guard let stepStart = lastStepTime else { return }
        let timeInStep = Date().timeIntervalSince(stepStart)

        trackStep("ftue_abandon", properties: [
            "last_step": lastStep,
            "time_in_step": timeInStep
        ])
    }

    func generateFunnelReport() -> FunnelReport {
        var dropOffPoints: [String: Double] = [:]
        var averageTimes: [String: TimeInterval] = [:]

        for (index, step) in funnelSteps.enumerated() {
            if index < funnelSteps.count - 1 {
                let nextStep = funnelSteps[index + 1]
                // Calculate drop-off (would need cohort data in real implementation)
                dropOffPoints[step.stepId] = 0.0
            }
            averageTimes[step.stepId] = step.timeFromPrevious
        }

        return FunnelReport(
            totalUsers: 1, // Would aggregate in real implementation
            completionRate: funnelSteps.contains { $0.stepId == "ftue_complete" } ? 1.0 : 0.0,
            dropOffPoints: dropOffPoints,
            averageTimePerStep: averageTimes
        )
    }

    private func trackStep(_ stepId: String, properties: [String: Any]) {
        let now = Date()
        let timeFromPrevious = lastStepTime.map { now.timeIntervalSince($0) } ?? 0

        let step = FunnelStep(
            stepId: stepId,
            timestamp: now,
            timeFromPrevious: timeFromPrevious,
            properties: properties
        )

        funnelSteps.append(step)
        lastStepTime = now

        // Send to analytics backend
        sendToBackend(event: stepId, properties: properties)
    }

    private func sendToBackend(event: String, properties: [String: Any]) {
        // Implementation would send to analytics service
        print("Analytics: \(event) - \(properties)")
    }

    private func getDeviceType() -> String {
        #if os(iOS)
        return UIDevice.current.model
        #else
        return "Unknown"
        #endif
    }

    private func getOSVersion() -> String {
        #if os(iOS)
        return UIDevice.current.systemVersion
        #else
        return "Unknown"
        #endif
    }

    private func isReturningPlayer() -> Bool {
        return UserDefaults.standard.bool(forKey: "hasCompletedFTUE")
    }

    struct FunnelReport {
        let totalUsers: Int
        let completionRate: Double
        let dropOffPoints: [String: Double]
        let averageTimePerStep: [String: TimeInterval]
    }
}
```

## Decision Trees

### Tutorial Complexity Decision

```
What type of game are you building?
├── Hyper-casual (single mechanic)
│   └── No formal tutorial
│       ├── First tap shows immediate result
│       ├── Second tap confirms understanding
│       └── Player is playing within 5 seconds
├── Casual (2-3 mechanics)
│   └── Light tutorial (3-5 steps)
│       ├── Each mechanic gets 1 introduction
│       ├── Total time: 30-60 seconds
│       └── Skip available after first mechanic
├── Mid-core (4-6 mechanics)
│   └── Phased tutorial
│       ├── Core mechanic: 60 seconds
│       ├── Each additional: 30 seconds each
│       ├── Gate advanced features behind levels
│       └── Total first session: 5-8 minutes
└── Core/Complex (7+ mechanics)
    └── Extended onboarding
        ├── Session 1: Core loop only
        ├── Session 2-3: Supporting mechanics
        ├── Session 4+: Advanced features
        └── Contextual tutorials throughout
```

### Hint Escalation Decision

```
Player has not performed expected action.
├── How long since last input?
│   ├── 0-3 seconds
│   │   └── No hint (normal thinking time)
│   ├── 3-5 seconds
│   │   └── Subtle glow on target element
│   ├── 5-8 seconds
│   │   └── Animated finger/hand indicator
│   ├── 8-12 seconds
│   │   └── Text hint in speech bubble
│   └── 12+ seconds
│       └── Auto-demo of action
├── Has player failed this action before?
│   ├── First attempt
│   │   └── Use timing above
│   ├── Second attempt
│   │   └── Skip to finger indicator at 3s
│   └── Third+ attempt
│       └── Skip to text hint at 3s, auto-demo at 8s
└── Is this a returning player?
    └── Reduce all timings by 50%
```

### Skip Tutorial Decision

```
Should skip tutorial be available?
├── Is this player's first install?
│   ├── YES and no cloud save
│   │   └── Hide skip for first 30 seconds
│   │       └── Show "Skip" after demonstrating proficiency
│   └── YES but cloud save exists
│       └── Show skip immediately with "Welcome back!"
├── Has player completed tutorial before?
│   └── Auto-skip OR show "Play tutorial again?" option
├── Is player demonstrating proficiency?
│   ├── Completed 3+ actions without hints
│   │   └── Offer to skip remaining tutorial
│   └── Used hints on every action
│       └── Do not offer skip
└── Did player explicitly request skip?
    └── Confirm with "Are you sure?" only if < 50% complete
```

## Quality Checklist

### First 30 Seconds Verification
- [ ] Value proposition is clear without reading any text
- [ ] First interactive element is visually obvious (size, color, animation)
- [ ] First tap produces immediate feedback (< 100ms)
- [ ] No loading screens or waits after initial launch
- [ ] Skip option appears after 1 second on splash screen
- [ ] Player has performed at least one action by 15 seconds

### First 2 Minutes Verification
- [ ] Total text shown is under 70 words
- [ ] Player has repeated core action at least 3 times
- [ ] First reward is claimed before 120 seconds
- [ ] Reward includes celebratory feedback (particles, sound, haptics)
- [ ] Progress indicator is visible after first reward
- [ ] No feature is introduced that isn't immediately usable

### Tutorial Flow Verification
- [ ] Each step has maximum 5-second idle before hint appears
- [ ] Hint escalation follows: glow -> finger -> text -> demo
- [ ] Auto-complete triggers after 15 seconds of no progress
- [ ] Tutorial can be completed in under 5 minutes
- [ ] Skip option is accessible but not prominent
- [ ] Restart tutorial option exists in Settings

### Beginner's Luck Verification
- [ ] First 3 levels/rounds have 95%+ success rate
- [ ] Difficulty scaling is invisible to player
- [ ] Drop rates are boosted in early levels
- [ ] Hints are more frequent in early levels
- [ ] First loss includes encouragement, not punishment
- [ ] Recovery from failure is quick and painless

### Analytics Funnel Verification
- [ ] Every tutorial step fires a tracking event
- [ ] Time spent per step is recorded
- [ ] Hint usage per step is recorded
- [ ] Skip events include skip point
- [ ] Abandon events include last step and time in step
- [ ] First reward timing is tracked
- [ ] D1 retention is correlated with FTUE completion

## Anti-Patterns

### Anti-Pattern: Text Wall Tutorial
**Wrong**:
```swift
// NEVER DO THIS: Wall of text before gameplay
func showTutorial() {
    let tutorialText = """
    Welcome to our game! In this tutorial, you will learn how to play.
    First, you need to understand that the goal is to collect coins.
    Coins can be found throughout the levels. You collect coins by
    moving your character over them. To move your character, swipe
    in the direction you want to go. There are also enemies that you
    need to avoid. If you touch an enemy, you lose a life...
    """
    showModal(text: tutorialText, dismissButton: "I understand")
}
```
**Consequence**: 40%+ drop-off before gameplay begins.

**Correct**:
```swift
func showTutorial() {
    // Highlight coin with pulsing glow
    highlightElement("coin")

    // Show finger swiping toward coin
    showGestureAnimation(.swipeToward("coin"))

    // Wait for player action (max 5s then escalate hint)
    waitForAction(.swipe) { success in
        if success {
            playCelebration()
            // Player learned by doing
        }
    }
}
```

### Anti-Pattern: Forced Account Creation
**Wrong**:
```swift
// NEVER DO THIS: Blocking gameplay for signup
func applicationDidFinishLaunching() {
    showLoginScreen(required: true) // Must login before playing
}
```
**Consequence**: 60%+ abandonment at login screen.

**Correct**:
```swift
func applicationDidFinishLaunching() {
    startGameplay() // Let them play immediately

    // After they've experienced value (level 5+)
    onLevelComplete(5) {
        showOptionalAccountPrompt(
            benefit: "Save your progress across devices"
        )
    }
}
```

### Anti-Pattern: All Features Visible
**Wrong**:
```swift
// NEVER DO THIS: Overwhelming UI on first launch
func setupMainScreen() {
    showShopButton()
    showLeaderboardButton()
    showGuildButton()
    showDailyRewardsButton()
    showBattlePassButton()
    showSettingsButton()
    showInventoryButton()
    showAchievementsButton()
    // First-time player sees 8+ buttons
}
```
**Consequence**: Decision paralysis, cognitive overload.

**Correct**:
```swift
func setupMainScreen(playerLevel: Int) {
    showPlayButton() // Always visible

    if playerLevel >= 3 {
        showShopButton()
    }
    if playerLevel >= 5 {
        showSocialButton()
    }
    // Progressive disclosure based on experience
}
```

### Anti-Pattern: Punishing First Failure
**Wrong**:
```swift
// NEVER DO THIS: Harsh failure on first attempt
func onPlayerDeath() {
    player.lives -= 1
    player.score = 0
    showGameOverScreen(message: "You lost! Try again?")
    if player.lives == 0 {
        showAdOrPayToRevive()
    }
}
```
**Consequence**: New players feel inadequate, quit before understanding game.

**Correct**:
```swift
func onPlayerDeath(isFirstSession: Bool) {
    if isFirstSession && deathCount <= 2 {
        // Gentle first failure
        showEncouragement("Almost had it! Here's a tip...")
        showHint(forFailureReason: lastDeathCause)
        respawnWithGracePeriod()
        // No life loss, no score reset
    } else {
        // Normal failure handling
        handleNormalDeath()
    }
}
```

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| **retention-engineer** | FTUE quality directly impacts D1 retention |
| **dopamine-optimizer** | First reward timing follows dopamine principles |
| **core-loop-architect** | FTUE must teach the core loop effectively |
| **difficulty-tuner** | Beginner's luck requires difficulty adjustment |
| **ui-transitions** | Smooth transitions during FTUE flow |
| **analytics-integration** | FTUE funnel tracking is critical |
