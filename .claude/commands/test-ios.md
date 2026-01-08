---
description: Run app on iOS Simulator or Appetize.io cloud simulator
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - mcp__XcodeBuildMCP__launch_app
  - mcp__XcodeBuildMCP__screenshot
  - mcp__XcodeBuildMCP__capture_logs
  - mcp__XcodeBuildMCP__boot_simulator
  - mcp__XcodeBuildMCP__list_simulators
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_screenshot
  - mcp__playwright__browser_click
---

# Test iOS Command

Run the app on iOS Simulator (local) or Appetize.io (cloud) and capture screenshots.

## Usage

```
/test-ios [--local | --cloud] [--simulator name]
```

## Options

- `--local` (default): Use local iOS Simulator via XcodeBuildMCP
- `--cloud`: Use Appetize.io cloud simulator via Playwright
- `--simulator`: Specify simulator name (default: iPhone 15)

## Local Testing (iOS Simulator)

### Step 1: Ensure Simulator Running

```
mcp__XcodeBuildMCP__list_simulators
mcp__XcodeBuildMCP__boot_simulator
simulator_name: "iPhone 15"
```

### Step 2: Launch App

```
mcp__XcodeBuildMCP__launch_app
bundle_id: "com.yourcompany.gamename"
simulator_name: "iPhone 15"
```

### Step 3: Capture Screenshot

```
mcp__XcodeBuildMCP__screenshot
simulator_name: "iPhone 15"
```

### Step 4: Capture Logs (if needed)

```
mcp__XcodeBuildMCP__capture_logs
simulator_name: "iPhone 15"
```

## Cloud Testing (Appetize.io)

### Prerequisites

- Appetize.io account with API key
- Uploaded .ipa file (public key returned)

### Step 1: Navigate to Appetize

```
mcp__playwright__browser_navigate
url: "https://appetize.io/app/YOUR_PUBLIC_KEY?device=iphone15&osVersion=17.0"
```

### Step 2: Wait for Boot

Wait 10-15 seconds for simulator to boot.

### Step 3: Capture Screenshot

```
mcp__playwright__browser_screenshot
```

### Step 4: Interact

```
mcp__playwright__browser_click
x: [screen x coordinate]
y: [screen y coordinate]
```

## Screenshot Analysis

After capturing, analyze for:

1. **Visual Correctness**
   - All UI elements visible
   - Correct colors and fonts
   - Proper layout

2. **Performance Indicators**
   - Smooth rendering
   - No visual lag

3. **Device Adaptation**
   - Safe areas respected
   - Dynamic Island clear
   - Home indicator clear

## Example Output

```markdown
## iOS Test Results

**Environment**: Local Simulator
**Device**: iPhone 15 (iOS 17.0)
**App**: MyGame (com.company.mygame)

### Screenshot Captured
[Screenshot analysis here]

### Observations
- App launched successfully
- Main menu visible
- Touch interactions working
- Score displays correctly

### Logs
[Relevant log entries if any]

### Status: ✅ PASS
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App not found | Run `/build` first |
| Simulator not booting | Check Xcode installation |
| Black screen | Wait longer for app load |
| Appetize timeout | Check API key and public key |

## Notes

- Local testing is faster but requires macOS + Xcode
- Cloud testing works from any platform
- Combine with `/optimize` for iterative testing
