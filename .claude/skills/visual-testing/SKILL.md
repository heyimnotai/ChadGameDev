---
name: visual-testing
description: Use when capturing and analyzing game screenshots for quality assessment. Triggers on visual testing, screenshot capture, layout verification, or rendering checks.
---

# Visual Testing

## Purpose

Capture screenshots via Playwright MCP and analyze for visual quality, layout issues, and iOS compliance.

## Core Process

1. **Setup**: Navigate to device-selector.html (never direct to game)
2. **Wait**: 1-2 seconds for render
3. **Snapshot**: Get element refs
4. **Capture**: Screenshot "iPhone Simulator" element
5. **Analyze**: Check against quality checklist
6. **Report**: Document findings with severity

## Screenshot Workflow

```javascript
// 1. Setup
mcp__playwright__browser_resize({ width: 900, height: 950 })
mcp__playwright__browser_navigate({ url: "http://localhost:8083/device-selector.html" })
mcp__playwright__browser_evaluate({
  function: "() => window.chadDeviceSelector.setGameUrl('http://localhost:8082')"
})

// 2. Wait for render
mcp__playwright__browser_wait_for({ time: 2 })

// 3. Get refs and capture
mcp__playwright__browser_snapshot()
mcp__playwright__browser_take_screenshot({
  element: "iPhone Simulator",
  ref: "[ref]",
  filename: "[game]/test.png"
})
```

## Analysis Checklist

### P0: iOS Safe Area (Check First)

| Zone | System UI | Requirement |
|------|-----------|-------------|
| Top 59px | Status bar, Dynamic Island | Game HUD BELOW this |
| Bottom 34px | Home indicator | Buttons ABOVE this |

### Layout
- Content respects safe areas
- Touch targets ≥44pt (132px at 3x)
- Elements properly aligned
- No clipping/overflow

### Visual Quality
- Colors match iOS aesthetic
- Text readable at size
- Animations smooth (60fps)
- No artifacts/glitches

### Game State
- Score displays correctly
- UI updates properly
- Objects at correct positions

## Report Format

```markdown
## Visual Test: [description]
**Status**: PASS / NEEDS_ATTENTION / FAIL

**Issues**:
- [Severity] [Issue]: [Fix needed]

**Working**:
- [Feature that's correct]
```

See `references/common-issues.md` for fixes.

## Adjacent Skills

- **game-preview**: Generate preview first
- **chad-optimizer**: Full optimization cycle
- **verification-before-completion**: Verify before claiming done
