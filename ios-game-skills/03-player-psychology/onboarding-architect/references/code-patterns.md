# Onboarding Architect - Code Patterns

## TutorialStepManager

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

        hintTimer = Timer.scheduledTimer(
            withTimeInterval: step.hintDelay,
            repeats: true
        ) { [weak self] _ in
            self?.escalateHint()
        }

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

        analytics.track("ftue_step_complete", properties: [
            "step_id": step.id,
            "time_spent": timeSpent,
            "hints_shown": hintsShownThisStep,
            "attempts": attemptsThisStep,
            "auto_completed": wasAutoCompleted
        ])

        currentStepIndex += 1
        advanceToStep(index: currentStepIndex)
    }

    private func escalateHint() {
        hintLevel = min(hintLevel + 1, 4)
        hintsShownThisStep += 1
        // Hint levels: 0=None, 1=Glow, 2=Finger, 3=Text, 4=Demo
    }

    private func completeTutorial() {
        isComplete = true
        analytics.track("ftue_complete", properties: ["total_steps": steps.count])
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
        case (.any, _), (_, .any): return true
        case let (.tap(p), .tap(r)): return p == r
        case let (.swipe(p), .swipe(r)): return p == r
        case let (.hold(pId, pDur), .hold(rId, rDur)): return pId == rId && pDur >= rDur
        case let (.drag(pFrom, pTo), .drag(rFrom, rTo)): return pFrom == rFrom && pTo == rTo
        default: return false
        }
    }
}

protocol AnalyticsTracker {
    func track(_ event: String, properties: [String: Any])
}
```

## ProgressiveDisclosureManager

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

    private var featureGates: [FeatureGate] = []
    private var unlockedFeatures: Set<String> = []
    private var announcedFeatures: Set<String> = []

    init() {
        setupDefaultGates()
        loadState()
    }

    private func setupDefaultGates() {
        featureGates = [
            FeatureGate(featureId: "settings", unlockCondition: .tutorialComplete, announcementType: .none),
            FeatureGate(featureId: "shop", unlockCondition: .level(3), announcementType: .prominent),
            FeatureGate(featureId: "daily_rewards", unlockCondition: .sessionCount(2), announcementType: .standard),
            FeatureGate(featureId: "social", unlockCondition: .level(5), announcementType: .prominent),
            FeatureGate(featureId: "leaderboards", unlockCondition: .level(10), announcementType: .standard),
            FeatureGate(featureId: "guilds", unlockCondition: .level(15), announcementType: .prominent),
            FeatureGate(featureId: "advanced_mode", unlockCondition: .level(20), announcementType: .prominent)
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
            case .level(let required): shouldUnlock = currentLevel >= required
            case .sessionCount(let required): shouldUnlock = sessionCount >= required
            case .achievementUnlocked(let achievementId): shouldUnlock = unlockedAchievements.contains(achievementId)
            case .tutorialComplete: shouldUnlock = tutorialComplete
            case .timeInGame(let required): shouldUnlock = totalTimeInGame >= required
            case .customCondition(let check): shouldUnlock = check()
            }

            if shouldUnlock {
                unlockedFeatures.insert(gate.featureId)
                newlyUnlocked.append(gate)
            }
        }

        if !newlyUnlocked.isEmpty { saveState() }
        return newlyUnlocked
    }

    func markAsAnnounced(_ featureId: String) {
        announcedFeatures.insert(featureId)
        saveState()
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

## FirstSessionCoordinator

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
        case postSession
    }

    struct PhaseConfig {
        let phase: SessionPhase
        let targetDuration: TimeInterval
        let maxDuration: TimeInterval
        let requiredMilestones: [String]
    }

    @Published var currentPhase: SessionPhase = .hook
    @Published var sessionComplete: Bool = false

    private var phaseStartTime: Date?
    private var sessionStartTime: Date?
    private var completedMilestones: Set<String> = []
    private var analytics: AnalyticsTracker

    private let phaseConfigs: [PhaseConfig] = [
        PhaseConfig(phase: .hook, targetDuration: 30, maxDuration: 45, requiredMilestones: ["first_tap", "first_feedback"]),
        PhaseConfig(phase: .coreLoop, targetDuration: 60, maxDuration: 90, requiredMilestones: ["core_action_1", "core_action_2", "core_action_3"]),
        PhaseConfig(phase: .firstReward, targetDuration: 30, maxDuration: 45, requiredMilestones: ["reward_shown", "reward_claimed"]),
        PhaseConfig(phase: .mechanicLayer, targetDuration: 120, maxDuration: 180, requiredMilestones: ["mechanic_2_intro", "mechanic_combo"]),
        PhaseConfig(phase: .firstChallenge, targetDuration: 120, maxDuration: 180, requiredMilestones: ["challenge_start", "challenge_complete"]),
        PhaseConfig(phase: .metaPeek, targetDuration: 120, maxDuration: 150, requiredMilestones: ["progression_shown", "first_upgrade"]),
        PhaseConfig(phase: .sessionEnd, targetDuration: 60, maxDuration: 120, requiredMilestones: ["session_summary", "next_tease"])
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

    private func checkPhaseCompletion() {
        guard let config = phaseConfigs.first(where: { $0.phase == currentPhase }) else { return }
        let allMilestonesComplete = config.requiredMilestones.allSatisfy { completedMilestones.contains($0) }
        if allMilestonesComplete {
            if let nextPhase = nextPhase(after: currentPhase) {
                transitionToPhase(nextPhase)
            } else {
                completeSession()
            }
        }
    }

    private func transitionToPhase(_ phase: SessionPhase) {
        currentPhase = phase
        phaseStartTime = Date()
        analytics.track("ftue_phase_start", properties: ["phase": String(describing: phase)])
    }

    private func completeSession() {
        sessionComplete = true
        currentPhase = .postSession
        analytics.track("ftue_session_complete", properties: [
            "total_duration": sessionElapsedTime(),
            "milestones_completed": completedMilestones.count
        ])
    }

    private func sessionElapsedTime() -> TimeInterval {
        guard let start = sessionStartTime else { return 0 }
        return Date().timeIntervalSince(start)
    }

    private func nextPhase(after phase: SessionPhase) -> SessionPhase? {
        switch phase {
        case .hook: return .coreLoop
        case .coreLoop: return .firstReward
        case .firstReward: return .mechanicLayer
        case .mechanicLayer: return .firstChallenge
        case .firstChallenge: return .metaPeek
        case .metaPeek: return .sessionEnd
        case .sessionEnd, .postSession: return nil
        }
    }
}
```

## BeginnersLuckSystem

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
            case aggressive // 2s idle
            case standard   // 5s idle
            case minimal    // 10s idle
            case none
        }
    }

    private var currentLevel: Int = 1
    private var consecutiveWins: Int = 0
    private var consecutiveLosses: Int = 0
    private var totalAttempts: Int = 0

    func getAdjustment(forLevel level: Int) -> DifficultyAdjustment {
        switch level {
        case 1...3:
            return DifficultyAdjustment(successRateTarget: 0.95, enemyHealthMultiplier: 0.6, enemyDamageMultiplier: 0.5, playerDamageMultiplier: 1.5, dropRateMultiplier: 2.0, hintFrequency: .aggressive)
        case 4...7:
            return DifficultyAdjustment(successRateTarget: 0.85, enemyHealthMultiplier: 0.8, enemyDamageMultiplier: 0.7, playerDamageMultiplier: 1.2, dropRateMultiplier: 1.5, hintFrequency: .standard)
        case 8...15:
            return DifficultyAdjustment(successRateTarget: 0.75, enemyHealthMultiplier: 0.9, enemyDamageMultiplier: 0.85, playerDamageMultiplier: 1.1, dropRateMultiplier: 1.2, hintFrequency: .minimal)
        default:
            return DifficultyAdjustment(successRateTarget: 0.60, enemyHealthMultiplier: 1.0, enemyDamageMultiplier: 1.0, playerDamageMultiplier: 1.0, dropRateMultiplier: 1.0, hintFrequency: .none)
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
        if consecutiveLosses >= 3 { return 0.8 }
        else if consecutiveLosses >= 2 { return 0.9 }
        else if consecutiveWins >= 5 && currentLevel > 10 { return 1.1 }
        return 1.0
    }

    func shouldGuaranteeSuccess(level: Int) -> Bool {
        if level <= 2 && totalAttempts <= 3 { return true }
        if consecutiveLosses >= 3 { return true }
        return false
    }
}
```

## FTUEAnalyticsTracker

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
        trackStep("ftue_first_tap", properties: ["time_to_tap": timeToTap, "was_prompted": wasPrompted])
    }

    func trackStepComplete(stepId: String, timeSpent: TimeInterval, hintsShown: Int) {
        trackStep("ftue_step_complete", properties: ["step_id": stepId, "time_spent": timeSpent, "hints_shown": hintsShown])
    }

    func trackFirstReward(rewardType: String, timeToReward: TimeInterval) {
        trackStep("ftue_first_reward", properties: ["reward_type": rewardType, "time_to_reward": timeToReward])
    }

    func trackAhaMoment(momentType: String) {
        guard let start = sessionStartTime else { return }
        trackStep("ftue_aha_moment", properties: ["moment_type": momentType, "time_to_aha": Date().timeIntervalSince(start)])
    }

    func trackComplete(totalSteps: Int, stepsSkipped: Int) {
        guard let start = sessionStartTime else { return }
        trackStep("ftue_complete", properties: [
            "total_time": Date().timeIntervalSince(start),
            "total_steps": totalSteps,
            "steps_skipped": stepsSkipped,
            "completion_rate": Double(totalSteps - stepsSkipped) / Double(totalSteps)
        ])
    }

    func trackSkip(skipPoint: String, reason: String) {
        trackStep("ftue_skip", properties: ["skip_point": skipPoint, "reason": reason])
    }

    func trackAbandon(lastStep: String) {
        guard let stepStart = lastStepTime else { return }
        trackStep("ftue_abandon", properties: ["last_step": lastStep, "time_in_step": Date().timeIntervalSince(stepStart)])
    }

    private func trackStep(_ stepId: String, properties: [String: Any]) {
        let now = Date()
        let timeFromPrevious = lastStepTime.map { now.timeIntervalSince($0) } ?? 0
        funnelSteps.append(FunnelStep(stepId: stepId, timestamp: now, timeFromPrevious: timeFromPrevious, properties: properties))
        lastStepTime = now
        sendToBackend(event: stepId, properties: properties)
    }

    private func sendToBackend(event: String, properties: [String: Any]) {
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
}
```
