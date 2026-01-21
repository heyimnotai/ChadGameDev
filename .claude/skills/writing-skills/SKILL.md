---
name: writing-skills
description: Use when creating new skills, editing existing skills, or auditing skill quality. Triggers on skill creation, skill compression, skill testing, or "the skill doesn't work" complaints.
---

# Writing Skills

## Purpose

Apply TDD to skill creation. Test where Claude fails without the skill, write minimal skill to fix that failure, refactor to close loopholes.

## The Iron Law

**NO SKILL WITHOUT A FAILING TEST FIRST.**

This applies to new skills AND edits. If you didn't watch Claude fail without the skill, you don't know if the skill teaches the right thing.

## RED-GREEN-REFACTOR Cycle

1. **RED**: Run scenarios WITHOUT skill. Document exact rationalizations Claude uses to skip the process.
2. **GREEN**: Write minimal skill addressing those specific violations.
3. **REFACTOR**: Test again. Identify new rationalizations. Add explicit counters.

## Token Efficiency Targets

| Type | Max Words | When |
|------|-----------|------|
| Discipline | 150-200 | Enforces a process |
| Technique | 300-500 | Teaches a method |
| Reference-heavy | 200 + refs | Has specs/code |

## Description Rules

**MUST** start with "Use when..."

**MUST** focus on triggering conditions only.

**NEVER** summarize the workflow in description. Descriptions that summarize create shortcuts Claude takes instead of reading the full skill.

```yaml
# BAD - summarizes workflow
description: Implements haptic feedback using UIFeedbackGenerator with prepare() timing...

# GOOD - triggers only
description: Use when adding tactile feedback to game events. Triggers on haptic implementation or feedback tuning.
```

## File Structure

```
skill-name/
├── SKILL.md        # <500 words, core instructions
├── references/     # Heavy docs (>20 lines code, >10 row tables)
└── scripts/        # Executable helpers (optional)
```

## Skill Template

```markdown
---
name: skill-name
description: Use when [triggers]. Triggers on [scenarios].
---

# Skill Name

## Purpose
[1-2 sentences - what this enables]

## When to Use
- [Specific trigger list]

## Core Process
[<10 numbered steps]

## Key Rules
[What NOT to do]

## Adjacent Skills
[Before/after skills]
```

## Anti-Patterns

| Pattern | Problem |
|---------|---------|
| Narrative examples | Tied to specific sessions, not generalizable |
| Multi-language samples | Pick ONE excellent example |
| Workflow in description | Claude skips the body |
| >500 words | Context waste |
| No failing test | Skill may not address real failure |

## Testing Skill Types

- **Discipline skills**: Test under pressure (time + sunk cost + exhaustion)
- **Technique skills**: Test application and edge cases
- **Reference skills**: Test retrieval and correct usage

## When to Extract to References

Move to `references/` when:
- Code example >20 lines
- Table >10 rows
- API documentation
- Platform-specific specs

Keep in SKILL.md:
- Core process steps
- Key rules
- Decision criteria
