# Economy Systems Code Patterns

## CurrencyManager Class

```typescript
interface Currency {
  id: string;
  name: string;
  icon: string;
  tier: 'soft' | 'medium' | 'hard';
  maxAmount?: number;
  canEarnInGame: boolean;
  canPurchase: boolean;
}

interface WalletState {
  balances: Map<string, number>;
  lifetimeEarned: Map<string, number>;
  lifetimeSpent: Map<string, number>;
}

class CurrencyManager {
  private currencies: Map<string, Currency>;
  private wallet: WalletState;

  add(currencyId: string, amount: number, source: string): AddResult {
    const currency = this.currencies.get(currencyId);
    if (!currency) return { success: false, reason: 'invalid_currency' };

    const current = this.wallet.balances.get(currencyId) || 0;
    let newAmount = current + amount;

    // Cap check
    if (currency.maxAmount) {
      newAmount = Math.min(newAmount, currency.maxAmount);
    }

    this.wallet.balances.set(currencyId, newAmount);
    this.wallet.lifetimeEarned.set(
      currencyId,
      (this.wallet.lifetimeEarned.get(currencyId) || 0) + amount
    );

    this.logTransaction({ type: 'earn', currencyId, amount, source });

    return {
      success: true,
      newBalance: newAmount,
      wasCaped: newAmount < current + amount,
    };
  }

  spend(currencyId: string, amount: number, purpose: string): SpendResult {
    const current = this.wallet.balances.get(currencyId) || 0;

    if (current < amount) {
      return {
        success: false,
        reason: 'insufficient_funds',
        current,
        required: amount,
        deficit: amount - current,
      };
    }

    this.wallet.balances.set(currencyId, current - amount);
    this.wallet.lifetimeSpent.set(
      currencyId,
      (this.wallet.lifetimeSpent.get(currencyId) || 0) + amount
    );

    this.logTransaction({ type: 'spend', currencyId, amount, purpose });

    return {
      success: true,
      newBalance: current - amount,
    };
  }

  canAfford(costs: Map<string, number>): AffordCheck {
    const affordable: string[] = [];
    const missing: Array<{ currency: string; have: number; need: number }> = [];

    for (const [currencyId, amount] of costs) {
      const balance = this.wallet.balances.get(currencyId) || 0;
      if (balance >= amount) {
        affordable.push(currencyId);
      } else {
        missing.push({ currency: currencyId, have: balance, need: amount });
      }
    }

    return {
      canAfford: missing.length === 0,
      affordable,
      missing,
    };
  }
}
```

## ShopSystem Class

```typescript
interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: Map<string, number>;  // Multi-currency support
  stock?: number;              // Limited quantity
  refreshTime?: number;        // When stock resets
  requirementLevel?: number;   // Level gate
  discount?: number;           // 0-1 discount
  bundleContents?: Item[];     // For bundles
}

interface ShopSection {
  id: string;
  name: string;
  items: ShopItem[];
  refreshInterval?: number;
  type: 'permanent' | 'rotating' | 'limited';
}

class ShopSystem {
  private sections: ShopSection[];
  private purchaseHistory: Map<string, PurchaseRecord[]>;

  purchase(itemId: string): PurchaseResult {
    const item = this.findItem(itemId);
    if (!item) return { success: false, reason: 'item_not_found' };

    // Stock check
    if (item.stock !== undefined && item.stock <= 0) {
      return { success: false, reason: 'out_of_stock' };
    }

    // Requirement check
    if (item.requirementLevel && player.level < item.requirementLevel) {
      return { success: false, reason: 'level_required' };
    }

    // Calculate final price
    const finalPrice = this.calculatePrice(item);

    // Affordability check
    const affordCheck = currencyManager.canAfford(finalPrice);
    if (!affordCheck.canAfford) {
      return {
        success: false,
        reason: 'insufficient_funds',
        missing: affordCheck.missing,
      };
    }

    // Execute purchase
    for (const [currency, amount] of finalPrice) {
      currencyManager.spend(currency, amount, `shop_${itemId}`);
    }

    // Decrease stock
    if (item.stock !== undefined) {
      item.stock--;
    }

    // Grant item
    const grantedItems = this.grantItem(item);

    // Record purchase
    this.recordPurchase(itemId);

    return {
      success: true,
      itemsGranted: grantedItems,
      remainingStock: item.stock,
    };
  }

  getRotatingDeals(): ShopItem[] {
    // Daily deals with discounts
    const seed = this.getDailySeed();
    const pool = this.sections
      .filter(s => s.type === 'permanent')
      .flatMap(s => s.items);

    const selected = this.seededShuffle(pool, seed).slice(0, 4);

    return selected.map(item => ({
      ...item,
      discount: 0.2 + Math.random() * 0.3,  // 20-50% off
    }));
  }
}
```

## CraftingSystem Class

```typescript
interface Recipe {
  id: string;
  resultItem: Item;
  resultQuantity: number;
  ingredients: Ingredient[];
  craftTime: number;  // seconds
  successRate: number;  // 0-1
  requirementLevel?: number;
  unlockCondition?: string;
}

interface Ingredient {
  itemId: string;
  quantity: number;
}

interface CraftingSlot {
  id: string;
  recipe: Recipe | null;
  startTime: number | null;
  isPremiumSlot: boolean;
}

class CraftingSystem {
  private recipes: Map<string, Recipe>;
  private slots: CraftingSlot[];
  private unlockedRecipes: Set<string>;

  startCraft(slotId: string, recipeId: string): CraftResult {
    const slot = this.slots.find(s => s.id === slotId);
    if (!slot) return { success: false, reason: 'invalid_slot' };

    if (slot.recipe) return { success: false, reason: 'slot_in_use' };

    const recipe = this.recipes.get(recipeId);
    if (!recipe) return { success: false, reason: 'invalid_recipe' };

    if (!this.unlockedRecipes.has(recipeId)) {
      return { success: false, reason: 'recipe_locked' };
    }

    // Check ingredients
    const missingIngredients = this.checkIngredients(recipe.ingredients);
    if (missingIngredients.length > 0) {
      return { success: false, reason: 'missing_ingredients', missingIngredients };
    }

    // Consume ingredients
    this.consumeIngredients(recipe.ingredients);

    // Start craft
    slot.recipe = recipe;
    slot.startTime = Date.now();

    return {
      success: true,
      completionTime: Date.now() + recipe.craftTime * 1000,
      recipe,
    };
  }

  completeCraft(slotId: string): CompleteResult {
    const slot = this.slots.find(s => s.id === slotId);
    if (!slot?.recipe || !slot.startTime) {
      return { success: false, reason: 'nothing_to_complete' };
    }

    const elapsed = (Date.now() - slot.startTime) / 1000;
    if (elapsed < slot.recipe.craftTime) {
      return {
        success: false,
        reason: 'not_ready',
        timeRemaining: slot.recipe.craftTime - elapsed,
      };
    }

    // Roll success
    const succeeded = Math.random() < slot.recipe.successRate;

    // Grant result
    let grantedItem: Item | null = null;
    if (succeeded) {
      grantedItem = this.grantCraftedItem(slot.recipe);
    } else {
      // Partial refund on failure
      this.refundPartialIngredients(slot.recipe, 0.5);
    }

    // Clear slot
    const completedRecipe = slot.recipe;
    slot.recipe = null;
    slot.startTime = null;

    return {
      success: true,
      craftSucceeded: succeeded,
      grantedItem,
      recipe: completedRecipe,
    };
  }

  skipWithCurrency(slotId: string, currencyId: string): SkipResult {
    const slot = this.slots.find(s => s.id === slotId);
    if (!slot?.recipe || !slot.startTime) {
      return { success: false, reason: 'nothing_to_skip' };
    }

    const remaining = slot.recipe.craftTime - (Date.now() - slot.startTime) / 1000;
    const cost = this.calculateSkipCost(remaining, currencyId);

    const spendResult = currencyManager.spend(currencyId, cost, 'craft_skip');
    if (!spendResult.success) {
      return { success: false, reason: 'insufficient_funds' };
    }

    // Force completion
    slot.startTime = Date.now() - slot.recipe.craftTime * 1000;

    return { success: true, cost };
  }
}
```

## Anti-Pattern Examples

### Pay-to-Win Pricing (Wrong)

```typescript
// Best weapon only for premium
const legendaryWeapon = {
  price: { premium: 1000 },  // $50+ worth
  stats: { damage: 999 },    // Massively OP
};
```

### Pay-to-Win Pricing (Correct)

```typescript
// Cosmetic for premium, stats earnable
const legendaryWeaponSkin = {
  price: { premium: 500 },
  type: 'cosmetic',
};
const legendaryWeapon = {
  price: { gold: 50000 },  // Grindable
  stats: { damage: 100 },  // Balanced
};
```

### Exploitable Exchange (Wrong)

```typescript
// Can convert soft to premium
function exchange(from: string, to: string, amount: number) {
  const rate = EXCHANGE_RATES[`${from}_${to}`];
  return amount * rate;
}
// Gold → Gems at 1000:1
// Gems → Premium at 10:1
// Allows farming premium currency!
```

### Exploitable Exchange (Correct)

```typescript
// Only downward conversion
const VALID_EXCHANGES = {
  'premium_gems': 10,
  'gems_gold': 100,
};
// Cannot convert upward
```

### Infinite Sinks (Correct)

```typescript
// Costs plateau at reasonable levels
const upgradeCost = basePrice * (1 + level * 0.5);
// Or soft cap:
const upgradeCost = basePrice * Math.min(Math.pow(1.5, level), 1000);
```

### F2P-Friendly Premium (Correct)

```typescript
// F2P can earn occasionally
const dailyPremiumEarnings = 10;  // Monthly pull is achievable
const weeklyChallenge = 50;       // Bonus for engaged players
```
