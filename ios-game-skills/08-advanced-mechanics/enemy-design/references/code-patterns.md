# Enemy Design Code Patterns

## EnemyArchetype and EnemyFactory Classes

```typescript
interface EnemyArchetype {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4 | 5;
  baseStats: EnemyStats;
  behavior: BehaviorTree;
  attacks: Attack[];
  weaknesses: Weakness[];
  resistances: Resistance[];
  spawnWeight: number;
  lootTable: string;
}

interface EnemyStats {
  maxHP: number;
  damage: number;
  speed: number;
  armor: number;
  attackSpeed: number;
  detectionRange: number;
  aggroRange: number;
}

class EnemyFactory {
  private archetypes: Map<string, EnemyArchetype>;

  spawn(
    archetypeId: string,
    position: Vector2,
    level: number,
    modifiers?: EnemyModifier[]
  ): Enemy {
    const archetype = this.archetypes.get(archetypeId);
    if (!archetype) throw new Error(`Unknown archetype: ${archetypeId}`);

    // Scale stats for level
    const scaledStats = this.scaleStats(archetype.baseStats, level);

    // Apply modifiers (elite affixes, event bonuses, etc.)
    const modifiedStats = this.applyModifiers(scaledStats, modifiers);

    return new Enemy({
      archetype,
      position,
      stats: modifiedStats,
      level,
      behavior: archetype.behavior.clone(),
      attacks: archetype.attacks.map(a => this.scaleAttack(a, level)),
    });
  }

  private scaleStats(base: EnemyStats, level: number): EnemyStats {
    const levelMultiplier = 1 + (level - 1) * 0.1;

    return {
      maxHP: Math.floor(base.maxHP * levelMultiplier),
      damage: Math.floor(base.damage * (1 + (level - 1) * 0.08)),
      speed: Math.min(base.speed * (1 + (level - 1) * 0.02), base.speed * 1.5),
      armor: base.armor + Math.floor(level / 5),
      attackSpeed: base.attackSpeed,
      detectionRange: base.detectionRange,
      aggroRange: base.aggroRange,
    };
  }
}
```

## BehaviorTree System

```typescript
type BehaviorNode = SelectorNode | SequenceNode | ActionNode | ConditionNode;

interface SelectorNode {
  type: 'selector';
  children: BehaviorNode[];  // Try each until one succeeds
}

interface SequenceNode {
  type: 'sequence';
  children: BehaviorNode[];  // Run all until one fails
}

interface ActionNode {
  type: 'action';
  action: string;
  params?: Record<string, any>;
}

interface ConditionNode {
  type: 'condition';
  condition: string;
  params?: Record<string, any>;
}

class BehaviorTreeExecutor {
  execute(node: BehaviorNode, context: AIContext): BehaviorResult {
    switch (node.type) {
      case 'selector':
        for (const child of node.children) {
          const result = this.execute(child, context);
          if (result === 'success') return 'success';
        }
        return 'failure';

      case 'sequence':
        for (const child of node.children) {
          const result = this.execute(child, context);
          if (result === 'failure') return 'failure';
        }
        return 'success';

      case 'condition':
        return this.evaluateCondition(node, context) ? 'success' : 'failure';

      case 'action':
        return this.performAction(node, context);
    }
  }

  private evaluateCondition(node: ConditionNode, ctx: AIContext): boolean {
    switch (node.condition) {
      case 'player_in_range':
        return ctx.distanceToPlayer <= (node.params?.range || ctx.enemy.attackRange);
      case 'health_below':
        return ctx.enemy.hp / ctx.enemy.maxHP < (node.params?.threshold || 0.5);
      case 'can_use_ability':
        return ctx.enemy.abilityCooldown <= 0;
      case 'ally_needs_support':
        return ctx.nearbyAllies.some(a => a.hp / a.maxHP < 0.3);
      default:
        return false;
    }
  }

  private performAction(node: ActionNode, ctx: AIContext): BehaviorResult {
    switch (node.action) {
      case 'attack':
        return ctx.enemy.performAttack(ctx.player);
      case 'move_to_player':
        return ctx.enemy.moveTo(ctx.player.position);
      case 'flee':
        return ctx.enemy.moveAwayFrom(ctx.player.position);
      case 'use_ability':
        return ctx.enemy.useAbility(node.params?.abilityId);
      case 'support_ally':
        return ctx.enemy.supportNearestAlly();
      default:
        return 'failure';
    }
  }
}

// Example: Rusher behavior tree
const rusherBehavior: SelectorNode = {
  type: 'selector',
  children: [
    {
      type: 'sequence',
      children: [
        { type: 'condition', condition: 'player_in_range' },
        { type: 'action', action: 'attack' },
      ],
    },
    { type: 'action', action: 'move_to_player' },
  ],
};

// Example: Support enemy behavior tree
const supporterBehavior: SelectorNode = {
  type: 'selector',
  children: [
    {
      type: 'sequence',
      children: [
        { type: 'condition', condition: 'ally_needs_support' },
        { type: 'action', action: 'support_ally' },
      ],
    },
    {
      type: 'sequence',
      children: [
        { type: 'condition', condition: 'health_below', params: { threshold: 0.3 } },
        { type: 'action', action: 'flee' },
      ],
    },
    {
      type: 'sequence',
      children: [
        { type: 'condition', condition: 'player_in_range' },
        { type: 'action', action: 'attack' },
      ],
    },
    { type: 'action', action: 'move_to_player' },
  ],
};
```

## BossEncounter Class

```typescript
interface BossPhase {
  hpThreshold: number;  // 0-1
  attacks: BossAttack[];
  phaseTransition?: PhaseTransition;
  modifiers?: StatModifier[];
}

interface BossAttack {
  id: string;
  name: string;
  damage: number;
  cooldown: number;
  telegraph: TelegraphConfig;
  pattern: AttackPattern;
  priority: number;
}

interface PhaseTransition {
  duration: number;  // Invulnerability time
  animation: string;
  dialogue?: string;
  spawnAdds?: string[];
}

class BossEncounter {
  private phases: BossPhase[];
  private currentPhaseIndex: number = 0;
  private boss: Enemy;
  private attackCooldowns: Map<string, number> = new Map();

  update(dt: number): void {
    // Check phase transition
    const hpPercent = this.boss.hp / this.boss.maxHP;
    const nextPhaseIndex = this.phases.findIndex(
      p => hpPercent <= p.hpThreshold
    );

    if (nextPhaseIndex > this.currentPhaseIndex) {
      this.transitionToPhase(nextPhaseIndex);
    }

    // Update cooldowns
    for (const [attackId, remaining] of this.attackCooldowns) {
      this.attackCooldowns.set(attackId, remaining - dt);
    }

    // Select and execute attack
    if (!this.boss.isActing) {
      const attack = this.selectAttack();
      if (attack) {
        this.executeAttack(attack);
      }
    }
  }

  private selectAttack(): BossAttack | null {
    const phase = this.phases[this.currentPhaseIndex];
    const availableAttacks = phase.attacks.filter(
      a => (this.attackCooldowns.get(a.id) || 0) <= 0
    );

    if (availableAttacks.length === 0) return null;

    // Weight by priority and randomness
    const totalPriority = availableAttacks.reduce((sum, a) => sum + a.priority, 0);
    let roll = Math.random() * totalPriority;

    for (const attack of availableAttacks) {
      roll -= attack.priority;
      if (roll <= 0) return attack;
    }

    return availableAttacks[0];
  }

  private async executeAttack(attack: BossAttack): Promise<void> {
    // Telegraph
    await this.showTelegraph(attack.telegraph);

    // Execute pattern
    await this.executePattern(attack.pattern);

    // Apply damage
    this.applyDamage(attack);

    // Set cooldown
    this.attackCooldowns.set(attack.id, attack.cooldown);
  }

  private transitionToPhase(phaseIndex: number): void {
    const phase = this.phases[phaseIndex];
    const transition = phase.phaseTransition;

    if (transition) {
      // Make boss invulnerable
      this.boss.invulnerable = true;

      // Play transition
      this.playTransitionAnimation(transition);

      // Spawn adds if configured
      if (transition.spawnAdds) {
        this.spawnAdds(transition.spawnAdds);
      }

      // Show dialogue
      if (transition.dialogue) {
        this.showDialogue(transition.dialogue);
      }

      // End invulnerability
      setTimeout(() => {
        this.boss.invulnerable = false;
      }, transition.duration);
    }

    // Apply phase modifiers
    if (phase.modifiers) {
      this.applyModifiers(phase.modifiers);
    }

    this.currentPhaseIndex = phaseIndex;
  }
}
```

## DifficultyScaler Class

```typescript
interface DifficultyConfig {
  baseLevel: number;
  adaptiveEnabled: boolean;
  adaptiveWindow: number;  // Time window for evaluation (seconds)
  minDifficulty: number;   // 0.5 = 50% stats
  maxDifficulty: number;   // 1.5 = 150% stats
}

interface PerformanceMetrics {
  deaths: number;
  damagesTaken: number;
  healingUsed: number;
  timeTaken: number;
  enemiesKilled: number;
  hitsTaken: number;
  perfectDodges: number;
}

class DifficultyScaler {
  private config: DifficultyConfig;
  private currentMultiplier: number = 1.0;
  private recentMetrics: PerformanceMetrics[] = [];

  recordMetrics(metrics: PerformanceMetrics): void {
    this.recentMetrics.push(metrics);

    // Keep only recent window
    while (this.recentMetrics.length > 10) {
      this.recentMetrics.shift();
    }

    if (this.config.adaptiveEnabled) {
      this.adjustDifficulty();
    }
  }

  private adjustDifficulty(): void {
    const avgMetrics = this.averageMetrics();
    const performanceScore = this.calculatePerformanceScore(avgMetrics);

    // Smooth adjustment
    const targetMultiplier = this.scoreToMultiplier(performanceScore);
    this.currentMultiplier = this.lerp(
      this.currentMultiplier,
      targetMultiplier,
      0.1  // Slow adjustment
    );

    // Clamp to bounds
    this.currentMultiplier = Math.max(
      this.config.minDifficulty,
      Math.min(this.config.maxDifficulty, this.currentMultiplier)
    );
  }

  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    // 0 = struggling, 50 = balanced, 100 = dominating
    let score = 50;

    // Deaths heavily impact score
    score -= metrics.deaths * 15;

    // Damage taken impacts score
    const damageRatio = metrics.damagesTaken / (metrics.enemiesKilled + 1);
    if (damageRatio > 100) score -= 10;
    if (damageRatio < 20) score += 10;

    // Perfect play bonus
    if (metrics.deaths === 0 && metrics.damagesTaken < 50) {
      score += 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  private scoreToMultiplier(score: number): number {
    // 0 score = 0.7x difficulty
    // 50 score = 1.0x difficulty
    // 100 score = 1.3x difficulty
    return 0.7 + (score / 100) * 0.6;
  }

  getScaledStats(baseStats: EnemyStats): EnemyStats {
    return {
      maxHP: Math.floor(baseStats.maxHP * this.currentMultiplier),
      damage: Math.floor(baseStats.damage * this.currentMultiplier),
      speed: baseStats.speed,  // Don't scale speed
      armor: baseStats.armor,
      attackSpeed: baseStats.attackSpeed,
      detectionRange: baseStats.detectionRange,
      aggroRange: baseStats.aggroRange,
    };
  }
}
```

## Anti-Pattern Examples

### Unfair Damage (Wrong)

```typescript
// Boss one-shots with no warning
const bossAttack = {
  damage: playerMaxHP * 2,
  telegraph: 0,  // No warning
};
```

### Unfair Damage (Correct)

```typescript
// High damage with clear telegraph
const bossAttack = {
  damage: playerMaxHP * 0.6,  // Survivable
  telegraph: 1500,  // Clear warning
  indicator: 'ground_zone',  // Visual cue
};
```

### Damage Sponge (Correct)

```typescript
// Reasonable HP with evolving mechanics
const boss = {
  hp: 500000,
  phases: [
    { hpThreshold: 0.7, attacks: [basic1, basic2] },
    { hpThreshold: 0.4, attacks: [basic1, basic2, special1] },
    { hpThreshold: 0.1, attacks: [all_attacks, enrage] },
  ],
};
```

### Swarm With Counter (Correct)

```typescript
// Swarm with AoE options
function spawnWave() {
  for (let i = 0; i < 30; i++) {
    spawn('fodder', randomPosition());
  }
}
// Player has: AoE ability, explosive barrel, choke point
```

### Visible Immunity (Correct)

```typescript
// Clear feedback on immunity
if (player.damageType === 'fire') {
  enemy.showImmune();  // Visual "IMMUNE" text
  audio.play('immune_sound');
  haptic.impact('rigid');  // Feels blocked
}
```
