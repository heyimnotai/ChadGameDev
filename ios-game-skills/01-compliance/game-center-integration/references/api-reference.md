# Game Center Integration - API Reference

## Game Center Capabilities

| Feature | iOS Version | Description |
|---------|-------------|-------------|
| Leaderboards (Classic) | iOS 4+ | All-time high scores |
| Leaderboards (Recurring) | iOS 14+ | Periodic reset (daily/weekly/etc.) |
| Achievements | iOS 4+ | Progress-based unlocks |
| Access Point | iOS 14+ | Floating Game Center dashboard entry |
| Challenges | iOS 6+ | Challenge friends to beat scores |
| Multiplayer | iOS 4+ | Turn-based and real-time matches |
| Friends | iOS 4.1+ | Friend lists and presence |

## Leaderboard Types

| Type | Reset Period | Use Case | Best For |
|------|--------------|----------|----------|
| Classic | Never | All-time records | Total playtime, highest level |
| Recurring Daily | 24 hours | Daily competition | Daily challenges |
| Recurring Weekly | 7 days | Weekly competition | Weekly events |
| Recurring Monthly | ~30 days | Monthly seasons | Monthly rankings |

## Achievement Design Limits

| Property | Limit |
|----------|-------|
| Maximum achievements per game | 100 |
| Maximum points total | 1000 |
| Points per achievement | 1-100 (increments of 5 recommended) |
| Title length | 50 characters |
| Pre-earned description | 255 characters |
| Earned description | 255 characters |
| Achievement icon size | 512x512 px (1024x1024 px @2x) |

## Score Formatting Options

| Format Type | Display Example | Use Case |
|-------------|-----------------|----------|
| Integer | 1,234,567 | Points, coins |
| Fixed Point (1 decimal) | 1,234.5 | Time in seconds |
| Fixed Point (2 decimals) | 12.34 | Precise measurements |
| Fixed Point (3 decimals) | 1.234 | Very precise values |
| Elapsed Time (Minutes) | 12:34 | Race times under 1 hour |
| Elapsed Time (Seconds) | 12:34.56 | Precise race times |
| Money | $1,234.56 | In-game currency displays |

## Access Point Locations

| Location | Recommended Use |
|----------|-----------------|
| .topLeading | Default, good for most games |
| .topTrailing | Alternative if top-left conflicts with UI |
| .bottomLeading | For games with top-heavy UI |
| .bottomTrailing | Alternative bottom position |

## Access Point States by Game State

| Game State | isActive | showHighlights | Location |
|------------|----------|----------------|----------|
| Main Menu | true | true | .topLeading |
| Gameplay | false | - | - |
| Pause | true | false | .topLeading |
| Game Over | true | true | .topTrailing |

## Authentication Failure Scenarios

| Scenario | Behavior | User Action |
|----------|----------|-------------|
| User cancelled | Allow game to continue | Prompt occasionally |
| Network error | Queue locally, retry later | Auto-retry on reconnect |
| Parental restrictions | Hide all Game Center UI | None (game works offline) |
| Account issues | Prompt to check Settings | Manual Settings fix |

## Achievement Submission Best Practices

| Scenario | Approach |
|----------|----------|
| Single unlock | 100% progress immediately |
| Progressive | Report at milestones (10%, 25%, 50%, 75%, 100%) |
| Rapid increments | Batch locally, submit periodically |
| Offline earned | Queue locally, submit on auth |

## Leaderboard Submission Timing

| Event | When to Submit |
|-------|----------------|
| Game over | Immediately |
| Session end | Immediately |
| Achievement unlock | If score-based |
| Checkpoint | For long sessions only |

## Error Handling Matrix

| Error Type | Retry | User Message |
|------------|-------|--------------|
| Not authenticated | No | Silent (use local) |
| Network error | Yes (3x backoff) | "Scores will sync later" |
| Leaderboard not found | No | Log error, use local |
| Rate limited | Yes (with delay) | Silent |

## GKLeaderboard.TimeScope Values

| Scope | Description |
|-------|-------------|
| .today | Current day only |
| .week | Current week |
| .allTime | All-time records |

## GKGameCenterViewControllerState Values

| State | Shows |
|-------|-------|
| .default | Main Game Center dashboard |
| .leaderboards | Leaderboard list/detail |
| .achievements | Achievement list |
| .localPlayerProfile | Current player's profile |
| .dashboard | Full dashboard |
