---
name: touch-control-optimizer
description: Use when implementing touch controls, fixing "floaty" or unresponsive input, or designing genre-appropriate control schemes. Triggers on tap/swipe/drag handling, virtual joysticks, gyroscope/tilt controls, input buffering, or forgiveness mechanics.
---

# Touch Control Optimizer

## Purpose

Implement touch controls that feel instant, precise, and satisfying. Controls are the primary player-game interface - every millisecond of latency erodes trust. Top games achieve <16ms response with generous forgiveness mechanics.

## When to Use

- Designing control scheme for new game
- Fixing "controls feel floaty" feedback
- Implementing virtual joystick or d-pad
- Adding gyroscope/tilt controls
- Optimizing input responsiveness
- Adding forgiveness mechanics (coyote time, input buffer)

## Core Process

1. **Set latency targets** - Touch-to-visual <16ms, gesture recognition <50ms
2. **Size touch targets** - Minimum 44x44pt, expand hitboxes 20-50% beyond visual
3. **Implement input buffer** - 100-150ms for jump, 100ms for attack
4. **Add coyote time** - 80-120ms jump window after leaving platform
5. **Design for thumb zones** - Primary controls in bottom 40%
6. **Choose control scheme by genre** - Platformer, runner, twin-stick, etc.
7. **Add visual feedback** - Scale to 93% on press, 108% on release
8. **Handle multi-touch** - First touch = movement, second = action

## Key Rules

- **<16ms touch-to-visual** - 1 frame at 60fps, non-negotiable
- **44x44pt minimum** - Apple HIG requirement
- **Expand hitboxes** - 20-50% larger than visual
- **Input buffer always** - Capture inputs before ready state
- **Coyote time for platformers** - 80-120ms grace period
- **Easy recalibration for gyro** - Players hold devices differently
- **Dead zone required** - 10-15% for joystick, 3-8 degrees for tilt

## Quick Reference

**Latency Targets:**
| Metric | Target | Failing |
|--------|--------|---------|
| Touch-to-visual | <16ms | >50ms |
| Touch-to-haptic | <8ms | >25ms |
| Gesture recognition | <50ms | >150ms |

**Gesture Parameters:**
- Tap: <300ms, <10pt movement
- Swipe: >50pt, <300ms, >300pt/sec
- Long press: >500ms, <10pt movement

**Forgiveness Stack (Platformer):**
- Input buffer: 150ms
- Coyote time: 100ms
- Corner correction: 6px

**Joystick Response Curves:**
- Linear: direct (racing)
- Quadratic: precise (aiming)
- S-Curve: smooth (movement) - recommended

**Gyro/Tilt Essentials:**
- Dead zone: 3-8 degrees
- Max tilt: 35-45 degrees
- Smoothing: 0.1-0.2 alpha
- MUST have easy recalibrate button

**Genre Control Schemes:**
| Genre | Move | Action |
|-------|------|--------|
| Platformer | Left joystick/swipe | Right tap |
| Runner | Tap anywhere | Swipe down/left/right |
| Twin-stick | Left joystick | Right joystick (auto-fire) |
| Puzzle | Tap to select | Drag to move |
| Racing | Tilt device | Tap accelerate |

See `references/api-reference.md` for detailed specs.
See `references/code-patterns.md` for Swift implementations.

## Adjacent Skills

| Skill | Relationship |
|-------|--------------|
| `haptic-optimizer` | Haptic on touch events |
| `audio-designer` | Sound on touch |
| `animation-system` | Visual response to touch |
| `core-loop-architect` | Input drives game loop |
