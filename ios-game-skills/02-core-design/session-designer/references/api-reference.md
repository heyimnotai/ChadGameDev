# Session Designer - API Reference

## Session Length by Genre

| Genre | Target | Min | Max | Sessions/Day |
|-------|--------|-----|-----|--------------|
| Hyper-Casual | 2-5 min | 30s | 10 min | 5-10 |
| Puzzle/Match-3 | 5-15 min | 3 min | 30 min | 3-5 |
| Card Game | 10-20 min | 5 min | 45 min | 2-4 |
| Roguelike | 15-30 min | 10 min | 60 min | 1-3 |
| Idle | 1-3 min active | 30s | 10 min | 8-15 |
| Strategy | 5-15 min | 2 min | 30 min | 4-8 |
| RPG | 15-30 min | 10 min | 60 min | 2-4 |

## Session Structure Template (15 min)

| Phase | Time | Purpose |
|-------|------|---------|
| HOOK | 0:00-0:30 | Show rewards, daily bonus, clear goal |
| WARM-UP | 0:30-2:00 | Easy task, first quick win |
| CORE | 2:00-10:00 | Main gameplay loops |
| CLIMAX | 10:00-12:00 | Boss/challenge, high stakes |
| RESOLUTION | 12:00-14:00 | Reward ceremony, achievements |
| BRIDGE | 14:00-15:00 | Preview next, set timer |

## Break Point Triggers

| Trigger | Response | Intent |
|---------|----------|--------|
| Level Complete | Score, offer continue | Natural pause |
| Energy Depleted | Wait or ad | Monetization + end |
| Daily Limit | "Come back tomorrow" | Prevent burnout |
| Achievement | Celebration | Good exit point |
| Boss Defeated | Victory ceremony | Milestone exit |

**Break Point Formula:**
```
interval = target_session / target_breaks
Example: 15 min / 4 breaks = ~4 min between breaks
```

## Session Start Elements (First 30s)

| Element | Timing | Purpose |
|---------|--------|---------|
| Welcome Back | 0-3s | Personal connection |
| Offline Earnings | 3-8s | Immediate reward |
| Daily Bonus | 5-15s | First action = reward |
| Today's Goal | 10-20s | Direction |
| Quick Win | 20-30s | Momentum |

## Session End Elements (Last 60s)

| Element | Timing | Purpose |
|---------|--------|---------|
| Progress Summary | 0-15s | Acknowledge accomplishment |
| Reward Animation | 15-30s | Dopamine hit |
| Achievement Display | 30-45s | Recognition |
| Next Goal Preview | 45-55s | Reason to return |
| Return Reminder | 55-60s | Specific callback |

## Mid-Session Hooks

| Hook | Placement | Purpose |
|------|-----------|---------|
| Streak Counter | Every action | Build investment |
| Near-Miss | Close calls | Increase tension |
| Surprise Reward | Random 5-10% | Variable reinforcement |
| Progress Milestone | 25%, 50%, 75% | Mark progress |
| Challenge Offer | Mid-session | Stakes |
| Social Trigger | After achievement | Connection |

## Inter-Session Bridges

| Bridge | Timing | Message |
|--------|--------|---------|
| Timer Reward | 4-8 hours | "Free chest in 4h" |
| Daily Reset | 24 hours | "Bonus resets midnight" |
| Energy Refill | 30min-4hr | "Full energy in 2h" |
| Event Countdown | Event-based | "Tournament ends in 2d" |
| Streak Maintenance | 24 hours | "Don't break streak!" |
| Cliffhanger | End of session | "Boss awaits..." |

## Energy System Configs

| Game Type | Max | Regen Rate | Full Refill |
|-----------|-----|------------|-------------|
| Hyper-Casual | None | N/A | N/A |
| Puzzle Casual | 5 | 1/30 min | 2.5 hr |
| Puzzle Core | 5 | 1/20 min | 1.5 hr |
| Strategy | 10-20 | 1/6-10 min | 1-3 hr |
| RPG/Gacha | 100-200 | 1/5 min | 8-16 hr |

## Successful Game Benchmarks

| Game | Avg Session | Sessions/Day | Key Timing |
|------|-------------|--------------|------------|
| Candy Crush | 8-12 min | 4-6 | 5 lives, 30m regen |
| Clash Royale | 12-15 min | 4-5 | 3-4 min matches |
| Marvel Snap | 8-10 min | 5-7 | 3 min matches |
| Vampire Survivors | 20-30 min | 1-2 | 30 min max/run |
| Wordle | 2-5 min | 1 | Once per day |

## Decision Trees

### Energy System Decision
```
[Hyper-Casual] -> NO energy, monetize via ads
[Casual Puzzle] -> YES, 5 lives, 30min regen
[Core Puzzle] -> Optional, consider subscription
[RPG/Gacha] -> YES, stamina, 100-200, 5min regen
[Competitive] -> NO on ranked, optional casual
[Premium] -> NO, player paid for access
```

### Break Point Placement
```
After Level: ALWAYS, show score, "Continue" prominent
After Achievement: Celebration = break
After Boss: Extended break, story moment
After Energy Depletes: Forced, show timer
At Target Length: Gentle suggestion
At Max Length: Stronger suggestion, health reminder
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Endless Session | Player burnout | Break every 5 min |
| Punishing Exit | Anxiety/trap feeling | Auto-save, graceful exit |
| Cold Start | No momentum | Welcome + continue context |
| Aggressive Energy | Feels predatory | 30+ min free play/day |
