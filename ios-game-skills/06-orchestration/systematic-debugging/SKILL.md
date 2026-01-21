---
name: systematic-debugging
description: Use when encountering bugs, test failures, or unexpected behavior. Triggers before proposing any fix - requires root cause analysis first, not symptom patching.
---

# Systematic Debugging

## Purpose

Find and fix root causes, not symptoms. Symptom fixes create technical debt and mask real problems.

## The Rule

**ALWAYS find root cause before attempting fixes.**

If you're guessing what might fix it, you haven't found the root cause yet.

## When to Use

- Test failures
- Runtime errors
- Unexpected behavior
- Performance issues
- Build failures
- "It worked before"

## Core Process

### Phase 1: Understand

1. **Read** the actual error message completely
2. **Reproduce** consistently (if can't reproduce, can't verify fix)
3. **Isolate** the minimal case that triggers it
4. **Check** what changed recently (git diff, recent commits)

### Phase 2: Analyze

5. **Find working example** in codebase (how does similar code work?)
6. **Compare** working vs broken (what's different?)
7. **Trace** data flow backward from error to source
8. **Form hypothesis** about root cause (specific, testable)

### Phase 3: Fix

9. **Make ONE change** to test hypothesis
10. **Verify** fix addresses root cause, not just symptom
11. **Check** for side effects

### Phase 4: Validate

12. **Run full test suite** (not just the failing test)
13. **Document** root cause for future reference

## Key Rules

**Three Strikes Rule**: If 3 fix attempts fail, STOP. Question your understanding of the problem. The architecture may be wrong.

**No Compound Fixes**: Change ONE thing at a time. Multiple simultaneous changes = unknown which worked.

**No Guessing**: "Maybe if I try..." = wrong approach. Understand first.

## Red Flags

| Thought | What It Means |
|---------|---------------|
| "Let me try..." | Guessing, not understanding |
| "This should fix it" | No verification plan |
| "It works now" | Did you find root cause? |
| "Quick fix" | Probably symptom fix |

## Quick Reference

```
Error → Read fully → Reproduce → Isolate → Recent changes?
                                              ↓
                        ← ← ← Find working example
                        ↓
                    Compare diff → Trace backward → Hypothesis
                                                        ↓
                                    ONE change → Verify → Full tests
```

## Adjacent Skills

- **verification-before-completion**: Verify fix actually worked
- **chad-optimizer**: Visual debugging for game issues
