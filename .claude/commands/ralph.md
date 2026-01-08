# Visual Ralph Loop - Autonomous Game Development

Run the Visual Ralph Loop to autonomously develop and polish games through iterative visual feedback.

## Usage

Just run:
```
/ralph
```

**Invoking `/ralph` grants permission for full automation.** Sub-agents will run with `--dangerously-skip-permissions` automatically - you don't need to start Claude with any special flags.

The main Claude session handles user interaction (project selection, cycle count). Once you confirm, sub-agents take over and run autonomously without prompts.

---

## Interactive Flow

When you run `/ralph`, you'll be guided through these steps:

```
Step 1: Project Mode
┌─────────────────────────────────────────┐
│  What would you like to do?             │
│                                         │
│  ○ New Game                             │
│  ○ Continue Project                     │
└─────────────────────────────────────────┘

Step 2: Iteration Count
┌─────────────────────────────────────────┐
│  How many improvement cycles?           │
│                                         │
│  ○ 5  (~30 min)                         │
│  ○ 10 (~1 hour) - Recommended           │
│  ○ 20 (~2 hours)                        │
│  ○ Custom                               │
└─────────────────────────────────────────┘

Step 3a (New Game): Game Idea
┌─────────────────────────────────────────┐
│  Describe your game idea:               │
│                                         │
│  > [User types game concept]            │
└─────────────────────────────────────────┘

Step 3b (Continue): Select Project & Focus
┌─────────────────────────────────────────────┐
│  Select project:                            │
│  ○ coin-collector (15 iters, 45,230 tokens) │
│  ○ block-blast (8 iters, 24,100 tokens)     │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  What changes do you want?                  │
│                                             │
│  > [User types specific improvements]       │
└─────────────────────────────────────────────┘
```

Token counts are ACTUAL usage (captured from sub-agent output), cumulative across all sessions.

---

## Technical Reference

**WSL Browser Handling:**
- Screenshots: `node scripts/capture-screenshot.js <url> <output> [wait-ms]`
- User preview: `explorer.exe "$(wslpath -w [path])"`
- NEVER use MCP Playwright tools (lock issues)

**If screenshots fail:** See Troubleshooting section at bottom.

---

## Workflow

### Phase 0: Gather Project Info (SILENT - NO OUTPUT)

**BEFORE any user interaction, silently gather project data:**

Use Glob tool to find projects:
```
Glob pattern: "projects/*/project.json"
```

For each project.json found, use Read tool to get:
- name, totalIterations, totalTokens from project.json

Store this info mentally - you'll need it for the project selection question.

**DO NOT print anything. DO NOT run bash. Just gather the data silently.**

---

### Phase 1: Interactive Project Selection

**After gathering project info, IMMEDIATELY call AskUserQuestion.**

#### Question 1: Project Mode (IMMEDIATE - NO PREAMBLE)

**Call AskUserQuestion tool NOW with these EXACT parameters:**

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

**WAIT for user response before continuing.**

#### Question 2: Iteration Count (USE AskUserQuestion TOOL)

**After user selects mode, IMMEDIATELY call AskUserQuestion again:**

```json
{
  "questions": [{
    "question": "How many improvement cycles should Ralph run?",
    "header": "Cycles",
    "multiSelect": false,
    "options": [
      {"label": "5 cycles", "description": "Quick prototype (~30 min)"},
      {"label": "10 cycles", "description": "Standard (~1 hour) - Recommended"},
      {"label": "20 cycles", "description": "Deep polish (~2 hours)"},
      {"label": "Custom", "description": "I'll specify a number"}
    ]
  }]
}
```

If "Custom" selected, ask for number via another AskUserQuestion.

---

#### Path A: NEW GAME Flow

If user selected "New Game":

**Question 3A: Game Idea (USE AskUserQuestion TOOL)**

```json
{
  "questions": [{
    "question": "Describe your game idea:",
    "header": "Idea",
    "multiSelect": false,
    "options": [
      {"label": "Tap collector", "description": "Tap items to collect points"},
      {"label": "Endless runner", "description": "Avoid obstacles, run forever"},
      {"label": "Puzzle game", "description": "Match or solve puzzles"}
    ]
  }]
}
```

User can select a template OR select "Other" (automatically provided) to describe their own game.

**Question 4A: Project Name (USE AskUserQuestion TOOL)**

After receiving the idea, suggest a name:

```json
{
  "questions": [{
    "question": "What should we name this project?",
    "header": "Name",
    "multiSelect": false,
    "options": [
      {"label": "[auto-suggested-name]", "description": "Based on your game idea"},
      {"label": "Custom name", "description": "I'll type my own"}
    ]
  }]
}
```

**After name selected, IMMEDIATELY proceed to Phase 2 (spawn sub-agent).**
DO NOT run any bash commands. The sub-agent will create the project folder and files.

(The sub-agent will create project.json with: name, description, created, totalIterations, totalSessions, totalTokens)

---

#### Path B: CONTINUE PROJECT Flow

If user selected "Continue Project":

**Question 3B: Select Project (USE AskUserQuestion TOOL)**

**You already have the project data from Phase 0. Use it immediately.**

DO NOT run any bash or glob commands here - you gathered this info at the start.

Call AskUserQuestion with the projects you found:

```json
{
  "questions": [{
    "question": "Which project do you want to continue?",
    "header": "Project",
    "multiSelect": false,
    "options": [
      {"label": "coin-collector", "description": "15 iterations, 45,230 tokens"},
      {"label": "block-blast", "description": "8 iterations, 24,100 tokens"}
    ]
  }]
}
```

**Format: "[X] iterations, [Y] tokens"** (actual counts from project.json totalTokens)

(Build options dynamically from actual projects found)

**Question 4B: What Changes? (USE AskUserQuestion TOOL)**

```json
{
  "questions": [{
    "question": "What should we focus on this session?",
    "header": "Focus",
    "multiSelect": false,
    "options": [
      {"label": "Auto-improve", "description": "Let Ralph analyze and decide (Recommended)"},
      {"label": "More juice", "description": "Better animations, particles, effects"},
      {"label": "New mechanics", "description": "Add gameplay features"}
    ]
  }]
}
```

User can select "Other" (automatically provided) to type a custom focus.

**After all questions answered, IMMEDIATELY proceed to Phase 2 (spawn sub-agent).**
DO NOT run any bash commands. The sub-agent will handle file setup.

---

### Phase 2: Launch Autonomous Loop Runner (IMMEDIATELY AFTER QUESTIONS)

**After user answers all questions, IMMEDIATELY spawn ONE sub-agent.**

**CRITICAL: The orchestrator runs NO bash commands. Only:**
- Glob/Read (to gather project info) - no permission needed
- AskUserQuestion (to get user choices) - no permission needed
- ONE Bash call to spawn the sub-agent - ONE permission prompt

Everything else (session setup, file copying, game code, screenshots) is done BY THE SUB-AGENT.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ORCHESTRATOR (Main Claude - YOU)                                           │
│  - Phase 0: Glob/Read to gather project info (silent, no prompts)           │
│  - Phase 1: AskUserQuestion for all choices (no prompts)                    │
│  - Phase 2: ONE bash call to spawn sub-agent (ONE prompt)                   │
│  - Phase 3: Wait and show results (no prompts)                              │
│  NO OTHER BASH COMMANDS. NO FILE WRITES. NO MKDIR.                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                          (ONE spawn, ONE permission)
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  LOOP RUNNER (Sub-Agent with --dangerously-skip-permissions)                │
│  - Runs ALL iterations autonomously                                         │
│  - Captures screenshots, analyzes, writes code                              │
│  - No permission prompts for anything                                       │
│  - Exits when all iterations complete                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Spawn the Loop Runner

**Use Bash to spawn a SINGLE sub-agent and capture token usage:**

```bash
cd /home/wsley/Coding/GameSkillsFrameWork && claude --dangerously-skip-permissions -p "[LOOP_RUNNER_PROMPT]" 2>&1 | tee projects/[project-name]/sessions/[session-id]/output.log
```

After the sub-agent completes, parse actual tokens from the output:
```bash
# Extract token count from Claude's output (format: "Total tokens: X")
grep -oP 'Total tokens: \K[0-9,]+' projects/[project-name]/sessions/[session-id]/output.log | tr -d ',' > projects/[project-name]/sessions/[session-id]/tokens.txt
```

The prompt must include ALL context needed to run autonomously:
- Project name and path
- Mode (new/continue)
- Number of iterations
- Game idea (if new) or focus area (if continue)
- Full instructions for the loop

---

#### Loop Runner Prompt Template (NEW GAME)

```markdown
# Ralph Loop Runner - New Game

## Project Info
- Project: [project-name]
- Location: /home/wsley/Coding/GameSkillsFrameWork
- Iterations: [N]

## Game Concept
[User's game description]

## Your Mission
Set up the project, create the game, then run [N] improvement iterations autonomously.

## Phase A: Setup (FIRST)
1. Create project folder and session:
   mkdir -p projects/[project-name]/sessions/session-$(date +%Y%m%d-%H%M%S)/screenshots
2. Create project.json if it doesn't exist
3. Create session.json with session details

## Phase B: Create Initial Game
1. Create preview/game.js implementing the game concept
2. Use game-renderer.js abstractions (SpriteNode, ShapeNode, LabelNode, Action, Scene, ParticleEmitter)
3. Canvas: 1179x2556 at 3x scale (393x852 logical)
4. Safe areas: top 162px, bottom 102px
5. Implement: state machine, core loop, scoring, visual feedback, game over

## Phase C: Run Improvement Loop
For each iteration 1 to [N]:

### Step 1: Capture Multi-State Screenshots
Take MULTIPLE screenshots to capture different game states:

```bash
# Initial state (game loaded)
node scripts/capture-screenshot.js "file:///.../preview/index.html" ".../iteration-X-01-initial.png" 500

# After animations settle
node scripts/capture-screenshot.js "file:///.../preview/index.html" ".../iteration-X-02-settled.png" 2000

# Gameplay state
node scripts/capture-screenshot.js "file:///.../preview/index.html" ".../iteration-X-03-gameplay.png" 4000
```

### Step 2: Analyze All Screenshots
Read EACH screenshot and evaluate:
- P0-P2: Errors (crashes, bugs, layout issues)
- P3-P5: Improvements (polish, mechanics, retention)

Compare screenshots to verify animations and state changes.

### Step 3: Make Improvements
Edit preview/game.js to fix errors and add improvements (max 3 changes per iteration)

### Step 4: TEST Each Feature Implemented
**CRITICAL: After making changes, you MUST test them:**

Use Playwright to interact with the game:
1. Navigate to game
2. Interact to trigger the feature (click, tap, wait)
3. Take screenshots: before, during animation, after
4. Verify the feature worked

**If feature DOESN'T work:**
- Fix it immediately
- Re-test until it works
- THEN proceed

### Step 5: Log Progress
Print: "═══ Iteration X/[N] ═══" with changes and test results

### Step 6: Continue
Repeat until all [N] iterations complete

## Quality Standards
- 60 FPS target
- Safe areas respected
- Every interaction feels satisfying
- Always find something to improve

## When Done
1. Copy final game: cp preview/game.js projects/[project-name]/game.js
2. Print completion summary
3. Print test URL: file:///home/wsley/Coding/GameSkillsFrameWork/preview/index.html
4. Exit

Print format:
```
═══ LOOP COMPLETE ═══
Iterations: [N]/[N]
Game saved to: projects/[project-name]/game.js
```

(Actual token count will be captured by orchestrator from this output)
```

---

#### Loop Runner Prompt Template (CONTINUE PROJECT)

```markdown
# Ralph Loop Runner - Continue Project

## Project Info
- Project: [project-name]
- Location: /home/wsley/Coding/GameSkillsFrameWork
- Iterations: [N]
- Focus: [auto-improve / user-specified-focus]

## Your Mission
Set up session, load the game, then run [N] improvement iterations autonomously.

## Phase A: Setup (FIRST)
1. Create session folder:
   mkdir -p projects/[project-name]/sessions/session-$(date +%Y%m%d-%H%M%S)/screenshots
2. Copy existing game to preview:
   cp projects/[project-name]/game.js preview/game.js
3. Create session.json with session details

## Phase B: Run Improvement Loop
For each iteration 1 to [N]:

### Step 1: Capture Multi-State Screenshots
Take MULTIPLE screenshots to capture different game states:

```bash
# Initial state (game loaded)
node scripts/capture-screenshot.js "file:///.../preview/index.html" ".../iteration-X-01-initial.png" 500

# After a few seconds (animations settled)
node scripts/capture-screenshot.js "file:///.../preview/index.html" ".../iteration-X-02-settled.png" 2000

# After more time (gameplay state changes)
node scripts/capture-screenshot.js "file:///.../preview/index.html" ".../iteration-X-03-gameplay.png" 4000
```

### Step 2: Analyze All Screenshots
Read EACH screenshot and evaluate:
- P0-P2: Errors (crashes, bugs, layout issues)
- P3-P5: Improvements (polish, mechanics, retention)

Compare screenshots to see:
- Did animations play correctly?
- Did state transitions happen?
- Are there visual glitches during motion?

Focus area: [auto / polish / mechanics / retention / user-specified]

### Step 3: Make Improvements
Edit preview/game.js to fix errors and add improvements (max 3 changes per iteration)

### Step 4: TEST Each Feature Implemented
**CRITICAL: After making changes, you MUST test them:**

Use Playwright to interact with the game and verify:
```
For each feature you added/changed:
1. Navigate to game: mcp__playwright__browser_navigate
2. Take screenshot of initial state
3. Interact to trigger the feature:
   - Click/tap: mcp__playwright__browser_click
   - Wait for animation: mcp__playwright__browser_wait_for
4. Take screenshot during animation (quick capture)
5. Take screenshot after animation completes
6. Verify the feature worked by analyzing screenshots
```

**Feature Testing Examples:**
- Game Over: Play until you lose, screenshot the game over screen
- Score: Tap to score, verify score label changed
- Particles: Trigger particle effect, capture during emission
- Animations: Trigger animation, capture start/middle/end
- Collisions: Move player into obstacle, verify response

**If feature DOESN'T work:**
- DO NOT move to next iteration
- Fix the bug immediately
- Re-test until it works
- THEN proceed

### Step 5: Log Progress
Print: "═══ Iteration X/[N] ═══" with:
- Changes made
- Features tested
- Test results (pass/fail)

### Step 6: Continue
Repeat until all [N] iterations complete

## Improvement Priorities
| P0 | Critical Errors | Blank screen, crashes, no touch |
| P1 | Functional Bugs | Score wrong, collision broken |
| P2 | Visual Issues | Safe area violations, clipping |
| P3 | Polish & Juice | Animations, particles, shake |
| P4 | Mechanics | Power-ups, combos, obstacles |
| P5 | Retention | Rewards, difficulty, hooks |

## Quality Standards
- 60 FPS target
- Safe areas: top 162px, bottom 102px (at 3x)
- Every interaction feels satisfying
- Always find something to improve

## When Done
1. Copy final game: cp preview/game.js projects/[project-name]/game.js
2. Print completion summary
3. Print test URL: file:///home/wsley/Coding/GameSkillsFrameWork/preview/index.html
4. Open preview: explorer.exe "$(wslpath -w /home/wsley/Coding/GameSkillsFrameWork/preview/index.html)"
5. Exit

Print format:
```
═══ LOOP COMPLETE ═══
Iterations: [N]/[N]
Game saved to: projects/[project-name]/game.js
```

(Actual token count will be captured by orchestrator from this output)
```

---

### Phase 3: Wait for Completion

After spawning the loop runner, the orchestrator waits.

The sub-agent will:
- Run all iterations autonomously
- Print progress for each iteration
- Exit when complete

**You (the orchestrator) just wait for the bash command to return.**

When it returns, proceed to Phase 5.

### Phase 4: Completion & Token Tally

**When the bash command returns, the orchestrator MUST:**

1. **Extract actual token count from output log:**
```bash
# Parse tokens from Claude's output
TOKENS=$(grep -oP '(?:Total tokens|tokens used): \K[0-9,]+' projects/[project-name]/sessions/[session-id]/output.log | tail -1 | tr -d ',')
echo "Session used $TOKENS tokens"
```

2. **Update project.json with actual tokens:**
```bash
# Read current totalTokens, add session tokens, write back
# Use jq or manual JSON update
```

Or have the orchestrator read the log and update:
```
Read projects/[project-name]/sessions/[session-id]/output.log
Find token count in output
Update projects/[project-name]/project.json totalTokens field
```

3. **Write session stats with actual tokens:**
```bash
cat > projects/[project-name]/sessions/[session-id]/stats.json << EOF
{
  "completedAt": "$(date -Iseconds)",
  "iterations": [N],
  "tokensUsed": $TOKENS
}
EOF
```

4. **Display completion with ACTUAL token count:**

```
═══════════════════════════════════════════════════════════════

GAME COMPLETE: [project-name]

Session: [N] iterations
Tokens used: [ACTUAL_COUNT] (this session)
Total project tokens: [CUMULATIVE]

► TEST YOUR GAME:
file:///home/wsley/Coding/GameSkillsFrameWork/preview/index.html

To continue improving: run /ralph → Continue Project

═══════════════════════════════════════════════════════════════
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

The loop maintains state in `ralph/session-state.json`:

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

**Ralph is designed to use ALL iterations.** Early stopping is rare.

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
═══ Ralph Iteration 2/10 ═══

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
═══ Ralph Iteration 6/10 ═══

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
═══ Ralph Complete ═══

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

Opening game in browser for testing...
  ✓ Preview launched

Game preview opened in your browser. Test it out!

The game has been optimized for maximum player retention and enjoyment.
All 10 iterations were used to polish every aspect.

If the browser didn't open, manually navigate to:
\\wsl.localhost\Ubuntu\home\wsley\Coding\GameSkillsFrameWork\preview\index.html

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
