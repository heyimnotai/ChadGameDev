---
name: retention-engineer
description: Use when designing daily engagement features, implementing streak systems, planning notification strategies, or building winback flows. Triggers on D1/D7/D30 retention optimization, churn prevention, or welcome-back systems. Covers login bonuses, streak recovery, push notifications, and re-engagement campaigns.
---

# Retention Engineer

Design engagement systems that maximize D1/D7/D30 retention through daily rewards, streak mechanics, and re-engagement flows that feel rewarding rather than obligatory.

## Decision Tree: Daily Reward Structure

```
Target session frequency?
+-- 1 session/day (casual)
|   +-- 7-day consecutive cycle with generous catch-up
|   +-- Miss 1 day: claim previous reward, Miss 2+: reset without penalty
+-- 2-3 sessions/day (mid-core)
|   +-- Cumulative monthly calendar
|   +-- Each login stamps one day, monthly total = bonus tier
+-- 4+ sessions/day (core)
    +-- Hybrid consecutive + cumulative
    +-- Streak multiplier + cumulative ensures no missed rewards
```

## Decision Tree: Winback Timing

```
Player inactive for how long?
+-- 1-2 days: No action (normal variation)
+-- 3-6 days: Light touch - reminder notification only
+-- 7-13 days: Active winback - offer notification + email
+-- 14-29 days: Re-engagement campaign - major update + fresh start offer
+-- 30+ days: Lost player - premium winback package, minimal contact after
```

## Core Principles

**Streak Design**: Minimum 3 days for bonus. Multiplier: 1.0x (days 1-3), 1.2x (4-7), 1.5x (8-14), 2.0x (15-30), 2.5x cap (30+). Milestones at 7, 14, 30, 60, 90 days.

**Streak Recovery**: Free recovery once per 30 days. Server outage = automatic preservation. Vacation mode = up to 7-day pause. Never remove earned rewards on break.

**Login Bonus Curve**: Day 1 = base, Day 7 = 4x base. Escalate: 100%, 120%, 150%, 180%, 220%, 280%, 400%. Reset at midnight local time.

**Push Notifications**: Never request on first launch. Ask after session 3+ or first milestone. Quiet hours 10PM-8AM. Match frequency to player behavior: 1 session/day = 1 notification max.

**Churn Prediction**: Score = 0.30 * session_decline + 0.25 * length_decline + 0.20 * spending_decline + 0.15 * social_decline + 0.10 * quest_decline. Low (<0.3), Medium (0.3-0.5), High (0.5-0.7), Critical (>0.7).

## Quality Checklist

### Daily Login
- [ ] Day 7 reward is exactly 4x Day 1
- [ ] Reset at midnight user local time
- [ ] Multiple logins same day do not grant duplicates
- [ ] State persists across app restarts

### Streak System
- [ ] Breaks after exactly 1 missed day
- [ ] Recovery tokens decrement properly
- [ ] Free recovery cooldown is 30 days
- [ ] Milestones trigger at exact day counts
- [ ] Longest streak record preserved permanently

### Notifications
- [ ] Permission requested after session 3+
- [ ] Quiet hours (10PM-8AM) enforced
- [ ] Daily notification limit respected
- [ ] Streak reminder fires 2 hours before reset

### Churn Prevention
- [ ] Signal weights sum to 1.0
- [ ] Interventions trigger at correct risk levels
- [ ] Baselines calculated from first 14 days

## Anti-Patterns

**Punitive Streak**: Removing earned rewards on break. Players feel punished and quit entirely.

**Notification Spam**: 7+ notifications per day. Players disable all notifications.

**Immediate Permission**: Requesting push on first launch. Lower opt-in rates, no value demonstrated.

**Aggressive Winback**: Daily emails/SMS starting day 1. Marked as spam, brand damage.

## References

- [Code Patterns](references/code-patterns.md) - DailyLoginSystem, StreakSystem, ChurnPredictionSystem, RetentionNotificationManager
- [API Reference](references/api-reference.md) - Benchmarks, bonus curves, streak multipliers, notification timing, churn thresholds

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| onboarding-architect | First-time experience sets D1 baseline |
| dopamine-optimizer | Reward psychology for daily engagement |
| reward-scheduler | Achievement pacing complements daily rewards |
| social-mechanics | Friend features as retention hooks |
| analytics-integration | Track retention metrics and churn signals |
