# Self-Prompt Examples

## Complete Iteration Prompt Example

```markdown
# Chad Iteration 4 Prompt

## Context
- Session: session-20260115-142030
- Previous iteration: 3
- Issues remaining: 4
- Quality gates passing: 3/5

## Objective
Fix the following issues in priority order. Stop after completing all three or when blocked.

## Priority 1: [CRITICAL] Particles not appearing
**Problem**: ParticleEmitter added to scene but no particles visible in screenshot
**Root Cause**: Missing start() call (documented in PATCH-002)
**File**: preview/game.js
**Line**: ~47
**Current**:
```javascript
const emitter = new ParticleEmitter({...});
scene.addChild(emitter);
```
**Fix**:
```javascript
const emitter = new ParticleEmitter({...});
scene.addChild(emitter);
emitter.start();  // ADD THIS LINE
```
**Verify**: After fix, capture screenshot on tap - yellow particles should burst from tap point

## Priority 2: [HIGH] Score overlapping Dynamic Island
**Problem**: Score label at y=100 is inside safe area (needs y >= 162)
**Root Cause**: Not accounting for safe area inset (PATCH-004)
**File**: preview/game.js
**Line**: ~30
**Fix**: Change `y: 100` to `y: 180`
**Verify**: Score should be clearly visible below Dynamic Island

## Priority 3: [MEDIUM] Touch feedback too subtle
**Problem**: No visual indication when player taps
**File**: preview/game.js
**Line**: ~80 (tap handler)
**Fix**:
```javascript
const pulse = Action.sequence([
  Action.scaleTo(1.2, 0.1),
  Action.scaleTo(1.0, 0.1)
]);
tappedObject.runAction(pulse);
```
**Verify**: Tapped coins should briefly enlarge then return to normal size

## Preserve (DO NOT MODIFY)
- Coin spawn timing (2-second interval) - working correctly
- Background gradient - renders properly
- Touch coordinate calculation - accurate
- Game over trigger at score 10 - functioning

## After Fixes
1. Save changes to preview/game.js
2. Refresh preview in Playwright
3. Wait 1 second for render
4. Capture screenshots: initial.png, gameplay.png
5. Analyze new screenshots
6. Check quality gates
7. If all pass: COMPLETE
8. If issues remain: generate next iteration prompt

## New Patches
If solving new problems, document:
```markdown
## PATCH-XXX: [Title]
**Problem Pattern:** [What it looks like]
**Root Cause:** [Why it happens]
**Solution:** [How to fix]
```
```

## Analysis Summary Format

```markdown
## Analysis Summary (Iteration 3)

### Screenshots Analyzed
- initial.png: Game loads, background renders, score label visible but under Dynamic Island
- gameplay.png: Coins spawn correctly, touch detected, but no particles appear

### Quality Gate Status
- Renders: PASS - All objects visible
- Layout: FAIL - Score under safe area
- Visual: FAIL - Missing particle effects
- Interaction: PASS - Touch registers correctly
- Logic: PASS - Score increments on tap

### Issues Identified
Total: 4 issues (1 critical, 1 high, 1 medium, 1 low)

### Patch Matches
| Issue | Matching Patch | Solution |
|-------|---------------|----------|
| Particles not visible | PATCH-002 | Call emitter.start() |
| Safe area violation | PATCH-004 | Use SAFE_AREA_TOP |
| Touch feedback | None | Debug required |
| Animation timing | None | Debug required |
```

## Quality Checks Before Output

- [ ] Specific file paths included
- [ ] Actual code snippets provided
- [ ] Verification steps concrete
- [ ] Maximum 3 priority fixes
- [ ] Preserve list populated
- [ ] Patch references included
- [ ] Stop condition stated
