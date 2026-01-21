---
name: analytics-integration
description: Use when implementing game analytics, event tracking, funnel analysis, cohort tracking, or A/B testing. Triggers on data-driven iteration needs, player behavior tracking, or privacy-compliant analytics setup.
---

# Analytics Integration

## Purpose

Implement comprehensive game analytics for data-driven development: event tracking, funnel analysis, cohort segmentation, A/B testing, and privacy compliance.

## When to Use

- Setting up analytics event taxonomy
- Defining FTUE/conversion/progression funnels
- Building A/B test infrastructure
- Implementing privacy-compliant tracking (ATT)
- Calculating sample sizes for experiments

## Core Process

1. Define event taxonomy (session, progression, economy, engagement, business)
2. Implement AnalyticsManager with provider abstraction
3. Set up standard funnels (FTUE, conversion)
4. Configure cohort tracking (install date, version, segment)
5. Build A/B test infrastructure with deterministic assignment
6. Add privacy consent flow (ATT for iOS 14.5+)
7. Validate events with debug provider

## Key Rules

- **Event naming**: snake_case, <40 chars
- **Parameters**: keys <40 chars, values <100 chars, max 25 per event
- **Privacy first**: Always check consent before tracking
- **No PII**: Track behavior, not identity
- **Sample size**: Calculate BEFORE launching A/B tests

## Quick Reference

### Event Categories

| Category | Examples |
|----------|----------|
| Session | session_start, session_end |
| Progression | level_complete, level_fail |
| Economy | currency_earned, currency_spent |
| Engagement | tutorial_step, feature_used |
| Business | iap_completed, ad_completed |

### Retention Benchmarks (2025)

| Metric | Median | Top 25% |
|--------|--------|---------|
| D1 | 26-28% | 31-33% |
| D7 | 3-4% | 7-8% |
| D30 | <3% | 5-7% |

### A/B Test Sample Sizes

| MDE | 95% Confidence | Sample/Variant |
|-----|----------------|----------------|
| 5% | 80% power | 6,400 |
| 10% | 80% power | 1,600 |
| 20% | 80% power | 400 |

### Test Duration

| Metric | Minimum | Recommended |
|--------|---------|-------------|
| Session | 3 days | 7 days |
| D7 retention | 10 days | 14 days |
| D30 retention | 33 days | 45 days |

## Anti-Patterns

**No consent check**: Always wrap tracking in privacy check
**Inconsistent naming**: Use snake_case everywhere
**Underpowered tests**: Calculate sample size first
**Tracking PII**: Track actions, not personal data

## Adjacent Skills

- `privacy-manifest` - ATT and privacy configuration
- `iap-implementation` - Transaction event tracking
- `retention-engineer` - Using data for retention optimization
- `onboarding-architect` - FTUE funnel optimization

## References

See `references/code-patterns.md` for implementation code.
See `references/api-reference.md` for benchmarks and specifications.
