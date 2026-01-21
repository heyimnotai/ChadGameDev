# Animation System API Reference

## Button Press Animation

| Property | Value | Notes |
|----------|-------|-------|
| Press duration | 100ms | Time to reach pressed state |
| Release duration | 150ms | Slightly longer for satisfying return |
| Press scale | 0.95x | Scale down on touch |
| Release overshoot | 1.05x | Brief overshoot before settling |
| Settle scale | 1.0x | Final resting state |
| Press easing | ease-out | `cubic-bezier(0.0, 0.0, 0.2, 1.0)` |
| Release easing | ease-out-back | `cubic-bezier(0.2, 0.8, 0.2, 1.0)` |
| Disabled opacity | 0.5 | Visual disabled state |

## Item Collection Sequence

| Time Offset | Event | Duration | Specification |
|-------------|-------|----------|---------------|
| T+0ms | Touch detected | - | Collision or tap registered |
| T+5ms | Haptic fires | - | UIImpactFeedbackGenerator(.light) |
| T+10ms | Scale up begins | 50ms | 1.0x to 1.3x, ease-out |
| T+15ms | Sound plays | - | Collection SFX triggers |
| T+30ms | Particles spawn | - | Burst emission |
| T+60ms | Fly to counter | 200ms | Bezier path to UI element |
| T+60ms | Alpha fade begins | 150ms | 1.0 to 0.0 during flight |
| T+260ms | Counter pulse | 150ms | Scale 1.0x to 1.2x to 1.0x |
| T+260ms | Score increment | 500ms | Animated number roll |

## Score Counter Animation

| Property | Value | Notes |
|----------|-------|-------|
| Total duration | 500-1000ms | Scales with score delta |
| Easing | ease-in-out | Fast in middle, slow at ends |
| Digit rate | 50ms minimum | Minimum time per digit change |
| Pulse on complete | 150ms | Scale 1.0x to 1.15x to 1.0x |

## Screen Transitions

| Transition Type | Duration | Easing | Use Case |
|-----------------|----------|--------|----------|
| Modal present | 300ms | ease-out | Popup dialogs, settings |
| Modal dismiss | 250ms | ease-in | Closing popups |
| Push navigation | 350ms | ease-in-out | Level progression |
| Fade crossfade | 200ms | linear | Scene changes |
| Scale zoom | 400ms | ease-out-back | Menu to gameplay |
| Slide horizontal | 300ms | ease-in-out | Tab switching |

**Tablet Adjustment**: Multiply all durations by 1.3x for iPad.

## Character Feedback Animations

### Hit Reaction
| Property | Value | Notes |
|----------|-------|-------|
| Flash white | 50ms | Full sprite tint to white |
| Knockback | 100ms | Small positional offset |
| Recovery | 150ms | Return to normal |
| Total duration | 300ms | Complete hit reaction cycle |
| Invulnerability flash | 100ms on/off | Alternating alpha during i-frames |

### Jump Animation
| Phase | Duration | Scale X | Scale Y | Notes |
|-------|----------|---------|---------|-------|
| Anticipation | 80ms | 1.2x | 0.8x | Crouch before jump |
| Launch | 50ms | 0.9x | 1.15x | Stretch during ascent |
| Apex | - | 1.0x | 1.0x | Normal at peak |
| Fall | - | 0.95x | 1.05x | Slight stretch descending |
| Land squash | 60ms | 1.3x | 0.7x | Impact deformation |
| Recovery | 100ms | 1.0x | 1.0x | Return to normal |

### Death Animation
| Phase | Duration | Effect |
|-------|----------|--------|
| Flash | 100ms | White tint |
| Freeze | 150ms | Brief pause (hit stop) |
| Collapse/Explode | 300ms | Genre-dependent destruction |
| Fade out | 200ms | Alpha 1.0 to 0.0 |
| Total | 750ms | Full death sequence |

## Menu Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Menu open | Scale 0.8x to 1.0x + fade in | 250ms | ease-out-back |
| Menu close | Scale 1.0x to 0.9x + fade out | 200ms | ease-in |
| Button hover (iPad) | Scale to 1.05x | 150ms | ease-out |
| List item appear | Stagger 50ms per item | 150ms each | ease-out |
| Tab switch | Slide + fade | 200ms | ease-in-out |
| Tooltip appear | Scale 0.9x to 1.0x + fade | 150ms | ease-out |

## Reward Reveal Sequences

### Loot Box / Chest Opening
| Phase | Duration | Animation |
|-------|----------|-----------|
| Anticipation | 800ms | Shake intensity 0 to 0.5, glow pulse |
| Peak buildup | 400ms | Shake intensity 0.5 to 1.0, particles emit |
| Open action | 200ms | Lid opens, flash white |
| Item reveal | 300ms per item | Items fly out with stagger |
| Rarity indicator | 150ms | Color/particle burst by rarity |
| Settle | 500ms | Items land in display position |
| **Total** | **2000-2500ms** | Sweet spot for ceremony vs speed |

### Daily Reward Claim
| Phase | Duration | Animation |
|-------|----------|-----------|
| Highlight current | 200ms | Scale 1.0x to 1.1x, glow |
| Claim action | 150ms | Scale 1.1x to 0.9x (press) |
| Burst | 100ms | Particles + flash |
| Fly to inventory | 300ms | Bezier curve path |
| Next day preview | 200ms | Shift calendar view |

## Victory/Defeat Sequences

### Victory
| Phase | Duration | Animation |
|-------|----------|-----------|
| Freeze frame | 200ms | Gameplay pauses |
| Score tally begin | 100ms | UI elements appear |
| Stars/rating reveal | 300ms each | Staggered with particles |
| Score count up | 1000ms | Animated increment |
| Best score flash | 500ms | If new record, pulse effect |
| Continue prompt | 200ms | Fade in button |
| **Total** | **2500-3000ms** | Full victory celebration |

### Defeat
| Phase | Duration | Animation |
|-------|----------|-----------|
| Death animation | 500ms | Character-specific |
| Screen fade/vignette | 300ms | Darken edges |
| "Game Over" text | 400ms | Scale in with bounce |
| Score display | 300ms | Fade in |
| Retry/Exit buttons | 200ms | Staggered fade in |
| **Total** | **1700-2000ms** | Respectful but not prolonged |

## Easing Curves Reference

| Name | Cubic Bezier | Use Case |
|------|--------------|----------|
| Linear | `(0.0, 0.0, 1.0, 1.0)` | Continuous rotation, progress bars |
| Ease In | `(0.4, 0.0, 1.0, 1.0)` | Elements leaving screen |
| Ease Out | `(0.0, 0.0, 0.2, 1.0)` | Elements entering screen |
| Ease In Out | `(0.4, 0.0, 0.2, 1.0)` | Navigation transitions |
| Ease Out Back | `(0.2, 0.8, 0.2, 1.0)` | Bouncy button release |
| Spring | Use spring animator | Natural physical motion |
| Bounce | Custom keyframes | Landing, celebration |

## Squash and Stretch Values

**Volume Conservation Principle**: X scale * Y scale should remain constant (~1.0).

| Action | X Scale | Y Scale | Product | Duration |
|--------|---------|---------|---------|----------|
| Jump anticipation | 1.2 | 0.83 | 1.0 | 80ms |
| Jump stretch | 0.85 | 1.18 | 1.0 | During rise |
| Land squash | 1.3 | 0.77 | 1.0 | 60ms |
| Button press | 1.1 | 0.91 | 1.0 | 50ms |
| Bounce impact | 1.25 | 0.8 | 1.0 | 50ms |
| Stretch vertical | 0.9 | 1.11 | 1.0 | Variable |
| Wobble settle | 1.05/0.95 | 0.95/1.05 | 1.0 | 3 cycles, 80ms each |

## Anticipation Frame Counts

| Action | Anticipation Frames | At 60fps | Purpose |
|--------|---------------------|----------|---------|
| Jump | 5-6 frames | 83-100ms | Crouch before launch |
| Attack | 3-4 frames | 50-66ms | Wind-up before strike |
| Dash | 2-3 frames | 33-50ms | Brief pause before speed |
| Throw | 4-5 frames | 66-83ms | Arm back before release |
| Heavy attack | 8-12 frames | 133-200ms | Power move wind-up |
