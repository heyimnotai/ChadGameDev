---
description: Run full Ralph Loop optimization cycle - visualize, analyze, fix, repeat
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

Run the full Ralph Loop optimization cycle to iteratively improve game visuals and gameplay.

## Usage

```
/optimize [--iterations n] [--focus area]
```

## Options

- `--iterations`: Maximum optimization iterations (default: 5)
- `--focus`: Specific area to focus on (layout, performance, visuals, gameplay)

## The Ralph Loop Cycle

```
┌────────────────────────────────────────────────────┐
│                                                    │
│    VISUALIZE ──▶ ANALYZE ──▶ FIX ──▶ VERIFY      │
│         ▲                              │          │
│         └──────────────────────────────┘          │
│                                                    │
│    Repeat until quality gates pass                │
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

Open preview and capture screenshot:
```
mcp__playwright__browser_navigate
url: file://${PWD}/preview/index.html

# Wait for render
mcp__playwright__browser_screenshot
```

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

If gates pass → Complete optimization
If gates fail → Return to Step 2 with remaining issues

## Output Format

```markdown
## Ralph Loop Optimization Report

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
3. **Don't over-optimize** - Stop when gates pass
4. **Document everything** - Future you will thank you
5. **Know when to stop** - Diminishing returns after ~5 iterations
