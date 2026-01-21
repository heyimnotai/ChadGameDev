# Common Visual Issues Reference

## Issue → Fix Mapping

| Issue | Cause | Fix |
|-------|-------|-----|
| Elements under Dynamic Island | Y position too low | Add SafeArea.top (162px) offset |
| Tiny touch targets | Scale too small | Increase hit area to 132px minimum |
| Blurry text | Wrong font size | Use multiples of 3 for 3x Retina |
| Jerky animations | Low FPS | Reduce object count or simplify |
| Color mismatch | RGB vs sRGB | Use Color class system colors |
| Elements under Home Indicator | Y position too high | Keep above bottom 102px |
| Text unreadable | Low contrast | Ensure 4.5:1 ratio minimum |

## Safe Area Violations

### Top Safe Area (Status Bar / Dynamic Island)
```javascript
// BAD: Overlaps system UI
const scoreLabel = new LabelNode({ y: 50 });

// GOOD: Below safe area
const scoreLabel = new LabelNode({ y: 180 });  // 162 + padding
```

### Bottom Safe Area (Home Indicator)
```javascript
// BAD: Overlaps gesture area
const button = new SpriteNode({ y: SCREEN_HEIGHT - 20 });

// GOOD: Above safe area
const button = new SpriteNode({ y: SCREEN_HEIGHT - 120 });  // 102 + padding
```

## Touch Target Sizes

Minimum touch target: 44pt = 132px at 3x Retina

```javascript
// BAD: Too small
const coin = new ShapeNode.circle(10);  // 20px diameter

// GOOD: Proper size
const coin = new ShapeNode.circle(22);  // 44px diameter (touch)
// or add invisible hit area
coin.hitAreaPadding = 30;
```

## Animation Performance

Target: 60fps (16.67ms per frame)

Signs of performance issues:
- Frame drops during particle effects
- Stuttering during many objects
- Lag on touch response

Fixes:
- Reduce particle count
- Use sprite batching
- Simplify complex shapes
- Remove unused objects from scene

## Screenshot States to Capture

1. **Initial**: First frame after load
2. **Idle**: Waiting for input
3. **Active**: During gameplay
4. **Score update**: After scoring
5. **Game over**: End state
6. **Win/Lose**: Both outcomes

## Reporting Template

```markdown
## Visual Test Results

### Screenshot: [name]
**Status**: PASS / NEEDS_ATTENTION / FAIL

**Safe Area Check**:
- Top: [OK/VIOLATION] - [details]
- Bottom: [OK/VIOLATION] - [details]

**Layout**:
- [✓/✗] Touch targets adequate
- [✓/✗] Alignment correct
- [✓/✗] No overflow

**Visual**:
- [✓/✗] Colors correct
- [✓/✗] Text readable
- [✓/✗] Animations smooth

**Game State**:
- [✓/✗] Score displays
- [✓/✗] Objects positioned
- [✓/✗] State updates work

**Priority Fixes**:
1. [P0] [issue]
2. [P1] [issue]
```
