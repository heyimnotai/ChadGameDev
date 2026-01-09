# Visual Chad Loop - Autonomous Game Development

> **Expo-based workflow: Games are built as React Native apps with hot-reload support.**
> Screenshots are captured via iOS Simulator using XcodeBuildMCP tools.

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

**Expo + iOS Simulator Workflow:**
- **Project location**: `expo-games/apps/[game-name]/`
- **Game code**: `expo-games/apps/[game-name]/App.tsx` (main game file)
- **Dev server**: `npx expo start --tunnel` (provides QR code for Expo Go)
- **Screenshots**: Use `mcp__XcodeBuildMCP__screenshot` via iOS Simulator

**Simulator Management:**
- Boot simulator: `mcp__XcodeBuildMCP__boot_simulator`
- List simulators: `mcp__XcodeBuildMCP__list_simulators`
- Take screenshot: `mcp__XcodeBuildMCP__screenshot`
- Capture logs: `mcp__XcodeBuildMCP__capture_logs`

**If screenshots fail:** Ensure iOS Simulator is booted and app is running.

---

## Workflow

### Phase 0: IMMEDIATE Project Discovery & Issue Check

**THE VERY FIRST THING when /chad runs - NO exceptions:**

```
1. Glob("projects/*/project.json")
2. Read each project.json found
3. Store: name, totalIterations, expoPath for each
4. Read projects/[name]/known-issues.json if it exists
5. Note any open issues for the "Continue Project" flow
6. Verify expo-games/apps/[name] exists for each project
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
- `game-preview` - Expo game preview generation
- `visual-testing` - Screenshot analysis techniques (iOS Simulator)
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
# Create session tracking directory
mkdir -p projects/[project-name]/sessions/session-$(date +%Y%m%d-%H%M%S)/screenshots

# Copy Expo template to create new game
cp -r expo-games/apps/template expo-games/apps/[project-name]
```

Update `expo-games/apps/[project-name]/package.json`:
- Change `"name"` to `"[project-name]"`

Create `projects/[project-name]/project.json`:
```json
{
  "name": "[project-name]",
  "description": "[game description]",
  "created": "[timestamp]",
  "lastModified": "[timestamp]",
  "totalIterations": 0,
  "totalSessions": 0,
  "status": "in-development",
  "expoPath": "expo-games/apps/[project-name]"
}
```

### Step B: Create Initial Game

**FIRST: Invoke the `core-loop-architect` skill** to design the game properly.

Then create `expo-games/apps/[project-name]/App.tsx`:
- Use the game-engine package: `import { Engine, createSprite, createText, Vector2, Color, TouchSystem, HapticManager } from '@expo-games/game-engine';`
- Screen dimensions: Use SafeAreaProvider for proper safe areas
- Implement: state machine, core loop, scoring, visual feedback, game over
- Use React Native patterns with TypeScript

### Step B2: Start Expo Dev Server

Start the Expo development server in the background:
```bash
cd expo-games/apps/[project-name] && npx expo start --tunnel &
```

Wait for the server to start and display the QR code URL.

**Tell the user:**
```
═══════════════════════════════════════════════════════════════
█ EXPO DEV SERVER STARTED
═══════════════════════════════════════════════════════════════

► Scan QR code with Expo Go app to test on your device
► Hot reload is enabled - changes appear automatically

Starting AI optimization loop...
═══════════════════════════════════════════════════════════════
```

### Step B3: Boot iOS Simulator for AI Testing

```bash
# Use XcodeBuildMCP to boot simulator
mcp__XcodeBuildMCP__boot_simulator
```

The simulator provides AI-visible screenshots while Expo Go provides human testing.

### Step C: Run Improvement Loop

For each iteration 1 to [N]:

#### Step 1: Capture Screenshots via iOS Simulator

Use XcodeBuildMCP to capture screenshots from the iOS Simulator:

```bash
# Capture initial state
mcp__XcodeBuildMCP__screenshot
# Save to: projects/[name]/sessions/[session]/screenshots/iter-[X]-01.png

# Wait for game state changes, capture again
# (Simulator shows live Expo app via hot reload)
mcp__XcodeBuildMCP__screenshot
# Save to: projects/[name]/sessions/[session]/screenshots/iter-[X]-02.png
```

**Note:** The Expo dev server hot-reloads changes automatically. After editing App.tsx,
the simulator updates within seconds, allowing rapid visual verification.

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
Edit `expo-games/apps/[project-name]/App.tsx` (max 3 changes per iteration)

**Track each change** - you will test each one.
**Hot reload:** Changes appear automatically in both Simulator and Expo Go.

#### Step 5: TEST EACH Feature (MANDATORY)
**Test EVERY feature you changed. Not once per iteration - ONCE PER FEATURE.**

**Use XcodeBuildMCP for iOS Simulator screenshots:**

```
FOR EACH feature/change:
  1. Identify HOW to trigger this specific feature
  2. Wait for hot reload to apply changes (1-2 seconds)
  3. Take screenshot via iOS Simulator:
     - mcp__XcodeBuildMCP__screenshot
  4. Analyze screenshots - DID IT WORK?
  5. Record: PASS or FAIL with evidence

  IF FAILED:
    - Fix the bug immediately
    - Re-test this specific feature
    - DO NOT proceed until it works
```

**NOTE: Hot reload updates both iOS Simulator (AI testing) and Expo Go (user device).
The user can test interactively on their device while AI iterates.**

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
# Create new session directory for screenshots
mkdir -p projects/[project-name]/sessions/session-$(date +%Y%m%d-%H%M%S)/screenshots
```

**Work directly in the Expo app directory:**
- Project location: `expo-games/apps/[project-name]/`
- Main game file: `expo-games/apps/[project-name]/App.tsx`

### Step A2: Start Expo Dev Server

If not already running:
```bash
cd expo-games/apps/[project-name] && npx expo start --tunnel &
```

### Step A3: Boot iOS Simulator

```bash
mcp__XcodeBuildMCP__boot_simulator
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

#### Step 1: Capture Screenshots via iOS Simulator
```bash
# Ensure simulator is booted and Expo app is running
mcp__XcodeBuildMCP__screenshot
# Save to: projects/[name]/sessions/[session]/screenshots/iter-[X]-01.png

# Wait for game state to progress, capture again
mcp__XcodeBuildMCP__screenshot
# Save to: projects/[name]/sessions/[session]/screenshots/iter-[X]-02.png
```

Hot reload ensures changes are immediately visible in both Simulator and Expo Go.

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
Edit `expo-games/apps/[project-name]/App.tsx` (max 3 changes per iteration)
**Track each change** - you will test each one.
**Hot reload** applies changes to both Simulator and user's device automatically.

#### Step 5: TEST EACH Feature (MANDATORY - PER FEATURE)
**Test EVERY feature you changed. Not once per iteration - ONCE PER FEATURE.**

**Use XcodeBuildMCP for iOS Simulator screenshots:**

```
FOR EACH feature/change:
  1. Identify what should be visible/working
  2. Wait for hot reload (1-2 seconds)
  3. Capture screenshot via iOS Simulator:
     mcp__XcodeBuildMCP__screenshot
  4. Analyze screenshots - Check: LOOKS good? FEELS right? WORKS correctly?
  5. Record PASS/FAIL with evidence

  IF FAILED:
    1. Add to known-issues.json with severity and evidence
    2. Attempt fix
    3. Re-test (hot reload applies immediately)
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

### Step 1: Capture Final Screenshots via iOS Simulator

```bash
# Capture multiple states of the game
mcp__XcodeBuildMCP__screenshot
# Save to: projects/[name]/sessions/[session]/final-test/test-01-initial.png

# Wait and capture gameplay state
mcp__XcodeBuildMCP__screenshot
# Save to: projects/[name]/sessions/[session]/final-test/test-02-gameplay.png

# Capture app logs for any errors
mcp__XcodeBuildMCP__capture_logs
```

### Step 2: Analyze Test Results

**Check for:**
- Console/app logs errors (critical)
- Visual issues in screenshots
- Layout problems

### Step 3: Review All Screenshots

Read EACH screenshot from the final test:
- `test-01-initial.png` - Does game load correctly?
- `test-02-gameplay.png` - Does gameplay look/feel right?

**The user will do interactive testing on their device via Expo Go.**

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

1. Update project.json:

**Read the current project.json, then update these fields:**
```json
{
  "lastModified": "[current timestamp]",
  "totalIterations": [previous + N],
  "totalSessions": [previous + 1]
}
```

2. Print Human Testing Handoff:
```
═══════════════════════════════════════════════════════════════════════════════
█ CHAD LOOP COMPLETE - [N]/[N] iterations
═══════════════════════════════════════════════════════════════════════════════

✓ AI Testing: All quality gates passed
✓ Game runs stable in iOS Simulator
✓ Hot reload active - changes sync automatically

Project: [project-name]
Location: expo-games/apps/[project-name]/

═══════════════════════════════════════════════════════════════════════════════
█ YOUR TURN: Test on your device
═══════════════════════════════════════════════════════════════════════════════

Expo Go should have hot-reloaded automatically with all changes.

If not connected, scan the QR code from the Expo dev server output.

► Play test the game on your device
► Check that interactions feel right
► Verify performance is smooth

═══════════════════════════════════════════════════════════════════════════════
█ NEXT STEPS
═══════════════════════════════════════════════════════════════════════════════

When satisfied with testing:
  • Run /build to create App Store build
  • Run /chad → Continue Project for more iterations

To stop the dev server: Ctrl+C in the terminal running Expo
═══════════════════════════════════════════════════════════════════════════════
```

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

### iOS Simulator not booting

```
Fix: Ensure Xcode and simulators are installed.
Use XcodeBuildMCP to list available simulators:
  mcp__XcodeBuildMCP__list_simulators

Then boot the desired simulator:
  mcp__XcodeBuildMCP__boot_simulator
```

### Expo dev server won't start

```
Possible causes:
1. Dependencies not installed
2. Port already in use

Fix:
1. cd expo-games/apps/[project-name] && npm install
2. Kill existing Expo process: pkill -f expo
3. Restart: npx expo start --tunnel
```

### Hot reload not working

```
Possible causes:
1. Expo dev server disconnected
2. Syntax error in App.tsx

Fix:
1. Check terminal for Expo errors
2. Verify App.tsx has valid TypeScript/JSX
3. Shake device to open Expo menu → Reload
```

### Screenshot shows blank/error screen

```
Possible causes:
1. App.tsx has syntax errors - check Expo logs
2. Missing dependencies in the game
3. Simulator not running the Expo app

Fix:
1. Check mcp__XcodeBuildMCP__capture_logs for errors
2. Verify Expo is running and connected to simulator
3. Ensure the Expo Go app is open in simulator
```

### Loop seems stuck on same issue

```
Possible causes:
1. Fix isn't being applied (hot reload issue)
2. Issue is misdiagnosed
3. Multiple issues masking each other

Fix:
1. Check Expo terminal for hot reload confirmation
2. Manually inspect the screenshot and code
3. Consider reducing to 1 issue per iteration
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

### XcodeBuildMCP tools not responding

```
Fix: Ensure MCP server is running.
Check .mcp.json configuration.
Restart Claude session if needed.
```
