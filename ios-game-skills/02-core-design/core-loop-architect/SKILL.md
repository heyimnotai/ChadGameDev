---
name: core-loop-architect
description: Design compelling, proven core gameplay loops for iOS games. Use this skill when creating the fundamental ACTION -> FEEDBACK -> REWARD -> PROGRESSION cycle for any game genre. Triggers when designing the primary repeatable gameplay experience, defining what players do moment-to-moment, or architecting the core engagement pattern that drives player investment. Covers hyper-casual, puzzle, roguelike, idle, strategy, and card game patterns.
---

# Core Loop Architect

## Purpose

This skill enables the design of genre-appropriate core gameplay loops that create compelling, repeatable engagement patterns. It enforces the quality bar of top-grossing App Store games by providing exact timing specifications, proven loop structures, and engagement hooks that have been validated across billions of play sessions. A properly architected core loop is the foundation upon which all retention, monetization, and progression systems are built.

## Domain Boundaries

- **This skill handles**: Core gameplay loop structure, action-feedback-reward cycles, loop timing by genre, engagement hooks within loops, complexity decisions, genre-to-pattern mapping
- **This skill does NOT handle**: Progression mathematics (see `progression-system`), economy balancing (see `economy-balancer`), difficulty curves (see `difficulty-tuner`), session length optimization (see `session-designer`), meta-game systems, monetization strategy

## Core Specifications

### Universal Loop Structure

Every game loop follows this pattern with genre-specific implementations:

```
ACTION -> FEEDBACK -> REWARD -> PROGRESSION -> REPEAT
```

| Phase | Definition | Timing Target |
|-------|------------|---------------|
| ACTION | Player input or decision | Immediate response required |
| FEEDBACK | Visual/audio/haptic response | Within 16ms (1 frame at 60fps) |
| REWARD | Tangible player benefit | Within 5 seconds of action |
| PROGRESSION | Sense of forward movement | Within 30-120 seconds |

### Genre-Specific Loop Patterns

#### Hyper-Casual (Crossy Road, Flappy Bird)

```
PATTERN: Play -> Score -> Retry
SESSION: 30 seconds - 2 minutes
LOOP_FREQUENCY: 1-5 seconds per micro-loop
MONETIZATION: Rewarded ads, cosmetics only
COMPLEXITY: Minimal - single mechanic mastery
```

**Loop Breakdown:**
1. Single-tap or swipe action (0ms - 100ms)
2. Immediate visual/audio feedback (5ms - 16ms)
3. Score increment or near-miss feedback (instant)
4. Death -> Score display -> Retry prompt (1-3 seconds)
5. Optional: Watch ad for revive/bonus (15-30 seconds)

**Engagement Hooks:**
- High score chase (personal best visible)
- Near-miss feedback ("Almost!" visual cues)
- Instant restart (< 500ms to retry)
- Session-end leaderboard comparison

#### Puzzle/Match-3 (Candy Crush)

```
PATTERN: Attempt Level -> Win/Lose -> Collect Rewards -> Unlock Next
SESSION: 3-5 minutes per level
LOOP_FREQUENCY: 2-4 seconds per move
MONETIZATION: Lives, boosters, continues
COMPLEXITY: Medium - pattern recognition + strategic planning
```

**Loop Breakdown:**
1. Survey board state (1-3 seconds)
2. Execute match action (< 500ms)
3. Chain reaction feedback with escalating sounds (500ms - 3 seconds)
4. Score accumulation animation (200ms per increment)
5. Level complete or fail state (2-5 seconds ceremony)
6. Reward collection or retry decision (3-5 seconds)

**Engagement Hooks:**
- Star rating system (1-3 stars motivates replay)
- Cascade combos (unpredictable big wins)
- Near-miss level design (1 move from winning)
- Limited moves creating urgency

#### Roguelike (Vampire Survivors)

```
PATTERN: Kill -> Collect XP -> Level Up -> Choose Upgrade -> Repeat
SESSION: 15-30 minutes per run
LOOP_FREQUENCY: 0.5-2 seconds per kill/reward
MONETIZATION: Character unlocks, cosmetics
COMPLEXITY: High - build optimization + real-time action
```

**Loop Breakdown:**
1. Move to avoid enemies (continuous input)
2. Automatic attacks trigger (0.5-2 second intervals)
3. Enemies die, XP gems spawn (instant feedback)
4. XP collection (magnetize within 100px)
5. Level up triggers upgrade selection (every 30-60 seconds)
6. Power fantasy escalates (screen-filling destruction)

**Engagement Hooks:**
- Rapid reward frequency (constant dopamine)
- Power fantasy escalation (becoming overpowered)
- Build discovery (synergy between upgrades)
- Run-based meta-progression (permanent unlocks)

#### Idle/Incremental (Cookie Clicker)

```
PATTERN: Wait -> Collect -> Upgrade -> Wait (faster)
SESSION: Brief check-ins (30 seconds - 2 minutes active)
LOOP_FREQUENCY: Passive with punctuated decisions
MONETIZATION: Time acceleration, premium currencies
COMPLEXITY: Low active, High strategic depth
```

**Loop Breakdown:**
1. Open app, see accumulated resources (instant gratification)
2. Collect offline earnings (satisfying number animation)
3. Evaluate upgrade options (10-30 seconds)
4. Purchase upgrades (immediate production increase)
5. Set new production running (close app)
6. Push notification when milestone reached (2-8 hours)

**Engagement Hooks:**
- Offline progression (always growing)
- Exponential number growth (psychological satisfaction)
- Prestige systems (reset for multiplier)
- Limited-time events (check-in pressure)

#### Strategy/Base Builder (Clash of Clans)

```
PATTERN: Collect Resources -> Build/Upgrade -> Battle -> Repeat
SESSION: 30 seconds (collection) to 5 minutes (battle)
LOOP_FREQUENCY: Multiple loops per session
MONETIZATION: Time acceleration (gems), resource packs
COMPLEXITY: High - base layout + troop composition + timing
```

**Triple Loop Design:**
- **Loop 1** (Short-term): Resource collection, 30-second check-ins
- **Loop 2** (Mid-term): Building upgrades, 1-24 hour timers
- **Loop 3** (Long-term): Clan wars, weekly cycles

**Engagement Hooks:**
- Timer-based anticipation
- Defensive base design (creativity)
- Social pressure (clan donations/wars)
- Competitive rankings

#### Card Game (Marvel Snap, Clash Royale)

```
PATTERN: Build Deck -> Battle -> Earn Rewards -> Collect Cards
SESSION: 3-4 minutes (Clash Royale), 2-3 minutes (Marvel Snap)
LOOP_FREQUENCY: 1-5 seconds per play
MONETIZATION: Card packs, battle pass, cosmetics
COMPLEXITY: High - deck building + real-time decisions
```

**Loop Breakdown (Clash Royale):**
1. Deploy troop/spell (instant decision, < 500ms)
2. Watch battle unfold (anticipation, 2-5 seconds)
3. Counter opponent's play (reactive decision)
4. Match resolution (60-180 seconds total)
5. Chest reward + timer start (5 seconds)
6. Open chests -> new cards (15-30 seconds ceremony)

**Engagement Hooks:**
- Collection meta-game
- Deck experimentation
- Ranked ladder progression
- Short matches enable "one more game"

### Loop Timing Specifications

| Genre | Micro-Loop | Macro-Loop | Session Length | Loops/Session |
|-------|------------|------------|----------------|---------------|
| Hyper-Casual | 1-5s | 30s-2min | 2-5 minutes | 5-15 |
| Puzzle | 2-4s | 3-5min | 10-20 minutes | 3-6 |
| Roguelike | 0.5-2s | 15-30min | 20-40 minutes | 1-2 |
| Idle | N/A (passive) | 2-8hr | 30s-2min active | 3-8/day |
| Strategy | 5-30s | 5min-24hr | 5-30 minutes | 2-4 |
| Card | 1-5s | 2-4min | 10-30 minutes | 3-10 |

### Engagement Hook Timing

| Hook Type | Optimal Timing | Purpose |
|-----------|----------------|---------|
| First Win | < 30 seconds | Competence validation |
| First Reward | < 2 minutes | Investment seeding |
| First Choice | < 60 seconds | Agency establishment |
| First Power Increase | < 3 minutes | Progression preview |
| First Social Hook | 5-15 minutes | Retention anchor |

## Implementation Patterns

### Swift Core Loop Manager

```swift
import Foundation

/// Core loop phase enumeration
enum LoopPhase: CaseIterable {
    case action
    case feedback
    case reward
    case progression
}

/// Protocol for genre-specific loop implementations
protocol CoreLoopProtocol {
    var currentPhase: LoopPhase { get }
    var microLoopDuration: TimeInterval { get }
    var macroLoopDuration: TimeInterval { get }

    func executeAction(_ input: PlayerInput) -> ActionResult
    func provideFeedback(_ result: ActionResult)
    func grantReward(_ result: ActionResult) -> Reward
    func updateProgression(_ reward: Reward)
}

/// Generic core loop manager
final class CoreLoopManager<T: CoreLoopProtocol> {
    private var loopImplementation: T
    private var loopsCompleted: Int = 0
    private var sessionStartTime: Date?

    private let feedbackDeadline: TimeInterval = 0.016 // 16ms (1 frame at 60fps)
    private let rewardDeadline: TimeInterval = 5.0 // 5 seconds max

    init(implementation: T) {
        self.loopImplementation = implementation
    }

    func startSession() {
        sessionStartTime = Date()
        loopsCompleted = 0
    }

    func processInput(_ input: PlayerInput) {
        let actionStart = CACurrentMediaTime()

        // Phase 1: Action
        let result = loopImplementation.executeAction(input)

        // Phase 2: Feedback (must complete within 16ms)
        let feedbackStart = CACurrentMediaTime()
        loopImplementation.provideFeedback(result)
        let feedbackDuration = CACurrentMediaTime() - feedbackStart

        if feedbackDuration > feedbackDeadline {
            print("Warning: Feedback exceeded \(feedbackDeadline * 1000)ms deadline")
        }

        // Phase 3: Reward (must complete within 5 seconds of action)
        let reward = loopImplementation.grantReward(result)
        let rewardTime = CACurrentMediaTime() - actionStart

        if rewardTime > rewardDeadline {
            print("Warning: Reward exceeded \(rewardDeadline)s deadline")
        }

        // Phase 4: Progression
        loopImplementation.updateProgression(reward)
        loopsCompleted += 1
    }

    func getSessionMetrics() -> LoopMetrics {
        guard let start = sessionStartTime else {
            return LoopMetrics(duration: 0, loopsCompleted: 0, avgLoopTime: 0)
        }

        let duration = Date().timeIntervalSince(start)
        let avgLoopTime = loopsCompleted > 0 ? duration / Double(loopsCompleted) : 0

        return LoopMetrics(
            duration: duration,
            loopsCompleted: loopsCompleted,
            avgLoopTime: avgLoopTime
        )
    }
}

struct LoopMetrics {
    let duration: TimeInterval
    let loopsCompleted: Int
    let avgLoopTime: TimeInterval
}

struct PlayerInput {
    let type: InputType
    let position: CGPoint?
    let timestamp: TimeInterval

    enum InputType {
        case tap
        case swipe(direction: Direction)
        case hold(duration: TimeInterval)
        case release
    }

    enum Direction {
        case up, down, left, right
    }
}

struct ActionResult {
    let success: Bool
    let magnitude: Float // 0.0 to 1.0
    let combo: Int
    let triggerReward: Bool
}

struct Reward {
    let type: RewardType
    let amount: Int
    let rarity: Rarity

    enum RewardType {
        case currency
        case experience
        case item
        case powerUp
    }

    enum Rarity {
        case common
        case uncommon
        case rare
        case epic
        case legendary
    }
}
```

### Hyper-Casual Loop Implementation

```swift
final class HyperCasualLoop: CoreLoopProtocol {
    var currentPhase: LoopPhase = .action

    // Genre-specific timing
    let microLoopDuration: TimeInterval = 2.0 // 2 seconds per attempt
    let macroLoopDuration: TimeInterval = 60.0 // 1 minute session

    private var score: Int = 0
    private var highScore: Int = 0
    private var nearMissCount: Int = 0

    func executeAction(_ input: PlayerInput) -> ActionResult {
        // Single-tap mechanic
        guard case .tap = input.type else {
            return ActionResult(success: false, magnitude: 0, combo: 0, triggerReward: false)
        }

        let success = evaluateTapTiming()
        let magnitude = calculateMagnitude()

        return ActionResult(
            success: success,
            magnitude: magnitude,
            combo: success ? 1 : 0,
            triggerReward: success
        )
    }

    func provideFeedback(_ result: ActionResult) {
        if result.success {
            // Success feedback: scale up, particle burst, sound
            triggerSuccessFeedback(magnitude: result.magnitude)
        } else {
            // Near-miss or failure
            if result.magnitude > 0.7 {
                nearMissCount += 1
                triggerNearMissFeedback()
            } else {
                triggerFailureFeedback()
            }
        }
    }

    func grantReward(_ result: ActionResult) -> Reward {
        guard result.triggerReward else {
            return Reward(type: .experience, amount: 0, rarity: .common)
        }

        let points = Int(10.0 * result.magnitude)
        score += points

        return Reward(
            type: .currency,
            amount: points,
            rarity: result.magnitude > 0.9 ? .rare : .common
        )
    }

    func updateProgression(_ reward: Reward) {
        if score > highScore {
            highScore = score
            triggerNewHighScoreAnimation()
        }
    }

    // Helper methods
    private func evaluateTapTiming() -> Bool {
        // Implementation depends on specific game mechanics
        return true
    }

    private func calculateMagnitude() -> Float {
        // 0.0 (miss) to 1.0 (perfect)
        return Float.random(in: 0.5...1.0)
    }

    private func triggerSuccessFeedback(magnitude: Float) {
        // Haptic: light impact
        // Sound: success chirp
        // Visual: scale up 1.0 -> 1.2 -> 1.0 over 150ms
    }

    private func triggerNearMissFeedback() {
        // Visual: "Almost!" text flash
        // Sound: whoosh sound
        // Slight screen shake
    }

    private func triggerFailureFeedback() {
        // Haptic: error notification
        // Sound: failure thud
        // Visual: screen flash red
    }

    private func triggerNewHighScoreAnimation() {
        // Confetti particles
        // "New High Score!" banner
        // Haptic: success notification
    }
}
```

### Roguelike Loop Implementation

```swift
final class RoguelikeLoop: CoreLoopProtocol {
    var currentPhase: LoopPhase = .action

    let microLoopDuration: TimeInterval = 1.0 // Kill every 1 second average
    let macroLoopDuration: TimeInterval = 1200.0 // 20 minute run

    private var currentXP: Int = 0
    private var level: Int = 1
    private var xpToNextLevel: Int = 10

    // XP curve: exponential growth
    private let xpBase: Int = 10
    private let xpMultiplier: Float = 1.15

    private var killCount: Int = 0
    private var upgradesChosen: [Upgrade] = []

    func executeAction(_ input: PlayerInput) -> ActionResult {
        // Automatic attacks - player only controls movement
        // This is called when an enemy is hit by auto-attack

        killCount += 1
        let isElite = killCount % 50 == 0

        return ActionResult(
            success: true,
            magnitude: isElite ? 1.0 : 0.3,
            combo: killCount,
            triggerReward: true
        )
    }

    func provideFeedback(_ result: ActionResult) {
        // Hit stop: 33ms for normal, 100ms for elite
        let hitStopDuration = result.magnitude > 0.5 ? 0.1 : 0.033
        applyHitStop(duration: hitStopDuration)

        // Damage numbers
        spawnDamageNumber(magnitude: result.magnitude)

        // Death particles
        spawnDeathParticles(count: Int(10 * result.magnitude))

        // Screen shake for elites
        if result.magnitude > 0.5 {
            applyScreenShake(trauma: 0.3)
        }
    }

    func grantReward(_ result: ActionResult) -> Reward {
        let xpGain = result.magnitude > 0.5 ? 5 : 1
        currentXP += xpGain

        // Spawn XP gem with magnetize behavior
        spawnXPGem(value: xpGain, magnetizeRadius: 100)

        return Reward(
            type: .experience,
            amount: xpGain,
            rarity: result.magnitude > 0.5 ? .rare : .common
        )
    }

    func updateProgression(_ reward: Reward) {
        if currentXP >= xpToNextLevel {
            levelUp()
        }
    }

    private func levelUp() {
        level += 1
        currentXP -= xpToNextLevel
        xpToNextLevel = calculateXPForLevel(level + 1)

        // Pause game, show upgrade selection
        presentUpgradeSelection(count: 3)
    }

    private func calculateXPForLevel(_ level: Int) -> Int {
        return Int(Float(xpBase) * pow(xpMultiplier, Float(level - 1)))
    }

    private func presentUpgradeSelection(count: Int) {
        // Generate random upgrades based on current build
        // Player selects one, game resumes
    }

    // Stub methods for feedback systems
    private func applyHitStop(duration: TimeInterval) {}
    private func spawnDamageNumber(magnitude: Float) {}
    private func spawnDeathParticles(count: Int) {}
    private func applyScreenShake(trauma: Float) {}
    private func spawnXPGem(value: Int, magnetizeRadius: CGFloat) {}
}

struct Upgrade {
    let id: String
    let name: String
    let description: String
    let rarity: Reward.Rarity
}
```

## Decision Trees

### Genre -> Loop Pattern Selection

```
START: What is the target session length?

[< 2 minutes]
    -> Does success require skill?
        [Yes] -> HYPER-CASUAL (Flappy Bird pattern)
        [No]  -> IDLE quick check-in variant

[2-10 minutes]
    -> Is gameplay turn-based or level-based?
        [Yes] -> PUZZLE/MATCH-3 (Candy Crush pattern)
        [No]  -> CARD GAME (Marvel Snap pattern)

[10-30 minutes]
    -> Does the game have permanent death?
        [Yes] -> ROGUELIKE (Vampire Survivors pattern)
        [No]  -> Is there base building?
            [Yes] -> STRATEGY (Clash of Clans pattern)
            [No]  -> RPG variant (hybrid loops)

[Passive/Check-in]
    -> Primary engagement is waiting for numbers to grow?
        [Yes] -> IDLE (Cookie Clicker pattern)
        [No]  -> STRATEGY timer-based variant
```

### Complexity Decision Matrix

```
When to ADD complexity to core loop:

[ADD] Player has mastered current mechanics (completion rate > 90%)
[ADD] D7 retention dropping while D1 is healthy
[ADD] Session length shorter than genre target
[ADD] Players requesting more depth (reviews, feedback)

When to KEEP loop simple:

[KEEP] Targeting hyper-casual audience
[KEEP] D1 retention below 35%
[KEEP] Average session achieving target length
[KEEP] Monetization dependent on session count, not depth
[KEEP] Player skill variance is very high

Complexity addition sequence:
1. Master single mechanic first
2. Add strategic choice (upgrade selection)
3. Add meta-progression (persistent unlocks)
4. Add social layer (leaderboards, sharing)
5. Add collection system (cards, characters)
6. Add competitive mode (ranked, tournaments)
```

### Feedback Priority Order

```
For any action, feedback should layer in this order:

1. HAPTIC (5ms) - Immediate physical confirmation
   - Light: tap, collect
   - Medium: hit, build
   - Heavy: explosion, death

2. VISUAL (16ms) - Frame-synced visual response
   - Scale pulse on interacted object
   - Color shift or flash
   - Particle emission start

3. AUDIO (20ms) - Sound effect trigger
   - Attack/action sound
   - Impact/result sound
   - UI feedback sound

4. SECONDARY VISUAL (50-200ms) - Extended animation
   - Damage numbers
   - Status changes
   - Chain reactions

5. UI UPDATE (200-1000ms) - Score/resource counters
   - Animated number increment
   - Progress bar fill
   - Notification banners
```

## Quality Checklist

### Core Loop Completeness
- [ ] ACTION phase responds to input within 16ms
- [ ] FEEDBACK phase includes haptic, visual, AND audio
- [ ] REWARD phase delivers tangible benefit within 5 seconds
- [ ] PROGRESSION phase shows forward movement within 2 minutes
- [ ] Loop completion time matches genre specification

### Engagement Hooks
- [ ] First success achievable within 30 seconds
- [ ] First meaningful reward within 2 minutes
- [ ] Near-miss feedback implemented for failure states
- [ ] High score or progression visibility at all times
- [ ] Instant restart capability (< 500ms)

### Timing Validation
- [ ] Micro-loop duration within genre range
- [ ] Session length achievable and satisfying
- [ ] No dead time > 3 seconds without feedback
- [ ] Loading screens < 2 seconds or have engagement

### Retention Foundation
- [ ] Loop motivates "one more try" behavior
- [ ] Variance in outcomes prevents monotony
- [ ] Mastery curve visible to player
- [ ] Social hooks integrated (where appropriate)

## Anti-Patterns

### Anti-Pattern: Front-Loading Complexity

**Wrong:**
```
Tutorial teaches 5 mechanics in first 10 minutes
Player overwhelmed before experiencing core fun
D1 retention: 15-20%
```

**Right:**
```
Tutorial introduces 1 mechanic
Player masters it through play
New mechanics introduced every 5-10 levels
D1 retention: 40-50%
```

**Consequence:** Players churn before finding the fun. Candy Crush introduces boosters over 35 levels, not 5.

### Anti-Pattern: Delayed Reward

**Wrong:**
```swift
// First reward after 5 minutes of tutorial
func completeFullTutorial() {
    showRewardScreen() // Too late
}
```

**Right:**
```swift
// Reward within 30 seconds
func completeFirstAction() {
    grantInstantReward()
    showRewardAnimation() // "You got 10 coins!"
}
```

**Consequence:** Players don't feel investment. First reward must come within 2 minutes maximum.

### Anti-Pattern: Monotonous Loop

**Wrong:**
```
Every enemy drops same reward
Every level same difficulty
Every session identical experience
```

**Right:**
```
Variable reward rarity (common 70%, rare 25%, epic 5%)
Difficulty variance (hard level, then 5 easy levels)
Daily special events and challenges
```

**Consequence:** Predictability kills engagement. Variable ratio reinforcement produces highest response rates.

### Anti-Pattern: No Near-Miss Feedback

**Wrong:**
```
Success: +100 points
Failure: Game Over screen
```

**Right:**
```
Perfect hit: +100 points + "PERFECT!" + particles
Good hit: +75 points + "GREAT!"
Almost: +25 points + "Almost!"
Failure: "SO CLOSE!" + ghost showing correct position
```

**Consequence:** Failures feel punishing rather than motivating. Near-misses trigger dopamine similar to winning.

### Anti-Pattern: Slow Restart

**Wrong:**
```
Death -> 2 second death animation
       -> 1 second fade to black
       -> 3 second loading screen
       -> 2 second countdown
       = 8 seconds to retry
```

**Right:**
```
Death -> 0.5 second death animation
       -> 0.3 second transition
       -> Instant gameplay resume
       = 0.8 seconds to retry
```

**Consequence:** Friction breaks flow state. Flappy Bird's instant restart enabled its viral success.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `progression-system` | Designs the XP curves and unlock pacing that fuel the PROGRESSION phase |
| `economy-balancer` | Defines currency rewards and spending opportunities within the loop |
| `difficulty-tuner` | Calibrates challenge level to maintain flow state through loops |
| `session-designer` | Optimizes how multiple loops combine into satisfying sessions |
| `reward-scheduler` | Fine-tunes reward timing and variable reinforcement schedules |
| `onboarding-architect` | Designs how players learn the core loop through play |
