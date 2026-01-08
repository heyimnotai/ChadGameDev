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

#### Step 1: Install Browser via Bash (REQUIRED FIRST ACTION)

**YOUR VERY FIRST ACTION must be running this bash command. No exceptions.**

```bash
# Run this FIRST - installs Chromium if not present
npx playwright install chromium
```

Use the Bash tool with timeout of 300000 (5 minutes) to run:
```
npx playwright install chromium
```

**DO NOT use mcp__playwright__browser_install** - it hangs. Use Bash instead.

WAIT for this to complete. First-time install downloads ~165MB and takes 1-2 minutes.
If it shows "Chromium downloaded to..." it worked.
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

### Phase 3: Iteration Loop

For each iteration (1 to maxIterations):

#### Step 1: Capture Screenshots
```
Use visual-testing skill:
- Capture initial state
- Simulate interactions (tap center of game area)
- Capture post-interaction state
- Save to screenshots/session-[ID]/iteration-[N]/
```

#### Step 2: Analyze Screenshots
```
Examine each screenshot for:
- Quality gate violations
- Visual issues
- Game logic problems
- Polish opportunities

Generate structured analysis with severity ratings.
```

#### Step 3: Consult Patches
```
For each issue found:
- Search patches.md by symptom
- If match found: use documented solution
- If no match: prepare to debug and document
```

#### Step 4: Self-Prompt
```
Use self-prompter skill to generate next iteration prompt:
- List issues with priorities
- Include patch-suggested fixes
- Note what's working (preserve)
- Define verification steps
```

#### Step 5: Apply Fixes
```
Make code changes:
- One fix at a time
- Focus on highest priority first
- Max 3 issues per iteration
```

#### Step 6: Check Quality Gates
```
Evaluate all gates:
- [ ] Renders: Canvas visible, no errors
- [ ] Layout: Safe areas respected
- [ ] Visual: Colors, FPS, typography
- [ ] Interaction: Touch works
- [ ] Logic: Score, states, conditions

If ALL pass → Output <promise>COMPLETE</promise>
If any fail → Continue to next iteration
```

#### Step 7: Update State
```
- Log iteration to analysis-log.md
- Update session-state.json
- Create any new patches for solved problems
- Update current-prompt.md for next iteration
```

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

The loop stops when ANY of these are true:
1. All quality gates pass
2. Max iterations reached
3. User interrupts
4. No issues found (nothing to fix)

---

## Output Format

### During Iteration
```
═══ Ralph Iteration 3/10 ═══

Capturing screenshots...
  ✓ initial.png
  ✓ gameplay.png

Analyzing...
  Found 2 issues:
  - [CRITICAL] Particles not visible
  - [HIGH] Score overlaps safe area

Consulting patches...
  ✓ PATCH-002 matches "Particles not visible"

Applying fixes...
  1. Added emitter.start() call
  2. Moved score label to y=180

Verifying...
  Quality Gates: 4/5 passed
  - [ ] Visual: FPS dropped to 45

Generating next prompt...
```

### On Completion
```
═══ Ralph Complete ═══

Session: abc123
Iterations: 7/10
Status: All quality gates passed

Issues: 12 found, 12 fixed
Patches: 3 consulted, 2 created

Final Quality Gates:
  ✓ Renders
  ✓ Layout
  ✓ Visual
  ✓ Interaction
  ✓ Logic

New Patches Created:
  - PATCH-011: Animation timing on game over
  - PATCH-012: Coin spawn rate too high

<promise>COMPLETE</promise>
```

---

## Tips

1. **Start small** - 5 iterations for simple games
2. **Be specific** - Clear game descriptions help
3. **Check patches first** - Known solutions save time
4. **Trust the loop** - Let it iterate
5. **Review screenshots** - Visual truth > assumptions

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
