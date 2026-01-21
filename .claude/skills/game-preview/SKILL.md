---
name: game-preview
description: Use when previewing Expo games in browser for visual testing. Triggers on preview generation, game visualization, or preparing for screenshots.
---

# Game Preview

## Purpose

Preview Expo React Native games through device-selector.html wrapper with iPhone frame, dev menu, and proper safe areas.

## Critical Rule

**NEVER navigate directly to localhost:8082.**

Always use device-selector.html:
```javascript
mcp__playwright__browser_resize({ width: 900, height: 950 })
mcp__playwright__browser_navigate({ url: "http://localhost:8083/device-selector.html" })
mcp__playwright__browser_evaluate({
  function: "() => window.chadDeviceSelector.setGameUrl('http://localhost:8082')"
})
```

## Core Process

1. Ensure Expo dev server running on port 8082
2. Navigate to device-selector.html (port 8083)
3. Set game URL via `setGameUrl()`
4. Wait 1-2 seconds for render
5. Screenshot "iPhone Simulator" element

## Dev Menu Commands

```javascript
window.chadDeviceSelector.resetGame()     // Reset state
window.chadDeviceSelector.triggerWin()    // Test win
window.chadDeviceSelector.triggerLose()   // Test lose
window.chadDeviceSelector.toggleDebug()   // Debug overlay
```

## Screen Dimensions

| Metric | Value |
|--------|-------|
| Canvas (3x) | 1179 x 2556 |
| Logical | 393 x 852 |
| Safe area top | 162px |
| Safe area bottom | 102px |

## Screenshots

```javascript
mcp__playwright__browser_snapshot()  // Get refs
mcp__playwright__browser_take_screenshot({
  element: "iPhone Simulator",
  ref: "[ref from snapshot]",
  filename: "[game]/preview.png"
})
```

See `references/rendering-api.md` for game object classes.
See `references/expo-go-testing.md` for physical device testing.

## Adjacent Skills

- **visual-testing**: Capture and analyze screenshots
- **chad-optimizer**: Full optimization cycle
