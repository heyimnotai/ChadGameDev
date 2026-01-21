# Touch Control Optimizer - API Reference

## Touch Latency Requirements

| Metric | Target | Acceptable | Failing |
|--------|--------|------------|---------|
| Touch-to-visual | <16ms (1 frame) | <33ms | >50ms |
| Touch-to-haptic | <8ms | <16ms | >25ms |
| Touch-to-action | <16ms | <33ms | >50ms |
| Gesture recognition | <50ms | <100ms | >150ms |

## Touch Target Minimum Sizes

| Element | Minimum | Recommended |
|---------|---------|-------------|
| Primary button | 44x44 pt | 60x60 pt |
| Secondary button | 44x44 pt | 48x48 pt |
| Destructible targets | 44x44 pt | 56x56 pt |
| Collectibles | 32x32 pt visible | 48x48 pt hitbox |
| Virtual joystick | 120x120 pt | 150x150 pt |

**Always expand hitboxes 20-50% beyond visual bounds**

## Gesture Parameters

### Tap
- Max duration: 300ms
- Max movement: 10pt
- Multi-tap window: 300ms
- Use touchDown position (not touchUp)

### Swipe
- Min distance: 50pt
- Max duration: 300ms
- Direction tolerance: 30 degrees
- Min velocity: 300pt/sec

### Long Press
- Min duration: 500ms
- Max movement: 10pt
- Haptic at 400ms (before recognition)

### Drag
- Activation distance: 10pt
- Update: 60Hz
- Momentum: last 100ms
- Snap threshold: 20pt

## Thumb Zone Ergonomics

**Portrait (right thumb):**
| Zone | Position | Use |
|------|----------|-----|
| Natural | Bottom 40% | Primary controls |
| Stretch | Middle 30% | Secondary, HUD |
| Overreach | Top 30% | Menu only |

**Landscape:**
| Zone | Position | Use |
|------|----------|-----|
| Left thumb | Left 35% | Movement |
| Right thumb | Right 35% | Actions |
| Center | Middle 30% | HUD only |

## Input Buffer Durations

| Buffer Type | Duration | Use Case |
|-------------|----------|----------|
| Jump | 100-150ms | Before landing |
| Attack | 100ms | During recovery |
| Dash | 80ms | During cooldown |
| Direction | 50ms | Quick changes |

## Forgiveness Mechanics

### Coyote Time
- Duration: 80-120ms after leaving platform
- Invisible to player
- Stacks with input buffer

### Corner Correction
- Distance: 4-8 pixels
- Angle: within 45 degrees
- Direction: toward open space

## Virtual Joystick Specs

| Type | Outer Diameter | Dead Zone | Best For |
|------|----------------|-----------|----------|
| Fixed | 120-150pt | 15% | Casual |
| Floating | 100-120pt | 10% | Core |

**Response Curves:**
- Linear: `output = input`
- Quadratic: `output = input^2` (good for aiming)
- S-Curve: `output = 3x^2 - 2x^3` (best for movement)

| Game Type | Curve | Dead Zone |
|-----------|-------|-----------|
| Platformer | S-Curve | 15% |
| Twin-stick | Quadratic | 10% |
| Racing | Linear | 5% |

## Gyroscope/Tilt Controls

| Parameter | Racing | Ball Roll | Flight |
|-----------|--------|-----------|--------|
| Input axis | X only | X and Y | X, Y, Z |
| Dead zone | 5-8 deg | 3-5 deg | 2-3 deg |
| Max angle | +/-35 deg | +/-45 deg | +/-60 deg |
| Smoothing | 0.15 alpha | 0.1 alpha | 0.2 alpha |

**Calibration is CRITICAL** - players hold devices at different angles. Provide easy recalibration button.

## Genre Control Schemes

### Platformer
- Move: Left side swipe/joystick
- Jump: Right side tap
- Input buffer: 150ms
- Coyote time: 100ms

### Endless Runner
- Jump: Tap anywhere
- Slide: Swipe down
- Lane change: Swipe left/right
- Entire screen is the button

### Twin-Stick Shooter
- Move: Left floating joystick
- Aim: Right floating joystick
- Fire: Auto-fire while aiming
- Both thumbs always occupied

### Puzzle
- Select: Tap
- Move: Drag
- Snap-to-grid: generous
- Undo: always available

### Racing (Tilt)
- Steer: Device tilt
- Accelerate: Tap/auto
- Dead zone: 5-10 degrees
- Must have recalibration

### Rhythm
| Rating | Tolerance |
|--------|-----------|
| Perfect | +/-33ms |
| Great | +/-66ms |
| Good | +/-100ms |
| Miss | >150ms |

## Multi-Touch Priority

1. First touch = movement (cannot be stolen)
2. Second touch = actions
3. Third+ touches = queue

**Conflict Resolution:**
- Joystick + button overlap: button wins
- Drag enters button: drag continues
- Button during drag: both active

## Visual Feedback

| State | Response | Timing |
|-------|----------|--------|
| Touch down | Scale to 93% | Immediate |
| Touch held | Maintain | Duration |
| Touch up success | Scale to 108% then 100% | 100ms |
| Touch cancel | Return to 100% | 50ms |

## Accessibility

| Feature | Implementation |
|---------|----------------|
| Larger targets | 1.5-2x toggle |
| Hold for tap | Easier for tremors |
| Auto-fire | Reduce repetition |
| One-handed | Relocate controls |
| Adjustable timing | Longer windows |

**Check iOS settings:**
```swift
UIAccessibility.isReduceMotionEnabled
UIAccessibility.isSwitchControlRunning
```
