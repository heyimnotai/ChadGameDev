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

## Workflow

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
