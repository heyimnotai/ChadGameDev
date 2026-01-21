# Enemy Design API Reference

## Enemy Archetype Hierarchy

| Tier | Archetype | HP | Damage | Speed | Role |
|------|-----------|-----|--------|-------|------|
| 1 | Fodder | Low | Low | Medium | Tutorial, cannon fodder |
| 2 | Basic | Medium | Medium | Medium | Standard challenge |
| 3 | Elite | High | High | Varies | Skill check |
| 4 | Champion | Very High | Very High | Varies | Mini-boss |
| 5 | Boss | Massive | Variable | Variable | Climactic |

## Core Archetypes

| Archetype | Behavior | Counter Strategy | Example |
|-----------|----------|------------------|---------|
| Rusher | Charges directly | Dodge/kite | Zombies |
| Shooter | Ranged attacks | Close gap, take cover | Archers |
| Tank | Absorbs damage | Focus fire, abilities | Golems |
| Swarm | Many weak units | AoE, crowd control | Bugs |
| Supporter | Buffs/heals others | Priority target | Healers |
| Assassin | High burst, low HP | Awareness, quick reaction | Ninjas |
| Siege | Slow, devastating | Interrupt, dodge | Artillery |
| Controller | Debuffs, zones | Positioning, cleanse | Mages |

## Boss Phase Structure

| Phase | HP Threshold | Mechanic Introduction | Intensity |
|-------|--------------|----------------------|-----------|
| 1 | 100-70% | Basic patterns | Learning |
| 2 | 70-40% | New attack + previous | Building |
| 3 | 40-15% | All attacks, faster | Climax |
| 4 (Enrage) | <15% | Desperation mode | Final push |

## Boss Attack Types

| Type | Frequency | Damage | Counterplay |
|------|-----------|--------|-------------|
| Normal | Often | Low | Basic dodge |
| Signature | Every 30s | Medium | Learn pattern |
| Ultimate | Phase transition | High | Safe zone |
| Enrage | Low HP only | Very High | DPS race |

## Telegraph Timing

| Attack Speed | Telegraph Duration | Visual + Audio |
|--------------|-------------------|----------------|
| Fast | 0.3-0.5s | Flash + sound |
| Medium | 0.5-1.0s | Windup animation |
| Slow | 1.0-2.0s | Ground indicator |
| Ultimate | 2.0-3.0s | Screen warning |

## Static Scaling (Per Level/Zone)

| Enemy Stat | Scaling Formula | Notes |
|------------|-----------------|-------|
| HP | base x (1 + level x 0.1) | Linear growth |
| Damage | base x (1 + level x 0.08) | Slightly slower than HP |
| Speed | base x (1 + level x 0.02) | Cap at 1.5x base |

## Dynamic Difficulty (Adaptive)

| Player Performance | Adjustment |
|--------------------|------------|
| Dying frequently | -10% enemy damage, +drop rates |
| Crushing easily | +15% enemy HP, spawn elites |
| Balanced | No change |

## Rubber Banding (Racing/Score)

```
If player_ahead:
  ai_speed += (distance / max_distance) x boost_factor
If player_behind:
  ai_speed -= (distance / max_distance) x rubber_band_factor
```

## Weakness System

| Weakness Type | Effect | Strategic Depth |
|---------------|--------|-----------------|
| Elemental | 2x damage from type | Rock-paper-scissors |
| Positional | Weak point (back, head) | Positioning skill |
| Timed | Vulnerable window | Pattern recognition |
| Conditional | After specific action | Combo/ability use |
| Equipment | Specific weapon type | Build variety |

## Decision Trees

### Choosing Enemy Mix for Encounter

```
What's the encounter purpose?
├── Tutorial → Mostly fodder, 1 basic
├── Standard → 60% basic, 30% elite, 10% special
├── Challenge → 40% basic, 40% elite, 20% champion
└── Boss room → Boss + support waves
    │
    What emotions should player feel?
    ├── Power fantasy → Many fodder, satisfying mow-down
    ├── Tension → Elite focus, resource pressure
    ├── Puzzle → Controller + synergy enemies
    └── Epic → Boss with add phases
```

### Boss Phase Count

```
How long should the fight be?
├── 1-2 minutes → 2 phases
├── 3-5 minutes → 3 phases
├── 5+ minutes → 4 phases with transitions
    │
    Is this a final boss?
    ├── YES → 4 phases, dramatic transitions
    └── NO → 2-3 phases, efficient
```

### When to Spawn Elite Modifier

```
Is the player overpowered for content?
├── YES → Spawn elites with affixes
└── NO → Standard enemies
    │
    Is the player under-leveled?
    ├── YES → Reduce elite spawn rate
    └── NO → Normal spawn rates
```

## Quality Checklists

### Enemy Variety
- [ ] Each archetype has distinct silhouette
- [ ] Behaviors are immediately recognizable
- [ ] Counter strategies are learnable
- [ ] Mix creates interesting compositions
- [ ] Progression introduces new types gradually

### Boss Fights
- [ ] Each phase feels different
- [ ] Attacks are telegraphed fairly
- [ ] Safe opportunities exist to attack
- [ ] Phase transitions are dramatic
- [ ] Enrage creates urgency, not unfairness

### AI Behavior
- [ ] Enemies react to player actions
- [ ] No exploitable behavior loops
- [ ] Support enemies prioritize correctly
- [ ] Aggro/threat system works
- [ ] Enemies don't get stuck on geometry

### Difficulty
- [ ] Baseline is beatable by average player
- [ ] Hard mode is fair, not cheap
- [ ] Adaptive feels invisible
- [ ] Overleveled content stays engaging
- [ ] Underleveled is hard, not impossible
