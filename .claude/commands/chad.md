# Visual Chad Loop - Autonomous Game Development

> **⚠️ CRITICAL: NEVER use MCP Playwright tools (mcp__playwright__*) in this environment.**
> They don't work in Docker. Use ONLY: `node scripts/capture-screenshot.js`

Run the Visual Chad Loop to autonomously develop and polish games through iterative visual feedback.

## Usage

Start Claude with permission override for hands-off operation:
```bash
claude --dangerously-skip-permissions
```

Then run:
```
/chad
```

**This runs directly in your Claude session with FULL SKILL ACCESS.**
- All 34 game development skills available via Skill tool
- Real-time visibility of everything in your terminal
- Skills properly invoke and chain together
- Iteration reports print directly to your screen

---

## Interactive Flow

**SPEED REQUIREMENT: Questions are preset. NO AI thinking between questions. Just ask → wait → ask → wait.**

When you run `/chad`:

```
IMMEDIATE: Read projects/*/project.json (silent, no output)
     ↓
Question 1: Mode (New Game / Continue Project)
     ↓
Question 2: [If Continue] Select Project
     ↓
Question 3: Focus (Auto-improve / Fix Bug / New Feature / More Juice / etc.)
     ↓
Question 4: [If not Fix Bug] Iteration Count
     ↓
START LOOP (only NOW does AI processing begin)
```

### Focus Modes

| Focus | Iterations | Behavior |
|-------|------------|----------|
| Fix known issues | User-selected | Fix issues from known-issues.json first, then auto-improve |
| Auto-improve | User-selected | AI analyzes and improves anything |
| Fix specific bug | Until fixed | Keeps iterating until bug is resolved |
| Implement feature | User-selected | All iterations focus on that feature |
| More juice | User-selected | Focus on animations, particles, effects |
| New mechanics | User-selected | Focus on gameplay features |

---

## Technical Reference

**CRITICAL - Browser Handling (Docker/WSL):**
- Screenshots: `node scripts/capture-screenshot.js <url> <output> [wait-ms]`
- User preview: `node scripts/preview-server.js 8080` (then open http://localhost:8080)
- **NEVER use MCP Playwright tools** (mcp__playwright__*) - they don't work in Docker
- **NEVER use file:// URLs with MCP tools** - only with the bash script
- For ALL screenshot/browser needs, use ONLY: `node scripts/capture-screenshot.js`

**If screenshots fail:** See Troubleshooting section at bottom.

---

## Workflow

### Phase 0: IMMEDIATE Project Discovery & Issue Check

**THE VERY FIRST THING when /chad runs - NO exceptions:**

```
1. Glob("projects/*/project.json")
2. Read each project.json found
3. Store: name, totalIterations for each
4. Read projects/[name]/known-issues.json if it exists
5. Note any open issues for the "Continue Project" flow
```

**NO output. NO thinking. Just read the files and proceed to questions.**

**Known Issues File Structure:**
```json
{
  "issues": [
    {
      "id": "issue-001",
      "description": "Score doesn't update on coin collect",
      "feature": "scoring",
      "severity": "major",
      "status": "open",
      "foundIn": "session-20260108-120000",
      "evidence": "screenshots/iter-5-02.png"
    }
  ]
}
```

**If open issues exist:** Mention them when asking about focus, suggest "Fix specific bug" mode.

---

### Phase 1: Rapid Question Flow

**CRITICAL: These are PRESET questions. NO AI processing between them.**
**Just: Tool call → Wait for answer → Next tool call → Wait → etc.**

---

#### Question 1: Mode

```json
{
  "questions": [{
    "question": "What would you like to do?",
    "header": "Mode",
    "multiSelect": false,
    "options": [
      {"label": "New Game", "description": "Create a new game from scratch"},
      {"label": "Continue Project", "description": "Keep improving an existing game"}
    ]
  }]
}
```

---

#### Path A: NEW GAME

**Question 2A: Game Idea**
```json
{
  "questions": [{
    "question": "What type of game?",
    "header": "Game",
    "multiSelect": false,
    "options": [
      {"label": "Tap collector", "description": "Tap items to collect points"},
      {"label": "Endless runner", "description": "Avoid obstacles, run forever"},
      {"label": "Puzzle game", "description": "Match or solve puzzles"},
      {"label": "Block puzzle", "description": "Tetris-style block placement"}
    ]
  }]
}
```

**Question 3A: Iteration Count**
```json
{
  "questions": [{
    "question": "How many improvement cycles?",
    "header": "Cycles",
    "multiSelect": false,
    "options": [
      {"label": "5 cycles", "description": "Quick prototype (~30 min)"},
      {"label": "10 cycles", "description": "Standard (~1 hour) - Recommended"},
      {"label": "20 cycles", "description": "Deep polish (~2 hours)"}
    ]
  }]
}
```

**→ PROCEED TO PHASE 2**

---

#### Path B: CONTINUE PROJECT

**Question 2B: Select Project**

Build from Phase 0 data:
```json
{
  "questions": [{
    "question": "Which project?",
    "header": "Project",
    "multiSelect": false,
    "options": [
      {"label": "[name]", "description": "[X] iterations"}
    ]
  }]
}
```

**Question 3B: Focus**

**If known-issues.json has open issues**, modify the question:
```json
{
  "questions": [{
    "question": "What should we focus on? (Note: [N] open issues from last session)",
    "header": "Focus",
    "multiSelect": false,
    "options": [
      {"label": "Fix known issues", "description": "[N] issues from last session - Recommended"},
      {"label": "Auto-improve", "description": "Let Chad analyze and decide"},
      {"label": "Fix specific bug", "description": "Describe a different bug"},
      {"label": "Implement feature", "description": "Add a specific feature you describe"},
      {"label": "More juice", "description": "Better animations, particles, effects"},
      {"label": "New mechanics", "description": "Add gameplay features"}
    ]
  }]
}
```

**If no open issues**, use standard question:
```json
{
  "questions": [{
    "question": "What should we focus on?",
    "header": "Focus",
    "multiSelect": false,
    "options": [
      {"label": "Auto-improve", "description": "Let Chad analyze and decide (Recommended)"},
      {"label": "Fix specific bug", "description": "Describe a bug - runs until fixed"},
      {"label": "Implement feature", "description": "Add a specific feature you describe"},
      {"label": "More juice", "description": "Better animations, particles, effects"},
      {"label": "New mechanics", "description": "Add gameplay features"}
    ]
  }]
}
```

**If "Fix specific bug" selected:**
- Ask user to describe the bug (via AskUserQuestion with text input)
- **DO NOT ask for iteration count** - loop runs until bug is fixed (max 20 iterations as safety)

**If "Implement feature" selected:**
- Ask user to describe the feature (via AskUserQuestion with text input)
- Then ask iteration count (iterations focus ONLY on this feature)

**For all other focus modes:**

**Question 4B: Iteration Count**
```json
{
  "questions": [{
    "question": "How many improvement cycles?",
    "header": "Cycles",
    "multiSelect": false,
    "options": [
      {"label": "5 cycles", "description": "Quick session (~30 min)"},
      {"label": "10 cycles", "description": "Standard (~1 hour) - Recommended"},
      {"label": "20 cycles", "description": "Deep polish (~2 hours)"}
    ]
  }]
}
```

**→ PROCEED TO PHASE 2**

---

### Phase 2: Run the Loop (DIRECT - FULL SKILL ACCESS)

**This runs directly in the main Claude session - NO sub-agent.**

**Requirements:**
- User must start Claude with `--dangerously-skip-permissions` for hands-off operation
- All 34 skills are available via the Skill tool
- Everything happens in real-time in the terminal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DIRECT EXECUTION (Main Claude)                                              │
│                                                                              │
│  ✓ Full Skill tool access - invoke skills properly                          │
│  ✓ Real-time visibility - see everything as it happens                      │
│  ✓ Conversation context - remembers what was discussed                      │
│  ✓ Can ask clarifying questions mid-loop if needed                          │
│                                                                              │
│  Requires: claude --dangerously-skip-permissions                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## AVAILABLE SKILLS (USE VIA SKILL TOOL)

**Invoke skills with the Skill tool when you need specialized guidance.**

**Chad Skills:**
- `game-preview` - HTML5 preview generation
- `visual-testing` - Screenshot analysis techniques
- `chad-optimizer` - Optimization loop methodology
- `self-prompter` - Self-prompting patterns

**Game Dev Skills (prefix with category):**
| When You Need | Invoke Skill |
|---------------|--------------|
| Adding juice/polish | `juice-orchestrator` |
| Screen shake effects | `screen-shake-impact` |
| Particle systems | `particle-effects` |
| Animation timing | `animation-system` |
| Player retention | `retention-engineer` |
| Reward systems | `reward-scheduler` |
| Difficulty balancing | `difficulty-tuner` |
| Core loop design | `core-loop-architect` |
| Performance fixes | `performance-optimizer` |
| Quality validation | `quality-validator` |

**IMPORTANT: Invoke relevant skills BEFORE implementing features in that domain.**

---

## NEW GAME FLOW

After user selects "New Game" and provides details:

### Step A: Setup Project
```bash
mkdir -p projects/[project-name]/sessions/session-$(date +%Y%m%d-%H%M%S)/screenshots
```

Create `projects/[project-name]/project.json`:
```json
{
  "name": "[project-name]",
  "description": "[game description]",
  "created": "[timestamp]",
  "lastModified": "[timestamp]",
  "totalIterations": 0,
  "totalSessions": 0,
  "status": "in-development"
}
```

### Step B: Create Initial Game

**FIRST: Invoke the `core-loop-architect` skill** to design the game properly.

Then create `preview/game.js`:
- Use game-renderer.js abstractions (SpriteNode, ShapeNode, LabelNode, Action, Scene, ParticleEmitter)
- Canvas: 1179x2556 at 3x scale (393x852 logical)
- Safe areas: top 162px, bottom 102px
- Implement: state machine, core loop, scoring, visual feedback, game over

### Step C: Run Improvement Loop

For each iteration 1 to [N]:

#### Step 1: Capture Screenshots
```bash
node scripts/capture-screenshot.js "file:///home/wsley/Coding/GameSkillsFrameWork/preview/index.html" "projects/[name]/sessions/[session]/screenshots/iter-[X]-01.png" 500
node scripts/capture-screenshot.js "file:///home/wsley/Coding/GameSkillsFrameWork/preview/index.html" "projects/[name]/sessions/[session]/screenshots/iter-[X]-02.png" 2000
node scripts/capture-screenshot.js "file:///home/wsley/Coding/GameSkillsFrameWork/preview/index.html" "projects/[name]/sessions/[session]/screenshots/iter-[X]-03.png" 4000
```

#### Step 2: Analyze Screenshots
Read EACH screenshot and evaluate:
- P0-P2: Errors (crashes, bugs, layout issues)
- P3-P5: Improvements (polish, mechanics, retention)

#### Step 3: Invoke Relevant Skills
**Before making changes, invoke skills for the domains you'll touch:**
- Adding particles? → Invoke `particle-effects` skill
- Adding screen shake? → Invoke `screen-shake-impact` skill
- Improving retention? → Invoke `retention-engineer` skill

#### Step 4: Make Improvements
Edit preview/game.js (max 3 changes per iteration)

**Track each change** - you will test each one.

#### Step 5: TEST EACH Feature (MANDATORY)
**Test EVERY feature you changed. Not once per iteration - ONCE PER FEATURE.**

**IMPORTANT: Use ONLY the bash screenshot script. NEVER use MCP Playwright tools.**

```
FOR EACH feature/change:
  1. Identify HOW to trigger this specific feature
  2. Take multiple screenshots at different wait times to capture the feature:
     - node scripts/capture-screenshot.js "file:///app/preview/index.html" "path/screenshot.png" 500
     - node scripts/capture-screenshot.js "file:///app/preview/index.html" "path/screenshot.png" 2000
     - node scripts/capture-screenshot.js "file:///app/preview/index.html" "path/screenshot.png" 4000
  3. Analyze screenshots - DID IT WORK?
  4. Record: PASS or FAIL with evidence

  IF FAILED:
    - Fix the bug immediately
    - Re-test this specific feature
    - DO NOT proceed until it works
```

**NOTE: For interactive testing (clicks/drags), the screenshot script captures static states.
Verify that visual elements render correctly. Full interaction testing happens when user
opens http://localhost:8080 after the loop completes.**

**Feature Testing Examples (MUST FOLLOW):**
| Feature Added | How to Test | Expected Result |
|---------------|-------------|-----------------|
| Game Over screen | Play until lose (click obstacles, wait for timer, etc.) | Game over UI appears |
| Score label | Tap to collect item | Score number increases |
| Particle effect | Trigger particle source (collect coin, explosion) | Particles visible in screenshot |
| Screen shake | Cause impact (collision, tap) | UI offset in screenshot |
| Animation | Trigger animation, capture during | Element mid-animation |
| Collision | Move player into obstacle | Response triggered |
| Power-up | Collect power-up | Effect activates |
| Sound feedback | N/A (visual only) | Skip audio tests |

**DO NOT SKIP THIS STEP. Every feature must be verified with evidence.**

### Step 5: PRINT Iteration Report (USER VISIBILITY - MANDATORY)
**After EACH iteration, PRINT this report to stdout so user sees it in real-time:**

```
═══════════════════════════════════════════════════════════════════════════════
█ ITERATION [X]/[N] COMPLETE                                    [timestamp]
═══════════════════════════════════════════════════════════════════════════════

┌─ CHANGES MADE ─────────────────────────────────────────────────────────────┐
│                                                                             │
│ 1. [Feature Name]                                                           │
│    What: [Specific code change]                                             │
│    Why:  [Reason/problem it solves]                                         │
│                                                                             │
│ 2. [Feature Name]                                                           │
│    What: [Specific code change]                                             │
│    Why:  [Reason/problem it solves]                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ FEATURE TEST RESULTS ──────────────────────────────────────────────────────┐
│                                                                             │
│ Feature 1: [Name]                                                           │
│   Test: [How it was triggered]                                              │
│   Result: ✓ PASSED / ✗ FAILED                                               │
│   Evidence: [What screenshot showed]                                        │
│                                                                             │
│ Feature 2: [Name]                                                           │
│   Test: [How it was triggered]                                              │
│   Result: ✓ PASSED / ✗ FAILED                                               │
│   Evidence: [What screenshot showed]                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ ISSUES & NEXT STEPS ───────────────────────────────────────────────────────┐
│                                                                             │
│ Issues Found: [Any new problems discovered]                                 │
│ Next Focus:   [What iteration X+1 will address]                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
═══════════════════════════════════════════════════════════════════════════════
```

**Also append to progress.log for persistence.**

This report MUST be printed after EVERY iteration so the user can monitor progress in real-time.

### Step 6: Continue
**NEVER finish early. Always use all [N] iterations.**
Even after initial game works, keep improving with juice/polish/mechanics.

---

## CONTINUE PROJECT FLOW

After user selects "Continue Project" and chooses a project:

### Step A: Setup Session
```bash
mkdir -p projects/[project-name]/sessions/session-$(date +%Y%m%d-%H%M%S)/screenshots
cp projects/[project-name]/game.js preview/game.js
```

### Step B: Run Improvement Loop

Same iteration loop as NEW GAME (Steps 1-6 above), but with focus on user's specified area.

**If user specified a specific bug/fix:**
- First 1-3 iterations: Focus on fixing that specific issue
- ONCE FIXED: Automatically switch to general improvements (P3-P5)
- **NEVER finish early. Always use all iterations.**

---

## FOCUS MODE BEHAVIORS

### Fix Known Issues (Priority)
- Reads `projects/[name]/known-issues.json` for open issues
- Works through issues by severity: critical → major → minor
- For EACH issue:
  1. Read the issue description and evidence screenshot
  2. Implement fix
  3. Test specifically for that issue
  4. If fixed: Update status to "fixed" in known-issues.json
  5. If not fixed: Try different approach, max 3 attempts per issue
- Runs until ALL issues are fixed or max iterations reached
- **After all known issues fixed:** Switch to Auto-improve for remaining iterations

### Auto-improve (Default)
- Runs for [N] iterations
- AI analyzes screenshots and decides what to improve
- Balances bug fixes, polish, and new features

### Fix Specific Bug
- User describes the bug
- Loop runs until bug is VERIFIED FIXED (via screenshot evidence)
- **No iteration limit asked** - runs until fixed (max 20 safety cap)
- Each iteration: Check if fixed → If not, try another approach → Repeat
- Once fixed, print success and END (don't continue with other improvements)

### Implement Feature
- User describes the feature they want
- Runs for [N] iterations
- **ALL iterations focus on this feature**:
  - Iteration 1-2: Implement basic version
  - Iteration 3-N: Polish, improve, add juice to THAT feature
- Do NOT work on unrelated improvements

### More Juice / New Mechanics
- Runs for [N] iterations
- Focus restricted to that category
- More Juice = animations, particles, screen shake, easing, feedback
- New Mechanics = gameplay features, power-ups, obstacles, combos

---

## ITERATION LOOP DETAILS (BOTH FLOWS)

For each iteration 1 to [N] (or until bug fixed for "Fix Specific Bug" mode):

#### Step 1: Capture Screenshots
```bash
node scripts/capture-screenshot.js "file:///app/preview/index.html" "projects/[name]/sessions/[session]/screenshots/iter-[X]-01.png" 500
node scripts/capture-screenshot.js "file:///app/preview/index.html" "projects/[name]/sessions/[session]/screenshots/iter-[X]-02.png" 2000
node scripts/capture-screenshot.js "file:///app/preview/index.html" "projects/[name]/sessions/[session]/screenshots/iter-[X]-03.png" 4000
```

#### Step 2: Analyze Screenshots
Read EACH screenshot with the Read tool and evaluate:
- P0-P2: Errors (crashes, bugs, layout issues)
- P3-P5: Improvements (polish, mechanics, retention)

#### Step 3: Invoke Relevant Skills (FULL SKILL ACCESS)
**BEFORE making changes, invoke skills for the domains you'll touch:**

| Improvement Type | Invoke This Skill |
|------------------|-------------------|
| Adding particles | `particle-effects` |
| Screen shake | `screen-shake-impact` |
| Animations | `animation-system` |
| Overall juice | `juice-orchestrator` |
| Retention hooks | `retention-engineer` |
| Difficulty curve | `difficulty-tuner` |
| Performance | `performance-optimizer` |

**Use the Skill tool** - this gives you full skill context, not just reading a file.

#### Step 4: Make Improvements
Edit preview/game.js (max 3 changes per iteration)
**Track each change** - you will test each one.

#### Step 5: TEST EACH Feature (MANDATORY - PER FEATURE)
**Test EVERY feature you changed. Not once per iteration - ONCE PER FEATURE.**

**Use ONLY bash scripts. NEVER use MCP Playwright tools.**

```
FOR EACH feature/change:
  1. Identify what should be visible/working
  2. Capture screenshots at different times:
     node scripts/capture-screenshot.js "file:///app/preview/index.html" "[output]" [wait-ms]
  3. For interactive testing, use the game tester:
     node scripts/game-tester.js quick "[output-dir]"
  4. Analyze screenshots - Check: LOOKS good? FEELS right? WORKS correctly?
  5. Record PASS/FAIL with evidence

  IF FAILED:
    1. Add to known-issues.json with severity and evidence
    2. Attempt fix
    3. Re-test
    4. If still failing after 2 attempts, mark issue as "open" and continue
```

**Feature Testing Checklist (for each feature):**
| Aspect | What to Check | Evidence |
|--------|---------------|----------|
| LOOKS | Visual appearance matches intent, colors correct, positioned right | Screenshot |
| FEELS | Animation timing, easing, responsiveness feel satisfying | Multiple screenshots during action |
| WORKS | Functional behavior is correct, no bugs, edge cases handled | Test results JSON |

**Feature Testing Matrix:**
| Feature Type | How to Test | What to Check |
|--------------|-------------|---------------|
| Game Over | `game-tester.js quick` until lose | Game over UI appears correctly |
| Score | Screenshot before/after collect | Score number increases |
| Particles | Screenshot during emission | Particles visible, look good |
| Screen shake | Screenshot during impact | UI offset visible in frame |
| Animation | Screenshots at 0ms, 200ms, 500ms | Smooth progression |
| Collision | `game-tester.js` with clicks | Correct response to hits |
| UI Layout | Initial screenshot | All elements in safe areas |

#### Step 6: PRINT Iteration Report
**After EACH iteration, print this to the terminal:**

```
═══════════════════════════════════════════════════════════════════════════════
█ ITERATION [X]/[N] COMPLETE                                    [timestamp]
═══════════════════════════════════════════════════════════════════════════════

┌─ CHANGES MADE ──────────────────────────────────────────────────────────────┐
│ 1. [Feature]: [What changed] - [Why]                                        │
│ 2. [Feature]: [What changed] - [Why]                                        │
│ 3. [Feature]: [What changed] - [Why]                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ TEST RESULTS (PER FEATURE) ────────────────────────────────────────────────┐
│ [Feature 1]: ✓ PASSED - [Evidence from screenshot]                          │
│ [Feature 2]: ✗ FAILED → FIXED → ✓ PASSED - [What was wrong, how fixed]      │
│ [Feature 3]: ✓ PASSED - [Evidence]                                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ NEXT ITERATION ────────────────────────────────────────────────────────────┐
│ Priority 1: [Next focus]                                                    │
│ Priority 2: [Secondary]                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
═══════════════════════════════════════════════════════════════════════════════
```

#### Step 7: Continue or Complete

**Behavior depends on Focus Mode:**

| Mode | When to Stop |
|------|--------------|
| Auto-improve | After all [N] iterations |
| Fix Specific Bug | When bug is VERIFIED FIXED (then stop immediately) |
| Implement Feature | After all [N] iterations (all focused on that feature) |
| More Juice | After all [N] iterations |
| New Mechanics | After all [N] iterations |

**For Auto-improve/Juice/Mechanics:** Even after errors are fixed, keep improving:
1. P3 - Juice/polish (animations, particles, shake)
2. P4 - Mechanics (power-ups, combos, variety)
3. P5 - Retention (rewards, difficulty, hooks)

**For Fix Specific Bug:** Once fixed, STOP. Print success and show preview URL.

**For Implement Feature:** Stay focused on THAT feature. Don't fix unrelated bugs or add unrelated improvements.

---

## IMPROVEMENT PRIORITIES

| Priority | Category | Examples |
|----------|----------|----------|
| P0 | Critical Errors | Blank screen, crashes, no touch |
| P1 | Functional Bugs | Score wrong, collision broken |
| P2 | Visual Issues | Safe area violations, clipping |
| P3 | Polish & Juice | Animations, particles, shake |
| P4 | Mechanics | Power-ups, combos, obstacles |
| P5 | Retention | Rewards, difficulty, hooks |

## QUALITY STANDARDS

- 60 FPS target
- Safe areas: top 162px, bottom 102px (at 3x)
- Every interaction feels satisfying
- Always find something to improve

---

## FINAL COMPREHENSIVE TEST (Before Completion)

**After all iterations but BEFORE marking complete, run a deep test:**

### Step 1: Run Deep Game Test
```bash
node scripts/game-tester.js deep "projects/[name]/sessions/[session]/final-test/" 60
```

This runs for 60 seconds and tests:
- Normal gameplay flow
- Rapid tap stress test
- Corner/edge tap handling
- Stability over time

### Step 2: Analyze Test Results

Read the test results:
```bash
cat projects/[name]/sessions/[session]/final-test/test-results.json
```

**Check for:**
- Console errors (critical)
- Issues found during playtest
- Screenshot evidence of problems

### Step 3: Review All Screenshots

Read EACH screenshot from the final test:
- `test-00-initial.png` - Does game load correctly?
- `test-XX-Xs.png` - Does gameplay look/feel right over time?
- `test-edge-*.png` - Do edge cases work?
- `test-XX-final.png` - Is game in good state after extended play?

### Step 4: Document Any Issues Found

**If issues are found during final test:**

Update `projects/[name]/known-issues.json`:
```json
{
  "issues": [
    {
      "id": "issue-[timestamp]",
      "description": "[What's wrong]",
      "feature": "[affected feature]",
      "severity": "critical|major|minor",
      "status": "open",
      "foundIn": "[session-id]",
      "evidence": "[screenshot path]"
    }
  ]
}
```

**Severity Guide:**
- `critical` - Game crashes, unplayable, major feature broken
- `major` - Feature doesn't work correctly, bad UX
- `minor` - Visual glitch, slight misbehavior, polish issue

### Step 5: Final Test Report

Print to terminal:
```
═══════════════════════════════════════════════════════════════════════════════
█ FINAL TEST RESULTS
═══════════════════════════════════════════════════════════════════════════════

Test Duration: 60 seconds
Screenshots Captured: [N]
Interactions Simulated: [N]

┌─ CONSOLE ERRORS ────────────────────────────────────────────────────────────┐
│ [List any console errors, or "None"]                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ ISSUES FOUND ──────────────────────────────────────────────────────────────┐
│ [List any issues with severity, or "None - all features working"]           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ FEATURES VERIFIED ─────────────────────────────────────────────────────────┐
│ ✓ Game loads correctly                                                      │
│ ✓ Touch input responsive                                                    │
│ ✓ Score/UI updates properly                                                 │
│ ✓ Animations smooth                                                         │
│ ✓ No crashes during extended play                                           │
│ [Add/remove based on actual test results]                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Overall: [PASS - Ready to ship / ISSUES FOUND - See known-issues.json]
═══════════════════════════════════════════════════════════════════════════════
```

---

## WHEN LOOP COMPLETES

After all [N] iterations AND final comprehensive test:

1. Save final game:
```bash
cp preview/game.js projects/[project-name]/game.js
```

2. Update project.json:

**Read the current project.json, then update these fields:**
```json
{
  "lastModified": "[current timestamp]",
  "totalIterations": [previous + N],
  "totalSessions": [previous + 1]
}
```

3. Print completion summary:
```
═══════════════════════════════════════════════════════════════════════════════
█ CHAD LOOP COMPLETE
═══════════════════════════════════════════════════════════════════════════════

Project: [project-name]
Iterations: [N]/[N] completed
Game saved to: projects/[project-name]/game.js

► TEST YOUR GAME (copy this URL into your browser):
file://wsl.localhost/Ubuntu/home/wsley/Coding/GameSkillsFrameWork/preview/index.html

To continue improving: run /chad → Continue Project
═══════════════════════════════════════════════════════════════════════════════
```

**NOTE:** The preview files are mounted from WSL, so they're directly accessible from Windows.
The user can copy the WSL file:// URL and paste it into their Windows browser.

---

## Quality Gates Reference

| Gate | Checks | Pass Criteria |
|------|--------|---------------|
| Renders | Canvas exists, no console errors | Elements visible |
| Layout | Safe areas, overflow, alignment | All within bounds |
| Visual | Colors, FPS (60), typography | Matches spec |
| Interaction | Touch events, feedback | Response < 100ms |
| Logic | Score, state machine | Correct behavior |

---

## Session State Management

The loop maintains state in `chad/session-state.json`:

```json
{
  "sessionId": "abc123",
  "status": "running",
  "iteration": { "current": 3, "max": 10 },
  "qualityGates": { ... },
  "issues": { "found": [...], "fixed": [...] },
  "patches": { "consulted": [...], "created": [...] }
}
```

---

## Stop Conditions

**Chad is designed to use ALL iterations.** Early stopping is rare.

The loop stops when:
1. **Max iterations reached** (EXPECTED - use all iterations to maximize quality)
2. **User interrupts** (they've seen enough)
3. **Game is truly perfect** (RARE - only if you genuinely cannot improve anything)

**The loop does NOT stop just because:**
- Quality gates pass (that just means focus shifts to improvements)
- No errors found (that means focus on polish, mechanics, retention)
- The game "works" (working ≠ optimized for player enjoyment)

**Remember:** A game that "works" can always be MORE satisfying, MORE juicy, MORE addictive.

---

## Output Format

### During Iteration (Error Fixing Phase)
```
═══ Chad Iteration 2/10 ═══

Capturing screenshots...
  ✓ initial.png
  ✓ gameplay.png

Analyzing (Errors)...
  Found 2 issues:
  - [P0] Particles not visible
  - [P2] Score overlaps safe area

Consulting patches...
  ✓ PATCH-002 matches "Particles not visible"

Applying fixes...
  1. Added emitter.start() call
  2. Moved score label to y=180

Quality Gates: 4/5 passed
  ✗ Visual: FPS dropped to 45

Continuing to iteration 3...
```

### During Iteration (Improvement Phase)
```
═══ Chad Iteration 6/10 ═══

Capturing screenshots...
  ✓ initial.png
  ✓ gameplay.png
  ✓ game-over.png

Analyzing (Improvements)...
  Quality Gates: 5/5 ✓

  Improvement Opportunities:
  - [P3] Screen shake could be juicier
  - [P3] Coin collect particles need more "pop"
  - [P4] No combo system - rapid taps unrewarded
  - [P5] Difficulty doesn't ramp - gets boring

Retention Check:
  ✓ Tap feels satisfying
  ✗ No "one more time" hook
  ✗ Rewards too predictable

Improvement Plan:
  1. [P3] Increase screen shake: 3px → 5px, add rotation
  2. [P4] Add combo multiplier (2x, 3x, 5x) for rapid taps
  3. [P5] Implement difficulty ramp: spawn rate increases

Applying improvements...
  ✓ Screen shake enhanced
  ✓ Combo system added
  ✓ Difficulty curve implemented

Continuing to iteration 7...
```

### On Completion (All Iterations Used)
```
═══ Chad Complete ═══

Session: abc123
Iterations: 10/10 (all used)
Status: Fully optimized

Error Fixes: 4 bugs fixed
Improvements Made: 18 enhancements

Quality Gates: All passing
  ✓ Renders
  ✓ Layout
  ✓ Visual
  ✓ Interaction
  ✓ Logic

Improvements by Category:
  Polish (P3): 8 enhancements
    - Screen shake on all impacts
    - Particle burst on collect
    - Smooth easing on animations
    - ...

  Mechanics (P4): 5 additions
    - Combo multiplier system
    - Power-up spawns
    - Near-miss detection
    - ...

  Retention (P5): 5 optimizations
    - Progressive difficulty
    - Variable reward timing
    - Session length hooks
    - ...

New Patches Created:
  - PATCH-011: Screen shake rotation pattern
  - PATCH-012: Combo timing window (300ms)

► TEST YOUR GAME (copy this URL into your browser):
file://wsl.localhost/Ubuntu/home/wsley/Coding/GameSkillsFrameWork/preview/index.html

The game has been optimized for maximum player retention and enjoyment.
All 10 iterations were used to polish every aspect.

<promise>COMPLETE</promise>
```

---

## Tips

1. **Use more iterations** - 10+ for best results, each iteration improves the game
2. **Be specific** - Clear game descriptions help initial generation
3. **Trust the loop** - Let it use ALL iterations, don't interrupt early
4. **Think retention** - "Would a player play this for 5 more minutes?"
5. **Juice everything** - Every action should feel satisfying
6. **Review screenshots** - Visual truth reveals improvement opportunities
7. **Check patches** - Learn from previous sessions' discoveries

---

## Troubleshooting

### "Could not find Chrome/Chromium" from screenshot script

```
Fix: The Playwright chromium browser isn't installed.
Run: npx playwright install chromium

This installs to ~/.cache/ms-playwright/chromium-*/
```

### "libnspr4.so" or other missing library errors (WSL)

```
Fix: System dependencies for Chromium aren't installed.
Run ONE TIME with sudo:

sudo apt-get update && sudo apt-get install -y libnspr4 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2

Or shorter:
sudo npx playwright install-deps chromium

This is a one-time setup for WSL.
```

### Browser hangs or MCP lock issues

```
This is why we use the bash puppeteer script instead of MCP Playwright.

If you see "Browser is already in use" or similar MCP errors:
1. DO NOT use MCP Playwright tools
2. Use: node scripts/capture-screenshot.js <url> <output> [wait]

Kill any stuck processes:
  pkill -f chromium; pkill -f chrome
```

### "Cannot navigate to preview"

```
Fix: Ensure the preview path is a valid file:// URL.
The path must be absolute: file:///home/user/project/preview/index.html
NOT: file://preview/index.html
```

### Screenshot shows blank white page

```
Possible causes:
1. game.js has syntax errors - check console messages
2. Game not initialized - ensure setup() is called
3. Canvas not rendering - check if canvas element exists

Fix: Use mcp__playwright__browser_console_messages to see errors.
```

### Loop seems stuck on same issue

```
Possible causes:
1. Fix isn't actually being applied
2. Issue is misdiagnosed
3. Multiple issues masking each other

Fix: Manually inspect the screenshot and code.
Consider reducing to 1 issue per iteration.
```

### "Max iterations reached" without completion

```
This means quality gates never all passed.
Check which gates are failing and why.
Consider:
- Simplifying the game prompt
- Running more iterations
- Manually fixing persistent issues
```
