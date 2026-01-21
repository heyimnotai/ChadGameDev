---
name: game-center-integration
description: Use when adding social/competitive features using GameKit, implementing leaderboards or achievements, handling player authentication, or configuring Game Center in App Store Connect. Triggers on new game social features, leaderboard implementation, achievement system design, or authentication flow issues.
---

# Game Center Integration

Implement complete Game Center integration for iOS games including authentication, leaderboards, achievements, and Access Point configuration with proper offline handling.

## Decision Tree: Leaderboard Type

```
What kind of competition?
+-- All-time records (highest ever)
|   +-- CLASSIC → Never resets
|   +-- Best for: Total progression, skill ceiling
+-- Time-limited competition
    +-- How often reset?
        +-- Daily → RECURRING (24h)
        +-- Weekly → RECURRING (7d)
        +-- Monthly/Seasonal → RECURRING (custom)
```

## Decision Tree: Achievement Design

```
What player behavior to reward?
+-- One-time accomplishment → 100% completion
|   +-- First win, beat final boss, find secret
+-- Cumulative progress → Progressive (0-100%)
|   +-- Collect 1000 coins, play 100 hours
+-- Skill demonstration → Difficulty-tiered
    +-- Beat level without damage, perfect combo
```

## Decision Tree: Auth Failure

```
Authentication failed?
+-- User cancelled → Allow game, disable GC features
+-- Network error → Queue locally, retry on reconnect
+-- Parental restrictions → Hide all GC UI, work offline
+-- Account issues → Prompt to check Settings
```

## Core Principles

**Authentication**: Attempt at app launch but never block gameplay. Game must be fully playable without authentication. Register GKLocalPlayerListener for invites/challenges.

**Leaderboards**: Submit after game completion. Save locally regardless of auth status. Use `GKLeaderboard.submitScore` for async submission. Always use `entry.formattedScore` (never hardcode formats).

**Achievements**: Cache progress locally. Queue when offline, process on auth. Report at milestones (not every increment). Max 100 achievements, 1000 total points.

**Access Point**: Hide during gameplay, show in menus. Use `.topLeading` default. Enable `showHighlights` for achievement notifications.

## Quality Checklist

### Authentication
- [ ] Attempted at app launch
- [ ] Game fully playable when not authenticated
- [ ] UI presented when login required
- [ ] Player listener registered

### Leaderboards
- [ ] Scores submitted after game completion
- [ ] Local high score saved regardless of auth
- [ ] Score format matches App Store Connect config
- [ ] Friends leaderboard option available

### Achievements
- [ ] Progress tracked locally
- [ ] Queued when offline
- [ ] Progressive achievements increment properly
- [ ] Banner display enabled for major achievements

### Access Point
- [ ] Hidden during active gameplay
- [ ] Shown in menus and pause screens
- [ ] Position doesn't conflict with game UI

## Anti-Patterns

**Blocking on Auth**: Requiring Game Center sign-in to play. Users without GC or who cancel cannot play. App Store rejection risk.

**Submitting Every Increment**: Reporting achievement progress on every action. Excessive network calls, rate limiting, battery drain.

**Access Point Always Visible**: Never hiding during gameplay. Covers game UI, accidental taps interrupt gameplay.

**Hardcoding Score Format**: Using `"\(score) points"` instead of `entry.formattedScore`. Wrong format for time-based leaderboards.

**Not Finishing Transactions**: Achievement reports without proper async handling. Progress may not persist.

## References

- [Code Patterns](references/code-patterns.md) - GameCenterManager, SwiftUI views, Access Point configuration, error handling
- [API Reference](references/api-reference.md) - Capabilities, leaderboard types, achievement limits, score formats, access point states

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| app-store-review | Game Center IDs must be configured in App Store Connect |
| analytics-integration | Track Game Center engagement metrics |
| retention-engineer | Leaderboards and achievements drive retention |
| social-mechanics | Game Center provides social gaming foundation |
| progression-system | Achievements should align with progression |
