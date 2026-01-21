---
name: self-prompter
description: Use when generating the next iteration prompt after screenshot analysis. Triggers on self-prompting, next iteration planning, or AI-driven optimization cycles.
---

# Self-Prompter

## Purpose

Analyze visual output and generate specific, actionable prompts for the next iteration. The AI writes its own instructions based on what it sees.

## Core Process

1. **Summarize** analysis results (issues found, gates passed)
2. **Categorize** issues by severity (CRITICAL/HIGH/MEDIUM/LOW)
3. **Match patches** for known solutions
4. **Identify** what's working (preserve list)
5. **Select** top 3 issues for this iteration
6. **Generate** detailed fix instructions
7. **Write** to `chad/current-prompt.md`

## Severity Criteria

| Severity | Impact | Examples |
|----------|--------|----------|
| CRITICAL | Game unplayable | Blank screen, crash, no touch |
| HIGH | Major broken | Score wrong, states stuck |
| MEDIUM | Noticeable | Misalignment, wrong colors |
| LOW | Polish | Animation timing, effects |

## Prompt Template

```markdown
# Chad Iteration [N+1]

## Context
- Previous: [N], Issues: [count], Gates: [X/5]

## Priority 1: [SEVERITY] [Title]
- **Problem**: [What screenshot shows]
- **File**: [path], **Line**: ~[N]
- **Fix**: [Exact code change]
- **Verify**: [How to confirm]

## Priority 2-3: [Same format]

## Preserve (DO NOT MODIFY)
- [Working feature 1]
- [Working feature 2]

## Stop Condition
All gates pass → COMPLETE
Otherwise → Generate next prompt
```

## Key Rules

- **Maximum 3 fixes** per iteration (prevent overwhelm)
- **Specific file paths** (not "fix the code")
- **Actual code snippets** (not "add the call")
- **Verification steps** (not "check if works")
- **Preserve list** (prevent regression)

## Anti-Patterns

```
# BAD
"Fix the particle issue and check layout stuff"

# GOOD
"Add emitter.start() at line 47 of game.js after addChild().
Verify: yellow particles appear at tap coordinates."
```

See `references/prompt-examples.md` for complete examples.

## Adjacent Skills

- **visual-testing**: Provides analysis input
- **chad-optimizer**: Orchestrates the loop
