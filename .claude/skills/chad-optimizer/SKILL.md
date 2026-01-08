---
name: chad-optimizer
description: Run the full Chad Loop optimization cycle - analyze visual output and iterate until quality gates pass
triggers:
  - optimize game
  - chad loop
  - iterate on visuals
  - optimization cycle
---

# Chad Optimizer Skill

The Chad Loop is an iterative optimization cycle that uses visual feedback to continuously improve iOS game quality. Named after the concept of "seeing like Chad" - using AI vision to analyze and improve game visuals.

## Key Innovation: Self-Prompting with Patch Learning

Unlike traditional Chad which uses static prompts, Visual Chad:
1. **Analyzes screenshots** using multimodal AI vision
2. **Consults patches.md** for known solutions before debugging
3. **Generates its own prompts** for subsequent iterations
4. **Documents new solutions** to patches.md for future use

## The Visual Chad Loop

```
┌─────────────────────────────────────────────────────────────────────────┐
│  VISUAL CHAD LOOP                                                      │
│                                                                         │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│   │  PROMPT  │───▶│  SKILLS  │───▶│  CODE    │───▶│ PREVIEW  │         │
│   │ (Self/   │    │ (30 game │    │ (game.js)│    │(Playwright│         │
│   │  User)   │    │  skills) │    │          │    │  launch) │         │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│        ▲                                                │               │
│        │                                                ▼               │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│   │  SELF-   │◀───│  PATCH   │◀───│ ANALYZE  │◀───│SCREENSHOT│         │
│   │ PROMPTER │    │ CONSULT  │    │ (Vision) │    │ (Capture)│         │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│        │                                                                │
│        │         ┌──────────┐                                           │
│        └────────▶│ PATCHES  │◀── Document new solutions                 │
│                  │   .md    │                                           │
│                  └──────────┘                                           │
│                                                                         │
│   Loop until: All quality gates pass OR max iterations reached          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Optimization Cycle Steps

### 0. Consult Patches (BEFORE fixing)

**Critical Step**: Before attempting any fix, check `patches.md`:

```markdown
## Patch Lookup Process

1. Identify the symptom from screenshot analysis
2. Search patches.md Index by Symptom table
3. If match found:
   - Read the documented solution
   - Apply it directly (don't reinvent)
   - Note patch ID in analysis log
4. If no match:
   - Debug the issue normally
   - After solving, document as new patch
```

**Example Patch Lookup:**
```
Issue Found: "Particles not visible in screenshot"
  ↓
Search patches.md: "particles" / "not visible"
  ↓
Match: PATCH-002 "Particles Not Visible"
  ↓
Solution: Add emitter.start() after scene.addChild()
  ↓
Apply known fix (skip debugging)
```

### 1. Render Preview

Generate the HTML5 preview using game-preview skill:
- Write/update `preview/game.js`
- Ensure all game objects render correctly

### 2. Capture Visual

Use visual-testing skill to capture screenshots:
- Take screenshot of current state
- Optionally capture multiple game states
- Save to `screenshots/session-[ID]/iteration-[N]/`

### 3. Analyze Output

Examine the screenshot for:

**Technical Issues**:
- Layout problems (safe areas, alignment)
- Rendering bugs (artifacts, clipping)
- Performance indicators (FPS from debug overlay)

**Design Issues**:
- Visual hierarchy unclear
- Color contrast insufficient
- Typography problems
- Animation timing off

**Game Feel Issues**:
- Touch targets too small
- Feedback unclear
- Pacing problems

### 4. Identify Fixes

Create a prioritized list of improvements:

```markdown
## Optimization Priorities

### Critical (Must Fix)
- [ ] Issue: [description]
  Fix: [specific code change]

### High (Should Fix)
- [ ] Issue: [description]
  Fix: [specific code change]

### Medium (Nice to Have)
- [ ] Issue: [description]
  Fix: [specific code change]
```

### 5. Apply Changes

Make targeted code changes:
- One issue at a time
- Test after each change
- Don't over-engineer

### 6. Verify Improvement

Capture new screenshot and compare:
- Did the fix work?
- Any new issues introduced?
- Quality gates passing?

### 7. Repeat or Exit

Continue loop until:
- All critical issues resolved
- Quality gates pass
- User approves visual output

## Quality Gates

### Gate 1: Renders Correctly
- [ ] Game loads without errors
- [ ] All objects visible
- [ ] Correct screen dimensions

### Gate 2: Layout Correct
- [ ] Respects safe areas
- [ ] Proper alignment
- [ ] No clipping/overflow

### Gate 3: Visual Quality
- [ ] Colors match design
- [ ] Typography readable
- [ ] Smooth animations (60 FPS)

### Gate 4: Interaction Works
- [ ] Touch events register
- [ ] Correct coordinates
- [ ] Appropriate feedback

### Gate 5: Game Logic
- [ ] Score updates correctly
- [ ] State transitions work
- [ ] Win/lose conditions function

## Optimization Strategies

### Performance Optimization
```javascript
// Before: Many objects
for (let i = 0; i < 100; i++) {
    scene.addChild(new ShapeNode.circle(5));
}

// After: Batch rendering
const batchNode = new SpriteNode(...);
batchNode.renderBatch = true;
```

### Visual Polish
```javascript
// Before: Hard edges
const button = new SpriteNode(Color.blue, { width: 200, height: 60 });

// After: Rounded corners, shadow
const button = new SpriteNode(Color.blue, { width: 200, height: 60 });
button.cornerRadius = 12;
```

### Animation Refinement
```javascript
// Before: Linear movement
Action.moveTo(target, 0.3);

// After: Eased movement
const action = Action.moveTo(target, 0.3);
action.timingFunction = Action.easeOut;
```

## Integration Commands

Use these commands during optimization:

- `/preview` - Generate and open preview
- `/build` - Build native iOS app
- `/test-ios` - Run on iOS Simulator
- `/optimize` - Run full Chad cycle
- `/push` - Commit and push when done

## Example Optimization Session

```markdown
## Chad Loop - Session 1

### Initial Capture
Screenshot shows: Circle off-center, score hidden under Dynamic Island

### Fixes Applied
1. Adjusted circle Y position: 400 → 600
2. Moved score label: y=100 → y=200

### Verification
Screenshot shows: Circle centered, score visible

### Quality Gate Status
- [x] Renders Correctly
- [x] Layout Correct
- [ ] Visual Quality (need to adjust colors)
- [ ] Interaction Works (not yet tested)

### Next Iteration
Focus on: Color contrast, touch testing
```

## Tips for Effective Optimization

1. **Fix one thing at a time** - Easier to verify each change
2. **Start with critical issues** - Don't polish before fixing bugs
3. **Trust the visual** - If it looks wrong, it is wrong
4. **Check on device** - Preview is approximation, verify on iOS
5. **Document changes** - Keep record for debugging
6. **Know when to stop** - Perfection is the enemy of shipped
7. **Consult patches first** - Don't reinvent solved problems
8. **Document new solutions** - Help future iterations learn

## Patch Integration

### Creating New Patches

When you solve a problem not in `patches.md`, document it:

```markdown
## PATCH-XXX: [Short Descriptive Title]
**Problem Pattern:** [What the screenshot shows - the symptom]
**Root Cause:** [Why it happens - the actual bug]
**Solution:**
```[language]
// Code that fixes the issue
// Include enough context to understand placement
```
**Affected Skills:** [Which skills should learn this]
**Date Added:** [YYYY-MM-DD]
**Iterations to Solve:** [How many iterations it took]
```

### Patch Quality Checklist

Before adding a new patch, verify:
- [ ] Problem pattern is specific (not "it doesn't work")
- [ ] Root cause explains WHY, not just WHAT
- [ ] Solution includes working code
- [ ] Code snippet is copy-paste ready
- [ ] Affected skills are identified
- [ ] Patch ID is sequential

### Patch Graduation

When a patch is used 5+ times successfully:
1. Consider incorporating into the affected skill
2. Add to skill's "Common Gotchas" or anti-patterns section
3. Keep patch in patches.md but mark as "Graduated"

## Self-Prompting Integration

After analysis, use `self-prompter` skill to generate next iteration:

```markdown
## Self-Prompt Generation Flow

1. Summarize analysis results
2. Categorize issues by severity
3. Match issues to existing patches
4. Identify what's working (preserve list)
5. Select top 3 issues for this iteration
6. Generate detailed fix instructions
7. Write to chad/current-prompt.md
```

### Self-Prompt Quality Checks

Generated prompts must include:
- [ ] Specific file paths (not "fix the file")
- [ ] Actual code snippets (not "add the call")
- [ ] Line numbers when known
- [ ] Verification steps (how to confirm fix worked)
- [ ] Preserve list (what NOT to change)
- [ ] Patch references where applicable
- [ ] Clear stop condition

## Session Management

### State Files

- `chad/config.json` - Loop configuration
- `chad/session-state.json` - Current session state
- `chad/current-prompt.md` - Next iteration prompt
- `chad/analysis-log.md` - Full history

### Screenshot Organization

```
screenshots/
└── session-abc123/
    ├── iteration-001/
    │   ├── initial.png
    │   ├── gameplay.png
    │   └── analysis.md
    ├── iteration-002/
    │   └── ...
    └── summary.md
```

## Metrics to Track

### Per Session
- Iterations used
- Issues found/fixed
- Patches consulted/created
- Quality gates final status

### Across Sessions
- Average iterations to completion
- Most common issues
- Most useful patches
- Skill improvement opportunities
