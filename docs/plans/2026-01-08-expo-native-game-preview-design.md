# Expo Native Game Preview System Design

**Date:** 2026-01-08
**Status:** Approved
**Goal:** Replace browser-based game preview with Expo Go native development, enabling App Store-ready games

## Overview

Migrate from HTML5 Canvas browser preview to React Native + Expo as the primary game development target. Games will be developed with native device testing via Expo Go and be ready for App Store submission when AI development completes.

## Key Decisions

| Decision | Choice |
|----------|--------|
| Primary target | React Native (web preview becomes secondary/removed) |
| Rendering | React Native Game Engine + React Native Skia (hybrid) |
| Dev workflow | Expo Go app, QR code connection, hot reload |
| Game code style | New API optimized for RN + Skia (not porting old API) |
| Preview integration | Replaces browser preview entirely |
| AI testing | iOS Simulator via XcodeBuildMCP |
| Human testing | Expo Go on physical device |

## Project Structure

```
GameSkillsFrameWork/
├── expo-games/                    # New Expo monorepo
│   ├── packages/
│   │   └── game-engine/           # Shared game renderer
│   │       ├── src/
│   │       │   ├── Engine.tsx     # Game loop, entity management
│   │       │   ├── Renderer.tsx   # Skia canvas rendering
│   │       │   ├── nodes/         # SpriteNode, ShapeNode, LabelNode
│   │       │   ├── systems/       # Physics, particles, animations
│   │       │   │   ├── TouchSystem.ts
│   │       │   │   ├── PhysicsSystem.ts
│   │       │   │   ├── ParticleSystem.ts
│   │       │   │   ├── AnimationSystem.ts
│   │       │   │   ├── AudioSystem.ts
│   │       │   │   └── HapticSystem.ts
│   │       │   └── index.ts
│   │       └── package.json
│   │
│   └── apps/
│       └── [game-name]/           # Each game is a standalone Expo app
│           ├── app/               # Expo Router app directory
│           ├── src/
│           │   └── Game.tsx       # Game logic
│           ├── assets/
│           │   ├── icon.png       # 1024x1024 app icon
│           │   ├── splash.png     # Launch screen
│           │   └── sounds/        # Game audio
│           ├── store/
│           │   ├── screenshots/   # App Store screenshots
│           │   ├── description.txt
│           │   ├── keywords.txt
│           │   └── privacy-policy.md
│           ├── app.json           # Expo config + App Store metadata
│           ├── eas.json           # Build configuration
│           └── package.json
│
├── projects/                      # Game metadata/saves (keep)
├── ios-game-skills/               # Game design skills (keep)
└── .claude/commands/
    └── chad.md                    # Updated for Expo workflow
```

## Game Engine Design

### Engine.tsx

Wraps React Native Game Engine with Skia rendering:

```typescript
import { GameEngine } from 'react-native-game-engine'
import { Canvas } from '@shopify/react-native-skia'

export function Engine({ systems, entities, onUpdate }) {
  return (
    <GameEngine
      systems={systems}
      entities={entities}
      onEvent={handleGameEvent}
    >
      <SkiaRenderer entities={entities} />
    </GameEngine>
  )
}
```

### SkiaRenderer.tsx

Draws all entities using Skia primitives:

```typescript
import { Canvas, RoundedRect, Text, Circle } from '@shopify/react-native-skia'

export function SkiaRenderer({ entities }) {
  return (
    <Canvas style={{ flex: 1 }}>
      {Object.values(entities).map(entity => {
        if (entity.type === 'sprite') return <RoundedRect {...entity} />
        if (entity.type === 'label') return <Text {...entity} />
        if (entity.type === 'circle') return <Circle {...entity} />
      })}
    </Canvas>
  )
}
```

### Built-in Systems

| System | Purpose |
|--------|---------|
| TouchSystem | Tap, swipe, drag gesture handling |
| PhysicsSystem | Simple collision detection |
| ParticleSystem | Particle effects via Skia |
| AnimationSystem | Tweening, easing |
| AudioSystem | Sound effects + music via expo-av |
| HapticSystem | Native haptic feedback via expo-haptics |

## Audio System

Full audio support using expo-av:

```typescript
import { Audio } from 'expo-av'

class AudioManager {
  private sounds: Map<string, Audio.Sound> = new Map()
  private music: Audio.Sound | null = null

  async preload(manifest: { [key: string]: any }) {
    for (const [name, source] of Object.entries(manifest)) {
      const { sound } = await Audio.Sound.createAsync(source)
      this.sounds.set(name, sound)
    }
  }

  async playSFX(name: string, options?: { volume?: number }) {
    const sound = this.sounds.get(name)
    await sound?.setVolumeAsync(options?.volume ?? 1.0)
    await sound?.replayAsync()
  }

  async playMusic(source: any, volume = 0.5) {
    this.music = (await Audio.Sound.createAsync(source, {
      isLooping: true,
      volume
    })).sound
    await this.music.playAsync()
  }

  async duckMusic(duration = 200) {
    await this.music?.setVolumeAsync(0.2)
    setTimeout(() => this.music?.setVolumeAsync(0.5), duration)
  }
}
```

## Updated /chad Workflow

### New Game Flow

```
/chad
  → "New Game"
  → Select game type
  → Creates: expo-games/apps/[game-name]/
  → Starts Expo dev server
  → Displays QR code in terminal
  → Scan with Expo Go, see game on phone
```

### Development Loop

```
1. Edit expo-games/apps/[game-name]/src/Game.tsx
2. Hot reload appears on phone instantly
3. AI captures screenshot via iOS Simulator
4. Analyze, iterate
5. Test haptics/audio live on device
```

### Commands

| Command | Action |
|---------|--------|
| `/chad` | Create/continue game (Expo apps) |
| `/build` | Run `eas build` for App Store |
| `/submit` | Run `eas submit` to App Store Connect |

## Dual Testing System

### AI Testing (Autonomous)

Uses iOS Simulator for Chad Loop iterations:

```
1. Game runs in iOS Simulator (on dev machine)
2. AI sends touch commands via XcodeBuildMCP
3. AI captures screenshots from simulator
4. AI analyzes, makes code changes
5. Hot reload applies changes
6. Repeat for N iterations
```

MCP tools used:
- `mcp__XcodeBuildMCP__boot_simulator`
- `mcp__XcodeBuildMCP__launch_app`
- `mcp__XcodeBuildMCP__screenshot`
- `mcp__XcodeBuildMCP__tap`
- `mcp__XcodeBuildMCP__swipe`

### Human Testing (Expo Go)

Physical device testing after AI iterations:

```
1. AI finishes iteration cycle
2. Terminal shows "Ready for testing" + QR code
3. Play on physical device via Expo Go
4. Feel haptics, hear audio, test controls
5. Provide feedback or approve
```

## Build & Submit Pipeline

### /build

Creates App Store-ready binary via EAS:

```bash
cd expo-games/apps/[game-name]
eas build --platform ios --profile production
```

- Builds in Expo cloud (~10-15 min)
- Signs with Apple Developer certificates
- Returns downloadable .ipa

### /submit

Publishes to App Store Connect:

```bash
eas submit --platform ios --latest
```

- Uploads latest build
- Review in App Store Connect web UI
- Submit for Apple review

## App Store Readiness

Each game includes all required assets:

### Auto-generated

- `assets/icon.png` - 1024x1024 app icon
- `assets/splash.png` - Launch screen
- `store/screenshots/` - Required device sizes
- `store/description.txt` - App Store description
- `store/keywords.txt` - Search keywords
- `store/privacy-policy.md` - Required URL

### app.json Template

```json
{
  "expo": {
    "name": "[Game Name]",
    "slug": "[game-slug]",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash.png" },
    "ios": {
      "bundleIdentifier": "com.yourcompany.[game-slug]",
      "buildNumber": "1",
      "supportsTablet": true,
      "requireFullScreen": true,
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "plugins": [
      "expo-av",
      "expo-haptics",
      "expo-screen-capture"
    ]
  }
}
```

## Dependencies

```json
{
  "expo": "~50.0.0",
  "react-native-game-engine": "^1.2.0",
  "@shopify/react-native-skia": "^0.1.0",
  "expo-av": "~13.0.0",
  "expo-haptics": "~12.0.0",
  "expo-screen-capture": "~5.0.0"
}
```

## One-Time Setup

```bash
npm install -g eas-cli
eas login
eas credentials  # Link Apple Developer account
```

## Files to Remove

After migration complete:
- `preview/index.html`
- `preview/game-renderer.js`
- `preview/game.js`
- Browser screenshot scripts

## Migration Path

Existing games (block-blast, hyper-tetris) will need to be rewritten using the new game engine. The game logic and design can be preserved, but the rendering code changes.
