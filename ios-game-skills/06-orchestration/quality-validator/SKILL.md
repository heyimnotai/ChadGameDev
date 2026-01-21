---
name: quality-validator
description: Use when completing a development phase, before App Store submission, or auditing game quality. Triggers on phase gates, pre-submission reviews, or quality concerns.
---

# Quality Validator

## Purpose

Systematic validation of iOS game quality across all dimensions: polish, performance, retention, monetization ethics, accessibility, and platform compliance. Enforces top 10% App Store quality bar.

## When to Use

- Phase completion checkpoint
- Pre-submission quality audit
- Performance concern investigation
- Accessibility compliance check
- Monetization ethics review

## Core Process

1. Run all 6 validation categories
2. Measure quantitative metrics (not estimates)
3. Identify critical failures (score=0)
4. Generate remediation recommendations
5. Calculate overall score and grade
6. Block progression on critical failures

## Validation Categories

### 1. Polish
- Every button has press/release feedback (100-150ms)
- Every action has sound
- Haptics synchronized (<15ms offset)
- Particles within budget (<500 active)

### 2. Performance
- 60fps sustained, <5% dropped frames
- Launch <400ms to first frame
- Memory peak <1GB, stable <800MB
- Thermal state handled

### 3. Retention
- FTUE <60s to core loop
- 3+ retention hooks implemented
- Daily reward system
- Streak with recovery option

### 4. Monetization Ethics
- Completable without paying
- F2P 3-5x slower (not 100x)
- Loot box odds disclosed
- Pity system implemented
- No predatory patterns

### 5. Accessibility
- VoiceOver labels on all interactive
- Touch targets minimum 44x44pt
- Screen shake disableable
- Reduce Motion respected

### 6. Platform Compliance
- Safe areas respected
- iPad supported
- Built with Xcode 16+, iOS 18 SDK
- PrivacyInfo.xcprivacy included

## Quality Grades

| Score | Grade | Action |
|-------|-------|--------|
| 95-100 | A+ | Ship ready |
| 90-94 | A | Ship with minor polish |
| 85-89 | B+ | Ship after fixes |
| 80-84 | B | Address before ship |
| 70-79 | C | Significant work needed |
| <70 | F | Do not ship |

## Key Benchmarks

| Metric | Minimum | Target |
|--------|---------|--------|
| Frame Rate | 60fps | 60fps stable |
| Launch Time | <500ms | <400ms |
| Memory Peak | <1.25GB | <1GB |
| Touch Targets | 44x44pt | 48x48pt |
| FTUE Completion | 70% | 85% |

## Anti-Patterns

**Subjective assessment**: Always measure quantitatively
**End-only validation**: Validate at each phase
**Ignoring accessibility**: Legal risk, App Store requirement
**"Mostly 60fps"**: Require consistent performance

## Failure Response

```
Critical (score=0) → BLOCK, must fix
Category failed → Fix items, re-validate
Low score (<80) → Create improvement backlog
```

## Adjacent Skills

For fixing failures:
- `animation-system`, `audio-designer`, `haptic-optimizer`
- `performance-optimizer`
- `retention-engineer`, `onboarding-architect`

After validation:
- `ship-readiness-checker` - Final submission gate

## References

See `references/code-patterns.md` for validators.
See `references/api-reference.md` for checklists.
