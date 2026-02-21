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
- Any time an interactive element feels hard to click/tap

## ⚠️ Critical Anti-Patterns (React Native / Expo)

These patterns silently break touch in browser AND iOS. Check for all of them whenever implementing or reviewing controls.

### 1. Parent Responder Conflict (Most Common Bug)

**Never set `onStartShouldSetResponder={() => true}` unconditionally on a container that has interactive children.** It will claim every touch before child Pressables can respond.

```tsx
// ❌ WRONG — steals ALL taps, children never fire
<View onStartShouldSetResponder={() => true} onResponderMove={handleMove}>
  <Pressable onPressIn={selectPiece}>...</Pressable>  {/* never fires */}
</View>

// ✅ CORRECT — parent only claims when a drag is already active
<View
  onStartShouldSetResponder={() => isDragging}
  onMoveShouldSetResponder={() => isDragging}
  onResponderMove={handleMove}
  onResponderRelease={handleRelease}
>
  <Pressable onPressIn={startDrag}>...</Pressable>  {/* fires normally */}
</View>
```

### 2. Hitbox Sized to Visual (Not Container)

**Never size an interactive Pressable to match the visual element inside it.** For small shapes, icons, or game pieces, the visual is tiny — the touch target must be the slot/container.

```tsx
// ❌ WRONG — a 2-block piece preview might be 32x16 — impossible to tap
<Pressable style={{ width: pieceWidth, height: pieceHeight }}>
  <PieceBlocks />
</Pressable>

// ✅ CORRECT — 90x90 container, visual centered inside
<Pressable style={{ width: 90, height: 90, justifyContent: 'center', alignItems: 'center' }}>
  <PieceBlocks />  {/* can be any size */}
</Pressable>
```

### 3. Missing hitSlop on Small Targets

Any tappable element smaller than 60x60pt needs `hitSlop`. This is mandatory.

```tsx
// ❌ WRONG — 32px icon, user must tap exactly on it
<Pressable style={{ width: 32, height: 32 }}>
  <Icon />
</Pressable>

// ✅ CORRECT — 32px visual, 56x56 effective hit area
<Pressable hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ width: 32, height: 32 }}>
  <Icon />
</Pressable>
```

### 4. Drag Active During Idle State

If a drag gesture consumes all pointer events while no piece is selected, any tap on any element in the container fails silently.

```tsx
// ❌ WRONG — container always intercepts
onStartShouldSetResponder={() => true}

// ✅ CORRECT — container only intercepts when piece is actively being dragged
onStartShouldSetResponder={() => draggingPiece !== null}
```

## Core Process

1. **Check for anti-patterns first** — Audit all container Views for unconditional responder claims
2. **Set latency targets** - Touch-to-visual <16ms, gesture recognition <50ms
3. **Size touch targets** - Minimum 44x44pt container, visual centered inside
4. **Add hitSlop everywhere** - All elements under 60pt get hitSlop: 12pt per side
5. **Implement input buffer** - 100-150ms for jump, 100ms for attack
6. **Add coyote time** - 80-120ms jump window after leaving platform
7. **Design for thumb zones** - Primary controls in bottom 40%
8. **Choose control scheme by genre** - Platformer, runner, twin-stick, etc.
9. **Add visual feedback** - Scale to 93% on press, 108% on release
10. **Handle multi-touch** - First touch = movement, second = action

## Key Rules

- **<16ms touch-to-visual** - 1 frame at 60fps, non-negotiable
- **44x44pt minimum** - Apple HIG requirement — use 90pt for game piece slots
- **Expand hitboxes** - 20-50% larger than visual, or use hitSlop
- **Parent responder is conditional** - Only claim when isDragging, never unconditionally
- **Visual ≠ hitbox** - The slot container is the hit target, not the shape inside
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
