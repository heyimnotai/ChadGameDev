# /chad - Visual Chad Loop

## STRICT INSTRUCTION: DO NOT IMPROVISE QUESTIONS

You MUST use the EXACT AskUserQuestion calls defined below. Do NOT:
- Add options
- Remove options
- Change wording
- Reorder options
- Combine questions
- Skip questions
- Paraphrase options

Copy the JSON exactly as written. The only exception is the project list which must be populated dynamically.

---

## Step 1: Get Project List

Run this command first to get available projects:

```bash
ls -1 expo-games/apps/ | grep -v template
```

Save the output as PROJECT_LIST for Step 3.

---

## Step 2: Ask Mode

Call AskUserQuestion with this EXACT JSON:

```json
{
  "questions": [{
    "question": "What would you like to do?",
    "header": "Mode",
    "multiSelect": false,
    "options": [
      { "label": "New Game", "description": "Create a new game from scratch" },
      { "label": "Continue Project", "description": "Keep improving an existing game" }
    ]
  }]
}
```

---

## Step 3: Branch Based on Mode

### If user selected "New Game":

Call AskUserQuestion with this EXACT JSON:

```json
{
  "questions": [{
    "question": "How detailed is your game idea?",
    "header": "Design",
    "multiSelect": false,
    "options": [
      { "label": "Quick Start", "description": "Pick a template and start coding fast" },
      { "label": "Extensive Design", "description": "Describe your full vision first" }
    ]
  }]
}
```

Then if "Quick Start", call AskUserQuestion with this EXACT JSON:

```json
{
  "questions": [{
    "question": "What type of game do you want to create?",
    "header": "Game Type",
    "multiSelect": false,
    "options": [
      { "label": "Tap Collector", "description": "Tap items to collect points" },
      { "label": "Endless Runner", "description": "Avoid obstacles, run forever" },
      { "label": "Puzzle Game", "description": "Match or solve puzzles" },
      { "label": "Block Puzzle", "description": "Tetris-style block placement" }
    ]
  }]
}
```

Then ask for game name (free text).

---

### If user selected "Continue Project":

Build the project options from PROJECT_LIST (from Step 1). Each project becomes an option with format:
- label: the project folder name
- description: "Game project"

Call AskUserQuestion with the dynamically built project list.

Then call AskUserQuestion with this EXACT JSON for focus:

```json
{
  "questions": [{
    "question": "What should we focus on?",
    "header": "Focus",
    "multiSelect": false,
    "options": [
      { "label": "Auto-improve", "description": "Let Chad analyze and decide what to fix" },
      { "label": "Complete TaskList", "description": "Work through tasklist.md + known issues" },
      { "label": "Fix Specific Bug", "description": "Describe a bug to fix" },
      { "label": "Add Feature", "description": "Implement a specific feature" },
      { "label": "More Juice", "description": "Better animations, particles, effects" },
      { "label": "New Mechanics", "description": "Add gameplay depth" }
    ]
  }]
}
```

---

## Step 4: Ask Testing Mode

Call AskUserQuestion with this EXACT JSON:

```json
{
  "questions": [{
    "question": "How do you want to test?",
    "header": "Testing",
    "multiSelect": false,
    "options": [
      { "label": "Browser", "description": "Test in browser with device simulator" },
      { "label": "iOS Simulator", "description": "Native testing via Xcode (Mac only)" },
      { "label": "Expo Go", "description": "Test on your phone via QR code" }
    ]
  }]
}
```

---

## Step 5: Ask Cycles (skip if focus is TaskList or Bug)

Call AskUserQuestion with this EXACT JSON:

```json
{
  "questions": [{
    "question": "How many improvement cycles?",
    "header": "Cycles",
    "multiSelect": false,
    "options": [
      { "label": "10 cycles", "description": "Thorough improvements - fix issues and add polish" },
      { "label": "5 cycles", "description": "Quick polish pass - fix obvious issues" },
      { "label": "20 cycles", "description": "Maximum quality - aim for 90+ scores" }
    ]
  }]
}
```

---

## Step 6: New Game Setup (if applicable)

1. Copy template: `cp -r expo-games/apps/template expo-games/apps/[game-name]`
2. Update app.json with game name, slug, bundleIdentifier
3. Install: `cd expo-games/apps/[game-name] && npm install`

---

## Step 7: Kill Stale Processes

```bash
pkill -9 -f 'http-server' 2>/dev/null || true; pkill -9 -f 'expo' 2>/dev/null || true; pkill -9 -f 'metro' 2>/dev/null || true; sleep 2; fuser -k 8082/tcp 8083/tcp 2>/dev/null || true; sleep 1; true
```

---

## Step 8: Load Reference

```
Read("chad/chad-reference.md")
```

---

## Step 9: Start Servers

### Browser Mode

```bash
npx -y http-server ./chad -p 8083 --cors -c-1 > /tmp/device-selector.log 2>&1 &
```

```bash
cd expo-games/apps/[PROJECT] && npx expo start --web --port 8082 > /tmp/expo-game.log 2>&1 &
```

```bash
sleep 8 && curl -s -o /dev/null -w "8083:%{http_code} " http://localhost:8083/device-selector.html && curl -s -o /dev/null -w "8082:%{http_code}\n" http://localhost:8082
```

Tell user:
```
┌─ MANUAL TESTING URL ────────────────────────────────────────────────────────┐
│  http://localhost:8083/device-selector.html                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Expo Go Mode

```bash
./start-servers.sh [PROJECT] --tunnel
```

### iOS Simulator Mode

Use XcodeBuildMCP tools.

---

## Step 10: Setup Playwright

```javascript
mcp__playwright__browser_install()
mcp__playwright__browser_close()
mcp__playwright__browser_resize({ width: 900, height: 950 })
mcp__playwright__browser_navigate({ url: "http://localhost:8083/device-selector.html" })
mcp__playwright__browser_wait_for({ text: "Device Selector" })
```

---

## Step 11: Screenshot and Loop

```javascript
mcp__playwright__browser_snapshot()
mcp__playwright__browser_take_screenshot({ element: "iPhone Simulator", ref: "[ref]", filename: "[game]/initial.png" })
```

Follow `chad/chad-reference.md` for the loop.

---

## Technical Requirements

### SDK 54
```json
{
  "expo": "~54.0.31",
  "expo-haptics": "~15.0.8",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-safe-area-context": "~5.6.0"
}
```

### Platform Safety
```typescript
import { Platform } from 'react-native';
useEffect(() => {
  if (Platform.OS !== 'web') return;
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

### Large Files
Use Grep + Read with offset/limit. Never read entire App.tsx.

---

## Completion

```
═══════════════════════════════════════════════════════════════
✅ DEVELOPMENT COMPLETE: [game-name]
═══════════════════════════════════════════════════════════════

🎮 Test: http://localhost:8083/device-selector.html

Next: /build, /submit, /push
═══════════════════════════════════════════════════════════════
```

Always use port 8083, never 8082 directly.
