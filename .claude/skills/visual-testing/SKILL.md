---
name: visual-testing
description: Use Playwright to capture and analyze screenshots from game previews
triggers:
  - capture screenshot
  - analyze visuals
  - check rendering
  - visual test
---

# Visual Testing Skill

Capture screenshots from game previews using Playwright MCP and analyze them for visual quality, layout issues, and optimization opportunities.

## Overview

This skill uses Playwright MCP to:
1. Open the game preview in a browser
2. Capture screenshots at specific game states
3. Analyze the visual output
4. Report issues and recommendations

## Prerequisites

- Playwright MCP server configured in `.mcp.json`
- Preview HTML file at `preview/index.html`
- Game code at `preview/game.js`

## Workflow

### Step 1: Navigate to Preview

```
Use mcp__playwright__browser_navigate to open:
file://${PWD}/preview/index.html
```

### Step 2: Wait for Render

Wait 1-2 seconds for the game to initialize and render the first frame.

### Step 3: Capture Screenshot

```
Use mcp__playwright__browser_screenshot to capture the current state
```

### Step 4: Interact (Optional)

```
Use mcp__playwright__browser_click to simulate taps
Coordinates should be within the iPhone screen area (centered in viewport)
```

### Step 5: Capture After Interaction

Take additional screenshots to verify state changes.

## Analysis Checklist

When analyzing screenshots, check for:

### Layout Issues
- [ ] Content respects safe areas (not under Dynamic Island/Home Indicator)
- [ ] Text is readable at intended size
- [ ] Touch targets appear large enough (44pt minimum)
- [ ] Elements are properly centered/aligned
- [ ] No visual clipping or overflow

### Visual Quality
- [ ] Colors are vibrant and match iOS aesthetic
- [ ] Shapes have appropriate corner radii
- [ ] Text uses system fonts where appropriate
- [ ] Animations appear smooth (check multiple frames)
- [ ] No visual artifacts or glitches

### Game State
- [ ] Score displays correctly
- [ ] UI elements update properly
- [ ] Game objects render at correct positions
- [ ] Particle effects appear as expected
- [ ] Background renders correctly

### Accessibility
- [ ] Sufficient color contrast
- [ ] Text size appropriate for mobile
- [ ] Interactive elements clearly distinguishable

## Screenshot Comparison

For iterative optimization, capture screenshots at these states:

1. **Initial load**: First frame after game starts
2. **Idle state**: Game waiting for input
3. **Active gameplay**: During action
4. **Score update**: After scoring event
5. **Game over**: End state

## Reporting Format

After analysis, report:

```markdown
## Visual Test Results

### Screenshot: [description]

**Status**: PASS / NEEDS_ATTENTION / FAIL

**Observations**:
- [What looks correct]
- [What needs improvement]

**Recommendations**:
1. [Specific change to make]
2. [Another improvement]

**Measurements**:
- FPS: [observed]
- Object count: [from debug overlay]
- Touch responsiveness: [observation]
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Elements under Dynamic Island | Incorrect Y positioning | Add SafeArea.top (162px) offset |
| Tiny touch targets | Scale too small | Increase hit area to 132px minimum |
| Blurry text | Wrong font size | Use multiples of 3 for 3x Retina |
| Jerky animations | Low FPS | Reduce object count or simplify render |
| Color mismatch | RGB vs sRGB | Use Color class system colors |

## Integration with Chad Loop

This skill is typically used as part of the optimization cycle:

1. **Generate** preview with game-preview skill
2. **Capture** screenshot with visual-testing skill
3. **Analyze** output and identify issues
4. **Fix** issues based on recommendations
5. **Repeat** until quality gates pass

## Automated Testing Script

For CI/CD integration, use this pattern:

```javascript
// test-visual.js
const tests = [
    { name: 'initial', wait: 1000 },
    { name: 'after-tap', action: 'click', x: 195, y: 500, wait: 500 },
    { name: 'game-over', wait: 5000 }
];

// Run via Playwright, capture each state, compare with baselines
```
