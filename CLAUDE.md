# Chad Loop iOS Game Development Environment

This project provides a complete development environment for iterative iOS game development with visual feedback loops. The "Chad Loop" enables rapid iteration by letting you see the results of code changes and optimize accordingly.

Games are developed using React Native + Expo, enabling native iOS development with hot reload and direct App Store submission.

## The Chad Loop Workflow

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
2. **Build for App Store**: `/build`
3. **Submit to App Store**: `/submit`
4. **Optimize iteratively**: `/optimize`
5. **Push changes**: `/push`

## Available Commands

| Command | Description |
|---------|-------------|
| `/chad` | Create new Expo game or continue existing development |
| `/build` | Build native iOS app for App Store via EAS |
| `/submit` | Submit to App Store Connect via EAS |
| `/ship` | Archive completed game to chadcompletedGames repository |
| `/test-ios` | Run on iOS Simulator |
| `/optimize` | Full Chad Loop optimization cycle |
| `/push` | Commit and push to GitHub |

## Dual Testing System

### AI Testing (Autonomous)

AI develops and tests games using iOS Simulator:

1. Game runs in iOS Simulator on dev machine
2. AI captures screenshots via XcodeBuildMCP
3. AI analyzes screenshots, makes code changes
4. Expo hot reload applies changes instantly
5. Repeat for N iterations until quality gates pass

### Human Testing (Expo Go)

After AI completes development iterations:

1. AI displays QR code in terminal
2. Scan with Expo Go app on physical device
3. Test haptics, audio, controls on real hardware
4. Provide feedback or approve for submission

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

### Chad Loop Skills (`.claude/skills/`)

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

#### 03-player-psychology
- **dopamine-optimizer**: Reward timing and feedback
- **onboarding-architect**: First-time user experience
- **retention-engineer**: Long-term engagement strategies
- **reward-scheduler**: Variable reward schedules
- **social-mechanics**: Social features and competition

#### 04-polish
- **animation-system**: Smooth animations and transitions
- **audio-designer**: Sound effects and music
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
│   ├── skills/                 # Chad Loop skills
│   │   ├── game-preview/
│   │   ├── visual-testing/
│   │   └── chad-optimizer/
│   ├── agents/                 # Custom agents
│   ├── hooks/                  # Event hooks
│   └── settings.json           # Permissions
├── expo-games/                  # Expo monorepo
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
│           ├── app/            # Expo Router
│           ├── src/Game.tsx    # Game logic
│           ├── assets/         # Icons, sounds
│           ├── store/          # App Store metadata
│           ├── app.json        # Expo config
│           └── eas.json        # Build config
├── archive/
│   └── browser-preview/        # Legacy HTML5 preview (reference)
├── ios-game-skills/            # iOS game development skills
│   ├── 01-compliance/
│   ├── 02-core-design/
│   ├── 03-player-psychology/
│   ├── 04-polish/
│   ├── 05-technical/
│   └── 06-orchestration/
├── projects/                    # Game metadata/saves
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
2. Run `/optimize` to enter Chad Loop
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
