# Onboarding Architect - API Reference

## Critical Timing Targets

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

## D1 Retention Correlation

| FTUE Element | D1 Impact | Priority |
|--------------|-----------|----------|
| Time to first action | -2% per 5 seconds delay | Critical |
| Tutorial completion rate | +0.5% per 1% completion | High |
| First reward timing | -3% if > 3 minutes | Critical |
| Beginner's luck (first win) | +5-8% if guaranteed | High |
| Text walls in tutorial | -1% per 50 words | Medium |
| Forced waiting | -4% per 30 seconds | Critical |

## First Session Blueprint

| Phase | Time | Focus | Required Milestones |
|-------|------|-------|---------------------|
| Hook | 0-30s | Visual hook + first tap | first_tap, first_feedback |
| Core Loop | 30-90s | Teach primary mechanic | core_action_1, core_action_2, core_action_3 |
| First Reward | 90-120s | Celebratory reward | reward_shown, reward_claimed |
| Mechanic Layer | 2-4 min | Secondary mechanic | mechanic_2_intro, mechanic_combo |
| First Challenge | 4-6 min | Slight difficulty | challenge_start, challenge_complete |
| Meta Peek | 6-8 min | Show progression | progression_shown, first_upgrade |
| Session End | 8-10 min | Summary + tease | session_summary, next_tease |

## Text Budget

| Phase | Maximum Words | Delivery |
|-------|---------------|----------|
| First 30s | 0-10 words | Character speech bubble |
| 30-60s | 10-20 words | Contextual hints |
| 60-90s | 15-25 words | Brief instructions |
| 90-120s | 10-15 words | Reward explanation |
| **Total** | **35-70 words** | Spread across 2 minutes |

## Beginner's Luck Calibration

| Session Stage | Target Success Rate | Difficulty Adjustment |
|---------------|---------------------|----------------------|
| First 3 levels/rounds | 95-100% | Maximum assistance |
| Levels 4-7 | 85-90% | Light assistance |
| Levels 8-15 | 70-80% | Normal difficulty |
| Levels 16+ | 50-65% | Full difficulty |

## Progressive Disclosure Sequence

| Layer | Time | Mechanics |
|-------|------|-----------|
| Layer 1 | 0-2 min | Core input (tap, swipe, hold) |
| Layer 2 | 2-4 min | Core objective (collect, destroy, match) |
| Layer 3 | 4-6 min | Fail state (what to avoid) |
| Layer 4 | 6-10 min | Power-ups/abilities |
| Layer 5 | 10-15 min | Secondary currency/resource |
| Layer 6 | 15-30 min | Social features |
| Layer 7 | 30+ min | Advanced mechanics, meta-game |

## Feature Gate Milestones

| Feature | Unlock After | Reason |
|---------|--------------|--------|
| Settings menu | Session 1 | Prevent early friction |
| Shop | Level 3 | Establish value first |
| Social features | Level 5 | Personal investment first |
| Leaderboards | Level 10 | Build confidence first |
| Guilds/clans | Level 15 | Committed players only |
| Advanced modes | Level 20+ | Mastery of basics |

## Aha Moment Patterns by Genre

| Genre | Aha Moment | Target Time |
|-------|------------|-------------|
| Puzzle | "I solved a pattern I thought was impossible" | 3-5 minutes |
| Action | "I defeated an enemy that seemed tough" | 2-4 minutes |
| Strategy | "My plan worked better than expected" | 5-8 minutes |
| Casual | "This is relaxing and satisfying" | 1-2 minutes |
| RPG | "My character feels more powerful" | 5-10 minutes |
| Roguelike | "I discovered a powerful combo" | 10-15 minutes |

## Funnel Analysis Targets

| Transition | Healthy Rate | Alert Threshold |
|------------|--------------|-----------------|
| Start - First tap | 98%+ | <95% |
| First tap - Step 2 | 95%+ | <90% |
| Each step - Next | 90%+ | <85% |
| Tutorial - First reward | 85%+ | <75% |
| First reward - Session complete | 80%+ | <70% |
| Session complete - Return (D1) | 45%+ | <35% |

## Analytics Events

| Event | When | Required Data |
|-------|------|---------------|
| `ftue_start` | First app launch | device_type, os_version |
| `ftue_first_tap` | First player input | time_to_tap, prompted |
| `ftue_step_complete` | Each tutorial step | step_id, time_spent, hints_shown |
| `ftue_first_reward` | First reward claimed | reward_type, time_to_reward |
| `ftue_aha_moment` | Aha moment triggered | moment_type, time_to_aha |
| `ftue_complete` | Tutorial finished | total_time, steps_skipped |
| `ftue_skip` | Tutorial skipped | skip_point, reason |
| `ftue_abandon` | App closed during FTUE | last_step, time_in_step |

## Hint Escalation Timing

| Idle Duration | Hint Level | Display |
|---------------|------------|---------|
| 0-3 seconds | 0 | No hint (normal thinking time) |
| 3-5 seconds | 1 | Subtle glow on target |
| 5-8 seconds | 2 | Animated finger indicator |
| 8-12 seconds | 3 | Text hint in speech bubble |
| 12+ seconds | 4 | Auto-demo of action |

## Difficulty Adjustment Multipliers

| Level Range | Enemy HP | Enemy Damage | Player Damage | Drop Rate | Hint Frequency |
|-------------|----------|--------------|---------------|-----------|----------------|
| 1-3 | 0.6x | 0.5x | 1.5x | 2.0x | Aggressive (2s) |
| 4-7 | 0.8x | 0.7x | 1.2x | 1.5x | Standard (5s) |
| 8-15 | 0.9x | 0.85x | 1.1x | 1.2x | Minimal (10s) |
| 16+ | 1.0x | 1.0x | 1.0x | 1.0x | None |
