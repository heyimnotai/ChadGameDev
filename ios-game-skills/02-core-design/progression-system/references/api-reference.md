# Progression System - API Reference

## XP Curve Formulas

### Linear
```
XP(level) = base * level
```
- base: 10-100
- Use: Short games, base layer for hybrid

### Polynomial
```
XP(level) = base * level^exponent
```
- base: 1-20, exponent: 1.5-3.0
- Exponent 1.5: Gentle (casual)
- Exponent 2.0: Quadratic (standard RPG)
- Exponent 2.5: Steep (mid-length)
- Exponent 3.0: Cubic (short, dramatic)

### Exponential
```
XP(level) = base * multiplier^(level-1)
```
- base: 50-200, multiplier: 1.05-1.20
- Use: Idle games, prestige systems

| Multiplier | Level 50 XP | Level 100 XP |
|------------|-------------|--------------|
| 1.05 | 1,147 | 13,150 |
| 1.10 | 10,672 | 1.38M |
| 1.15 | 76,861 | 117M |

### Hybrid (Recommended)
```
L1-10:  Concave (exp < 1) - Fast start
L11-40: Linear - Steady middle
L41+:   Convex (exp > 1) - Slow grind
```

## Level Count by Genre

| Genre | Levels | Reasoning |
|-------|--------|-----------|
| Hyper-Casual | 0-10 | Focus on score |
| Puzzle (Linear) | 200-2000+ | Level = content |
| Puzzle (Meta) | 30-100 | XP across levels |
| Roguelike | 15-30/run | Meta: 20-50 unlocks |
| Idle | 50-200 + prestige | Reset extends |
| Strategy/RPG | 50-100 | Investment sweet spot |
| Card Game | 50-100 | Collection is progression |

## Unlock Pacing

```
unlock_level(item) = max_level * (item/total)^pacing_curve

pacing_curve:
  0.5 = Front-loaded (50% by level 25%)
  1.0 = Even distribution
  1.5 = Back-loaded (50% by level 75%)
```

| Phase | Levels | Unlock Frequency |
|-------|--------|------------------|
| Tutorial | 1-5 | Every level |
| Early | 6-15 | Every 2-3 levels |
| Mid | 16-40 | Every 3-5 levels |
| Late | 41+ | Every 5-10 levels |

## Power Curve Guidelines

| Levels | Growth/Level | Max Power |
|--------|--------------|-----------|
| 10 | 10% | 2x base |
| 50 | 3% | 2.5x base |
| 100 | 1.5% | 2.5x base |

**Diminishing Returns:**
```
actual = max_stat * (1 - e^(-k * investment))

k = 0.05:
  Investment 20: 63% of max
  Investment 40: 86% of max
  Investment 60: 95% of max
```

## Prestige Patterns

| Pattern | Formula | Use |
|---------|---------|-----|
| Linear | 0.1 * resets | Simple (+10%/reset) |
| Diminishing | 0.5 * sqrt(resets) | Encourages multiple |
| Asymptotic | 1 - e^(-0.1*resets) | Hard cap at +100% |

**Prestige Timing:**
- Reset when prestige bonus gain > time lost to reset
- Rule: Reset when you reach 50% in 25% of time

## Soft vs Hard Caps

| Cap Type | Implementation |
|----------|----------------|
| Soft Cap | XP reduced 50-90% |
| Hard Cap | No progression |
| Time Cap | Daily/weekly limits |
| Content Cap | "Coming Soon" |

## Decision Trees

### XP Curve Selection
```
[Casual <1hr] -> LINEAR, 10-20 levels
[Moderate 1-10hr] -> POLYNOMIAL 1.5-2.0, 30-50 levels
[Dedicated 10-50hr] -> HYBRID, 50-100 levels, soft cap
[Hardcore 50+hr] -> EXPONENTIAL + prestige
[Idle] -> EXPONENTIAL 1.15+, mandatory prestige
```

### Level Count Decision
```
[Levels ARE content] -> 200-2000+ (puzzle)
[Levels unlock content] -> 50-100 (RPG)
[Levels = skill] -> 20-50 ranks (competitive)
[Levels = investment] -> Infinite via prestige (idle)
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Impossible Grind | Exponential with no prestige | Add prestige or soft cap |
| Empty Levels | Nothing unlocks | Every level rewards something |
| Linear Forever | Predictable/boring | Use hybrid for variance |
| Pay-to-Skip | Player skips all content | Sell acceleration, not completion |
