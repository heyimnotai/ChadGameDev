# Character Systems Code Patterns

## TraitSystem Class

```typescript
interface Trait {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'offensive' | 'defensive' | 'utility' | 'synergy';
  rarity: Rarity;
  modifiers: Modifier[];
  requirements?: TraitRequirement;
  exclusions?: string[];  // Mutually exclusive traits
}

interface TraitSlot {
  index: number;
  unlockedAtLevel: number;
  equippedTrait: Trait | null;
  isLocked: boolean;
}

class TraitSystem {
  private slots: TraitSlot[];
  private availableTraits: Map<string, Trait>;
  private equippedTraits: Set<string>;

  getAvailableSlots(): TraitSlot[] {
    return this.slots.filter(s => !s.isLocked && player.level >= s.unlockedAtLevel);
  }

  canEquip(trait: Trait, slotIndex: number): EquipCheck {
    const slot = this.slots[slotIndex];

    // Slot availability
    if (slot.isLocked || player.level < slot.unlockedAtLevel) {
      return { canEquip: false, reason: 'slot_locked' };
    }

    // Already equipped check
    if (this.equippedTraits.has(trait.id)) {
      return { canEquip: false, reason: 'already_equipped' };
    }

    // Requirement check
    if (trait.requirements && !this.meetsRequirements(trait.requirements)) {
      return { canEquip: false, reason: 'requirements_not_met', requirements: trait.requirements };
    }

    // Exclusion check
    if (trait.exclusions) {
      const conflicts = trait.exclusions.filter(id => this.equippedTraits.has(id));
      if (conflicts.length > 0) {
        return { canEquip: false, reason: 'conflicts', conflictingTraits: conflicts };
      }
    }

    return { canEquip: true };
  }

  equip(traitId: string, slotIndex: number): EquipResult {
    const trait = this.availableTraits.get(traitId);
    if (!trait) return { success: false, reason: 'trait_not_found' };

    const check = this.canEquip(trait, slotIndex);
    if (!check.canEquip) return { success: false, ...check };

    // Unequip current
    const slot = this.slots[slotIndex];
    if (slot.equippedTrait) {
      this.equippedTraits.delete(slot.equippedTrait.id);
      this.removeModifiers(slot.equippedTrait);
    }

    // Equip new
    slot.equippedTrait = trait;
    this.equippedTraits.add(trait.id);
    this.applyModifiers(trait);

    return {
      success: true,
      modifiersApplied: trait.modifiers,
      synergyTriggered: this.checkSynergies(),
    };
  }

  getSynergyBonuses(): SynergyBonus[] {
    const bonuses: SynergyBonus[] = [];
    const equippedCategories = new Map<string, number>();

    for (const traitId of this.equippedTraits) {
      const trait = this.availableTraits.get(traitId)!;
      equippedCategories.set(
        trait.category,
        (equippedCategories.get(trait.category) || 0) + 1
      );
    }

    // Category synergies
    for (const [category, count] of equippedCategories) {
      if (count >= 3) {
        bonuses.push({
          name: `${category}_mastery`,
          description: `+15% to all ${category} effects`,
          multiplier: 1.15,
          affectedCategory: category,
        });
      }
    }

    return bonuses;
  }
}
```

## SkillTreeSystem Class

```typescript
interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  position: { x: number; y: number };
  type: 'minor' | 'major' | 'keystone' | 'capstone';
  cost: number;
  maxRanks: number;
  currentRanks: number;
  modifiersPerRank: Modifier[];
  prerequisites: string[];
  isExclusive: boolean;  // If true, blocks other keystones
}

interface SkillTree {
  id: string;
  name: string;
  nodes: Map<string, SkillNode>;
  connections: Array<[string, string]>;
  totalPointsAllocated: number;
  maxPoints: number;
}

class SkillTreeSystem {
  private trees: Map<string, SkillTree>;
  private availablePoints: number;
  private activeExclusives: Set<string>;

  allocatePoint(treeId: string, nodeId: string): AllocateResult {
    if (this.availablePoints <= 0) {
      return { success: false, reason: 'no_points' };
    }

    const tree = this.trees.get(treeId);
    if (!tree) return { success: false, reason: 'tree_not_found' };

    const node = tree.nodes.get(nodeId);
    if (!node) return { success: false, reason: 'node_not_found' };

    // Max rank check
    if (node.currentRanks >= node.maxRanks) {
      return { success: false, reason: 'max_rank' };
    }

    // Prerequisite check
    for (const prereqId of node.prerequisites) {
      const prereq = tree.nodes.get(prereqId);
      if (!prereq || prereq.currentRanks === 0) {
        return { success: false, reason: 'prerequisites_not_met' };
      }
    }

    // Exclusive check (keystones)
    if (node.isExclusive && node.currentRanks === 0) {
      if (this.activeExclusives.size > 0) {
        return {
          success: false,
          reason: 'keystone_conflict',
          activeKeystone: Array.from(this.activeExclusives)[0],
        };
      }
      this.activeExclusives.add(node.id);
    }

    // Allocate
    node.currentRanks++;
    tree.totalPointsAllocated++;
    this.availablePoints--;

    // Apply modifiers
    this.applyModifiers(node.modifiersPerRank);

    return {
      success: true,
      newRank: node.currentRanks,
      modifiersApplied: node.modifiersPerRank,
      remainingPoints: this.availablePoints,
    };
  }

  respec(treeId: string): RespecResult {
    const tree = this.trees.get(treeId);
    if (!tree) return { success: false, reason: 'tree_not_found' };

    const respecCost = this.calculateRespecCost(tree);

    if (!currencyManager.canAfford(respecCost)) {
      return { success: false, reason: 'cannot_afford', cost: respecCost };
    }

    // Remove all modifiers
    for (const node of tree.nodes.values()) {
      for (let i = 0; i < node.currentRanks; i++) {
        this.removeModifiers(node.modifiersPerRank);
      }
      node.currentRanks = 0;
    }

    // Refund points
    const refundedPoints = tree.totalPointsAllocated;
    this.availablePoints += refundedPoints;
    tree.totalPointsAllocated = 0;

    // Clear exclusives
    this.activeExclusives.clear();

    // Charge cost
    currencyManager.spend(respecCost);

    return {
      success: true,
      pointsRefunded: refundedPoints,
      cost: respecCost,
    };
  }

  getBuildSummary(): BuildSummary {
    const allocations: Record<string, number> = {};
    const keystones: string[] = [];
    const totalModifiers: Modifier[] = [];

    for (const tree of this.trees.values()) {
      allocations[tree.id] = tree.totalPointsAllocated;

      for (const node of tree.nodes.values()) {
        if (node.currentRanks > 0) {
          for (let i = 0; i < node.currentRanks; i++) {
            totalModifiers.push(...node.modifiersPerRank);
          }
          if (node.isExclusive) {
            keystones.push(node.name);
          }
        }
      }
    }

    return {
      allocations,
      keystones,
      totalModifiers: this.aggregateModifiers(totalModifiers),
      buildCode: this.generateBuildCode(),
    };
  }
}
```

## LoadoutSystem Class

```typescript
interface LoadoutSlot {
  type: 'weapon' | 'armor' | 'accessory' | 'ability' | 'consumable';
  index: number;
  equipped: Item | Ability | null;
  restrictions?: string[];  // e.g., "melee_only"
}

interface LoadoutPreset {
  id: string;
  name: string;
  icon: string;
  slots: Map<string, string>;  // slot key → item/ability id
  createdAt: number;
}

class LoadoutSystem {
  private slots: LoadoutSlot[];
  private presets: LoadoutPreset[];
  private maxPresets: number = 10;

  equip(slotKey: string, itemId: string): EquipResult {
    const slot = this.findSlot(slotKey);
    if (!slot) return { success: false, reason: 'slot_not_found' };

    const item = inventory.getItem(itemId);
    if (!item) return { success: false, reason: 'item_not_found' };

    // Type check
    if (!this.isValidForSlot(item, slot)) {
      return { success: false, reason: 'wrong_slot_type' };
    }

    // Restriction check
    if (slot.restrictions && !this.meetsRestrictions(item, slot.restrictions)) {
      return { success: false, reason: 'restriction_not_met' };
    }

    // Unequip current
    const previousItem = slot.equipped;
    if (previousItem) {
      this.unequipItem(previousItem);
    }

    // Equip new
    slot.equipped = item;
    this.applyItemStats(item);

    // Check set bonuses
    const newSetBonuses = this.calculateSetBonuses();

    return {
      success: true,
      previousItem,
      newItem: item,
      setBonuses: newSetBonuses,
      statsChanged: this.getStatsChange(previousItem, item),
    };
  }

  savePreset(name: string): SaveResult {
    if (this.presets.length >= this.maxPresets) {
      return { success: false, reason: 'max_presets_reached' };
    }

    const preset: LoadoutPreset = {
      id: generateId(),
      name,
      icon: this.generatePresetIcon(),
      slots: new Map(),
      createdAt: Date.now(),
    };

    for (const slot of this.slots) {
      if (slot.equipped) {
        preset.slots.set(this.getSlotKey(slot), slot.equipped.id);
      }
    }

    this.presets.push(preset);

    return { success: true, preset };
  }

  loadPreset(presetId: string): LoadResult {
    const preset = this.presets.find(p => p.id === presetId);
    if (!preset) return { success: false, reason: 'preset_not_found' };

    const results: EquipResult[] = [];
    const missingItems: string[] = [];

    for (const [slotKey, itemId] of preset.slots) {
      if (!inventory.hasItem(itemId)) {
        missingItems.push(itemId);
        continue;
      }

      const result = this.equip(slotKey, itemId);
      results.push(result);
    }

    return {
      success: true,
      equipResults: results,
      missingItems,
      setBonus: this.calculateSetBonuses(),
    };
  }

  calculateSetBonuses(): SetBonus[] {
    const setsEquipped = new Map<string, number>();

    for (const slot of this.slots) {
      if (slot.equipped && slot.equipped.setId) {
        setsEquipped.set(
          slot.equipped.setId,
          (setsEquipped.get(slot.equipped.setId) || 0) + 1
        );
      }
    }

    const bonuses: SetBonus[] = [];

    for (const [setId, count] of setsEquipped) {
      const setDef = this.getSetDefinition(setId);
      for (const threshold of setDef.thresholds) {
        if (count >= threshold.pieces) {
          bonuses.push(threshold.bonus);
        }
      }
    }

    return bonuses;
  }
}
```

## Anti-Pattern Examples

### Trap Options (Wrong)

```typescript
// Trait that's strictly worse than others
const weakTrait = {
  name: 'Minor Strength',
  modifiers: [{ stat: 'attack', value: 1 }],
};
const strongTrait = {
  name: 'Major Strength',
  modifiers: [{ stat: 'attack', value: 10 }],
};
// Same cost, same slot - no reason to pick weak
```

### Trap Options (Correct)

```typescript
// Each trait has unique trade-offs
const offensiveTrait = {
  name: 'Glass Cannon',
  modifiers: [
    { stat: 'attack', value: 25 },
    { stat: 'defense', value: -10 },
  ],
};
const defensiveTrait = {
  name: 'Fortress',
  modifiers: [
    { stat: 'defense', value: 25 },
    { stat: 'speed', value: -10 },
  ],
};
```

### Locked Builds (Correct)

```typescript
// Respec with reasonable cost
function respecTree(treeId: string) {
  const cost = calculateRespecCost(tree);
  if (canAfford(cost)) {
    refundAllPoints(tree);
    charge(cost);
  }
}
```

### Mandatory Sets (Correct)

```typescript
// Gradual scaling, mix-match viable
const setBonus = {
  2: { attack: 15 },   // Noticeable
  4: { attack: 35 },   // Significant
  6: { attack: 60 },   // Great, but not mandatory
};
// Alternative: two 2-piece bonuses = viable too
```
