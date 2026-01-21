---
name: chad-optimizer
description: Use when running the full Chad Loop optimization cycle. Triggers on game optimization, visual iteration, or quality gate verification.
---

# Chad Optimizer

## Purpose

Iteratively improve iOS games using visual feedback. Capture screenshots, analyze issues, apply fixes, verify improvements until quality gates pass.

## The Loop

```
PROMPT → CODE → PREVIEW → SCREENSHOT → ANALYZE → FIX → VERIFY → REPEAT
                                                              ↓
                                         Until gates pass OR iterations complete
```

## Core Process

### 0. Consult Patches First
Before debugging, check `patches.md` for known solutions:
1. Identify symptom from screenshot
2. Search patches by symptom
3. If match: apply documented solution
4. If no match: debug and document new patch

### 1-6. Optimization Steps
1. **Preview**: Generate via game-preview skill
2. **Capture**: Screenshot via visual-testing skill
3. **Analyze**: Check quality gates
4. **Identify**: Prioritize fixes (max 3)
5. **Apply**: One change at a time
6. **Verify**: Capture new screenshot, compare

## Quality Gates

| Gate | Criteria |
|------|----------|
| Renders | Game loads, objects visible |
| Layout | Safe areas respected, aligned |
| Visual | Colors correct, 60fps, readable |
| Interaction | Touch works, feedback present |
| Logic | Score updates, states transition |

## Iteration Rules

**Continue until:**
- Iterations complete (5/10/20 selected), OR
- ALL scores reach 90+, OR
- User requests stop

**Each iteration MUST:**
- Make 1-3 substantive changes
- Capture and analyze screenshot
- Update quality scores
- Report: "Iteration X/N complete"

**DO NOT stop early because:**
- "Looks good enough" at 70-85%
- Basic gates pass
- Want to finish faster

## Patch Integration

### Using Patches
```
Issue Found: "Particles not visible"
  → Search patches.md: "particles"
  → Match: PATCH-002
  → Apply known fix (skip debugging)
```

### Creating Patches
When solving new problems:
```markdown
## PATCH-XXX: [Title]
**Problem**: [Symptom]
**Cause**: [Root cause]
**Solution**: [Code fix]
**Skills**: [Affected skills]
```

See `references/quality-scoring.md` for detailed scoring.
See `references/optimization-strategies.md` for fix patterns.

## Adjacent Skills

- **game-preview**: Generate preview
- **visual-testing**: Capture screenshots
- **self-prompter**: Generate next iteration
- **verification-before-completion**: Verify before done
