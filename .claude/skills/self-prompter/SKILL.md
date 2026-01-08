---
name: self-prompter
description: Generate the next iteration prompt based on screenshot analysis - the AI writes its own instructions
triggers:
  - generate next prompt
  - self prompt
  - next iteration
  - analyze and prompt
---

# Self-Prompter Skill

This skill enables Claude to analyze visual output and generate its own prompt for the next iteration. This is the core innovation of Visual Chad - instead of humans writing prompts, the AI examines screenshots and writes specific, actionable instructions for itself.

## Purpose

Traditional Chad uses human-written prompts that stay static. Visual Chad uses AI-generated prompts that adapt based on what the AI actually sees in the game. This creates a true feedback loop.

## When to Use

After capturing and analyzing screenshots:
1. Quality gates have been checked
2. Issues have been identified with severity ratings
3. Patches have been consulted for known solutions
4. Ready to generate instructions for next iteration

## Self-Prompt Generation Process

### Step 1: Summarize Analysis

Create a structured summary of what was found:

```markdown
## Analysis Summary (Iteration [N])

### Screenshots Analyzed
- initial.png: [observations]
- gameplay.png: [observations]
- [other captures]: [observations]

### Quality Gate Status
- Renders: [PASS/FAIL] - [reason if fail]
- Layout: [PASS/FAIL] - [reason if fail]
- Visual: [PASS/FAIL] - [reason if fail]
- Interaction: [PASS/FAIL] - [reason if fail]
- Logic: [PASS/FAIL] - [reason if fail]

### Issues Identified
Total: [N] issues ([critical], [high], [medium], [low])
```

### Step 2: Categorize Issues

Assign severity based on impact:

| Severity | Criteria | Examples |
|----------|----------|----------|
| CRITICAL | Game unplayable | Blank screen, crash, no touch |
| HIGH | Major functionality broken | Score wrong, states stuck |
| MEDIUM | Noticeable problems | Misalignment, wrong colors |
| LOW | Polish items | Animation timing, subtle effects |

### Step 3: Match Patches

For each issue, search `patches.md`:

```markdown
### Patch Matches

| Issue | Matching Patch | Solution Summary |
|-------|---------------|------------------|
| Particles not visible | PATCH-002 | Call emitter.start() |
| Safe area violation | PATCH-004 | Use SAFE_AREA_TOP constant |
| [No match found] | - | Debug required |
```

### Step 4: Identify What's Working

List features that should NOT be changed:

```markdown
### Preserve (Do Not Break)
- Coin spawning works correctly at 2-second intervals
- Background gradient renders properly
- Touch detection functional (coordinates correct)
- Game over state triggers at score threshold
```

This is critical - prevents regression.

### Step 5: Generate Prioritized Fix List

Select top 3 issues for this iteration (prevent overwhelm):

```markdown
### Priority Fixes (This Iteration)

1. **[CRITICAL] Particles not appearing**
   - File: `preview/game.js`
   - Line: ~45 (ParticleEmitter creation)
   - Current: `scene.addChild(emitter)`
   - Fix: Add `emitter.start()` after addChild
   - Patch: PATCH-002
   - Verification: Screenshot should show yellow burst on tap

2. **[HIGH] Score overlapping Dynamic Island**
   - File: `preview/game.js`
   - Line: ~30 (score label position)
   - Current: `y: 100`
   - Fix: Change to `y: 180` (below safe area)
   - Patch: PATCH-004
   - Verification: Score visible below Dynamic Island cutout

3. **[MEDIUM] Touch feedback too subtle**
   - File: `preview/game.js`
   - Line: ~80 (tap handler)
   - Current: No scale animation on tap
   - Fix: Add `Action.sequence([scaleUp, scaleDown])` on tap
   - Patch: None - new pattern
   - Verification: Visible pulse effect on tap
```

### Step 6: Write Next Iteration Prompt

Generate the complete prompt for next iteration:

```markdown
# Chad Iteration [N+1] Prompt

## Context
- Session: [session-id]
- Previous iteration: [N]
- Issues remaining: [count]
- Quality gates passing: [X/5]

## Objective
Fix the following issues in priority order. Stop after completing all three or when blocked.

## Priority 1: [CRITICAL] Particles not appearing
**Problem**: ParticleEmitter added to scene but no particles visible in screenshot
**Root Cause**: Missing start() call (documented in PATCH-002)
**Fix**:
```javascript
// In game.js, after creating emitter:
const emitter = new ParticleEmitter({...});
scene.addChild(emitter);
emitter.start();  // ADD THIS LINE
```
**Verify**: After fix, capture screenshot on tap - yellow particles should burst from tap point

## Priority 2: [HIGH] Score overlapping Dynamic Island
**Problem**: Score label at y=100 is inside safe area (needs y >= 162)
**Root Cause**: Not accounting for safe area inset (PATCH-004)
**Fix**:
```javascript
// Change score label position
const scoreLabel = new LabelNode({
  text: 'Score: 0',
  position: { x: CANVAS_WIDTH / 2, y: 180 }  // Was 100, now 180
});
```
**Verify**: Score should be clearly visible below Dynamic Island

## Priority 3: [MEDIUM] Touch feedback too subtle
**Problem**: No visual indication when player taps
**Fix**:
```javascript
// Add scale animation on successful tap
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

1. Save changes to `preview/game.js`
2. Refresh preview in Playwright
3. Wait 1 second for render
4. Capture screenshots:
   - initial.png (game loaded)
   - gameplay.png (after 2-3 taps)
5. Analyze new screenshots
6. Check quality gates
7. If all pass: output `<promise>COMPLETE</promise>`
8. If issues remain: generate next iteration prompt

## New Patches

If you solve an issue not in patches.md, document it:
```markdown
## PATCH-XXX: [Title]
**Problem Pattern:** [What it looks like]
**Root Cause:** [Why it happens]
**Solution:** [How to fix]
**Affected Skills:** [Which skills]
**Date Added:** [Today]
```
```

### Step 7: Write to Current Prompt File

Save generated prompt to `chad/current-prompt.md` for next iteration.

## Self-Prompt Template

Use this template when generating prompts:

```markdown
# Chad Iteration [N+1] Prompt

## Context
- Previous iteration: [N]
- Issues remaining: [count]
- Quality gates: [passed/total]

## Priority Fixes (This Iteration)

### 1. [SEVERITY] [Issue Title]
- **Problem**: [What's wrong - describe what screenshot shows]
- **File**: [path/to/file.js]
- **Line**: [approximate line number]
- **Current Code**: [what it looks like now]
- **Fixed Code**: [what it should be]
- **Patch Reference**: [PATCH-XXX or "None - new pattern"]
- **Verification**: [How to confirm fix worked]

### 2. [SEVERITY] [Issue Title]
...

### 3. [SEVERITY] [Issue Title]
...

## Preserve (Do Not Break)
- [Working feature 1]
- [Working feature 2]
- [Working feature 3]

## Verification Steps
1. Save changes
2. Refresh preview
3. Wait [X] seconds
4. Capture: [list of screenshots]
5. Analyze for: [specific things to check]

## Stop Condition
If quality gates [renders, layout, visual, interaction, logic] ALL pass:
<promise>COMPLETE</promise>

Otherwise, generate next iteration prompt.

## Patch Documentation
If solving new problems, add to patches.md with full entry.
```

## Quality Checks for Generated Prompts

Before outputting the prompt, verify:

- [ ] Specific file paths included (not vague "fix the code")
- [ ] Actual code snippets provided (not "add the missing call")
- [ ] Verification steps are concrete (not "check if it works")
- [ ] Maximum 3 priority fixes (prevent overwhelm)
- [ ] Preserve list is populated (prevent regression)
- [ ] Patch references included where applicable
- [ ] Stop condition clearly stated

## Anti-Patterns

**DON'T generate prompts like:**
```
Fix the particle issue and also check the layout stuff.
Make sure everything looks good.
```

**DO generate prompts like:**
```
Priority 1: Add emitter.start() at line 47 of game.js after scene.addChild(emitter).
Verify by capturing screenshot - yellow particles should appear at tap coordinates.
```

## Integration with Chad Loop

This skill is called after:
1. `visual-testing` captures screenshots
2. `chad-optimizer` analyzes quality gates

The generated prompt is:
1. Saved to `chad/current-prompt.md`
2. Read at start of next iteration
3. Executed by following the fix instructions

## Example Complete Flow

```
Iteration 3:
  ↓
visual-testing: Capture screenshots
  ↓
chad-optimizer: Analyze, find 4 issues
  ↓
self-prompter: Generate iteration 4 prompt
  • Summarize: 4 issues (1 critical, 2 high, 1 medium)
  • Match patches: 2 matches found
  • Preserve list: 3 working features
  • Priority fixes: Top 3 issues with code
  • Write to current-prompt.md
  ↓
Iteration 4:
  • Read current-prompt.md
  • Apply Priority 1 fix
  • Apply Priority 2 fix
  • Apply Priority 3 fix
  • Capture new screenshots
  ↓
Repeat...
```

## Metrics

Track self-prompting effectiveness:
- Fixes that worked first try
- Fixes that required multiple iterations
- Patches successfully applied
- New patches created
- Regression events (broke something that was working)
