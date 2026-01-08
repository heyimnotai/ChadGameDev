---
description: Commit changes and push to GitHub after optimization cycle
allowed-tools:
  - Bash
  - Read
  - Glob
---

# Push Command

Commit and push changes to GitHub after completing an optimization cycle.

## Usage

```
/push [commit message]
```

## What This Command Does

1. **Check** git status for changes
2. **Review** what will be committed
3. **Stage** relevant files
4. **Commit** with descriptive message
5. **Push** to remote repository

## Execution Steps

### Step 1: Check Repository Status

```bash
git status
```

Verify:
- On correct branch
- Changes ready to commit
- No unintended files

### Step 2: Review Changes

```bash
git diff --stat
git diff preview/game.js  # or specific files
```

Ensure changes are intentional and complete.

### Step 3: Stage Files

Stage game-related files:
```bash
git add preview/
git add *.swift  # if native code changed
git add .claude/  # if skills/commands updated
```

Do NOT stage:
- `.DS_Store`
- `*.xcuserstate`
- Build artifacts
- Credentials or secrets

### Step 4: Commit

Use conventional commit format:
```bash
git commit -m "feat(game): add tap-the-circle gameplay

- Implement circle spawning and touch detection
- Add score tracking and display
- Include particle effects on successful tap

Ralph Loop iterations: 3
Quality gates: All passing"
```

### Step 5: Push

```bash
git push origin [branch-name]
```

If new branch:
```bash
git push -u origin [branch-name]
```

## Commit Message Format

```
<type>(<scope>): <short summary>

<body - what changed and why>

Ralph Loop iterations: <n>
Quality gates: <status>
```

### Types

- `feat`: New feature or game mechanic
- `fix`: Bug fix
- `perf`: Performance improvement
- `style`: Visual/UI changes
- `refactor`: Code restructuring
- `docs`: Documentation
- `chore`: Maintenance tasks

### Example Messages

```
feat(game): implement tap-the-circle base gameplay
```

```
fix(layout): correct score position for Dynamic Island
```

```
perf(render): optimize particle system for 60fps
```

```
style(ui): improve color contrast and button styling
```

## Pre-Push Checklist

Before pushing, verify:

- [ ] Game runs without errors
- [ ] All quality gates pass
- [ ] No debug code left in
- [ ] No hardcoded test values
- [ ] Commit message is descriptive
- [ ] Correct branch selected

## Output Format

```markdown
## Push Complete ✅

**Branch**: feature/tap-game
**Commit**: abc1234
**Message**: feat(game): implement tap-the-circle gameplay

### Files Changed
- preview/game.js (new)
- preview/index.html (modified)
- .claude/commands/preview.md (new)

### Remote
Pushed to: origin/feature/tap-game
URL: https://github.com/user/repo/commit/abc1234

### Next Steps
- Create PR if ready for review
- Continue development on this branch
- Run `/optimize` after next changes
```

## Notes

- Always pull before pushing to avoid conflicts
- Use feature branches for new games/features
- Keep commits atomic (one logical change per commit)
- Reference issue numbers if applicable: `fixes #123`
