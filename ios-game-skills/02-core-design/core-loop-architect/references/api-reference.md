# Core Loop Architect - API Reference

## Universal Loop Structure

| Phase | Definition | Timing Target |
|-------|------------|---------------|
| ACTION | Player input or decision | Immediate response required |
| FEEDBACK | Visual/audio/haptic response | Within 16ms (1 frame at 60fps) |
| REWARD | Tangible player benefit | Within 5 seconds of action |
| PROGRESSION | Sense of forward movement | Within 30-120 seconds |

## Genre-Specific Loop Patterns

### Hyper-Casual (Crossy Road, Flappy Bird)
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

### Puzzle/Match-3 (Candy Crush)
```
PATTERN: Attempt Level -> Win/Lose -> Collect Rewards -> Unlock Next
SESSION: 3-5 minutes per level
LOOP_FREQUENCY: 2-4 seconds per move
MONETIZATION: Lives, boosters, continues
COMPLEXITY: Medium - pattern recognition + strategic planning
```

### Roguelike (Vampire Survivors)
```
PATTERN: Kill -> Collect XP -> Level Up -> Choose Upgrade -> Repeat
SESSION: 15-30 minutes per run
LOOP_FREQUENCY: 0.5-2 seconds per kill/reward
MONETIZATION: Character unlocks, cosmetics
COMPLEXITY: High - build optimization + real-time action
```

### Idle/Incremental (Cookie Clicker)
```
PATTERN: Wait -> Collect -> Upgrade -> Wait (faster)
SESSION: Brief check-ins (30 seconds - 2 minutes active)
LOOP_FREQUENCY: Passive with punctuated decisions
MONETIZATION: Time acceleration, premium currencies
COMPLEXITY: Low active, High strategic depth
```

### Strategy/Base Builder (Clash of Clans)
```
PATTERN: Collect Resources -> Build/Upgrade -> Battle -> Repeat
SESSION: 30 seconds (collection) to 5 minutes (battle)
LOOP_FREQUENCY: Multiple loops per session
MONETIZATION: Time acceleration (gems), resource packs
COMPLEXITY: High - base layout + troop composition + timing
```

**Triple Loop Design:**
- Loop 1 (Short-term): Resource collection, 30-second check-ins
- Loop 2 (Mid-term): Building upgrades, 1-24 hour timers
- Loop 3 (Long-term): Clan wars, weekly cycles

### Card Game (Marvel Snap, Clash Royale)
```
PATTERN: Build Deck -> Battle -> Earn Rewards -> Collect Cards
SESSION: 3-4 minutes (Clash Royale), 2-3 minutes (Marvel Snap)
LOOP_FREQUENCY: 1-5 seconds per play
MONETIZATION: Card packs, battle pass, cosmetics
COMPLEXITY: High - deck building + real-time decisions
```

## Loop Timing Specifications

| Genre | Micro-Loop | Macro-Loop | Session Length | Loops/Session |
|-------|------------|------------|----------------|---------------|
| Hyper-Casual | 1-5s | 30s-2min | 2-5 minutes | 5-15 |
| Puzzle | 2-4s | 3-5min | 10-20 minutes | 3-6 |
| Roguelike | 0.5-2s | 15-30min | 20-40 minutes | 1-2 |
| Idle | N/A (passive) | 2-8hr | 30s-2min active | 3-8/day |
| Strategy | 5-30s | 5min-24hr | 5-30 minutes | 2-4 |
| Card | 1-5s | 2-4min | 10-30 minutes | 3-10 |

## Engagement Hook Timing

| Hook Type | Optimal Timing | Purpose |
|-----------|----------------|---------|
| First Win | < 30 seconds | Competence validation |
| First Reward | < 2 minutes | Investment seeding |
| First Choice | < 60 seconds | Agency establishment |
| First Power Increase | < 3 minutes | Progression preview |
| First Social Hook | 5-15 minutes | Retention anchor |

## Feedback Priority Order

For any action, feedback should layer in this order:

1. **HAPTIC (5ms)** - Immediate physical confirmation
   - Light: tap, collect
   - Medium: hit, build
   - Heavy: explosion, death

2. **VISUAL (16ms)** - Frame-synced visual response
   - Scale pulse on interacted object
   - Color shift or flash
   - Particle emission start

3. **AUDIO (20ms)** - Sound effect trigger
   - Attack/action sound
   - Impact/result sound
   - UI feedback sound

4. **SECONDARY VISUAL (50-200ms)** - Extended animation
   - Damage numbers
   - Status changes
   - Chain reactions

5. **UI UPDATE (200-1000ms)** - Score/resource counters
   - Animated number increment
   - Progress bar fill
   - Notification banners

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

**When to ADD complexity:**
- Player has mastered current mechanics (completion rate > 90%)
- D7 retention dropping while D1 is healthy
- Session length shorter than genre target
- Players requesting more depth (reviews, feedback)

**When to KEEP loop simple:**
- Targeting hyper-casual audience
- D1 retention below 35%
- Average session achieving target length
- Monetization dependent on session count, not depth
- Player skill variance is very high

**Complexity addition sequence:**
1. Master single mechanic first
2. Add strategic choice (upgrade selection)
3. Add meta-progression (persistent unlocks)
4. Add social layer (leaderboards, sharing)
5. Add collection system (cards, characters)
6. Add competitive mode (ranked, tournaments)
