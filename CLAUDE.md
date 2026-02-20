# ChadGameLoop iOS Game Development Environment

This project provides a complete development environment for iterative iOS game development with visual feedback loops. The "ChadGameLoop" enables rapid iteration by letting you see the results of code changes and optimize accordingly.

Games are developed using React Native + Expo, enabling native iOS development with hot reload and direct App Store submission.

## ⚠️ CRITICAL: MCP TOOLS ARE NOT BASH COMMANDS ⚠️

**MCP tools (mcp__playwright__*, mcp__XcodeBuildMCP__*) are called using Claude's TOOL INTERFACE, NOT via Bash.**

```
✅ CORRECT: Use the tool directly
   mcp__playwright__browser_navigate({ url: "http://localhost:8083/device-selector.html" })
   mcp__playwright__browser_take_screenshot({ element: "iPhone Simulator", ref: "e85" })

❌ WRONG: Never run via Bash - this will FAIL with "command not found"
   Bash("mcp__playwright__browser_navigate ...")
   Bash("mcp__playwright__browser_install")
```

**If you see "command not found" errors for MCP tools, you are calling them incorrectly!**

## The ChadGameLoop Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    │
│   │  PROMPT  │───▶│   PLAN   │───▶│   CODE   │───▶│ VISUALIZE│    │
│   │  (User)  │    │  (Opus)  │    │ (Skills) │    │(Simulator)│   │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘    │
│                                                         │          │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐         │          │
│   │   PUSH   │◀───│   FIX    │◀───│ ANALYZE  │◀────────┘          │
│   │  (Git)   │    │  (Code)  │    │(Screenshot)                   │
│   └──────────┘    └──────────┘    └──────────┘                    │
│        │                ▲                                          │
│        │                └────── Iterate until quality gates ──────┤
│        │                                                          │
│        └──────────────────────────────────────────────────────────┘
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Quick Start

1. **Start developing**: `/chad` (creates new game or continues existing)
2. **Quick test display**: `/boot` (verifies device selector works - 30 seconds)
3. **Preview game**: `/preview` (opens game in browser emulator)
4. **Build for App Store**: `/build`
5. **Submit to App Store**: `/submit`
6. **Push changes**: `/push`

### Manual Server Start (without Claude)

If you want to test the device selector without Claude:
```bash
./start-servers.sh
# Then open: http://localhost:8083/device-selector.html
```

### Phone Testing with Expo Go

To test games on your physical iPhone:
```bash
cd expo-games/apps/[game-name]
npx expo start --tunnel
```
Then scan the QR code with your iPhone camera to open in Expo Go.

## iOS-First Development Requirements

**All games MUST be built for iOS devices, not as web apps.** Follow these requirements:

### ⚠️ CRITICAL: Device Selector URL for Testing ⚠️

**NEVER direct users to port 8082. ALWAYS use the device selector:**

```
✅ CORRECT: http://localhost:8083/device-selector.html
❌ WRONG:   http://localhost:8082
```

The device selector (port 8083) embeds the game in an iPhone simulator frame with:
- Multiple device sizes (iPhone SE, iPhone 15, iPad Pro, etc.)
- Dev tools (reset, refresh, trigger win/lose)
- Safe area visualization
- Realistic iOS chrome (status bar, home indicator)

Port 8082 is the raw Expo server - users should NEVER access it directly.

### iOS Game vs Web Game - Key Differences

**Games built with this system are iOS apps, not web apps.** The browser preview is for testing only.

| Aspect | iOS Game (What we build) | Web Game (NOT this) |
|--------|--------------------------|---------------------|
| Distribution | App Store | Web URL |
| Haptics | Native Taptic Engine | None (or vibration) |
| Audio | expo-av native | Web Audio API |
| Storage | AsyncStorage/SecureStore | localStorage |
| Touch | React Native touch events | DOM events |
| Rendering | React Native + Skia | Canvas/WebGL |
| Safe Areas | useSafeAreaInsets | CSS env() |

**Signs you're building a web game (BAD):**
- Using `document.*` or `window.*` without Platform checks
- Using CSS-in-JS libraries designed for web
- Using localStorage directly
- Using `<canvas>` or WebGL
- Using npm packages that only work in browser

**Signs you're building an iOS game (GOOD):**
- Using `Platform.OS` checks for any browser-specific code
- Using `expo-haptics` for feedback
- Using `expo-av` for audio
- Using React Native components (View, Text, Pressable)
- Using `useSafeAreaInsets` for iPhone notch/Dynamic Island
- All browser code is wrapped in `if (Platform.OS === 'web')` for preview compatibility

### SDK Versions (Expo SDK 54)

```json
{
  "dependencies": {
    "expo": "~54.0.31",
    "expo-haptics": "~15.0.8",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "~5.6.0"
  }
}
```

### app.json Configuration

```json
{
  "expo": {
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "requireFullScreen": true,
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    }
  }
}
```

### Platform Safety Rules

**NEVER use browser-only APIs without platform checks:**

```typescript
// ❌ WRONG - Will crash on iOS
window.addEventListener('message', handleMessage);

// ✅ CORRECT - Platform-safe
import { Platform } from 'react-native';

useEffect(() => {
  if (Platform.OS !== 'web') return;
  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

**Browser APIs that require Platform.OS checks:**
- `window.addEventListener` / `removeEventListener`
- `window.AudioContext` / `webkitAudioContext`
- `document.*`
- `localStorage` / `sessionStorage`
- `navigator.*` (except `navigator.vibrate` alternatives)

### Standalone App Structure

Each game should be a standalone app with its own dependencies:

```
expo-games/apps/[game-name]/
├── App.tsx           # Main game component
├── index.js          # Entry point (registerRootComponent)
├── app.json          # Expo config
├── package.json      # SDK 54 dependencies
├── metro.config.js   # Standalone Metro config
└── assets/           # Icons, sounds
```

**metro.config.js for standalone apps:**
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

config.projectRoot = projectRoot;
config.watchFolders = [];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
```

## TaskList Mode (Batch Processing)

Create a tasklist file and Chad will work through every item until complete:

### 1. Create Your TaskList

Copy the template and add your tasks:
```bash
cp templates/tasklist-template.md expo-games/apps/[game-name]/tasklist.md
```

Edit with your bugs/features:
```markdown
## Tasks

- [ ] [P0] Bug: Game crashes when score reaches 1000
- [ ] [P1] Feature: Add combo multiplier for rapid taps
- [ ] [P2] Polish: Screen shake feels weak on explosions
- [ ] Bug: Score label overlaps pause button
- [ ] Feature: Add power-up that slows time
```

### 2. Run Complete TaskList

```
/chad → Continue Project → [select game] → Complete TaskList
```

Chad will:
- Merge your tasklist with any known-issues.json
- Process tasks by priority (P0 first)
- Loop: implement → test → screenshot → verify until fixed
- Mark tasks `[x]` as they complete
- Learn from fixes (stores in patches.json)
- Auto-improve skills when a fix is used 3+ times

### 3. Self-Improving System

When Chad solves a problem:
1. Fix is stored in `chad/patches.json`
2. Next time similar issue appears, the fix is applied automatically
3. After a fix is used 3+ times, it's promoted to the relevant skill file

This means Chad gets better at fixing common issues over time.

## Extensive Design Mode

For complex games with detailed requirements, use Extensive Design mode:

### How It Works

```
/chad → New Game → Extensive Design → [describe your vision] → Chad builds it
```

Describe everything:
- Core gameplay mechanics
- Visual style, animations, effects
- Audio and music requirements
- UI/UX flows
- Reference games to learn from
- What makes it unique

### Scoring System

Chad rates your game across 11 iOS-focused categories (0-100%):

**90% = Top 100 in App Store category. Scoring is brutally honest.**

| Category | Weight | What It Measures |
|----------|--------|------------------|
| Core Loop | 18% | Main gameplay - must be inherently satisfying |
| Controls & Input | 10% | Touch responsiveness - must feel instant |
| Visual Polish | 12% | Animations, particles, juice on everything |
| Audio Design | 8% | SFX, music, ducking - mute must work |
| Haptic Feedback | 6% | iOS Taptic Engine - enhances, not annoys |
| UI/UX Design | 10% | Menus, HUD, iOS HIG compliance |
| Onboarding | 6% | 30 seconds to fun, learn by doing |
| Performance | 10% | **60fps on ALL devices** - non-negotiable |
| Difficulty | 8% | Hard but fair, smooth progression |
| Retention | 10% | Variable rewards, "one more game" |
| App Store Compliance | 2% | Privacy, universal, guidelines |

**Quality Levels:**
- 61-75%: Good (3.5-4 stars)
- 76-85%: Great (4-4.5 stars, top 500)
- 86-90%: Excellent (4.5+ stars, **top 100**)
- 91-95%: Outstanding (App Store featured)
- 96-100%: Masterpiece (Game of the Year)

### Auto-Priority

Chad automatically focuses on the **lowest scoring category** each iteration:

```
Iteration 12:
  Core Loop:      75%
  Visual Polish:  45%  ← FOCUS (lowest)
  Audio:          30%
  ...
```

### Completion

Runs until ALL categories reach threshold (default 85%), then prompts to continue or end.

Your design is saved to `expo-games/apps/[game]/design.json` and continuously referenced.

---

## Available Commands

| Command | Description |
|---------|-------------|
| `/chad` | Create new Expo game or continue existing development |
| `/boot` | Quick test - verify device selector works (~30 seconds) |
| `/preview` | Open game in browser emulator for manual testing |
| `/build` | Build native iOS app for App Store via EAS |
| `/submit` | Submit to App Store Connect via EAS |
| `/ship` | Archive completed game to chadcompletedGames repository |
| `/test-ios` | Run on iOS Simulator |
| `/optimize` | Full ChadGameLoop optimization cycle |
| `/push` | Commit and push to GitHub |

## Testing Modes

Choose your testing mode based on your setup:

### Browser Mode (Default for WSL2)

**This is the standard mode for WSL2 development.**

**Architecture:**
```
┌─────────────────────────────────────────────────────────────┐
│  Device Selector (port 8083)                                │
│  http://localhost:8083/device-selector.html                 │
│  ┌─────────────┐  ┌─────────────────────────────────────┐  │
│  │ Device      │  │  iPhone Simulator Frame              │  │
│  │ Selector    │  │  ┌─────────────────────────────┐    │  │
│  │ Panel       │  │  │ Game (iframe from :8082)    │    │  │
│  │             │  │  │                             │    │  │
│  │ - iPhone 15 │  │  │  Auto-loads when server    │    │  │
│  │ - iPhone SE │  │  │  is detected               │    │  │
│  │ - iPad Pro  │  │  │                             │    │  │
│  │             │  │  └─────────────────────────────┘    │  │
│  └─────────────┘  │  ┌─────────────────────────────┐    │  │
│                   │  │ Dev Tools Menu               │    │  │
│                   └──┴─────────────────────────────┴────┘  │
└─────────────────────────────────────────────────────────────┘
```

**How it works:**
1. Device selector server runs on port 8083
2. Game (Expo) runs on port 8082
3. Device selector auto-loads game when server is ready
4. User can test manually: `http://localhost:8083/device-selector.html`
5. AI captures screenshots via Playwright MCP

**Always shown to user:**
```
┌─ MANUAL TESTING URL ────────────────────────────────────────────────────────┐
│  http://localhost:8083/device-selector.html                                 │
│  Open in your browser. Game will auto-load when ready.                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Note:** Haptics won't work in browser, but all other features do.

### iOS Simulator Mode

Native testing on your Mac:

1. Game runs in iOS Simulator
2. AI captures screenshots via XcodeBuildMCP
3. Full native experience including haptics simulation
4. Requires Xcode installed

### Expo Go Mode

Test on real phone (requires WiFi):

1. Game runs on your phone via Expo Go app
2. Scan QR code to connect
3. Test haptics, audio, controls on real hardware
4. AI uses iOS Simulator for screenshots

## MCP Tools

### XcodeBuildMCP

Used for AI testing via iOS Simulator:

- `mcp__XcodeBuildMCP__list_simulators` - List available simulators
- `mcp__XcodeBuildMCP__boot_simulator` - Boot a simulator
- `mcp__XcodeBuildMCP__launch_app` - Launch app on simulator
- `mcp__XcodeBuildMCP__screenshot` - Capture simulator screenshot
- `mcp__XcodeBuildMCP__tap` - Send tap event to simulator
- `mcp__XcodeBuildMCP__swipe` - Send swipe gesture to simulator
- `mcp__XcodeBuildMCP__capture_logs` - Get app logs

### Playwright MCP

Browser automation (for legacy browser preview in archive/):

- `mcp__playwright__browser_navigate` - Open URL in browser
- `mcp__playwright__browser_screenshot` - Capture screenshot
- `mcp__playwright__browser_click` - Simulate click/tap

## Project Skills

### ChadGameLoop Skills (`.claude/skills/`)

- **game-preview**: Generate game previews (legacy browser-based)
- **visual-testing**: Capture and analyze screenshots
- **chad-optimizer**: Run the full optimization cycle

### iOS Game Development Skills (`ios-game-skills/`)

#### 01-compliance
- **app-store-review**: Navigate App Store review guidelines
- **game-center-integration**: Implement Game Center features
- **iap-implementation**: In-app purchase implementation
- **privacy-manifest**: Privacy nutrition labels
- **universal-app-requirements**: Universal app support

#### 02-core-design
- **core-loop-architect**: Design engaging game loops
- **difficulty-tuner**: Balance difficulty curves
- **economy-balancer**: Virtual economy design
- **progression-system**: Player progression mechanics
- **session-designer**: Optimal session length design
- **touch-control-optimizer**: Responsive, satisfying mobile controls

#### 03-player-psychology
- **dopamine-optimizer**: Reward timing and feedback
- **onboarding-architect**: First-time user experience
- **retention-engineer**: Long-term engagement strategies
- **reward-scheduler**: Variable reward schedules
- **social-mechanics**: Social features and competition

#### 04-polish
- **animation-system**: Smooth animations and transitions
- **audio-designer**: Sound effects and music
- **combo-multiplier-system**: Optimized combo counters and score multipliers with escalating feedback
- **haptic-optimizer**: Haptic feedback patterns
- **juice-orchestrator**: Game feel and satisfaction
- **particle-effects**: Visual effects systems
- **screen-shake-impact**: Impact feedback
- **ui-transitions**: UI animation patterns

#### 05-technical
- **analytics-integration**: Event tracking setup
- **asset-pipeline**: Asset management workflow
- **performance-optimizer**: 60fps optimization
- **spritekit-patterns**: SpriteKit best practices
- **swiftui-game-ui**: SwiftUI for game interfaces

#### 06-orchestration
- **game-architect**: High-level game architecture
- **quality-validator**: Quality assurance checks
- **ship-readiness-checker**: Launch readiness validation

#### 07-asset-generation
- **art-director**: Analyze game and generate 5 art style options with previews
- **gemini-image-generator**: Generate sprites/backgrounds using Gemini AI (web or API)
- **sound-sourcer**: Source audio from libraries (Kenney) with AI fallback (ElevenLabs)
- **asset-generator**: Orchestrator that coordinates the full asset generation pipeline
- **visual-validator**: Validate generated assets match style guide

#### 08-advanced-mechanics
- **core-expander**: Analyze game and recommend mechanics to add depth after core loop reaches 90%
- **loot-systems**: Design chests, gacha, daily rewards with proper pity mechanics and legal compliance
- **progression-systems**: Implement prestige, battle pass, mastery tracks for long-term retention
- **economy-systems**: Design shops, currencies, crafting with proper sink/faucet balance
- **character-systems**: Build traits, classes, skill trees, loadouts for player identity and theorycrafting
- **enemy-design**: Create enemy variety, boss encounters, AI behaviors, and difficulty scaling

## Directory Structure

```
.
├── CLAUDE.md                    # This file
├── .mcp.json                    # MCP server configuration
├── .claude/
│   ├── commands/               # Slash commands
│   │   ├── chad.md             # Main game development command
│   │   ├── build.md            # EAS Build command
│   │   ├── submit.md           # App Store submission
│   │   ├── test-ios.md
│   │   ├── optimize.md
│   │   └── push.md
│   ├── skills/                 # ChadGameLoop skills
│   │   ├── game-preview/
│   │   ├── visual-testing/
│   │   └── chad-optimizer/
│   ├── agents/                 # Custom agents
│   ├── hooks/                  # Event hooks
│   └── settings.json           # Permissions
├── expo-games/                  # Expo monorepo (SOURCE OF TRUTH for games)
│   ├── packages/
│   │   └── game-engine/        # Shared game engine
│   │       └── src/
│   │           ├── Engine.tsx  # Main engine component
│   │           ├── renderer/   # Skia rendering
│   │           ├── systems/    # Audio, Haptic, Touch, Animation
│   │           ├── entities/   # Game object types
│   │           └── types/      # Vector2, Color
│   └── apps/
│       └── [game-name]/        # Each game is a standalone Expo app
│           ├── App.tsx         # Main game component
│           ├── app.json        # Expo config
│           ├── assets/         # Icons, sounds
│           ├── design.json     # Game design document (optional)
│           ├── tasklist.md     # Task tracking (optional)
│           └── sessions/       # Development sessions (optional)
├── templates/                   # Templates for new games
│   ├── design-template.json    # Design document template
│   └── tasklist-template.md    # Tasklist template
├── archive/
│   ├── browser-preview/        # Legacy HTML5 preview (reference)
│   └── legacy-browser-games/   # Old browser-based games
├── ios-game-skills/            # iOS game development skills
│   ├── 01-compliance/
│   ├── 02-core-design/
│   ├── 03-player-psychology/
│   ├── 04-polish/
│   ├── 05-technical/
│   ├── 06-orchestration/
│   ├── 07-asset-generation/    # AI-powered asset generation (unlocks at 90%)
│   └── 08-advanced-mechanics/  # Deep game mechanics for expansion after 90%
├── .playwright-mcp/             # Playwright screenshots (auto-generated)
└── docs/
    ├── plans/                  # Design docs and implementation plans
    ├── specs/                  # Game specifications
    └── tasks/                  # Task tracking
```

## Expo Game Engine

### Architecture

Games use React Native Game Engine + React Native Skia:

- **React Native Game Engine**: Entity-component system, game loop
- **React Native Skia**: High-performance 2D rendering
- **expo-av**: Audio (sound effects + music)
- **expo-haptics**: Native haptic feedback

### Entity Types

| Type | Description |
|------|-------------|
| SpriteEntity | Rectangle with color, corner radius |
| TextEntity | Text with font, alignment, color |
| CircleEntity | Circle with radius and color |

### Systems

| System | Purpose |
|--------|---------|
| TouchSystem | Tap, double-tap, swipe, drag detection |
| AnimationSystem | Tweening with easing functions |
| AudioManager | Sound effects, background music |
| HapticManager | Impact, notification, selection feedback |

### Example Game Structure

```typescript
import { useState } from 'react';
import { Engine, createSprite, HapticManager, Vector2 } from '@expo-games/game-engine';

export default function Game() {
  const [entities, setEntities] = useState({
    player: createSprite('player', { position: new Vector2(200, 400) }),
    // ... more entities
  });

  const handleTouch = (x: number, y: number) => {
    HapticManager.getInstance().impact('light');
    // Handle game touch
  };

  return (
    <Engine
      entities={entities}
      systems={[]}
      onTouch={handleTouch}
      onUpdate={(entities) => setEntities({...entities})}
    />
  );
}
```

## Quality Gates

Before shipping, ensure all gates pass:

1. **Renders Correctly** - Game loads, all objects visible
2. **Layout Correct** - Safe areas respected, proper alignment
3. **Visual Quality** - Colors match, text readable, 60 FPS
4. **Interactions Work** - Touch events register, correct feedback
5. **Audio Works** - Sound effects play, music loops
6. **Haptics Work** - Feedback feels appropriate
7. **Game Logic** - Score works, win/lose conditions function

### Quality Gate Scoring

Each category is scored 0-100. When ALL core categories reach **≥90/100**, the Asset Generation phase unlocks:

| Category | Threshold | Description |
|----------|-----------|-------------|
| Renders | 90 | Game loads and displays correctly |
| Layout | 90 | UI elements properly positioned |
| Interaction | 90 | Touch/controls work flawlessly |
| Logic | 90 | Game mechanics function correctly |
| Polish | 90 | Animations, effects feel good |

## Asset Generation Pipeline

When quality gates are met (≥90 on all categories), Chad unlocks AI-powered asset generation:

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ASSET GENERATION PIPELINE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Phase 1: Analysis                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│   │  Read Code   │───▶│Extract Assets│───▶│Build Manifest│        │
│   └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                                     │
│   Phase 2: Art Direction                                            │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│   │ art-director │───▶│ User Picks   │───▶│Save Style    │        │
│   │  5 options   │    │   Style      │    │  Guide       │        │
│   └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                                     │
│   Phase 3: Image Generation (Gemini AI)                             │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│   │  Character   │───▶│  Enemies &   │───▶│ Backgrounds  │        │
│   │   Sprites    │    │   Items      │    │  & UI        │        │
│   └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                                     │
│   Phase 4: Sound Generation                                         │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│   │  Libraries   │───▶│  AI Fallback │───▶│  Integration │        │
│   │(Kenney, etc) │    │ (ElevenLabs) │    │              │        │
│   └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                                     │
│   Phase 5: Validation                                               │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│   │   visual-    │───▶│   Style      │───▶│  Ship Ready  │        │
│   │  validator   │    │  Cohesion    │    │              │        │
│   └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Art Direction

When triggered, the art-director skill:
1. Analyzes game code to understand mechanics, mood, and entities
2. Generates 5 distinct art style options (Retro Pixel, Modern Minimal, etc.)
3. Creates preview images for each style using Gemini
4. User selects preferred style
5. Saves comprehensive style guide to `art-style.json`

### Image Generation

Uses Gemini AI via web automation (preserves free quota):
- Character sprites generated first (establishes style reference)
- Enemies, items, power-ups follow
- Backgrounds and UI last
- All use consistent prompts from art-style.json

### Sound Sourcing

Tiered approach for audio:
1. **Open-source first**: Kenney.nl (CC0), OpenGameArt, Freesound
2. **AI fallback**: ElevenLabs SFX V2 for unique sounds
3. **Music**: Suno for background music (Pro plan for commercial)

### Visual Validation

Before shipping, visual-validator checks:
- Color palette adherence (within tolerance)
- Correct dimensions and transparency
- Style consistency across all assets
- Visual cohesion (sprites contrast with backgrounds)

## Development Workflow

### Creating a New Game

1. Run `/chad` and select "New Game"
2. Choose game type from templates
3. AI creates game in `expo-games/apps/[game-name]/`
4. Expo dev server starts automatically
5. AI iterates using iOS Simulator screenshots
6. When ready, QR code displayed for human testing
7. Test on physical device via Expo Go
8. Build with `/build`, submit with `/submit`

### Optimizing an Existing Game

1. Run `/chad` and select existing game
2. Run `/optimize` to enter ChadGameLoop
3. AI analyzes simulator screenshots
4. Apply targeted fixes with hot reload
5. Verify improvements
6. Repeat until quality gates pass
7. Push with `/push`

## App Store Submission

### Required Assets (per game)

- `assets/icon.png` - 1024x1024 app icon
- `assets/splash.png` - Launch screen image
- `store/screenshots/` - Required device sizes
- `store/description.txt` - App Store description
- `store/keywords.txt` - Search keywords
- `store/privacy-policy.md` - Privacy policy URL

### Build & Submit

```bash
# Build for App Store (runs in Expo cloud)
/build

# Submit to App Store Connect
/submit
```

## One-Time Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Link Apple Developer account
eas credentials
```

## Best Practices

- **Iterate quickly**: Hot reload enables instant feedback
- **Fix one thing at a time**: Easier to verify and debug
- **Test on real device**: Simulator is approximation, verify haptics/audio on phone
- **Use skills**: Leverage the iOS game development skills library
- **Prepare App Store assets early**: Icon, screenshots, description
- **Know when to stop**: Perfect is the enemy of shipped
