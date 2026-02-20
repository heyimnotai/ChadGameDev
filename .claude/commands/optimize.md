---
description: Run full ChadGameLoop optimization cycle - visualize, analyze, fix, repeat
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - TodoWrite
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_screenshot
  - mcp__playwright__browser_click
  - mcp__XcodeBuildMCP__screenshot
  - mcp__XcodeBuildMCP__launch_app
---

# Optimize Command

Run the full ChadGameLoop optimization cycle to iteratively improve game visuals and gameplay.

## Usage

```
/optimize [--iterations n] [--focus area]
```

## Options

- `--iterations`: Maximum optimization iterations (default: 5)
- `--focus`: Specific area to focus on (layout, performance, visuals, gameplay)

## The ChadGameLoop Cycle

```
┌────────────────────────────────────────────────────┐
│                                                    │
│    VISUALIZE ──▶ ANALYZE ──▶ FIX ──▶ VERIFY      │
│         ▲                              │          │
│         └──────────────────────────────┘          │
│                                                    │
│    Repeat until:                                  │
│    - All iterations complete, OR                  │
│    - All scores 90+ (truly polished), OR          │
│    - User requests stop                           │
│                                                    │
└────────────────────────────────────────────────────┘
```

## Execution Steps

### Step 1: Initialize

Create todo list for tracking:
```
- [ ] Capture initial state
- [ ] Analyze screenshot
- [ ] Identify issues
- [ ] Apply fixes
- [ ] Verify improvements
- [ ] Check quality gates
```

### Step 2: Visualize

Open device selector and capture screenshot of the iPhone frame only:

```javascript
// 1. Resize browser for device selector
mcp__playwright__browser_resize({ width: 900, height: 950 })

// 2. Navigate to device selector
mcp__playwright__browser_navigate({ url: "http://localhost:8083/device-selector.html" })

// 3. Set game URL (assumes Expo running on 8082)
mcp__playwright__browser_evaluate({
  function: "() => window.chadDeviceSelector.setGameUrl('http://localhost:8082')"
})

// 4. Wait for game to load
mcp__playwright__browser_wait_for({ time: 2 })

// 5. Get element refs with snapshot
mcp__playwright__browser_snapshot()

// 6. Screenshot the full device frame (use ref from snapshot for "iPhone Simulator")
mcp__playwright__browser_take_screenshot({
  element: "iPhone Simulator",
  ref: "[ref from snapshot]",
  filename: "[game-name]/iter-01.png"  // Saved to .playwright-mcp/
})
```

**IMPORTANT:** Always screenshot the "iPhone Simulator" element to see full device context.

### Step 3: Analyze

Examine screenshot for issues in priority order:

**Critical (Blocks Release)**
- App crashes or fails to render
- Major visual bugs
- Broken core gameplay

**High Priority**
- Layout issues (safe areas, alignment)
- Performance problems (low FPS)
- Touch target issues

**Medium Priority**
- Visual polish (colors, animations)
- Typography improvements
- Juice and feedback

**Low Priority**
- Minor aesthetic tweaks
- Edge case handling
- Polish details

### Step 4: Fix

Apply targeted fixes one at a time:

1. Identify the specific code to change
2. Make the minimal change needed
3. Document what was changed and why

Example:
```markdown
### Fix #1: Circle position

**Issue**: Circle appears under Dynamic Island
**File**: preview/game.js:45
**Change**: Adjusted Y position from 100 to 300
**Reason**: Need to respect safe area inset of 162px
```

### Step 5: Verify

Capture new screenshot and compare:
- Did the fix work?
- Any regressions?
- Quality gate status?

### Step 6: Quality Gate Check

```markdown
## Quality Gates

### Gate 1: Renders Correctly
- [ ] Game loads without errors
- [ ] All objects visible
- [ ] Correct dimensions

### Gate 2: Layout Correct
- [ ] Safe areas respected
- [ ] Proper alignment
- [ ] No clipping

### Gate 3: Visual Quality
- [ ] Colors correct
- [ ] Text readable
- [ ] 60 FPS target

### Gate 4: Interactions Work
- [ ] Touch events register
- [ ] Correct feedback
- [ ] State updates

### Gate 5: Game Logic
- [ ] Score works
- [ ] Win/lose conditions
- [ ] State transitions
```

### Step 7: Iterate or Complete

**⚠️ ITERATION ENFORCEMENT ⚠️**

```
If iterations remaining AND scores < 90 → Return to Step 2
If ALL scores reach 90+ → Offer early exit (game is polished)
If all iterations complete → Complete optimization
If user requests stop → Complete optimization
```

**Early exit allowed when:**
- All quality scores reach 90+ (truly polished)
- User explicitly requests to stop
- Critical blocker prevents progress
- 3 consecutive iterations with no meaningful improvement

**If scores are 70-85 with iterations remaining:**
- ASK user before stopping, don't assume

**After each iteration, report:**
```
Iteration 3/10 complete
Remaining: 7 iterations
Next focus: [lowest scoring category]
```

## Output Format

```markdown
## ChadGameLoop Optimization Report

### Session Summary
- **Iterations**: 3
- **Issues Found**: 5
- **Issues Fixed**: 5
- **Time**: ~10 minutes

### Iteration 1
**Screenshot**: [analysis]
**Issues**:
- Circle under safe area
- Score text too small

**Fixes Applied**:
1. Moved circle Y: 100 → 400
2. Increased font size: 32 → 48

### Iteration 2
**Screenshot**: [analysis]
**Issues**:
- Touch target too small

**Fixes Applied**:
1. Increased circle radius: 40 → 60

### Iteration 3
**Screenshot**: [analysis]
**Status**: All quality gates pass ✅

### Final Quality Gate Status
- [x] Renders Correctly
- [x] Layout Correct
- [x] Visual Quality
- [x] Interactions Work
- [x] Game Logic

### Recommendations for Next Session
- Consider adding particle effects on tap
- Could improve color contrast slightly
```

## Tips

1. **One fix at a time** - Easier to verify and debug
2. **Take screenshots liberally** - Visual history helps
3. **Complete ALL iterations** - User selected the count deliberately
4. **Document everything** - Future you will thank you
5. **Higher counts = deeper work** - 20 iterations means AAA polish, not rushed work

## ⚠️ Iteration Enforcement

**Basic quality gates (60-80) do NOT mean stop.** The selected iteration count is a commitment:

| Iterations | Expectation | Early Exit Threshold |
|------------|-------------|---------------------|
| 5 | Quick pass - fix obvious issues | 85+ all scores |
| 10 | Thorough - fix all issues, add polish | 90+ all scores |
| 20 | Perfection - multiple passes | 90+ all scores |

**Early exit allowed when:**
- ALL scores reach 90+ (offer to user, don't force exit)
- User explicitly requests to stop
- Critical blocker or no improvements after 3 attempts

**Each iteration must make substantive progress.** Don't rush through with token changes.
