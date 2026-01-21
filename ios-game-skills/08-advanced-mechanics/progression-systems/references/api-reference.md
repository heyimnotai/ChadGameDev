# Progression Systems API Reference

## Prestige System Design

| Element | Specification | Rationale |
|---------|---------------|-----------|
| First Prestige | 2-4 hours playtime | Hook before boredom |
| Prestige Multiplier | 2-10x initial | Must feel powerful |
| Subsequent Prestiges | 50-100% longer each | Diminishing but extending |
| Carryover | Achievements, unlocks | Never lose everything |
| New Content | Unlocked post-prestige | Reward for resetting |

## Prestige Currency Formula

```
prestige_currency = floor(lifetime_earnings / threshold) ^ exponent

// Example (Adventure Capitalist style):
soul_eggs = floor(lifetime_earnings / 1e12) ^ 0.5
```

## Optimal Prestige Timing

| Run Number | Optimal Prestige Point | Why |
|------------|------------------------|-----|
| 1st | 2x current max | Learn the system |
| 2nd-5th | 3-4x current max | Efficient growth |
| 6th+ | 2x current max | Maintenance mode |

## Battle Pass Structure

| Tier Range | Content Type | Free Track | Premium Track |
|------------|--------------|------------|---------------|
| 1-10 | Quick Wins | Basic resources | Cosmetic item |
| 11-30 | Core Rewards | Standard items | Exclusive items |
| 31-60 | Mid-Game | Mixed value | Premium currency |
| 61-90 | Investment Payoff | Good items | Rare cosmetics |
| 91-100 | Finale | Solid finale | Flagship reward |
| 100+ | Prestige | Resources | Exclusive variant |

## XP Curve Per Tier

```
tier_xp_required = base_xp x (1 + (tier / 100) x multiplier)

// Example: 1000 base, 0.5 multiplier
// Tier 1:  1000 XP
// Tier 50: 1250 XP
// Tier 100: 1500 XP
```

## Time Budget

- Total completion: 80-100 hours over season
- Daily engagement: 30-60 minutes
- Weekly challenges: Major XP boost
- Catch-up weeks: End-of-season bonus XP

## Mastery System Design

| Level | Unlock | Effort Required |
|-------|--------|-----------------|
| 1-3 | Basic cosmetics | Easy, teaches system |
| 4-6 | Stat bonuses | Regular play |
| 7-8 | Unique abilities | Dedicated use |
| 9 | Prestigious visual | Significant commitment |
| 10 | Title + Badge | Completionist goal |

## What Resets on Mastery

| Resets | Persists |
|--------|----------|
| Level progress | Cosmetics earned |
| In-game currency | Achievements |
| Temporary buffs | Mastery badges |

## Ascension Tiers

| Layer | Name | Typical Unlock | Bonus Type |
|-------|------|----------------|------------|
| 0 | Base Game | - | - |
| 1 | Prestige | Hours | Multipliers |
| 2 | Ascension | Days | New mechanics |
| 3 | Transcendence | Weeks | Permanent unlocks |
| 4 | Enlightenment | Months | Ultimate goals |

## Battle Pass Tier Pacing

```
How far into the season?
├── Week 1-2 → Players should be tier 15-25
├── Week 3-4 → Players should be tier 40-55
├── Week 5-6 → Players should be tier 65-80
└── Week 7-8 → Players should complete

Is the player behind?
├── YES → Offer catch-up (bonus XP weekend)
└── NO → Normal progression
```

## Mastery Challenge Design

```
What should challenges require?
│
Mix of:
├── Quantity-based (use X times)
├── Skill-based (achieve Y with element)
├── Variety-based (use in N different contexts)
└── Achievement-based (special conditions)

DO NOT use:
├── Win-only progress (frustrating)
├── Unrealistic quantities (months of grinding)
└── Pure RNG gates (luck-based)
```

## Quality Checklists

### Prestige Systems
- [ ] First prestige achievable in 2-4 hours
- [ ] Prestige multiplier feels meaningful (2x minimum)
- [ ] Clear indication of optimal prestige point
- [ ] Carryover items/achievements feel valuable
- [ ] New content unlocks post-prestige
- [ ] Multiple prestige layers (if applicable)

### Battle Pass
- [ ] 100% completion in ~80-100 hours
- [ ] Free track has genuinely useful rewards
- [ ] Premium track has exclusive-feeling items
- [ ] Milestone tiers (25, 50, 75, 100) are exciting
- [ ] Season end countdown visible
- [ ] Premium returns some premium currency

### Mastery
- [ ] All elements have mastery tracks
- [ ] Visual progression is satisfying
- [ ] Max mastery takes meaningful (not excessive) time
- [ ] Mastery badges visible to other players
- [ ] Challenges encourage skill, not grinding
