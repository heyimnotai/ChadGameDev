---
name: iap-implementation
description: Use when adding monetization to a game, implementing consumables/non-consumables/subscriptions, handling purchase flows, implementing receipt validation, testing IAP with StoreKit configuration files, or responding to IAP-related App Store rejections. Triggers on new monetization feature, purchase flow implementation, restore purchases, or server validation setup.
---

# In-App Purchase Implementation

Implement bulletproof StoreKit 2 in-app purchases for iOS games with complete purchase flows, proper verification, and handling of all edge cases including interrupted purchases and family sharing.

## Decision Tree: Product Type

```
What is being sold?
+-- Virtual currency (coins, gems) → CONSUMABLE
+-- Permanent unlock (ad removal, skin) → NON-CONSUMABLE
|   +-- Family Sharing? → Configure in App Store Connect
+-- Time-limited premium features
    +-- Auto-renews? → AUTO-RENEWABLE SUBSCRIPTION
    +-- Fixed end date? → NON-RENEWING SUBSCRIPTION
```

## Decision Tree: Validation Strategy

```
Purchase value?
+-- Low value consumables (<$5)
|   +-- On-device verification only
|   +-- Use Transaction.verification property
+-- High value or permanent unlocks
|   +-- Server validation recommended
|   +-- Send JWS to server, verify signature
+-- Subscriptions
    +-- Server validation REQUIRED
    +-- Implement Server Notifications V2
```

## Decision Tree: Purchase Result

```
Purchase result?
+-- .success(.verified) → Grant content → Finish transaction
+-- .success(.unverified) → DO NOT GRANT → Log fraud attempt
+-- .userCancelled → Return silently (no error)
+-- .pending → Show "Awaiting Approval" message
```

## Core Principles

**Always Finish Transactions**: Call `await transaction.finish()` after processing. Unfinished transactions persist and cause duplicate purchases.

**Never Grant Unverified**: Check `VerificationResult` before granting. Unverified = potential fraud.

**Transaction.updates Listener**: Start at app launch to catch purchases completed outside the app (interrupted, Ask to Buy approved).

**Always Use DisplayPrice**: Never hardcode prices. Use `product.displayPrice` for correct regional formatting.

**Restore Purchases**: Use `AppStore.sync()` (StoreKit 2). Always provide accessible restore button.

## Quality Checklist

### Core Implementation
- [ ] StoreKit 2 used (not deprecated StoreKit 1)
- [ ] Transaction.updates listener active
- [ ] All transactions finished after processing
- [ ] Unfinished transactions recovered at launch
- [ ] Products loaded asynchronously

### Purchase Flow
- [ ] Loading state shown during purchase
- [ ] User cancellation handled silently
- [ ] Pending purchases explained to user
- [ ] Verification checked before granting

### Restore & Subscriptions
- [ ] Restore button accessible in store/settings
- [ ] Subscription period clearly displayed
- [ ] Auto-renewal terms disclosed
- [ ] Grace period handled (user still has access)

### Testing
- [ ] StoreKit configuration file created
- [ ] All products testable in simulator
- [ ] Error conditions tested
- [ ] Sandbox testing completed before submission

## Anti-Patterns

**Not Finishing Transactions**: Forgetting `await transaction.finish()`. Transaction stays in queue, user may be charged again.

**Granting Unverified**: Not checking verification result. Fraudulent transactions grant content.

**Blocking UI on Load**: Synchronously loading products at launch. App appears frozen.

**Missing Transaction Listener**: Only handling purchase flow, not `Transaction.updates`. Background completions never processed.

**Hardcoded Prices**: Using `"$0.99"` instead of `product.displayPrice`. Wrong prices in other regions, legal issues.

## References

- [Code Patterns](references/code-patterns.md) - StoreManager, EntitlementManager, StoreUI, ServerValidator, error handling
- [API Reference](references/api-reference.md) - Product types, StoreKit comparison, purchase states, validation strategy, testing checklist

## Adjacent Skills

| Skill | Use For |
|-------|---------|
| app-store-review | IAP must comply with guideline 3.1.1 |
| economy-balancer | Design currency/pricing before implementing |
| analytics-integration | Track purchase conversion funnels |
| privacy-manifest | Purchase tracking may require disclosure |
| retention-engineer | IAP timing affects retention strategy |
