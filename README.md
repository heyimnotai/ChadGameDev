# Visual Chad Loop - Autonomous Game Development

An AI-powered game development framework that uses visual feedback loops to autonomously build and polish iOS games. Based on the Chad Loop methodology, extended with multimodal screenshot analysis and self-prompting capabilities.

## What is This?

Traditional [Chad](https://github.com/frankbria/chad-claude-code) uses typecheck/tests as feedback signals. **Visual Chad** uses screenshot analysis - Claude looks at the game, identifies issues, writes its own fix instructions, and iterates until quality gates pass.

```
User Prompt → Generate Code → Preview → Screenshot → Analyze → Self-Prompt → Fix → Repeat
                                                                      ↓
                                                              patches.md (learns from mistakes)
```

## Key Features

- **30 iOS Game Development Skills** - Specialized knowledge for core loops, polish, psychology, compliance
- **Visual Feedback Loop** - Screenshots analyzed by multimodal AI instead of just tests
- **Self-Prompting** - Claude writes its own instructions for the next iteration
- **Patch Learning System** - Problems and solutions accumulate in `patches.md`
- **Quality Gates** - 5 gates (renders, layout, visual, interaction, logic) must pass
- **MCP Integration** - Uses Playwright for screenshots, XcodeBuildMCP for native builds

## Setup (Required Before First Run)

### Step 1: Clone and Install Dependencies

```bash
git clone https://github.com/heyimnotai/VisualChadLoop.git
cd VisualChadLoop
npm install
npx playwright install chromium
```

### Step 2: Install System Dependencies (WSL/Linux Only)

**This is required on WSL/Linux for Chromium to work:**

```bash
sudo npx playwright install-deps chromium
```

Or manually:
```bash
sudo apt-get update && sudo apt-get install -y \
  libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libxcomposite1 libxdamage1 libxrandr2 \
  libgbm1 libpango-1.0-0 libcairo2 libasound2
```

### Step 3: Verify Setup

```bash
# Test that screenshots work
node scripts/capture-screenshot.js \
  "file://$(pwd)/preview/index.html" \
  "screenshots/test.png" \
  1000
```

You should see: `Screenshot saved: screenshots/test.png`

### Step 4: Run Claude Code

For fully hands-off operation (recommended):
```bash
claude --dangerously-skip-permissions
```

Then run:
```
/chad
```

---

## Quick Start

```bash
# Run the Chad loop (interactive mode)
/chad

# Or use the commands separately
/preview    # Generate and open HTML5 preview
/optimize   # Run optimization cycle on current preview
/build      # Build native iOS app
/test-ios   # Test on iOS Simulator
```

## How It Works

1. **User provides a game prompt** - "Create a hyper-casual coin collector"
2. **Skills generate code** - 30 specialized skills guide implementation
3. **Playwright captures screenshots** - Visual state at key moments
4. **Claude analyzes visuals** - Identifies issues using multimodal vision
5. **Patches consulted** - Known solutions applied from `patches.md`
6. **Self-prompt generated** - Claude writes next iteration instructions
7. **Fixes applied** - Top 3 priority issues addressed
8. **Loop repeats** - Until quality gates pass or max iterations

## Project Structure

```
GameSkillsFrameWork/
├── CLAUDE.md                    # Main documentation
├── SYSTEM_BREAKDOWN.md          # Architecture details
├── patches.md                   # Problem→Solution knowledge base
│
├── chad/                       # Loop infrastructure
│   ├── config.json             # Settings
│   ├── session-state.json      # Current session
│   ├── current-prompt.md       # Self-generated prompt
│   └── analysis-log.md         # History
│
├── .claude/
│   ├── commands/               # 6 slash commands
│   │   ├── chad.md           # /chad - Main loop
│   │   ├── preview.md         # /preview - HTML5 preview
│   │   ├── optimize.md        # /optimize - Optimization cycle
│   │   ├── build.md           # /build - iOS build
│   │   ├── test-ios.md        # /test-ios - Simulator test
│   │   └── push.md            # /push - Git commit
│   └── skills/                 # 4 Chad skills
│       ├── game-preview/
│       ├── visual-testing/
│       ├── chad-optimizer/
│       └── self-prompter/
│
├── ios-game-skills/            # 30 game development skills
│   ├── 01-compliance/          # App Store, IAP, Privacy
│   ├── 02-core-design/         # Loops, difficulty, economy
│   ├── 03-player-psychology/   # Retention, rewards, onboarding
│   ├── 04-polish/              # Animation, audio, haptics, juice
│   ├── 05-technical/           # Performance, SpriteKit, analytics
│   └── 06-orchestration/       # Architecture, quality, ship-ready
│
├── preview/                    # HTML5 game preview system
│   ├── index.html             # iPhone frame template
│   ├── game-renderer.js       # SpriteKit-like abstractions
│   └── game.js                # Current game code
│
└── screenshots/               # Captured during Chad loops
```

## The Patch System

When Chad encounters a problem and solves it, the solution is documented:

```markdown
## PATCH-002: Particles Not Visible
**Problem Pattern:** ParticleEmitter created but no particles appear
**Root Cause:** Emitter needs explicit start() call
**Solution:**
const emitter = new ParticleEmitter({...});
scene.addChild(emitter);
emitter.start();  // REQUIRED
**Affected Skills:** particle-effects, juice-orchestrator
```

Future iterations consult `patches.md` before debugging - using proven solutions instead of guessing. Over time, the system gets smarter.

## Quality Gates

| Gate | What It Checks |
|------|----------------|
| **Renders** | Canvas visible, no errors |
| **Layout** | Safe areas respected, no overflow |
| **Visual** | Colors correct, 60 FPS, typography |
| **Interaction** | Touch events work, feedback visible |
| **Logic** | Score updates, states transition |

All gates must pass for `<promise>COMPLETE</promise>`.

## Requirements

- [Claude Code](https://claude.ai/claude-code) CLI
- MCP servers configured:
  - `@playwright/mcp` - Browser automation for screenshots
  - `xcodebuildmcp` - iOS builds (optional, for native)

## Configuration

MCP servers are configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "XcodeBuildMCP": {
      "command": "npx",
      "args": ["-y", "xcodebuildmcp@latest"]
    }
  }
}
```

## Troubleshooting

### "libnspr4.so" or missing library errors

You haven't installed system dependencies. Run:
```bash
sudo npx playwright install-deps chromium
```

### "Could not find Chrome/Chromium"

Playwright browser not installed. Run:
```bash
npx playwright install chromium
```

### Browser hangs or MCP lock errors

The system uses a bash puppeteer script instead of MCP Playwright to avoid lock issues. If you see "Browser is already in use" errors from MCP, the system will automatically use the bash approach instead.

Kill stuck processes:
```bash
pkill -f chromium; pkill -f chrome
```

### Screenshots show blank page

Check for JavaScript errors:
```bash
node scripts/capture-screenshot.js "file://$(pwd)/preview/index.html" test.png 2000
```
Then check `test-console.txt` for errors.

### WSL: Browser window opens and hangs

Make sure `.mcp.json` has `PLAYWRIGHT_HEADLESS` set to `true`. The system uses headless screenshots and `explorer.exe` for user preview.

---

## Inspiration

- [Chad Wiggum Technique](https://dev.to/sivarampg/the-chad-wiggum-approach-running-ai-coding-agents-for-hours-not-minutes-57c1) by Geoffrey Huntley
- [Ryan Carson's Chad Guide](https://x.com/ryancarson) - Step-by-step breakdown
- [chad-claude-code](https://github.com/frankbria/chad-claude-code) - Original implementation

## License

MIT
