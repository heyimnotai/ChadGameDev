# Visual Chad Loop: Autonomous Game Development System

## Overview

This system extends the Chad Loop methodology (created by Geoffrey Huntley, popularized by Ryan Carson) specifically for **game development with visual feedback**. Unlike traditional Chad which uses typecheck/tests as feedback signals, this system uses **screenshot analysis and multimodal AI** to evaluate gameplay, identify issues, and self-correct.

---

## How Traditional Chad Works (Reference)

```
┌─────────────────────────────────────────────────────────────┐
│  TRADITIONAL CHAD LOOP                                     │
│                                                             │
│  prompt.md → AI Agent → Implement → typecheck/test          │
│       ↑                                    │                │
│       │                                    ▼                │
│       └──────── git commit ◄───── Pass? ───┘                │
│                     │              │                        │
│                     │              └── Fail → Loop back     │
│                     ▼                                       │
│              progress.txt (learnings)                       │
└─────────────────────────────────────────────────────────────┘

Feedback Signal: ✓ typecheck passes, ✓ tests pass
Memory: git history + progress.txt + prd.json
Stop Condition: <promise>COMPLETE</promise>
```

---

## Your System: Visual Chad for Games

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  VISUAL CHAD LOOP FOR GAME DEVELOPMENT                                     │
│                                                                             │
│  User Prompt                                                                │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  GAME GENERATION PHASE                                              │   │
│  │  • Skills (30 iOS game skills) guide implementation                 │   │
│  │  • MCP tools (XcodeBuildMCP, Playwright) execute builds             │   │
│  │  • Code generated for preview/native                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  VISUAL TESTING PHASE                                               │   │
│  │  • Playwright launches preview/simulator                            │   │
│  │  • Screenshots captured at key moments:                             │   │
│  │    - Initial render                                                 │   │
│  │    - After interactions (tap, swipe)                                │   │
│  │    - Game state transitions                                         │   │
│  │    - Error states                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ANALYSIS PHASE (Claude Multimodal)                                 │   │
│  │  • Analyze screenshots for:                                         │   │
│  │    - Rendering issues (blank screen, wrong colors)                  │   │
│  │    - Layout problems (safe area violations, overflow)               │   │
│  │    - Visual polish (animations, effects, juice)                     │   │
│  │    - Game logic correctness (score updates, state changes)          │   │
│  │    - UX issues (touch targets, feedback)                            │   │
│  │  • Compare against quality gates                                    │   │
│  │  • Generate structured analysis report                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SELF-PROMPTING PHASE (KEY INNOVATION)                              │   │
│  │  • Claude writes its OWN next prompt based on analysis              │   │
│  │  • Prompt includes:                                                 │   │
│  │    - What went wrong (specific issues found)                        │   │
│  │    - What went right (preserve these)                               │   │
│  │    - Proposed fixes (prioritized)                                   │   │
│  │    - Context from patches.md (known solutions)                      │   │
│  │  • No human intervention needed                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PATCH ACCUMULATION PHASE (LEARNING SYSTEM)                         │   │
│  │  • When a problem is solved:                                        │   │
│  │    1. Document the problem pattern                                  │   │
│  │    2. Document the solution                                         │   │
│  │    3. Link to affected skills                                       │   │
│  │    4. Add to patches.md                                             │   │
│  │  • Future iterations consult patches.md FIRST                       │   │
│  │  • Skills get updated with patch learnings over time                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ITERATION CONTROL                                                  │   │
│  │  • User sets max iterations (e.g., 10)                              │   │
│  │  • Loop continues until:                                            │   │
│  │    - All quality gates pass, OR                                     │   │
│  │    - Max iterations reached                                         │   │
│  │  • Each iteration builds on previous learnings                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Differences from Traditional Chad

| Aspect | Traditional Chad | Visual Chad for Games |
|--------|-------------------|------------------------|
| **Feedback Signal** | typecheck + unit tests | Screenshot analysis (multimodal) |
| **Prompt Source** | Human-written prompt.md | AI-generated from analysis |
| **Learning Storage** | progress.txt | patches.md (problem→solution pairs) |
| **Quality Gates** | Tests pass/fail | Visual quality gates (5 gates) |
| **Domain** | General software | Game development specific |
| **Skill Integration** | None | 30 specialized game skills |
| **Iteration Trigger** | Test failure | Visual issue detected |

---

## System Components

### 1. Input Layer

**User Prompt**
```
"Create a hyper-casual coin collection game with satisfying
tap feedback and particle effects"
```

**Configuration**
```json
{
  "maxIterations": 10,
  "qualityGates": ["renders", "layout", "visual", "interaction", "logic"],
  "targetPlatform": "preview",  // or "ios-simulator"
  "captureInterval": "on-change"
}
```

### 2. Game Generation (Skills + MCP)

**Skills Used:**
- `game-architect` - Overall structure
- `core-loop-architect` - Gameplay loop
- `juice-orchestrator` - Game feel
- `particle-effects` - Visual effects
- `dopamine-optimizer` - Reward timing
- `spritekit-patterns` - Implementation patterns

**MCP Tools:**
- `XcodeBuildMCP` - Native iOS builds
- `Playwright` - Browser preview + screenshots

### 3. Visual Testing Pipeline

```javascript
// Screenshot capture sequence
const captures = [
  { name: "initial", trigger: "page-load", delay: 1000 },
  { name: "gameplay", trigger: "after-tap", coordinates: [196, 426] },
  { name: "reward", trigger: "score-change", delay: 500 },
  { name: "game-over", trigger: "state-change", state: "ended" }
];
```

### 4. Quality Gates (Expanded)

| Gate | What It Checks | Pass Criteria |
|------|----------------|---------------|
| **Renders** | Screen not blank, canvas exists | Elements visible |
| **Layout** | Safe areas respected, no overflow | All in bounds |
| **Visual** | Colors correct, 60 FPS, no artifacts | Matches spec |
| **Interaction** | Touch works, feedback exists | Response < 100ms |
| **Logic** | Score updates, states transition | Behavior correct |
| **Polish** | Animations smooth, effects play | "Feels good" |

### 5. Self-Prompting Engine

After analysis, Claude generates its own prompt:

```markdown
## Analysis Summary (Iteration 3)

### Issues Found
1. CRITICAL: Particle effects not appearing after tap
   - Expected: Burst of 20 particles on coin collect
   - Actual: No particles visible in screenshot

2. HIGH: Score label overlapping Dynamic Island
   - Safe area top: 162px required, current: 50px

3. MEDIUM: Tap feedback too subtle
   - Haptic should be .medium, appears to be .light

### What's Working
- Coin spawning at correct rate
- Background color matches spec
- Touch detection functional

### Next Actions (Priority Order)
1. Fix particle emitter initialization in game.js:45
2. Move score label below safe area (y = 180px)
3. Upgrade haptic to .medium impact

### Patches Consulted
- PATCH-007: "Particles not rendering" → Check emitter.start() called
- PATCH-012: "Safe area violations" → Use SAFE_AREA_TOP constant
```

### 6. Patches System (Knowledge Accumulation)

**patches.md Structure:**

```markdown
# Chad Patches - Game Development Knowledge Base

## How This File Works
When Chad encounters a problem and solves it, the problem-solution
pair is recorded here. Future iterations consult this file BEFORE
attempting fixes, using proven solutions instead of guessing.

---

## PATCH-001: Blank Canvas on Initial Render
**Problem Pattern:** Screenshot shows white/blank canvas after page load
**Root Cause:** game.js not initializing scene before first frame
**Solution:** Call `scene.setup()` in DOMContentLoaded, add 100ms delay before screenshot
**Affected Skills:** game-preview, visual-testing
**Date Added:** 2025-01-07

---

## PATCH-002: Particles Not Visible
**Problem Pattern:** ParticleEmitter created but no particles appear
**Root Cause:** Emitter needs explicit start() call after adding to scene
**Solution:**
```javascript
const emitter = new ParticleEmitter(config);
scene.addChild(emitter);
emitter.start(); // REQUIRED - often forgotten
```
**Affected Skills:** particle-effects, juice-orchestrator
**Date Added:** 2025-01-07

---

## PATCH-003: Touch Events Not Registering
**Problem Pattern:** Tap on game elements has no effect
**Root Cause:** Event listener on wrong element (canvas vs container)
**Solution:** Attach to canvas element directly, use correct coordinate transform
**Affected Skills:** spritekit-patterns, game-preview
**Date Added:** 2025-01-07

---

## Index by Symptom
- "Blank screen" → PATCH-001
- "No particles" → PATCH-002
- "Touch not working" → PATCH-003
- "Safe area violation" → PATCH-012
- "Animation stuttering" → PATCH-015
- "Score not updating" → PATCH-008
```

---

## File Structure

```
GameSkillsFrameWork/
├── CLAUDE.md                    # Main documentation
├── SYSTEM_BREAKDOWN.md          # This file
├── patches.md                   # Problem→Solution knowledge base (NEW)
├── .mcp.json                    # MCP server config
│
├── .claude/
│   ├── settings.json
│   ├── commands/
│   │   ├── chad.md             # Main Chad loop command (NEW)
│   │   ├── preview.md
│   │   ├── optimize.md
│   │   └── ...
│   └── skills/
│       ├── game-preview/
│       ├── visual-testing/
│       ├── chad-optimizer/
│       └── self-prompter/       # Self-prompting logic (NEW)
│
├── chad/                       # Chad loop infrastructure (NEW)
│   ├── config.json              # Iteration settings
│   ├── current-prompt.md        # Current iteration prompt
│   ├── analysis-log.md          # Screenshot analysis history
│   └── session-state.json       # Current session state
│
├── ios-game-skills/             # 30 game development skills
│   └── ...
│
├── preview/                     # HTML5 preview system
│   ├── index.html
│   ├── game-renderer.js
│   └── game.js
│
└── screenshots/                 # Captured screenshots (NEW)
    ├── iteration-001/
    │   ├── initial.png
    │   ├── gameplay.png
    │   └── analysis.md
    └── iteration-002/
        └── ...
```

---

## Workflow: Complete Chad Session

### Phase 1: Initialization
```
User: "Build a tap-to-collect coin game with 10 iterations"

System:
1. Create chad/config.json with maxIterations: 10
2. Initialize chad/session-state.json
3. Load relevant skills (game-architect, core-loop, etc.)
4. Load patches.md for known issues
5. Generate initial game code
```

### Phase 2: First Iteration
```
1. Generate game code using skills
2. Launch preview in Playwright
3. Wait for render (1-2 seconds)
4. Capture screenshots: initial, after-tap, score-change
5. Analyze screenshots with Claude vision
6. Generate quality report
7. If all gates pass → COMPLETE
8. If issues found → Generate self-prompt
```

### Phase 3: Subsequent Iterations
```
1. Read self-prompt from previous iteration
2. Consult patches.md for known solutions
3. Apply fixes (prioritized by severity)
4. Re-generate/update game code
5. Capture new screenshots
6. Analyze and compare
7. If fixed → Log to patches.md
8. If new issues → Generate new self-prompt
9. Repeat until complete or max iterations
```

### Phase 4: Completion
```
1. Generate final summary
2. List all patches discovered
3. Update relevant skills with learnings
4. Clean up session files
5. Present results to user
```

---

## Self-Prompting Format

Each iteration, Claude generates a prompt for the next iteration:

```markdown
# Chad Iteration [N+1] Prompt

## Context
- Previous iteration: [N]
- Issues remaining: [count]
- Quality gates: [passed/total]

## Priority Fixes (This Iteration)
1. [CRITICAL] [Issue description]
   - File: [path]
   - Line: [number]
   - Fix: [specific code change]
   - Patch reference: [if exists]

2. [HIGH] [Issue description]
   ...

## Preserve (Do Not Break)
- [Working feature 1]
- [Working feature 2]

## Verification Steps
After fixes, verify:
1. Capture screenshot of [state]
2. Check that [expected behavior]
3. Confirm [quality gate] passes

## Stop Condition
If all quality gates pass, output:
<promise>COMPLETE</promise>
```

---

## Patch Learning Cycle

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Problem Encountered                                    │
│         │                                               │
│         ▼                                               │
│  ┌─────────────────┐     ┌─────────────────┐           │
│  │ Check patches.md│────▶│ Solution exists?│           │
│  └─────────────────┘     └─────────────────┘           │
│                                │                        │
│              ┌─────────────────┴─────────────────┐      │
│              ▼                                   ▼      │
│         YES: Apply                          NO: Debug   │
│         known fix                           and solve   │
│              │                                   │      │
│              │                                   ▼      │
│              │                          Document new    │
│              │                          patch entry     │
│              │                                   │      │
│              └───────────────┬───────────────────┘      │
│                              ▼                          │
│                    Verify fix worked                    │
│                              │                          │
│                              ▼                          │
│                    Continue iteration                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Quality Metrics

### Per-Iteration Metrics
- Screenshots captured
- Issues found (by severity)
- Issues fixed
- New patches created
- Quality gates passed

### Per-Session Metrics
- Total iterations
- Time per iteration
- Patches consulted vs. new patches created
- Final quality score
- Skills most frequently invoked

### Long-Term Metrics
- Patch library size
- Common issue categories
- Skill improvement rate
- Average iterations to completion

---

## Benefits of This System

1. **Autonomous**: Once started, runs without human intervention
2. **Self-Improving**: patches.md grows smarter over time
3. **Visual-First**: Catches issues tests can't (layout, polish, feel)
4. **Game-Specific**: 30 skills optimized for game development
5. **Bounded**: User controls max iterations
6. **Transparent**: Full analysis log for debugging
7. **Compounding**: Each session improves future sessions

---

## Next Steps to Implement

1. [ ] Create `patches.md` with initial structure
2. [ ] Create `chad/` directory with config files
3. [ ] Create `/chad` command in `.claude/commands/`
4. [ ] Create `self-prompter` skill
5. [ ] Update `chad-optimizer` skill with patch integration
6. [ ] Create `screenshots/` directory structure
7. [ ] Test with simple game prompt
8. [ ] Iterate on patch format based on real usage

---

## Sources & References

- [Chad Claude Code GitHub](https://github.com/frankbria/chad-claude-code)
- [Chad Wiggum Technique Explained](https://dev.to/sivarampg/the-chad-wiggum-approach-running-ai-coding-agents-for-hours-not-minutes-57c1)
- [Awesome Claude - Chad Wiggum](https://awesomeclaude.ai/chad-wiggum)
- [VentureBeat - Chad Wiggum AI](https://venturebeat.com/technology/how-chad-wiggum-went-from-the-simpsons-to-the-biggest-name-in-ai-right-now)
- [Chad Loop Guide](https://mejba.me/blog/chad-loop-claude-code-autonomous-ai-coding-framework-guide)
- [Brief History of Chad](https://www.humanlayer.dev/blog/brief-history-of-chad)
