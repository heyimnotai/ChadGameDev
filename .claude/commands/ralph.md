# Visual Ralph Loop - Autonomous Game Development

Run the Visual Ralph Loop to autonomously develop and polish games through iterative visual feedback.

## Usage

**For fully hands-off operation, run Claude with skip-permissions:**

```bash
claude --dangerously-skip-permissions
```

Then run:
```
/ralph
```

This eliminates permission prompts during project setup and development.

**Standard mode** (with permission prompts):
```
claude
/ralph
```

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
│  ○ 5  (Quick prototype)                 │
│  ○ 10 (Standard - Recommended)          │
│  ○ 20 (Deep polish)                     │
│  ○ Custom                               │
└─────────────────────────────────────────┘

Step 3a (New Game): Game Idea
┌─────────────────────────────────────────┐
│  Describe your game idea:               │
│                                         │
│  > [User types game concept]            │
└─────────────────────────────────────────┘

Step 3b (Continue): Select Project & Focus
┌─────────────────────────────────────────┐
│  Select project:                        │
│  ○ coin-collector (15 iterations)       │
│  ○ block-blast (8 iterations)           │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  What changes do you want?              │
│                                         │
│  > [User types specific improvements]   │
└─────────────────────────────────────────┘
```

---

## CRITICAL: First-Time Setup

**If a previous run hung**, kill any stuck processes first:
```bash
pkill -f chromium
pkill -f chrome
```

---

## Workflow

### Phase 0: Prerequisites Check (MANDATORY - DO NOT SKIP)

**STOP. Before ANY other action, you MUST complete these steps in order.**

#### Step 1: Install All Dependencies via Bash (REQUIRED FIRST ACTION)

**YOUR VERY FIRST ACTION must be running this bash command. No exceptions.**

Use the Bash tool with timeout of 300000 (5 minutes) to run:
```bash
cd /home/wsley/Coding/GameSkillsFrameWork && npm install && npx playwright install chromium
```

This command:
1. Installs npm dependencies (@playwright/test)
2. Downloads Chromium browser (~165MB first time)

**DO NOT use mcp__playwright__browser_install** - it hangs. Use Bash instead.

WAIT for this to complete. First-time install takes 1-2 minutes.
If it shows "Chromium downloaded to..." or "up to date" it worked.
If it fails, STOP and report the error to the user.

#### Step 2: Verify Core Files Exist

```
Use Glob or Read to verify these files exist:
- preview/index.html
- preview/game-renderer.js

If ANY are missing: STOP and report to user.
```

#### Step 3: Test Browser Works

```
ONLY after Step 1 completes successfully:

Call: mcp__playwright__browser_navigate
Parameters: url = "about:blank"

If this fails with "browser not found": Run Step 1 again.
If this fails for other reasons: STOP and report error.
If success: Close browser with mcp__playwright__browser_close
```

#### Step 4: Confirm Ready

```
Print to user:
"Prerequisites passed:
  ✓ Browser installed (via bash)
  ✓ Core files found
  ✓ Browser test successful

Ready for project selection..."
```

**DO NOT proceed to Phase 1 until all 4 steps complete successfully.**

---

### Phase 1: Interactive Project Selection

**After prerequisites pass, YOU MUST USE THE AskUserQuestion TOOL to present choices.**

**DO NOT just print text and wait. USE THE TOOL.**

#### Question 1: Project Mode (USE AskUserQuestion TOOL NOW)

**IMMEDIATELY call the AskUserQuestion tool with these EXACT parameters:**

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
      {"label": "5 cycles", "description": "Quick prototype (~10-15 min)"},
      {"label": "10 cycles", "description": "Standard - Recommended"},
      {"label": "20 cycles", "description": "Deep polish (~45-60 min)"},
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
      {"label": "Puzzle game", "description": "Match or solve puzzles"},
      {"label": "Custom idea", "description": "I'll describe my own game"}
    ]
  }]
}
```

User will select an option or type their own via "Other".

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

**Then create project:**

```bash
mkdir -p projects/[project-name]/screenshots
mkdir -p projects/[project-name]/sessions
```

Create `projects/[project-name]/project.json`:
```json
{
  "name": "[project-name]",
  "description": "[user's game idea]",
  "created": "[ISO timestamp]",
  "lastModified": "[ISO timestamp]",
  "totalIterations": 0,
  "totalSessions": 0,
  "status": "in-development"
}
```

---

#### Path B: CONTINUE PROJECT Flow

If user selected "Continue Project":

**Question 3B: Select Project (USE AskUserQuestion TOOL)**

First, list existing projects:
```bash
ls -d projects/*/ 2>/dev/null | xargs -I {} basename {}
```

Read each `project.json` for status, then call AskUserQuestion:

```json
{
  "questions": [{
    "question": "Which project do you want to continue?",
    "header": "Project",
    "multiSelect": false,
    "options": [
      {"label": "coin-collector", "description": "15 iterations, last: Jan 5"},
      {"label": "block-blast", "description": "8 iterations, last: Jan 3"}
    ]
  }]
}
```

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
      {"label": "New mechanics", "description": "Add gameplay features"},
      {"label": "Custom request", "description": "I'll describe what I want"}
    ]
  }]
}
```

If "Custom request" selected, user types their specific changes via "Other".

**Then load project:**

```bash
cp projects/[project-name]/game.js preview/game.js
```

Read `projects/[project-name]/project.json` for context.

---

### Phase 1.5: Session Setup

After project selection (new or continue):

1. **Generate session ID**: `session-[timestamp]`

2. **Create session folder**:
   ```bash
   mkdir -p projects/[project-name]/sessions/[session-id]
   mkdir -p projects/[project-name]/sessions/[session-id]/screenshots
   ```

3. **Create session.json**:
   ```json
   {
     "sessionId": "[session-id]",
     "startedAt": "[ISO timestamp]",
     "projectName": "[project-name]",
     "mode": "new|continue",
     "focus": "[auto|polish|mechanics|retention|bugs]",
     "maxIterations": [N],
     "currentIteration": 0,
     "improvements": [],
     "errorsFixed": [],
     "status": "running"
   }
   ```

4. **Load context**:
   - Read `patches.md` for known solutions
   - Read `ralph/session-state.json` for any existing session
   - Read `ralph/config.json` for settings

3. **Setup Session**
   - Generate unique session ID
   - Create `screenshots/session-[ID]/` directory
   - Update `ralph/session-state.json`

### Phase 2: Sub-Agent Architecture

**Ralph uses sub-agents for hands-off development.** The main orchestrator manages the loop while sub-agents do the actual coding work with full permissions.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  RALPH ORCHESTRATOR (Main Claude)                                           │
│  - Manages project selection                                                │
│  - Analyzes screenshots                                                     │
│  - Decides what to improve                                                  │
│  - Spawns sub-agents for each iteration                                     │
│  - Tracks progress and patches                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SUB-AGENT (Iteration Worker)                                               │
│  - Runs with: claude --dangerously-skip-permissions                         │
│  - Receives specific task prompt                                            │
│  - Writes/modifies game code                                                │
│  - No permission prompts = faster iteration                                 │
│  - Returns when task complete                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### How to Spawn Sub-Agents

For each iteration, use the **Bash tool** to spawn a sub-agent:

```bash
echo "[ITERATION PROMPT]" | claude --dangerously-skip-permissions -p
```

Or use the **Task tool** with `subagent_type: "Bash"` to run:
```bash
cd /home/wsley/Coding/GameSkillsFrameWork && claude --dangerously-skip-permissions -p "[PROMPT]"
```

#### Sub-Agent Prompt Template

Each sub-agent receives a focused prompt:

```markdown
# Ralph Iteration [N] - [Project Name]

## Your Task
You are a sub-agent in the Ralph Loop. Complete this iteration's improvements.

## Project Location
- Game file: preview/game.js
- Project folder: projects/[project-name]/

## This Iteration's Focus
[From orchestrator's analysis]

### Errors to Fix (P0-P2)
[List of specific errors with file locations]

### Improvements to Make (P3-P5)
[List of specific improvements with implementation details]

## Instructions
1. Read the current game.js
2. Make the specified changes
3. Save the file
4. Exit when done

## Quality Standards
- Maintain 60 FPS
- Respect safe areas (top: 162px, bottom: 102px at 3x)
- Use game-renderer.js abstractions
- Add juice and polish to every interaction

## When Done
Simply exit. The orchestrator will capture screenshots and analyze results.
```

---

### Phase 2.5: Initial Game Generation

For NEW games, spawn a sub-agent to create the initial game:

```bash
cd /home/wsley/Coding/GameSkillsFrameWork && claude --dangerously-skip-permissions -p "
# Create New Game: [Project Name]

## Game Concept
[User's game description]

## Your Task
Create preview/game.js implementing this game concept.

## Technical Requirements
- Use game-renderer.js abstractions (SpriteNode, ShapeNode, LabelNode, Action, Scene, ParticleEmitter)
- Canvas: 1179x2556 at 3x scale (393x852 logical)
- Safe area top: 162px, bottom: 102px
- Target 60 FPS
- Implement touch handling

## Game Structure
1. Game state machine (menu, playing, gameOver)
2. Core gameplay loop
3. Score tracking
4. Visual feedback on actions
5. Game over condition

## Invoke Skills
Use these skills from ios-game-skills/:
- core-loop-architect
- juice-orchestrator
- particle-effects
- dopamine-optimizer

Create a complete, playable game. Exit when done.
"
```

---

### Phase 3: Continuous Improvement Loop

**IMPORTANT: Ralph does NOT stop when errors are fixed. Ralph continuously improves the game for ALL iterations.**

The loop runs for ALL iterations (1 to maxIterations). Each iteration:
1. **Orchestrator** captures screenshots and analyzes
2. **Orchestrator** decides what to improve
3. **Sub-agent** implements the improvements (with --dangerously-skip-permissions)
4. **Orchestrator** verifies and continues

**Philosophy: "Is there anything that could be better about this game?"**
- If YES → Spawn sub-agent to make improvements
- If NO → Only then consider stopping early (rare)

---

#### Improvement Priority System

When analyzing, work through these priorities IN ORDER:

| Priority | Category | Focus | Examples |
|----------|----------|-------|----------|
| P0 | **Critical Errors** | Game-breaking bugs | Blank screen, crashes, no touch response |
| P1 | **Functional Bugs** | Things that don't work | Score not updating, wrong collision |
| P2 | **Visual Issues** | Layout/display problems | Safe area violations, clipping, alignment |
| P3 | **Polish & Juice** | Game feel improvements | Better animations, particles, screen shake |
| P4 | **Mechanics** | Gameplay additions | New obstacles, power-ups, combo systems |
| P5 | **Retention Optimization** | Player psychology | Reward timing, difficulty curve, session hooks |

**ALWAYS find something to improve.** Even a "perfect" game can have:
- Smoother animations
- More satisfying sound cues
- Better particle effects
- Tighter difficulty curves
- More rewarding feedback loops

---

#### Step 1: Capture Screenshots
```
Use visual-testing skill:
- Capture initial state (game loaded)
- Capture gameplay state (after interactions)
- Capture different game states (menu, playing, game over)
- Save to projects/[project-name]/sessions/[session-id]/screenshots/iteration-[N]/
```

#### Step 2: Deep Analysis (Errors AND Improvements)
```
Examine each screenshot through TWO lenses:

LENS 1 - ERROR DETECTION (P0-P2):
- Quality gate violations?
- Visual bugs or glitches?
- Functional problems?
- Layout issues?

LENS 2 - IMPROVEMENT OPPORTUNITIES (P3-P5):
- Could animations be smoother/juicier?
- Are particle effects satisfying enough?
- Is the feedback loop tight?
- Could difficulty curve be better?
- Are rewards timed for maximum dopamine?
- Would screen shake add impact?
- Is the pacing optimal for retention?
- Could there be more variety?
- Are touch targets satisfying to hit?
- Does the game "feel" good?

If no errors found, you MUST find improvements.
Ask: "What would make a player want to play this for 30 more seconds?"
```

#### Step 3: Consult Skills for Improvements
```
Based on what you want to improve, invoke relevant skills:

For Polish (P3):
- juice-orchestrator: Overall game feel
- particle-effects: Visual effects
- animation-system: Smooth animations
- screen-shake-impact: Impact feedback
- haptic-optimizer: Tactile feedback
- audio-designer: Sound design

For Mechanics (P4):
- core-loop-architect: Gameplay loop refinement
- difficulty-tuner: Challenge balancing
- progression-system: Advancement mechanics

For Retention (P5):
- dopamine-optimizer: Reward timing
- reward-scheduler: Variable rewards
- session-designer: Session length optimization
- retention-engineer: Long-term hooks
- onboarding-architect: First experience
```

#### Step 4: Consult Patches
```
For errors: Search patches.md by symptom
For improvements: Check if similar enhancements documented

If implementing something new that works well, prepare to document it.
```

#### Step 5: Generate Improvement Plan
```
Create a prioritized list:

## Iteration [N] Plan

### Errors to Fix (if any)
1. [P0/P1/P2] Description - specific fix

### Improvements to Make
1. [P3] Add screen shake on coin collect - 3px, 100ms
2. [P4] Add combo multiplier for rapid taps
3. [P5] Implement near-miss reward for close calls

### Retention Check
- [ ] Does collecting feel satisfying?
- [ ] Is there a reason to play "one more time"?
- [ ] Are rewards unpredictable enough?
- [ ] Is difficulty ramping appropriately?
```

#### Step 6: Spawn Sub-Agent to Apply Changes

**DO NOT make changes directly. Spawn a sub-agent with full permissions.**

Use Bash tool to spawn the iteration worker:

```bash
cd /home/wsley/Coding/GameSkillsFrameWork && claude --dangerously-skip-permissions -p "
# Ralph Iteration [N] - [Project Name]

## Your Task
You are a sub-agent in the Ralph Loop. Implement these improvements.

## Files
- Game: preview/game.js
- Renderer: preview/game-renderer.js (read-only reference)

## Errors to Fix
[List from Step 5, or 'None' if no errors]

## Improvements to Make
[List from Step 5 - max 3 items]

## Implementation Notes
[Specific code guidance from patches.md or skills]

## Quality Standards
- Maintain 60 FPS
- Safe areas: top 162px, bottom 102px (at 3x scale)
- Use existing game-renderer.js classes
- Every interaction should feel satisfying

Exit when changes are complete.
"
```

**Wait for sub-agent to complete before continuing.**

The sub-agent will:
- Read the current game.js
- Make the specified changes
- Save the file
- Exit automatically

Sub-agent runs with `--dangerously-skip-permissions` so there are no interruptions.

#### Step 7: Verify Quality Gates
```
Evaluate all gates:
- [ ] Renders: Canvas visible, no errors
- [ ] Layout: Safe areas respected
- [ ] Visual: Colors, FPS, typography correct
- [ ] Interaction: Touch works with good feedback
- [ ] Logic: Score, states, conditions work

Gates passing does NOT mean loop ends.
Gates passing means you can focus on P3-P5 improvements.
```

#### Step 8: Retention Self-Check
```
Ask these questions EVERY iteration:

1. "Would I tap again?" - Is action satisfying?
2. "What's the hook?" - Why keep playing?
3. "Where's the dopamine?" - When do players feel good?
4. "Is there anticipation?" - Do players look forward to something?
5. "Is there surprise?" - Are there unexpected delights?

If any answer is weak, that's your next improvement target.
```

#### Step 9: Update State & Continue
```
- Log iteration to analysis-log.md
- Update session-state.json
- Document new patterns to patches.md
- Generate next iteration prompt
- CONTINUE TO NEXT ITERATION (don't stop just because gates pass)
```

---

#### When Does the Loop Actually End?

The loop ends when:
1. **Max iterations reached** (most common - this is expected!)
2. **User interrupts** (they've seen enough)
3. **Game is truly optimized** (rare - only if you genuinely cannot think of ANY improvement)

**The loop should almost always run all iterations.**
Use all the iterations the user gave you to make the game as good as possible.

### Phase 4: Completion

When loop ends (max iterations reached):

1. **Save Game to Project Folder (REQUIRED)**

   ```bash
   # Copy the final game.js to the project folder
   cp preview/game.js projects/[project-name]/game.js

   # Copy final screenshot
   cp [latest-screenshot] projects/[project-name]/screenshots/latest.png
   ```

2. **Update Project Metadata**

   Update `projects/[project-name]/project.json`:
   ```json
   {
     "lastModified": "[ISO timestamp]",
     "totalIterations": [previous + this session],
     "totalSessions": [previous + 1],
     "status": "in-development"
   }
   ```

3. **Finalize Session**

   Update `projects/[project-name]/sessions/[session-id]/session.json`:
   ```json
   {
     "status": "completed",
     "completedAt": "[ISO timestamp]",
     "finalIterations": [N],
     "improvements": [...],
     "errorsFixed": [...]
   }
   ```

4. **Generate Summary**
   - Total iterations used
   - Issues found and fixed
   - Improvements made by category (P3/P4/P5)
   - Patches created
   - Final quality gate status

5. **Update Patches**
   - Add any new problem→solution pairs
   - Update patch statistics

6. **Present Results**
   - Show final screenshot
   - List improvements made this session
   - Provide next steps

7. **Launch Preview for User Testing (REQUIRED)**

   **After completion, ALWAYS open the game in the user's browser so they can test it.**

   Use Bash to run:
   ```bash
   explorer.exe "$(wslpath -w /home/wsley/Coding/GameSkillsFrameWork/preview/index.html)"
   ```

   This opens the preview in the Windows browser from WSL.

   Note: The command may return exit code 1 but still work - that's expected on WSL.

8. **Display Clickable Test Link (REQUIRED)**

   **ALWAYS output the test URL as a clickable link for the user.**

   Print this EXACT format (the link should be clickable in the terminal):

   ```
   ═══════════════════════════════════════════════════════════════

   GAME COMPLETE: [project-name]

   Iterations: [N]/[N]
   Improvements: [X] enhancements made

   ► TEST YOUR GAME:
   file:///home/wsley/Coding/GameSkillsFrameWork/preview/index.html

   ► Windows path (if above doesn't work):
   \\wsl.localhost\Ubuntu\home\wsley\Coding\GameSkillsFrameWork\preview\index.html

   ► Project saved to:
   projects/[project-name]/

   To continue improving: run /ralph → Continue Project → [project-name]

   ═══════════════════════════════════════════════════════════════
   ```

   The `file:///` URL should be clickable in most terminals.

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

### "Browser not installed" or timeout on first run

```
Fix: The browser_install step should handle this automatically.
If it fails, run /setup first to diagnose.
```

### Browser hangs or times out

```
Fix: Kill any stuck browser processes first:
  pkill -f chromium
  pkill -f chrome

Then try again.
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
