# Skill Templates Reference

## Full Discipline Skill Template

```markdown
---
name: [verb-noun format]
description: Use when [condition]. Triggers on [specific scenarios].
---

# [Skill Name]

## Purpose
[Single sentence: what behavior this enforces]

## The Rule
[Core constraint in imperative form]

## Process
1. [Step]
2. [Step]
3. [Step]

## Red Flags
[Thoughts that indicate violation]

## Verification
[How to confirm compliance]
```

## Full Technique Skill Template

```markdown
---
name: [noun or verb-noun]
description: Use when [implementing X]. Triggers on [scenarios].
---

# [Skill Name]

## Purpose
[What this technique achieves]

## When to Use
- [Trigger 1]
- [Trigger 2]

## Core Process
1. [Step with detail]
2. [Step with detail]
3. [Step with detail]

## Key Patterns
[Essential code or process patterns - keep brief]

## Anti-Patterns
[What NOT to do]

## Adjacent Skills
- [skill-before]: [relationship]
- [skill-after]: [relationship]
```

## Full Reference Skill Template

```markdown
---
name: [topic-reference]
description: Use when [needing specs for X]. Triggers on [implementation, debugging, auditing].
---

# [Topic] Reference

## Purpose
[What information this provides]

## Quick Lookup
[Most common needs - 5-10 items max]

## When to Load Full Reference
- [Scenario requiring references/full-spec.md]
- [Scenario requiring references/api-docs.md]

## File Index
- `references/api-reference.md` - [what it contains]
- `references/code-patterns.md` - [what it contains]
```

## Compression Checklist

When compressing an existing skill:

- [ ] Rewrite description to start with "Use when..."
- [ ] Remove workflow summary from description
- [ ] Count words in body (target <500)
- [ ] Identify code blocks >20 lines → move to references/
- [ ] Identify tables >10 rows → move to references/
- [ ] Remove redundant explanations
- [ ] Convert prose to bullets/tables where possible
- [ ] Verify all triggers still mentioned
- [ ] Test that skill still activates correctly

## Word Count Guidelines

**Counting method**: Body content only, excluding YAML frontmatter.

| Section | Target |
|---------|--------|
| Purpose | 20-40 words |
| When to Use | 30-60 words |
| Core Process | 100-200 words |
| Key Rules | 50-100 words |
| Quick Reference | 50-100 words |
| Adjacent Skills | 20-40 words |
| **Total** | **270-540 words** |

## Example Transformations

### Before (verbose)
```markdown
## Implementation Patterns

### Basic Haptic Manager

The haptic manager should be implemented as a singleton pattern
to ensure consistent access throughout your application. Here's
a complete implementation that handles all feedback types:

\`\`\`swift
import UIKit
import CoreHaptics

final class HapticManager {
    static let shared = HapticManager()
    // ... 200 more lines
}
\`\`\`
```

### After (compressed)
```markdown
## Key Patterns

Singleton `HapticManager` with reused generators. See `references/code-patterns.md` for full implementation.

Essential methods:
- `prepare()` before expected haptic
- `impact(style:intensity:)` for collisions
- `notification(type:)` for outcomes
```
