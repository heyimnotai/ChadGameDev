# Ship Readiness Checker API Reference

## App Store Requirements (2025)

| Requirement | Specification | Enforcement |
|-------------|---------------|-------------|
| Xcode | 16.0+ | Hard gate (April 2025) |
| iOS SDK | 18.0 | Hard gate (April 2025) |
| Privacy Manifest | PrivacyInfo.xcprivacy | Hard gate |
| Launch Time | <400ms | Soft gate |

## TestFlight Requirements

| Phase | Duration | Testers | Crash-Free |
|-------|----------|---------|------------|
| Internal | 3+ days | 5+ | 99% |
| External | 7+ days | 25+ | 99.5% |
| Pre-Launch | 3 days | 10+ active | 99.9% |

## Review Timeline

| Type | Typical | Maximum |
|------|---------|---------|
| New App | 24-48h | 7 days |
| Update | 24h | 5 days |
| Expedited | 24h | 48h |
| Rejection Resubmit | 24-48h | 7 days |

## Screenshot Requirements

| Device | Size | Required |
|--------|------|----------|
| iPhone 6.7" | 1290x2796 | Yes |
| iPhone 6.5" | 1242x2688 | Yes |
| iPhone 5.5" | 1242x2208 | Yes |
| iPad Pro 12.9" | 2048x2732 | Universal apps |

## Hard Gate Checklist

### Build Requirements
- [ ] Xcode 16+ used
- [ ] iOS 18 SDK
- [ ] PrivacyInfo.xcprivacy included
- [ ] Release build (not debug)
- [ ] No debug code in release

### App Store Compliance
- [ ] Screenshots show actual gameplay
- [ ] Privacy policy URL live
- [ ] Age rating accurate
- [ ] IAP products configured
- [ ] Loot box odds disclosed (if applicable)

### Quality Validation
- [ ] quality-validator score >= 80
- [ ] No critical failures
- [ ] 60fps minimum
- [ ] Launch <500ms

### Testing
- [ ] Internal testing 3+ days
- [ ] Crash-free >= 99%
- [ ] No known crash bugs
- [ ] Core loop playable

### Metadata
- [ ] All screenshots uploaded
- [ ] Description complete
- [ ] Demo account (if sign-in)

## Soft Gate Checklist

### Quality Excellence
- [ ] Score >= 90

### Retention Readiness
- [ ] FTUE <5 minutes
- [ ] 3+ retention hooks
- [ ] Daily engagement loop

### Launch Preparation
- [ ] Phased release configured
- [ ] Monitoring dashboard ready
- [ ] On-call schedule set

## Launch Day Monitoring

### Critical Alerts (Immediate)
- Crash rate >2%
- Server errors >5%
- IAP failures >10%
- Zero sessions 15+ min

### Warning Alerts (Hourly)
- FTUE completion <70%
- Session length <2min
- High uninstall rate

## Phased Release Schedule

| Day | % Users | Focus |
|-----|---------|-------|
| 1 | 1% | Monitor crashes |
| 2 | 2% | Review feedback |
| 3 | 5% | Check retention |
| 4 | 10% | Validate economy |
| 5 | 20% | Go/no-go |
| 6 | 50% | Final validation |
| 7 | 100% | Full release |
