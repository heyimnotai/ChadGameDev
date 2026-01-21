# Core Expander - Code Patterns

## Game Analysis Interface

```typescript
interface GameAnalysis {
  genre: 'idle' | 'puzzle' | 'action' | 'strategy' | 'roguelike' | 'other';
  sessionLength: 'micro' | 'short' | 'medium' | 'long';
  progressionType: 'endless' | 'levels' | 'campaign';
  currentMechanics: string[];

  // Metrics (if available)
  day1Retention?: number;
  day7Retention?: number;
  avgSessionLength?: number;

  // Gaps
  missingCategories: string[];
  weakAreas: string[];

  // Recommendations
  phase1: MechanicRecommendation[];
  phase2: MechanicRecommendation[];
  phase3: MechanicRecommendation[];
}

interface MechanicRecommendation {
  name: string;
  category: string;
  priority: number;  // 0-100
  effort: 'low' | 'medium' | 'high';
  expectedImpact: string;
  synergiesWith: string[];
  researchReference: string;
}
```

## Analysis Workflow

```typescript
function analyzeGame(game: GameState): GameAnalysis {
  // 1. Identify genre
  const genre = detectGenre(game);
  const genreExpectations = GENRE_EXPECTATIONS[genre];

  // 2. Catalog existing mechanics
  const currentMechanics = extractMechanics(game);

  // 3. Find gaps
  const missingCategories = genreExpectations.required
    .filter(m => !currentMechanics.includes(m));

  // 4. Score candidates
  const candidates = ALL_MECHANICS.map(mechanic => ({
    ...mechanic,
    priority: scoreMechanic(mechanic, game, genre),
  }));

  // 5. Phase recommendations
  const sorted = candidates.sort((a, b) => b.priority - a.priority);

  return {
    genre,
    currentMechanics,
    missingCategories,
    phase1: sorted.slice(0, 3),
    phase2: sorted.slice(3, 6),
    phase3: sorted.slice(6, 9),
  };
}
```

## Synergy Map

```typescript
const SYNERGIES: Record<string, string[]> = {
  'prestige': ['currencies', 'upgrades', 'achievements'],
  'chests': ['currencies', 'gacha', 'daily-rewards'],
  'battle-pass': ['challenges', 'currencies', 'cosmetics'],
  'combo-system': ['leaderboards', 'achievements', 'challenges'],
  'equipment': ['crafting', 'upgrades', 'traits'],
  'skill-trees': ['classes', 'loadouts', 'synergies'],
  'daily-rewards': ['streaks', 'currencies', 'notifications'],
  'leaderboards': ['achievements', 'seasons', 'guilds'],
};

function findSynergies(mechanic: string, existing: string[]): string[] {
  return (SYNERGIES[mechanic] || []).filter(s => existing.includes(s));
}
```

## Priority Scoring

```typescript
function scoreMechanic(mechanic: Mechanic, game: GameState, genre: string): number {
  const genreFit = mechanic.genres.includes(genre) ? 1 : 0.5;
  const effortScore = { low: 1, medium: 0.6, high: 0.3 }[mechanic.effort];
  const retentionScore = mechanic.retentionImpact / 100;
  const synergies = findSynergies(mechanic.id, game.currentMechanics);
  const synergyScore = Math.min(synergies.length / 3, 1);
  const uniqueScore = game.competitors?.has(mechanic.id) ? 0.5 : 1;

  return (
    genreFit * 0.25 +
    effortScore * 0.25 +
    retentionScore * 0.20 +
    synergyScore * 0.15 +
    uniqueScore * 0.15
  ) * 100;
}
```

## Decision Tree: Should Add Mechanic?

```
Is core loop at 90%+?
├── NO → Fix core loop first
└── YES → Continue

Does mechanic fit genre?
├── NO → Skip unless pioneering
└── YES → Continue

Implementable in <1 week?
├── YES → Strong candidate (Phase 1)
└── NO → Continue

Multiplies existing mechanics?
├── YES → Worth effort (Phase 2)
└── NO → Deprioritize
```
