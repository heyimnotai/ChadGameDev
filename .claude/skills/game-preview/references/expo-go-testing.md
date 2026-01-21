# Expo Go Testing Reference

## Physical Device Testing

Test haptics, audio, and native features on real device while AI uses browser.

## Setup

```bash
# Start Expo with tunnel mode
cd expo-games/apps/[game-name] && npx expo start --tunnel
```

## Display QR Code

```javascript
// Show QR in device selector
mcp__playwright__browser_evaluate({
  function: "() => window.chadDeviceSelector.showExpoGoQR('exp://u.expo.dev/your-tunnel-url')"
})

// Load web preview for AI testing
mcp__playwright__browser_evaluate({
  function: "() => window.chadDeviceSelector.setGameUrl('http://localhost:8082')"
})
```

## Dual Mode Operation

| Mode | Target | What It Tests |
|------|--------|---------------|
| QR Code | User's phone | Haptics, audio, native feel |
| Browser | AI analysis | Visual layout, game logic |

## API Functions

```javascript
window.chadDeviceSelector.showExpoGoQR(url)      // Show QR panel
window.chadDeviceSelector.hideExpoGoQR()         // Hide QR panel
window.chadDeviceSelector.setExpoGoConnected(bool)  // Update status
window.chadDeviceSelector.isExpoGoVisible()      // Check visibility
window.chadDeviceSelector.getExpoUrl()           // Get current URL
```

## Workflow

1. Start Expo with `--tunnel`
2. Extract tunnel URL from output
3. Navigate to device-selector.html
4. Show QR via `showExpoGoQR(tunnelUrl)`
5. User scans with Expo Go app
6. AI continues testing via browser iframe
