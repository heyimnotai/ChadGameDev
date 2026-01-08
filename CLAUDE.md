# Chad Loop iOS Game Development Environment

This project provides a complete development environment for iterative iOS game development with visual feedback loops. The "Chad Loop" enables rapid iteration by letting you see the results of code changes and optimize accordingly.

## The Chad Loop Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    │
│   │  PROMPT  │───▶│   PLAN   │───▶│   CODE   │───▶│ VISUALIZE│    │
│   │  (User)  │    │  (Opus)  │    │ (Skills) │    │ (Preview)│    │
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

1. **Preview a game**: `/preview`
2. **Build native app**: `/build`
3. **Test on iOS**: `/test-ios`
4. **Optimize iteratively**: `/optimize`
5. **Push changes**: `/push`

## Available Commands

| Command | Description |
|---------|-------------|
| `/preview` | Generate HTML5 preview and open in browser |
| `/build` | Build native iOS app using Xcode |
| `/test-ios` | Run on iOS Simulator or cloud |
| `/optimize` | Full Chad Loop optimization cycle |
| `/push` | Commit and push to GitHub |

## MCP Tools

### XcodeBuildMCP

Native iOS build pipeline:

- `mcp__XcodeBuildMCP__build_sim_name_proj` - Build project for simulator
- `mcp__XcodeBuildMCP__build_sim_name_workspace` - Build workspace for simulator
- `mcp__XcodeBuildMCP__list_simulators` - List available simulators
- `mcp__XcodeBuildMCP__boot_simulator` - Boot a simulator
- `mcp__XcodeBuildMCP__launch_app` - Launch app on simulator
- `mcp__XcodeBuildMCP__screenshot` - Capture simulator screenshot
- `mcp__XcodeBuildMCP__capture_logs` - Get app logs
- `mcp__XcodeBuildMCP__get_build_settings` - Inspect build settings

### Playwright MCP

Browser automation for previews:

- `mcp__playwright__browser_navigate` - Open URL in browser
- `mcp__playwright__browser_screenshot` - Capture screenshot
- `mcp__playwright__browser_click` - Simulate click/tap
- `mcp__playwright__browser_type` - Type text

## Project Skills

### Chad Loop Skills (`.claude/skills/`)

- **game-preview**: Generate HTML5 game previews from SpriteKit/SwiftUI concepts
- **visual-testing**: Capture and analyze screenshots with Playwright
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
│   │   ├── preview.md
│   │   ├── build.md
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
├── preview/
│   ├── index.html             # iPhone-framed canvas
│   ├── game-renderer.js       # SpriteKit-like utilities
│   └── game.js                # Current game code
├── ios-game-skills/           # iOS game development skills
│   ├── 01-compliance/
│   ├── 02-core-design/
│   ├── 03-player-psychology/
│   ├── 04-polish/
│   ├── 05-technical/
│   └── 06-orchestration/
└── docs/
    ├── specs/                  # Game specifications
    └── tasks/                  # Task tracking
```

## Preview System

### iPhone Frame Specifications

- **Device**: iPhone 15
- **Viewport**: 390 x 844 points
- **Canvas**: 1179 x 2556 pixels (3x Retina)
- **Safe Areas**:
  - Top: 162px (below Dynamic Island)
  - Bottom: 102px (above Home Indicator)

### Rendering Primitives

The preview system provides SpriteKit-like classes:

| SpriteKit | Preview |
|-----------|---------|
| SKSpriteNode | SpriteNode |
| SKShapeNode | ShapeNode |
| SKLabelNode | LabelNode |
| SKAction | Action |
| SKScene | Scene |
| CGPoint | Vector2 |
| UIColor | Color |

## Quality Gates

Before shipping, ensure all gates pass:

1. **Renders Correctly** - Game loads, all objects visible
2. **Layout Correct** - Safe areas respected, proper alignment
3. **Visual Quality** - Colors match, text readable, 60 FPS
4. **Interactions Work** - Touch events register, correct feedback
5. **Game Logic** - Score works, win/lose conditions function

## Development Workflow

### Creating a New Game

1. Plan the game concept and mechanics
2. Use game design skills to architect core loop
3. Create preview with `/preview`
4. Iterate with `/optimize` until quality gates pass
5. Build native with `/build`
6. Test on device with `/test-ios`
7. Push changes with `/push`

### Optimizing an Existing Game

1. Run `/preview` to see current state
2. Run `/optimize` to enter Chad Loop
3. Analyze screenshots for issues
4. Apply targeted fixes
5. Verify improvements
6. Repeat until satisfied
7. Push with `/push`

## Best Practices

- **Iterate quickly**: Use preview for rapid feedback before native builds
- **Fix one thing at a time**: Easier to verify and debug
- **Document changes**: Keep notes on what you tried and why
- **Use skills**: Leverage the iOS game development skills library
- **Test on device**: Preview is approximation, always verify on real iOS
- **Know when to stop**: Perfect is the enemy of shipped
