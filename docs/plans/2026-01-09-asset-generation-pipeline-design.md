# Asset Generation Pipeline Design

**Date:** 2026-01-09
**Status:** Approved - Pending Research Phase

---

## Overview

Expand the Chad Loop with AI-powered asset generation for production-quality game art and sound. The system analyzes game code, generates cohesive visual styles, and produces App Store-ready assets autonomously.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Image Generation | Gemini via Playwright web automation | Free quota, best quality for game assets |
| Sound Generation | Open-source libraries first, AI fallback | Libraries cover 90% of needs, save AI for unique sounds |
| Art Direction | Automatic analysis + 5 style options for user selection | Balance autonomy with subjective art choices |
| Quality Gate | 90%+ on all core categories before art phase | Don't waste time on art for broken gameplay |
| Asset Quality | Production-ready for App Store | No placeholder mentality |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CHAD ASSET PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                  │
│  │  GAME CODE   │───▶│ ART DIRECTOR │───▶│ STYLE GUIDE  │                  │
│  │  (App.tsx)   │    │   (Claude)   │    │   (.json)    │                  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘                  │
│                                                  │                          │
│                      ┌───────────────────────────┴────────────────┐         │
│                      │                                            │         │
│                      ▼                                            ▼         │
│  ┌─────────────────────────────────────┐    ┌────────────────────────────┐ │
│  │     IMAGE GENERATION                │    │   SOUND GENERATION         │ │
│  │  ┌─────────────────────────────┐   │    │  ┌──────────────────────┐  │ │
│  │  │ Claude writes prompts       │   │    │  │ Search libraries     │  │ │
│  │  │ Playwright → Gemini web     │   │    │  │ (freesound, kenney)  │  │ │
│  │  │ Download generated images   │   │    │  │ AI fallback if none  │  │ │
│  │  │ Claude reviews quality      │   │    │  └──────────────────────┘  │ │
│  │  └─────────────────────────────┘   │    └────────────────────────────┘ │
│  └─────────────────────────────────────┘                                   │
│                      │                                            │         │
│                      └───────────────────────────────────────────┘         │
│                                          │                                  │
│                                          ▼                                  │
│                              ┌──────────────────────┐                       │
│                              │   assets/ folder     │                       │
│                              │   Ready for game     │                       │
│                              └──────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quality Gate Unlock

Art Director only activates when core gameplay is solid:

```
┌─ QUALITY SCORES ────────────────────────────────────────────────────────────┐
│ Renders:     92/100  ██████████████████░░  ✓ Excellent                      │
│ Layout:      94/100  ██████████████████░░  ✓ Excellent                      │
│ Interaction: 91/100  ██████████████████░░  ✓ Excellent                      │
│ Logic:       95/100  ██████████████████░░  ✓ Excellent                      │
│ Polish:      90/100  ██████████████████░░  ✓ Excellent                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🎨 ART DIRECTOR UNLOCKED - Game ready for asset generation                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Unlock Requirements:**
- Renders ≥ 90/100
- Layout ≥ 90/100
- Interaction ≥ 90/100
- Logic ≥ 90/100
- Polish ≥ 90/100 (gameplay polish, not visual)

---

## Art Direction Workflow

### Step 1: Analysis (Automatic)

Claude reads:
- `App.tsx` - game mechanics, entities, interactions
- `project.json` - game name, description
- Score system, win/lose conditions
- Color palette currently in use

Extracts: genre, mood, pacing, target audience, key visual elements

### Step 2: Generate 5 Style Options

Each style includes:
- Style name and description
- Sample sprite prompt
- Color palette (5-6 colors)
- Background style description
- UI element treatment
- **Preview image generated via Gemini**

Example styles (adapted per game type):
1. Retro Arcade - 16-bit pixel art, CRT glow
2. Modern Minimal - Flat shapes, bold colors
3. Hand-Drawn - Sketchy lines, paper texture
4. Neon Cyber - Dark backgrounds, glowing edges
5. Cute Kawaii - Rounded shapes, pastels

### Step 3: User Selection

```
🎨 ART DIRECTION - Choose your style

Based on your tap-collector game with fast-paced scoring,
here are 5 style directions:

1. Retro Arcade - 16-bit pixel art, CRT glow, chiptune vibes
2. Modern Minimal - Flat shapes, bold colors, clean geometry
3. Hand-Drawn - Sketchy lines, paper texture, indie charm
4. Neon Cyber - Dark backgrounds, glowing edges, synthwave
5. Cute Kawaii - Rounded shapes, pastels, happy faces

[Preview images shown]

Which style fits your vision?
```

### Step 4: Style Guide Saved

```json
// projects/[game]/art-style.json
{
  "style": "Retro Arcade",
  "palette": ["#1a1c2c", "#5d275d", "#b13e53", "#ef7d57", "#ffcd75"],
  "spriteStyle": "16-bit pixel art with 1px black outline",
  "backgroundStyle": "Scanline overlay, CRT curvature, dark vignette",
  "uiStyle": "Blocky fonts, neon glow on interactive elements",
  "soundStyle": "8-bit chiptune, bleeps, bloops",
  "promptPrefix": "16-bit retro arcade game sprite, pixel art, ..."
}
```

### Step 5: Autonomous Asset Generation

Using the saved style guide, generate all assets:
- Player sprite(s)
- Enemy/obstacle sprites
- Collectible items
- Background(s)
- UI elements (buttons, icons, score display)
- App icon (1024x1024)

---

## Gemini Web Automation

### Browser Setup

```javascript
// Use persistent context to maintain Google login
// Navigate to Gemini
mcp__playwright__browser_navigate({ url: "https://gemini.google.com" })

// Verify logged in
mcp__playwright__browser_snapshot()
```

### Generate Single Asset

1. **Inject Prompt**
```
Generate a game sprite: [asset description]

Style requirements:
- [from art-style.json promptPrefix]
- Transparent background (PNG)
- Size: [dimensions] pixels
- Colors: [palette from style guide]

This is for a mobile game. Keep it simple and readable at small sizes.
No text unless specified.
```

2. **Wait for Generation** (~15 seconds)

3. **Download Image** to `assets/sprites/[name].png`

4. **Quality Check** - Claude reviews, regenerate if needed (max 3 attempts)

### Batch Generation Order

1. Player sprite (sets the tone)
2. Background (establishes world)
3. Enemies/obstacles (match player style)
4. Collectibles/items
5. UI elements
6. App icon (1024x1024)

Start new Gemini chat between unrelated assets to avoid style drift.

---

## Sound Generation Pipeline

### Step 1: Analyze Sound Needs

Claude reads game code, identifies triggers:
```json
{
  "sounds": [
    { "id": "tap", "trigger": "player tap", "type": "ui" },
    { "id": "collect", "trigger": "item collected", "type": "reward" },
    { "id": "hit", "trigger": "collision", "type": "impact" },
    { "id": "win", "trigger": "level complete", "type": "fanfare" },
    { "id": "lose", "trigger": "game over", "type": "negative" },
    { "id": "bgm", "trigger": "gameplay", "type": "music_loop" }
  ]
}
```

### Step 2: Search Libraries (Primary)

Priority order:
1. **Kenney.nl** (CC0) - UI sounds, impacts, simple SFX
2. **OpenGameArt.org** (CC) - Music loops, ambient, themed packs
3. **Freesound.org** (CC0/CC-BY) - Specific sounds, requires API
4. **Pixabay Audio** - Music, ambient, longer audio

### Step 3: AI Fallback (When Needed)

Triggers:
- Unique game mechanic (no standard sound fits)
- Style-specific need ("chiptune that matches our pixel art")
- Custom voice/character sounds

Options: ElevenLabs SFX, Stable Audio, Suno

### Step 4: Style Matching

| Art Style | Sound Style |
|-----------|-------------|
| Retro Pixel | 8-bit chiptune, bleeps, bloops |
| Modern Minimal | Clean tones, soft clicks, subtle |
| Hand-Drawn | Organic, acoustic, whimsical |
| Neon Cyber | Synth, bass-heavy, electronic |
| Cute Kawaii | Bright, bouncy, playful pops |

---

## Updated Chad Loop Phases

### Phase 1: Core Development (Existing)
- Placeholder rectangles for sprites
- No sounds or system beeps
- Iterate on gameplay, logic, layout, interaction
- Exit: All 5 core categories ≥ 90/100

### Phase 2: Art Direction
- Claude analyzes game code
- Generates 5 style concepts with preview images
- User selects preferred style
- Style guide saved

### Phase 3: Asset Generation (Autonomous)
- Generate all images via Gemini
- Source sounds from libraries
- Wire assets into game code
- New category unlocked: "Visual"

### Phase 4: Visual Polish
- Iterate on art quality
- Fix style inconsistencies
- Exit: All 6 categories ≥ 90/100 → SHIP READY

---

## New Skills Required

| Skill | Purpose |
|-------|---------|
| `art-director` | Analyze game, generate style options, create style guide |
| `gemini-automation` | Playwright flow for Gemini web image generation |
| `asset-generator` | Orchestrate sprite/background/UI generation |
| `sound-sourcer` | Search libraries, download, convert audio |
| `visual-validator` | Review art cohesion, check style consistency |

---

## Research Requirements (2025/2026 Data)

All research must use current data. Search for 2025/2026 information.

### Research Task 1: Gemini Web Automation
- Current Gemini image generation capabilities (2025/2026)
- Exact DOM selectors for chat input, send, image output
- How to download generated images
- Transparent PNG support
- Rate limits / cooldowns
- Persistent login via Playwright

**Output:** `docs/research/gemini-automation-research.md`

### Research Task 2: Game Asset Prompting
- Best prompts for game sprites (test 20+ variations)
- Consistent style across generations
- Optimal sizes for different asset types
- Transparent background techniques
- Pixel art vs vector vs painted comparison

**Output:** `docs/research/asset-prompting-guide.md`

### Research Task 3: Sound Libraries Deep Dive
- Full Kenney.nl game audio inventory
- OpenGameArt best collections for mobile
- Freesound API setup (2025 version)
- License requirements per source
- Expo-compatible audio formats
- Audio conversion tools

**Output:** `docs/research/sound-libraries-catalog.md`

### Research Task 4: AI Sound Generation (2025)
- ElevenLabs Sound Effects current capabilities
- Stable Audio for game SFX
- Suno for short loops + licensing
- Free tiers / web automation options
- Best for 8-bit/chiptune sounds

**Output:** `docs/research/ai-sound-comparison.md`

### Research Task 5: Art Direction Best Practices
- Professional game style guide creation
- Mobile game art readability principles
- Color palette theory for game moods
- Top App Store game art analysis by category

**Output:** `docs/research/art-direction-principles.md`

---

## Implementation Order

### Phase A: Research (No code yet)
1. Gemini web automation research
2. Asset prompting experiments
3. Sound library cataloging
4. AI sound tool comparison
5. Art direction principles

### Phase B: Core Skills
1. `gemini-automation` skill
2. `art-director` skill
3. `sound-sourcer` skill

### Phase C: Integration
1. `asset-generator` skill
2. `visual-validator` skill
3. Update `chad-reference.md` with Phase 2-4 flow
4. Update quality scoring for Visual category

### Phase D: Testing
1. Run full pipeline on test game
2. Iterate on prompt templates
3. Build patch library for common issues

---

## Success Criteria

- [ ] Gemini automation works reliably (>90% success rate)
- [ ] Generated sprites are consistent within a game
- [ ] Sound sourcing finds matches for >80% of needs
- [ ] Full asset generation completes in <30 minutes per game
- [ ] Generated games pass App Store visual quality bar
- [ ] Zero manual asset creation required for simple games
