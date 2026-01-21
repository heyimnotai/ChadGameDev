---
name: social-mechanics
description: Use when implementing leaderboards, friend systems, guilds/clans, sharing features, or multiplayer social components. Triggers on competitive vs cooperative design, social proof implementation, or viral mechanics. Covers leaderboard psychology, guild systems, sharing flows, and privacy requirements.
---

# Social Mechanics

Design social features that drive engagement through competition, cooperation, and community while respecting player privacy and providing opt-out options.

## Decision Tree: Leaderboard Type

```
What is the primary goal?
+-- Showcase top players globally
|   +-- Global Leaderboard → Reset weekly/seasonally
+-- Motivate friends to compete
|   +-- Friends Leaderboard (default)
|   +-- Show "invite friends" if < 5
+-- Help struggling players feel good
|   +-- Percentile View → "Top X%" not raw rank
|   +-- Emphasize personal improvement
+-- Match similar skill levels
    +-- Nearby Players → Within 20% of score
```

## Decision Tree: Competition vs Cooperation

```
Game's core fantasy?
+-- Power/Domination → 70% competitive, 30% cooperative
+-- Community/Belonging → 30% competitive, 70% cooperative
+-- Self-improvement → 40-40-20 (personal focus)
+-- Social/Party → 20% competitive, 80% cooperative
+-- Casual/Relaxation → Minimal social (all optional)
```

## Core Principles

**Leaderboard Display**: Default to friends-only or percentile view. Always show player position centered with 5 neighbors above/below. Use percentile format ("Top 15%") over raw rank for large pools. Update at session end, not real-time.

**Anti-Discouragement**: For bottom 10%, show personal best improvement, "players you beat this week" count, and emphasize friends comparison. For 0 friends, show nearby players or AI ghosts.

**Social Proof**: Hide online counter when <100 players. Limit friend activity to 3 notifications/day. Don't interrupt active gameplay. Update popular items every 5 minutes.

**Guild Features**: Unlock progressively (Level 1: chat, Level 2: bank, Level 3: events, Level 4: wars, Level 5: bosses). Warn inactive members at 7 days, auto-kick at 14-30 days.

**Privacy**: Default to friends-only (Level 2). Require opt-in for leaderboards, friend activity, push. Support complete opt-out including offline mode.

## Quality Checklist

### Leaderboards
- [ ] Friends leaderboard is default view
- [ ] Player position always visible
- [ ] 5 neighbors above/below shown
- [ ] Percentile format for ranks > 1000
- [ ] Anti-discouragement active for bottom 10%

### Social Proof
- [ ] Online counter hidden when < 100
- [ ] Friend activity capped at 3/day
- [ ] Notifications don't interrupt gameplay
- [ ] All social proof has opt-out

### Guilds
- [ ] Name 3-20 characters validated
- [ ] Role permissions enforced
- [ ] Inactivity warning at 7 days
- [ ] Leadership transfer works

### Privacy
- [ ] Friends-only is default setting
- [ ] Complete opt-out available
- [ ] GDPR deletion removes all social data
- [ ] No forced social for progression

## Anti-Patterns

**Public Shaming**: Highlighting bottom players with red/negative styling. Players quit, negative reviews.

**Forced Social**: Requiring friends to progress (e.g., "must have 5 friends for level 35"). Solo players locked out.

**Notification Spam**: Unlimited friend activity notifications. Players disable all notifications.

**Pay-to-Win Leaderboards**: Score includes purchased boosts. Free players disengage.

**Empty Social Features**: Showing leaderboard with 3 players. New players assume game is dead.

## References

- [Code Patterns](references/code-patterns.md) - LeaderboardSystem, SocialProofManager, GuildSystem, ShareSystem
- [API Reference](references/api-reference.md) - Display principles, competition balance, guild tiers, share triggers, privacy levels

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| retention-engineer | Social features drive long-term retention |
| game-center-integration | Technical leaderboard/achievement implementation |
| onboarding-architect | When to introduce social features |
| dopamine-optimizer | Social rewards and competition psychology |
| privacy-manifest | Social data collection compliance |
