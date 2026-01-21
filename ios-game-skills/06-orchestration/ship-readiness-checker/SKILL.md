---
name: ship-readiness-checker
description: Use when preparing for App Store submission, after quality validation passes, or determining if a game is ready to ship. Triggers on final review, submission preparation, or ship decision.
---

# Ship Readiness Checker

## Purpose

Final validation gate before App Store submission. Validates metadata, build configuration, TestFlight completion, release strategy, and provides definitive ship/no-ship criteria.

## When to Use

- Preparing for App Store submission
- After quality-validator passes (score >= 80)
- Final review before upload
- Planning phased release strategy

## Core Process

1. Verify all hard gates pass
2. Evaluate soft gates
3. Generate ship readiness report
4. Make ship/conditional-ship/no-ship decision
5. Schedule submission (Mon-Wed optimal)
6. Configure phased release and monitoring

## Hard Gates (Must Pass)

| Gate | Requirement |
|------|-------------|
| Build | Xcode 16+, iOS 18 SDK, PrivacyInfo.xcprivacy |
| Compliance | Screenshots show gameplay, privacy policy live |
| Quality | quality-validator score >= 80, 60fps, <500ms launch |
| Testing | 3+ days internal, 99% crash-free |
| Metadata | All screenshots, description, demo account (if needed) |

## Soft Gates (Should Pass)

| Gate | Recommendation |
|------|----------------|
| Quality Excellence | Score >= 90 for top 10% |
| Retention Readiness | 3+ hooks, FTUE <5min |
| Launch Preparation | Monitoring, on-call schedule |

## Decision Matrix

```
ALL Hard Pass + ALL Soft Pass → SHIP
ALL Hard Pass + SOME Soft Fail → CONDITIONAL SHIP (document risk)
ANY Hard Fail → NO SHIP (fix first)
```

## TestFlight Requirements

| Phase | Duration | Testers | Crash-Free |
|-------|----------|---------|------------|
| Internal | 3 days | 5 | 99% |
| External | 7 days | 25 | 99.5% |
| Pre-Launch | 3 days soak | 10+ active | 99.9% |

## Phased Release (New Apps)

| Day | Users | Action |
|-----|-------|--------|
| 1 | 1% | Monitor crashes |
| 2 | 2% | Review feedback |
| 3 | 5% | Check retention |
| 4 | 10% | Validate economy |
| 5 | 20% | Go/no-go decision |
| 6 | 50% | Final validation |
| 7 | 100% | Full release |

## Submission Timing

| Day | Action |
|-----|--------|
| Mon-Wed | SUBMIT (fastest review) |
| Thu | SUBMIT if not urgent |
| Fri-Sun | WAIT until Monday |

## Anti-Patterns

**Submit without TestFlight**: Undiscovered crashes cause 1-star reviews
**Placeholder screenshots**: Misleading images cause rejection
**Skip phased release**: Issues amplified at scale
**No monitoring setup**: Cannot detect launch issues

## Launch Monitoring

- Crash rate alerts (>2% triggers)
- FTUE completion tracking
- Revenue/conversion monitoring
- On-call rotation set

## Adjacent Skills

Prerequisites:
- `quality-validator` - Must pass >= 80
- `app-store-review` - Compliance check
- `privacy-manifest` - Privacy requirements

For failures:
- `performance-optimizer` - Performance issues
- `game-architect` - Major structural issues

## References

See `references/code-patterns.md` for report generator.
See `references/api-reference.md` for checklists.
