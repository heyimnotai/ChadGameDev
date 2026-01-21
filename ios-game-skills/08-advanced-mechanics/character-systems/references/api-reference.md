# Character Systems API Reference

## Trait Slot Scaling

| Player Level | Trait Slots | Rationale |
|--------------|-------------|-----------|
| 1-10 | 1 | Learn system |
| 11-25 | 2 | First meaningful choices |
| 26-50 | 3 | Build identity forms |
| 51-75 | 4 | Theorycrafting depth |
| 76-100 | 5 | Min-maxing possible |

## Trait Categories

| Category | Function | Examples |
|----------|----------|----------|
| Offensive | Damage/attack | +10% crit, +5 attack |
| Defensive | Survival | +15% HP, +armor |
| Utility | Quality of life | +speed, +drop rate |
| Synergy | Combo enabling | "Fire abilities cost 20% less" |

## Trait Types

| Trait Type | Examples | Change Frequency |
|------------|----------|------------------|
| Innate | Race, background | Never |
| Chosen | Starting perks | On respec |
| Earned | Achievement unlocks | Permanent |
| Equipped | Active modifiers | Anytime |

## Class Archetypes

| Archetype | Fantasy | Stat Focus | Playstyle |
|-----------|---------|------------|-----------|
| Warrior | Tank/Fighter | HP, Defense | Frontline, sustained |
| Mage | Caster | Power, Mana | Burst damage, fragile |
| Rogue | Assassin | Speed, Crit | High risk/reward |
| Support | Healer/Buffer | Utility | Team-focused |
| Ranger | Ranged DPS | Precision | Positional, consistent |

## Subclass Branching

```
Class (Lv. 1)
├── Subclass A (Lv. 20)
│   ├── Specialization A1 (Lv. 50)
│   └── Specialization A2 (Lv. 50)
└── Subclass B (Lv. 20)
    ├── Specialization B1 (Lv. 50)
    └── Specialization B2 (Lv. 50)
```

## Skill Tree Types

| Tree Type | Description | Best For |
|-----------|-------------|----------|
| Linear | Straight progression | Simple games, clear path |
| Branching | Fork choices | Specialization |
| Web/Grid | Connected nodes | Deep theorycrafting |
| Cluster | Grouped nodes | Path of Exile style |

## Skill Node Types

| Type | Function | Points Required |
|------|----------|-----------------|
| Minor | Small stat boost | 1 |
| Major | Significant ability | 3-5 |
| Keystone | Build-defining | 5-10, often exclusive |
| Capstone | Tree completion | All prerequisites |

## Point Economy

| Level Range | Points Earned | Unlocks |
|-------------|---------------|---------|
| 1-20 | 10 | Core abilities |
| 21-50 | 15 | Specialization |
| 51-80 | 10 | Optimization |
| 81-100 | 5 | Min-max |

## Loadout Elements

| Element | Slots | Change Rules |
|---------|-------|--------------|
| Weapons | 2-3 | Combat/menu |
| Armor | 4-6 | Out of combat |
| Accessories | 2-4 | Anytime |
| Abilities | 4-8 | Pre-match only |
| Consumables | 3-5 | Anytime |

## Synergy Types

| Type | Mechanic | Example |
|------|----------|---------|
| Set Bonus | 2/4/6 pieces | Diablo set items |
| Elemental | Type matching | Pokemon type effectiveness |
| Stat Threshold | Hit breakpoint | "At 100 AGI, attacks pierce" |
| Combo | Ability chains | "After using X, Y gains bonus" |
| Tag | Shared keywords | "All 'Fire' units gain +10%" |

## Set Bonus Scaling

| Pieces | Bonus Power | Player Investment |
|--------|-------------|-------------------|
| 2 | Minor | Easy to achieve |
| 4 | Significant | Commitment required |
| 6 | Major | Build-defining |
| Full Set | Ultimate | Max optimization |

## Decision Trees

### How Many Trait Slots?

```
What's the game's complexity level?
├── Casual → 2-3 slots max
├── Mid-core → 3-5 slots
└── Hardcore → 5-8 slots

Are traits meaningful or incremental?
├── Meaningful (build-defining) → Fewer slots
└── Incremental (small bonuses) → More slots OK
```

### Skill Tree Depth

```
Expected playtime per character?
├── < 10 hours → Linear tree, 20-30 nodes
├── 10-50 hours → Branching tree, 50-100 nodes
└── 50+ hours → Web/cluster, 100+ nodes

Is theorycrafting a goal?
├── YES → Complex trees, hidden synergies
└── NO → Clear paths, obvious choices
```

### Class vs Classless

```
Does the game have strong fantasy archetypes?
├── YES → Classes enhance identity
└── NO → Classless more flexible
    │
    Is build diversity the main draw?
    ├── YES → Classless (Path of Exile style)
    └── NO → Classes simplify choice
```

## Quality Checklists

### Traits
- [ ] Each trait has clear purpose
- [ ] No "always pick" or "never pick" traps
- [ ] Synergies between traits discoverable
- [ ] Exclusions clearly communicated
- [ ] Respec option exists

### Skill Trees
- [ ] Point economy is balanced
- [ ] Each path is viable
- [ ] Keystones define builds
- [ ] Visual layout is readable
- [ ] Build sharing/importing works

### Loadouts
- [ ] Quick switching is smooth
- [ ] Set bonuses are visible
- [ ] Preset saving works
- [ ] Missing items handled gracefully
- [ ] Stats comparison shown

### Synergies
- [ ] Set bonuses feel powerful
- [ ] 2-piece is achievable
- [ ] Full set isn't mandatory
- [ ] Mix-and-match is viable
- [ ] Synergies are fun to discover
