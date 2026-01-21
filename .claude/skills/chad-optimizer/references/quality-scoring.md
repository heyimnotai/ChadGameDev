# Quality Scoring Reference

## Scoring System

Each category scored 0-100. **90% = Top 100 in App Store category.**

| Category | Weight | What It Measures |
|----------|--------|------------------|
| Core Loop | 18% | Main gameplay satisfaction |
| Controls | 10% | Touch responsiveness |
| Visual Polish | 12% | Animations, particles, juice |
| Audio | 8% | SFX, music, mute works |
| Haptics | 6% | iOS Taptic Engine usage |
| UI/UX | 10% | Menus, HUD, iOS HIG |
| Onboarding | 6% | 30 seconds to fun |
| Performance | 10% | 60fps on all devices |
| Difficulty | 8% | Hard but fair |
| Retention | 10% | "One more game" factor |
| Compliance | 2% | App Store guidelines |

## Quality Levels

| Score | Level | App Store Equivalent |
|-------|-------|---------------------|
| 61-75% | Good | 3.5-4 stars |
| 76-85% | Great | 4-4.5 stars, top 500 |
| 86-90% | Excellent | 4.5+ stars, **top 100** |
| 91-95% | Outstanding | Featured potential |
| 96-100% | Masterpiece | Game of the Year |

## Auto-Priority

Focus on **lowest scoring category** each iteration:

```
Iteration 12:
  Core Loop:      75%
  Visual Polish:  45%  ← FOCUS (lowest)
  Audio:          30%  ← Next focus
  ...
```

## Gate Completion Thresholds

| Gate | Pass | Excellent |
|------|------|-----------|
| Renders | 100% | N/A |
| Layout | 90% | 95% |
| Visual | 85% | 95% |
| Interaction | 90% | 98% |
| Logic | 95% | 100% |

## Scoring Rubric

### Renders (Pass/Fail)
- 100%: Game loads, all objects visible, correct dimensions
- 0%: Any critical failure

### Layout
- 100%: Perfect safe areas, alignment, no overflow
- 90%: Minor alignment issues
- 70%: Safe area violations but playable
- 50%: Major layout problems

### Visual
- 100%: 60fps, polished animations, perfect colors
- 90%: Smooth, good aesthetics
- 70%: Functional but lacking polish
- 50%: Visible issues, jerky animation

### Interaction
- 100%: Instant touch response, clear feedback
- 90%: Responsive, good feedback
- 70%: Works but sluggish or unclear
- 50%: Touch issues

### Logic
- 100%: All mechanics work perfectly
- 90%: Minor edge cases
- 70%: Core works, some bugs
- 50%: Major logic issues
