# Haptic Optimizer API Reference

## UIImpactFeedbackGenerator Styles

| Style | Intensity | Sharpness | When to Use |
|-------|-----------|-----------|-------------|
| `.light` | Low | Medium | Soft tap, hover, scroll tick |
| `.medium` | Medium | Medium | Button press, item pickup, collision |
| `.heavy` | High | Medium | Enemy hit, heavy landing, explosion |
| `.soft` | Medium | Low | Bubble pop, soft landing, stretch |
| `.rigid` | Medium | High | Click, toggle switch, lock-in |

## Intensity/Sharpness Values

| Style | Intensity Value | Sharpness Value | Feel |
|-------|-----------------|-----------------|------|
| `.light` | 0.3 - 0.5 | 0.4 - 0.6 | Subtle tap |
| `.medium` | 0.5 - 0.7 | 0.4 - 0.6 | Definite thump |
| `.heavy` | 0.8 - 1.0 | 0.4 - 0.6 | Strong impact |
| `.soft` | 0.5 - 0.7 | 0.1 - 0.3 | Dull, rounded |
| `.rigid` | 0.5 - 0.7 | 0.8 - 1.0 | Sharp, clicking |

## UINotificationFeedbackGenerator Types

| Type | Pattern | When to Use |
|------|---------|-------------|
| `.success` | Two quick taps (ascending) | Level complete, achievement, purchase |
| `.warning` | Single firm tap | Low health, timer warning |
| `.error` | Three rapid taps (descending) | Invalid move, blocked action |

## UISelectionFeedbackGenerator

| Method | When to Use |
|--------|-------------|
| `selectionChanged()` | Picker wheel, slider tick, list scroll |

## prepare() Timing

| Scenario | When to Call | Notes |
|----------|--------------|-------|
| Button press | On touchDown | 50-100ms before impact |
| Collision | Objects approaching | 1-2 seconds before |
| Menu opening | Transition starts | Before first element |
| Re-prepare | Every 1-2 seconds | Engine idles after ~2s |

## Haptic Event Catalog

### Events That SHOULD Have Haptics

| Event | Haptic Type | Intensity |
|-------|-------------|-----------|
| Button Press | Light impact | 0.4 |
| Significant Button | Medium impact | 0.6 |
| Item Collection | Light impact | 0.3-0.5 |
| Valuable Collection | Medium impact | 0.6-0.8 |
| Player Hit (light) | Medium impact | 0.6 |
| Player Hit (heavy) | Heavy impact | 0.9-1.0 |
| Player Death | Notification error | N/A |
| Enemy Kill | Rigid impact | 0.7 |
| Jump Land | Medium impact | 0.5-0.6 |
| Heavy Land | Heavy impact | 0.8 |
| Level Complete | Notification success | N/A |
| Toggle Switch | Rigid impact | 0.6 |

### Events That Should NOT Have Haptics

| Event | Reason |
|-------|--------|
| Background animations | Battery waste |
| Particle effects | Too frequent |
| Character walking | Fatigue |
| Continuous actions | Sustained holding |
| Score incrementing | Too frequent |
| Timer ticking | Annoying |

## Battery and Frequency Guidelines

| Guideline | Specification |
|-----------|---------------|
| Maximum sustained rate | 10 haptics/second (100ms minimum) |
| Recommended sustained rate | 2-4 haptics/second |
| Burst maximum | 5 haptics in 500ms, then pause |
| Heavy usage impact | 3-5% additional battery/hour |

## Core Haptics Parameters

| Parameter | Range | Description |
|-----------|-------|-------------|
| Intensity | 0.0 - 1.0 | Vibration strength |
| Sharpness | 0.0 - 1.0 | 0=dull, 1=sharp |
| Attack time | 0.0 - 1.0s | Fade in |
| Decay time | 0.0 - 1.0s | Fade out |
| Sustain time | 0.0 - 30.0s | Max continuous |

## Device Support

| Device | Support | Notes |
|--------|---------|-------|
| iPhone 8+ | Full | Taptic Engine (2nd gen) |
| iPhone 7 | Full | Taptic Engine (1st gen) |
| iPhone 6s | Limited | Basic Taptic |
| iPad | None | No Taptic Engine |
