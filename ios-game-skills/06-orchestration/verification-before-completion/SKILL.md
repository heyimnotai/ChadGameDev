---
name: verification-before-completion
description: Use when about to claim work is complete, fixed, or passing. Triggers before commits, PRs, task completion, or any success claims. Requires running verification commands and confirming output before assertions.
---

# Verification Before Completion

## Purpose

Enforce evidence-based completion claims. No "done" without fresh verification output proving it.

## The Gate (Non-Negotiable)

Before ANY completion claim:

1. **Identify** the command that proves your claim
2. **Run** the command fresh (not cached/previous)
3. **Read** full output including exit codes
4. **Verify** output confirms the claim
5. **Only then** make the claim

Skipping any step = dishonesty.

## Red Flags (Stop Immediately)

These thoughts mean you're about to violate:

- "Should work now" → RUN IT
- "That probably fixed it" → RUN IT
- "Looks good" → RUN IT
- "Done!" before seeing output → STOP
- Trusting previous run → RUN FRESH
- Trusting agent report without diff → VERIFY

## Insufficient Evidence

These do NOT count as verification:

| Claimed | Why Insufficient |
|---------|------------------|
| Previous test run | Need FRESH run after changes |
| Linter passes | Doesn't verify runtime behavior |
| Code looks right | Doesn't verify execution |
| Agent reported success | Need independent verification |
| Partial check | Need FULL verification |

## Valid Evidence

| Claim | Required Evidence |
|-------|-------------------|
| "Tests pass" | Fresh `npm test` / `pytest` output showing all green |
| "Build succeeds" | Fresh build command with exit code 0 |
| "Bug is fixed" | Reproduction steps now produce correct behavior |
| "Feature works" | Demo of feature functioning as specified |
| "App runs" | Fresh launch with no crash, screenshot if visual |

## Integration with Chad Loop

Before marking ANY quality gate as passed:

```
Quality Gate: "Renders Correctly"
  ↓
Required: Fresh screenshot showing correct render
  ↓
NOT: "I updated the code so it should render"
```

## Before Commits

```bash
# WRONG
git commit -m "Fix bug"  # Without verifying fix

# RIGHT
npm test                 # Run tests
# See: "42 passed, 0 failed"
git commit -m "Fix bug"  # Now commit
```

## Apply Always Before

- Completion claims ("Done!", "Fixed!", "Working!")
- Satisfaction expressions ("Perfect!", "Looks great!")
- Commits and PRs
- Task status updates
- Delegating to agents (verify their output)

## The Principle

**Honesty requires evidence. Claims without verification are guesses presented as facts.**
