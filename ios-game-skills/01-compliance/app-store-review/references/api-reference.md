# App Store Review Reference Tables

## Critical Guidelines for Games

| Guideline | Requirement | Risk | Enforcement |
|-----------|-------------|------|-------------|
| **2.1 Completeness** | No placeholders, demo credentials if login | 40% rejections | Strict |
| **2.3 Metadata** | Screenshots show actual gameplay | High | Strict |
| **2.25 Loot Boxes** | Disclose odds BEFORE purchase | Critical | Zero tolerance |
| **3.1.1 IAP** | ALL unlocks via Apple IAP | Critical | Zero tolerance |
| **3.1.3(b) Multiplatform** | Cross-platform content if IAP also offered | Medium | Case-by-case |
| **4.1(c) Copycat** | No cloned icons, brands, concepts | High | Strict |
| **4.2 Functionality** | Lasting entertainment value | Medium | Subjective |
| **4.7 HTML5** | Follow all guidelines, no real-money without license | High | Strict |
| **5.1.1(v) Login** | Allow play without login if no account features | Medium | Strict |
| **5.1.2(i) AI Data** | Disclose third-party AI data sharing | High | New (Nov 2025) |
| **5.3.4 Gambling** | License, geo-restrict, FREE listing | Critical | Zero tolerance |

## Screenshot Requirements

| Device | Count | Portrait | Landscape |
|--------|-------|----------|-----------|
| iPhone 6.9" | 3-10 | 1320x2868 | 2868x1320 |
| iPhone 6.7" | 3-10 | 1290x2796 | 2796x1290 |
| iPhone 6.5" | 3-10 | 1284x2778 | 2778x1284 |
| iPhone 5.5" | 3-10 | 1242x2208 | 2208x1242 |
| iPad Pro 12.9" | 3-10 | 2048x2732 | 2732x2048 |
| iPad Pro 11" | 3-10 | 1668x2388 | 2388x1668 |

## Age Rating Mapping

| Rating | Content |
|--------|---------|
| **4+** | No objectionable content |
| **9+** | Mild cartoon/fantasy violence, mild profanity |
| **12+** | Frequent cartoon violence, simulated gambling, mild realistic violence |
| **17+** | Realistic violence, mature themes, real-money gambling |

## Review Timeline

| Stage | Duration | Notes |
|-------|----------|-------|
| Initial Submission | 24-48 hours | For review to begin |
| Standard Review | 1-3 days | 90% of apps |
| Extended Review | Up to 7 days | Complex apps |
| Expedited Review | 24 hours | Valid reason required |
| Rejection Response | 24-48 hours | For re-review |
| Appeal | 2-5 days | Disputed rejections |

## Subscription Disclosure Requirements

1. Title of publication or service
2. Length of subscription period
3. Price of subscription
4. Price per unit if duration differs from billing
5. Payment charged to iTunes Account at confirmation
6. Auto-renews unless cancelled 24 hours before end
7. Charged for renewal within 24 hours of period end
8. Link to terms of service
9. Link to privacy policy
10. Managing subscriptions in Account Settings

## Pre-Submission Checklist

### Core
- [ ] All placeholder content removed
- [ ] All features in metadata functional
- [ ] Demo account in Review Notes
- [ ] PrivacyInfo.xcprivacy present
- [ ] Age rating accurate
- [ ] Screenshots from actual devices

### IAP
- [ ] All virtual goods use StoreKit
- [ ] Loot box odds disclosed
- [ ] Subscription terms displayed
- [ ] Restore purchases accessible

### Accounts
- [ ] Guest play if account not essential
- [ ] Sign in with Apple if third-party login
- [ ] Account deletion available

### Technical
- [ ] Built with Xcode 16+ / iOS 18 SDK
- [ ] Universal app (iPhone + iPad)
- [ ] Launch under 400ms
- [ ] No crashes in standard flows

## Decision Trees

### Account System
```
Account required?
├── No → Guest-only compliant
└── Yes → Provides user value?
    ├── No → MUST allow guest play
    └── Yes → Third-party login offered?
        ├── No → Sign in with Apple NOT required
        └── Yes → MUST offer Sign in with Apple
```

### Loot Box Compliance
```
Random items in purchase?
├── No → Standard IAP
└── Yes → Odds disclosed before purchase?
    ├── No → REJECTION (2.25)
    └── Yes → Clearly visible?
        ├── No → LIKELY REJECTION
        └── Yes → Odds accurate? → Yes = Compliant
```

### Real Money Gaming
```
Real money wagering?
├── No → Standard guidelines
└── Yes → License for each region?
    ├── No → CANNOT publish
    └── Yes → FREE listing? → Geo-fenced? → Submit with docs
```
