---
name: app-store-review
description: Use when preparing iOS game for App Store submission, auditing compliance, responding to rejection, or implementing features needing guideline awareness (IAP, accounts, loot boxes). Triggers on pre-submission review, metadata prep, rejection response.
---

# App Store Review Compliance

## Purpose

Achieve first-submission App Store approval by enforcing Apple's guidelines, preventing common rejections, and providing validation checklists.

## When to Use

- Preparing game for first submission
- Auditing existing game for compliance
- Responding to App Store rejection
- Adding IAP, accounts, or loot boxes
- Creating App Store metadata

## Core Process

1. **Run Pre-Submission Audit**: Check for placeholders, debug code, broken features
2. **Validate Metadata**: Screenshots from real devices, accurate descriptions, no "coming soon"
3. **Check IAP Compliance**: All purchases via StoreKit, loot box odds disclosed
4. **Verify Account Flow**: Guest play available, Sign in with Apple if third-party login exists
5. **Review Age Rating**: Match content to questionnaire answers
6. **Prepare Demo Account**: Document credentials in Review Notes

## Key Rules

**Critical (Zero Tolerance)**:
- ALL virtual goods/unlocks MUST use Apple IAP (Guideline 3.1.1)
- Loot box odds MUST be disclosed BEFORE purchase (Guideline 2.25)
- No external payment links or mentions of cheaper web prices

**High Risk**:
- Remove ALL placeholder content - "lorem", "TODO", "test" (40% of rejections)
- Screenshots must show actual in-game content, not pre-rendered art
- If third-party login offered, MUST also offer Sign in with Apple
- Allow guest play unless account provides clear user value

**Metadata**:
- Description: 4,000 chars max, first 167 visible without tap
- Screenshots: 3-10 per device size, actual gameplay only
- No pricing, time-sensitive language, or competitor mentions

## Quick Reference

| Rejection Cause | Prevention |
|-----------------|------------|
| Incomplete app (2.1) | Remove placeholders, test all features |
| Misleading metadata (2.3) | Real screenshots, accurate description |
| IAP bypass (3.1.1) | All purchases through StoreKit |
| Hidden loot odds (2.25) | Show odds before purchase screen |
| Forced login (5.1.1v) | Offer guest play option |

**Timeline**: Standard review 1-3 days. Expedited available for critical bugs, security fixes, time-sensitive events.

**Required for submission**: PrivacyInfo.xcprivacy, Xcode 16+/iOS 18 SDK, universal app support.

See `references/code-patterns.md` for implementation examples.
See `references/api-reference.md` for complete tables and checklists.

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| `privacy-manifest` | PrivacyInfo.xcprivacy implementation |
| `iap-implementation` | StoreKit 2 code patterns |
| `game-center-integration` | Leaderboards/achievements setup |
| `universal-app-requirements` | iPhone + iPad support |
