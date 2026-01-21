# Difficulty Tuner - API Reference

## Difficulty Curve Formulas

### Linear
```
difficulty(level) = base + (increment * level)
```
- base: 1.0-2.0, increment: 0.1-0.5
- Use for: Short games (<50 levels), predictable feel

### Polynomial
```
difficulty(level) = base * level^exponent
```
- base: 1-20, exponent: 1.5-3.0
- Use for: 20-100 levels, accelerating challenge

### Exponential
```
difficulty(level) = base * multiplier^(level - 1)
```
- base: 50-200, multiplier: 1.05-1.20
- Use for: Idle games, prestige systems

### Stair-Step (Recommended)
```
Pattern: Hard level followed by 5-6 easier levels
New mechanic introduced at difficulty reset points
```

## DDA Algorithm

```
Performance_Score = weighted_average(deaths, time, retries, resources)

If Performance_Score < 0.4:  // Struggling
    difficulty_modifier -= 0.1 (reduce by 10%)

If Performance_Score > 0.8:  // Dominating
    difficulty_modifier += 0.05 (increase by 5%)

Bounds: 0.5 <= difficulty_modifier <= 1.5
```

**DDA Principles:**
1. Hidden - Players should not perceive adaptation
2. Gradual - Adjust 5-15% per evaluation
3. Bounded - Define min/max difficulty
4. Reversible - Can increase AND decrease

## Performance Metrics

| Metric | Weight | Measurement |
|--------|--------|-------------|
| Deaths/Failures | High | Track per level/session |
| Completion Time | Medium | Compare to target time |
| Near-Misses | Medium | Close calls that succeed |
| Retries | High | Repeated attempts |
| Idle Time | Low | Pauses (confusion indicator) |
| Resource Usage | Medium | Boosters/helps used |

## Fail-State Progression

| Attempt | Response |
|---------|----------|
| 1 | Normal failure, encourage retry |
| 2 | Subtle hint (highlight mechanic) |
| 3 | Explicit tip ("Try X to defeat Y") |
| 4 | Offer help option (ad/item) |
| 5 | Reduce difficulty for attempt |
| 6+ | Offer skip option |

## Skill-Based vs Time-Based Progression

| Aspect | Skill-Based | Time-Based |
|--------|-------------|------------|
| Advancement | Performance | Time/attempts |
| Player Feel | Mastery, can frustrate | Inevitable, can feel hollow |
| Audience | Core/hardcore | Casual |
| Monetization | Skill-assists | Time-acceleration |

**Hybrid (Recommended):**
```
adjustedThreshold = max(0.3, skillThreshold - (attempts * 0.05))
canProgress = skillScore >= adjustedThreshold || attempts >= 10
```

## Accessibility Requirements

| Option | Description |
|--------|-------------|
| Difficulty Presets | Easy/Normal/Hard multipliers |
| Assist Mode | Invincibility/Skip options |
| Time Controls | Pause, slow motion |
| Visual Assists | High contrast, colorblind |
| Audio Cues | Sound for visual events |

## Decision Trees

### Difficulty Curve Selection
```
[Hyper-Casual] -> LINEAR, gentle slope, reset on death
[Puzzle] -> STAIR-STEP, mechanic = reset
[Action/Roguelike] -> EXPONENTIAL within run + DDA
[Idle] -> EXPONENTIAL + prestige
[Strategy] -> LOGARITHMIC, multiple axes
```

### DDA Activation
```
[Competitive/Ranked] -> NO (skill measurement)
[Story/Campaign] -> YES (0.7-1.3 bounds)
[Endless/High-score] -> PARTIAL (early game only)
[Tutorial/FTUE] -> AGGRESSIVE (0.5-1.0 only easier)
```

## Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Obvious DDA | Players game it | Keep hidden |
| Difficulty Wall | 90% quit | Max 50% spike between levels |
| No Recovery | Stuck at high | DDA must be bidirectional |
| Punishing Tutorial | Player uninstalls | Aggressive DDA in tutorial |
