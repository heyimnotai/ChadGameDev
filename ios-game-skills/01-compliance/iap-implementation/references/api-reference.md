# IAP Implementation - API Reference

## Product Types for Games

| Product Type | Use Case | Expires | Can Restore | Family Sharing |
|--------------|----------|---------|-------------|----------------|
| Consumable | Currencies, lives, boosters | N/A (consumed) | No | No |
| Non-Consumable | Premium unlock, ad removal, character skins | Never | Yes | Optional |
| Auto-Renewable Subscription | Battle pass, VIP status | End of period | Yes | Configurable |
| Non-Renewing Subscription | Seasonal pass, time-limited boost | Fixed end date | Developer choice | No |

## StoreKit 2 vs StoreKit 1

| Feature | StoreKit 2 (iOS 15+) | StoreKit 1 (Legacy) |
|---------|---------------------|---------------------|
| API Style | Swift async/await | Delegate callbacks |
| Receipts | JWS (JSON Web Signature) | ASN.1 encoded |
| Transaction Updates | `Transaction.updates` stream | SKPaymentTransactionObserver |
| Server Validation | App Store Server API | verifyReceipt endpoint (deprecated) |
| Minimum iOS | 15.0 | 7.0 |
| Recommended | Yes | Only for <iOS 15 support |

## App Store Server API Endpoints

| Endpoint | Purpose | URL |
|----------|---------|-----|
| Production | Live transactions | `https://api.storekit.itunes.apple.com` |
| Sandbox | Testing | `https://api.storekit-sandbox.itunes.apple.com` |

## Purchase Result States

| Result | User Action | App Response |
|--------|-------------|--------------|
| `.success(.verified)` | Purchase completed | Grant content, finish transaction |
| `.success(.unverified)` | Fraud attempt | DO NOT grant, log error |
| `.userCancelled` | Tapped cancel | Return silently (no error) |
| `.pending` | Ask to Buy | Show "awaiting approval" |

## Transaction Streams

| Stream | Purpose | When to Use |
|--------|---------|-------------|
| `Transaction.updates` | Background completions | Listen at app launch |
| `Transaction.currentEntitlements` | Valid purchases | Check owned content |
| `Transaction.unfinished` | Interrupted purchases | Recover at launch |

## Verification Results

| Result | Meaning | Action |
|--------|---------|--------|
| `.verified(transaction)` | Valid signature | Safe to grant content |
| `.unverified(_, error)` | Invalid/tampered | DO NOT grant, investigate |

## Receipt Validation Strategy

| Purchase Value | Validation Method |
|----------------|-------------------|
| Low value consumables (<$5) | On-device verification only |
| High value / permanent unlocks | Server validation recommended |
| Subscriptions | Server validation + Server Notifications V2 |

## Subscription States

| State | Description | User Access |
|-------|-------------|-------------|
| `.subscribed` | Active subscription | Full access |
| `.inGracePeriod` | Billing retry | Full access |
| `.inBillingRetryPeriod` | Failed renewal | Varies |
| `.expired` | Subscription ended | No access |
| `.revoked` | Refunded/family removed | No access |

## Error Types and Handling

| Error | Retry | User Message |
|-------|-------|--------------|
| productLoadFailed | Yes (3x) | "Check your connection" |
| purchaseFailed | Yes (3x backoff) | "Please try again" |
| purchasePending | No | "Awaiting approval" |
| verificationFailed | No | "Could not verify" |
| restoreFailed | Yes | "Please try again" |

## StoreKit Configuration File Structure

| Section | Contains |
|---------|----------|
| `products` | Consumables and non-consumables |
| `subscriptionGroups` | Auto-renewable subscriptions |
| `nonRenewingSubscriptions` | Non-renewing subscriptions |
| `settings` | Test configuration options |

## Testing Checklist

| Test Case | How to Test |
|-----------|-------------|
| Purchase success | StoreKit config file in Xcode |
| User cancellation | Cancel during purchase sheet |
| Network failure | Enable airplane mode |
| Pending (Ask to Buy) | StoreKit config settings |
| Interrupted purchase | Kill app during purchase |
| Restore purchases | New device / reinstall |
| Subscription renewal | Time acceleration in StoreKit config |
| Refund handling | Xcode transaction manager |

## Price Display Rules

| Rule | Requirement |
|------|-------------|
| Always use `product.displayPrice` | Never hardcode prices |
| Regional formatting | Automatic via StoreKit |
| Currency symbol | Included in displayPrice |
| Subscription period | Use `subscription.subscriptionPeriod` |

## Transaction Finishing Rules

| Scenario | When to Finish |
|----------|----------------|
| Successful purchase | After granting content |
| Consumable | After granting (immediately) |
| Non-consumable | After persisting entitlement |
| Subscription | After updating status |
| Verification failed | DO NOT finish |
| Unfinished at launch | After re-granting content |
