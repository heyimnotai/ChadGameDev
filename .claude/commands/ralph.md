# Visual Ralph Loop - Autonomous Game Development

Run the Visual Ralph Loop to autonomously develop and polish a game through iterative visual feedback.

## Usage

```
/ralph [iterations] [game description]
```

**Examples:**
- `/ralph 10 hyper-casual coin collector with tap mechanics`
- `/ralph 5 endless runner with obstacle avoidance`
- `/ralph` (uses defaults: 10 iterations, continues current session)

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

#### Step 2: Verify Preview Files Exist

```
Use Glob or Read to verify these files exist:
- preview/index.html
- preview/game-renderer.js
- preview/game.js

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
  ✓ Preview files found
  ✓ Browser test successful

Proceeding to game generation..."
```

**DO NOT proceed to Phase 1 until all 4 steps complete successfully.**

---

### Phase 1: Initialize Session

1. **Parse Arguments**
   - Extract max iterations (default: 10)
   - Extract game description (or use existing)

2. **Load Context**
   - Read `patches.md` for known solutions
   - Read `ralph/session-state.json` for any existing session
   - Read `ralph/config.json` for settings

3. **Setup Session**
   - Generate unique session ID
   - Create `screenshots/session-[ID]/` directory
   - Update `ralph/session-state.json`

### Phase 2: Game Generation

1. **Invoke Skills**
   - Use `game-architect` for overall structure
   - Use domain-specific skills based on game type
   - Generate `preview/game.js` code

2. **Launch Preview**
   - Use Playwright to navigate to preview
   - Wait for initial render

### Phase 3: Continuous Improvement Loop

**IMPORTANT: Ralph does NOT stop when errors are fixed. Ralph continuously improves the game for ALL iterations.**

The loop runs for ALL iterations (1 to maxIterations). Each iteration either:
1. Fixes errors (if any exist), OR
2. Improves the game (if no errors)

**Philosophy: "Is there anything that could be better about this game?"**
- If YES → Make improvements
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
- Save to screenshots/session-[ID]/iteration-[N]/
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

#### Step 6: Apply Changes
```
Make code changes:
- Fix errors first (P0-P2)
- Then add improvements (P3-P5)
- Max 3 changes per iteration to keep progress trackable
- Test each change visually
```

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

When loop ends (all gates pass OR max iterations):

1. **Generate Summary**
   - Total iterations used
   - Issues found and fixed
   - Patches created
   - Final quality gate status

2. **Update Patches**
   - Add any new problem→solution pairs
   - Update patch statistics

3. **Present Results**
   - Show final screenshot
   - List remaining issues (if any)
   - Provide next steps

4. **Launch Preview for User Testing (REQUIRED)**

   **After completion, ALWAYS open the game in the user's browser so they can test it.**

   Use Bash to run:
   ```bash
   explorer.exe "$(wslpath -w /home/wsley/Coding/GameSkillsFrameWork/preview/index.html)"
   ```

   This opens the preview in the Windows browser from WSL.

   Note: The command may return exit code 1 but still work - that's expected on WSL.

   Tell the user:
   ```
   "Game preview opened in your browser. Test it out!

   If the browser didn't open, manually navigate to:
   \\wsl.localhost\Ubuntu\home\wsley\Coding\GameSkillsFrameWork\preview\index.html"
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
