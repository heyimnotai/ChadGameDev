# Quality Validator API Reference

## Performance Benchmarks

| Metric | Minimum | Target | Top 10% |
|--------|---------|--------|---------|
| Frame Rate | 60fps | 60fps stable | 120fps ProMotion |
| Launch Time | <500ms | <400ms | <300ms |
| Memory Peak | <1.25GB | <1GB | <750MB |
| Memory Stable | <1GB | <800MB | <600MB |
| CPU (idle) | <30% | <20% | <10% |

## Animation Timing Standards

| Type | Duration | Tolerance |
|------|----------|-----------|
| Button feedback | 100-150ms | +/- 20ms |
| Item collection | 50-200ms | +/- 30ms |
| Screen transition | 200-400ms | +/- 50ms |
| Score increment | 500-1000ms | +/- 100ms |
| Reward reveal | 1-2s | +/- 200ms |

## Audio Latency

| Metric | Maximum | Target |
|--------|---------|--------|
| SFX latency | 50ms | <20ms |
| Haptic-audio sync | 15ms | <5ms |
| Music fade | 500ms | 300ms |

## Touch Targets

| Element | Minimum | Recommended |
|---------|---------|-------------|
| Standard button | 44x44pt | 48x48pt |
| Frequent action | 44x44pt | 56x56pt |
| Primary CTA | 48x48pt | 60x60pt |
| Spacing | 8pt | 12pt |

## Retention Benchmarks

| Metric | Minimum | Target |
|--------|---------|--------|
| FTUE Completion | 70% | 85% |
| D1 Retention | 30% | 45% |
| D7 Retention | 10% | 20% |
| D30 Retention | 3% | 10% |
| Sessions/Day | 1.5 | 3+ |

## Polish Checklist

- [ ] Every button has press feedback
- [ ] Every button has release feedback
- [ ] Every action has sound
- [ ] Audio latency <50ms
- [ ] Haptics synchronized
- [ ] Particles <500 active
- [ ] Screen shake with disable option

## Performance Checklist

- [ ] 60fps minimum
- [ ] <5% dropped frames
- [ ] Launch <400ms
- [ ] Memory <1GB
- [ ] No memory leaks
- [ ] Thermal handling

## Retention Checklist

- [ ] Daily rewards
- [ ] Streak with recovery
- [ ] 3+ retention hooks
- [ ] FTUE <60s to loop
- [ ] First reward <2 min

## Monetization Ethics Checklist

- [ ] Completable F2P
- [ ] 3-5x pay advantage max
- [ ] Odds disclosed
- [ ] Pity system
- [ ] No dark patterns
- [ ] Restore purchases works

## Accessibility Checklist

- [ ] VoiceOver labels
- [ ] Touch targets 44pt+
- [ ] Reduce Motion respected
- [ ] Screen shake disableable
- [ ] Contrast 4.5:1+

## Platform Checklist

- [ ] Safe areas respected
- [ ] iPad supported
- [ ] Xcode 16+ / iOS 18 SDK
- [ ] PrivacyInfo.xcprivacy
- [ ] @1x, @2x, @3x assets
