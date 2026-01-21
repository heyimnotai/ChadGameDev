---
name: privacy-manifest
description: Use when creating PrivacyInfo.xcprivacy for iOS games, adding third-party SDKs, implementing App Tracking Transparency, or responding to privacy rejections. Triggers on new project setup, SDK integration, pre-submission review, privacy audit.
---

# Privacy Manifest Implementation

## Purpose

Create complete, accurate privacy manifests for iOS games. Required since May 2024 for App Store submission.

## When to Use

- Creating new iOS game project
- Adding third-party SDKs (ads, analytics)
- Preparing for App Store submission
- Responding to privacy-related rejection
- Implementing App Tracking Transparency (ATT)

## Core Process

1. **Create PrivacyInfo.xcprivacy** in main app target
2. **Declare Required Reason APIs**: UserDefaults (CA92.1), SystemBootTime (35F9.1), FileTimestamp (C617.1), DiskSpace (E174.1)
3. **Set Tracking Status**: NSPrivacyTracking = true only if sharing data for tracking
4. **List Tracking Domains**: All ad network endpoints if tracking enabled
5. **Document Data Collection**: User ID, gameplay content, device ID as applicable
6. **Audit Third-Party SDKs**: Check if SDKs include their own manifests
7. **Implement ATT** if using personalized advertising

## Key Rules

**Always Required**:
- PrivacyInfo.xcprivacy file in main target
- API declarations for UserDefaults (almost all games use this)
- Accurate tracking declaration matching actual behavior

**ATT Required When**:
- Using personalized ads with IDFA
- Sharing device/user data with third parties for tracking

**ATT NOT Required When**:
- First-party analytics only
- Contextual ads only
- Data stays on device

**ATT Timing**:
- NEVER at first launch
- After user experiences app value (2+ sessions)
- Before first interstitial ad opportunity

## Quick Reference

| API Category | Common Reason | Game Use |
|--------------|---------------|----------|
| UserDefaults | CA92.1 | Settings, game state |
| SystemBootTime | 35F9.1 | Game timers, frame timing |
| FileTimestamp | C617.1 | Save file management |
| DiskSpace | E174.1 | Asset downloads |

**Common Mistakes**:
- Missing UserDefaults declaration (most common rejection)
- Premature ATT prompt (hurts opt-in rates)
- Claiming no tracking while using IDFA-based ad SDKs
- Not auditing third-party SDK privacy requirements

See `references/code-patterns.md` for manifest templates and ATT implementation.
See `references/api-reference.md` for complete API codes and SDK domains.

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| `app-store-review` | Overall submission compliance |
| `analytics-integration` | Privacy-compliant analytics setup |
| `iap-implementation` | Purchase tracking disclosure |
