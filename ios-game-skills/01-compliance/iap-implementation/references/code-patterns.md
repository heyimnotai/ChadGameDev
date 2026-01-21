# IAP Implementation - Code Patterns

## StoreManager - Complete Implementation

```swift
import StoreKit

/// Thread-safe store manager using StoreKit 2
@MainActor
final class StoreManager: ObservableObject {

    // MARK: - Published Properties

    @Published private(set) var products: [Product] = []
    @Published private(set) var purchasedProductIDs: Set<String> = []
    @Published private(set) var isLoading = false
    @Published private(set) var error: StoreError?

    // MARK: - Product Identifiers

    enum ProductID {
        // Consumables
        static let coins100 = "com.game.coins.100"
        static let coins500 = "com.game.coins.500"
        static let coins1000 = "com.game.coins.1000"

        // Non-Consumables
        static let removeAds = "com.game.removeads"
        static let premiumUpgrade = "com.game.premium"
        static let characterSkinDragon = "com.game.skin.dragon"

        // Subscriptions
        static let vipMonthly = "com.game.vip.monthly"
        static let vipYearly = "com.game.vip.yearly"
        static let battlePassSeason1 = "com.game.battlepass.s1"

        static var all: [String] {
            [
                coins100, coins500, coins1000,
                removeAds, premiumUpgrade, characterSkinDragon,
                vipMonthly, vipYearly, battlePassSeason1
            ]
        }
    }

    // MARK: - Private Properties

    private var updateListenerTask: Task<Void, Error>?
    private let entitlementManager: EntitlementManager

    // MARK: - Initialization

    init(entitlementManager: EntitlementManager = .shared) {
        self.entitlementManager = entitlementManager

        // Start listening for transaction updates
        updateListenerTask = listenForTransactionUpdates()

        // Load products and check entitlements
        Task {
            await loadProducts()
            await updatePurchasedProducts()
        }
    }

    deinit {
        updateListenerTask?.cancel()
    }

    // MARK: - Product Loading

    func loadProducts() async {
        isLoading = true
        error = nil

        do {
            products = try await Product.products(for: ProductID.all)
            products.sort { $0.price < $1.price }
        } catch {
            self.error = .productLoadFailed(error)
        }

        isLoading = false
    }

    // MARK: - Purchase Flow

    func purchase(_ product: Product) async throws -> Transaction? {
        isLoading = true
        error = nil

        defer { isLoading = false }

        do {
            let result = try await product.purchase()

            switch result {
            case .success(let verification):
                let transaction = try checkVerification(verification)

                // Handle the purchase based on product type
                await handlePurchase(transaction, product: product)

                // CRITICAL: Always finish the transaction
                await transaction.finish()

                return transaction

            case .userCancelled:
                // User cancelled - not an error, just return nil
                return nil

            case .pending:
                // Transaction requires approval (Ask to Buy, etc.)
                self.error = .purchasePending
                return nil

            @unknown default:
                self.error = .unknown
                return nil
            }
        } catch {
            self.error = .purchaseFailed(error)
            throw error
        }
    }

    // MARK: - Verification

    private func checkVerification<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified(_, let error):
            // Verification failed - potential fraud
            throw StoreError.verificationFailed(error)
        case .verified(let item):
            return item
        }
    }

    // MARK: - Handle Purchase Types

    private func handlePurchase(_ transaction: Transaction, product: Product) async {
        switch product.type {
        case .consumable:
            await handleConsumable(transaction, product: product)
        case .nonConsumable:
            await handleNonConsumable(transaction, product: product)
        case .autoRenewable:
            await handleSubscription(transaction, product: product)
        case .nonRenewable:
            await handleNonRenewingSubscription(transaction, product: product)
        default:
            break
        }

        purchasedProductIDs.insert(product.id)
    }

    private func handleConsumable(_ transaction: Transaction, product: Product) async {
        // Grant the consumable content
        switch product.id {
        case ProductID.coins100:
            await entitlementManager.grantCoins(100)
        case ProductID.coins500:
            await entitlementManager.grantCoins(500)
        case ProductID.coins1000:
            await entitlementManager.grantCoins(1000)
        default:
            break
        }

        // Log for analytics
        await logPurchase(transaction, product: product)
    }

    private func handleNonConsumable(_ transaction: Transaction, product: Product) async {
        // Grant permanent entitlement
        switch product.id {
        case ProductID.removeAds:
            await entitlementManager.unlockFeature(.removeAds)
        case ProductID.premiumUpgrade:
            await entitlementManager.unlockFeature(.premium)
        case ProductID.characterSkinDragon:
            await entitlementManager.unlockSkin(.dragon)
        default:
            break
        }

        await logPurchase(transaction, product: product)
    }

    private func handleSubscription(_ transaction: Transaction, product: Product) async {
        // Update subscription status
        await entitlementManager.updateSubscriptionStatus(
            productID: product.id,
            expirationDate: transaction.expirationDate
        )

        await logPurchase(transaction, product: product)
    }

    private func handleNonRenewingSubscription(_ transaction: Transaction, product: Product) async {
        // Calculate expiration (e.g., 30 days from purchase)
        let expirationDate = Calendar.current.date(
            byAdding: .day,
            value: 30,
            to: transaction.purchaseDate
        )

        await entitlementManager.updateSubscriptionStatus(
            productID: product.id,
            expirationDate: expirationDate
        )

        await logPurchase(transaction, product: product)
    }

    private func logPurchase(_ transaction: Transaction, product: Product) async {
        // Analytics logging (implement based on your analytics)
    }

    // MARK: - Transaction Updates Listener

    private func listenForTransactionUpdates() -> Task<Void, Error> {
        Task.detached {
            // Listen for transactions that complete outside the app
            for await result in Transaction.updates {
                do {
                    let transaction = try await self.checkVerification(result)

                    // Re-grant entitlements
                    if let product = await self.products.first(where: { $0.id == transaction.productID }) {
                        await self.handlePurchase(transaction, product: product)
                    }

                    // CRITICAL: Always finish
                    await transaction.finish()

                    await self.updatePurchasedProducts()
                } catch {
                    // Log verification failure
                }
            }
        }
    }

    // MARK: - Restore Purchases

    func restorePurchases() async {
        isLoading = true
        error = nil

        defer { isLoading = false }

        do {
            // Sync with App Store
            try await AppStore.sync()

            // Update local entitlements
            await updatePurchasedProducts()

        } catch {
            self.error = .restoreFailed(error)
        }
    }

    // MARK: - Check Entitlements

    func updatePurchasedProducts() async {
        var purchased: Set<String> = []

        // Check current entitlements
        for await result in Transaction.currentEntitlements {
            do {
                let transaction = try checkVerification(result)

                // Verify transaction is still valid
                if transaction.revocationDate == nil {
                    purchased.insert(transaction.productID)

                    // Re-grant if needed
                    if let product = products.first(where: { $0.id == transaction.productID }) {
                        await handlePurchase(transaction, product: product)
                    }
                }
            } catch {
                // Verification failed for this transaction
            }
        }

        purchasedProductIDs = purchased
    }

    // MARK: - Subscription Status

    func subscriptionStatus(for groupID: String) async -> Product.SubscriptionInfo.Status? {
        guard let product = products.first(where: { $0.subscription?.subscriptionGroupID == groupID }),
              let subscription = product.subscription else {
            return nil
        }

        do {
            let statuses = try await subscription.status
            return statuses.first { $0.state == .subscribed || $0.state == .inGracePeriod }
        } catch {
            return nil
        }
    }

    // MARK: - Helper Methods

    func product(for identifier: String) -> Product? {
        products.first { $0.id == identifier }
    }

    func isPurchased(_ productID: String) -> Bool {
        purchasedProductIDs.contains(productID)
    }
}

// MARK: - Store Errors

enum StoreError: LocalizedError {
    case productLoadFailed(Error)
    case purchaseFailed(Error)
    case purchasePending
    case verificationFailed(Error)
    case restoreFailed(Error)
    case unknown

    var errorDescription: String? {
        switch self {
        case .productLoadFailed:
            return "Unable to load products. Please check your connection."
        case .purchaseFailed:
            return "Purchase could not be completed. Please try again."
        case .purchasePending:
            return "Purchase requires approval. Check with your family organizer."
        case .verificationFailed:
            return "Purchase could not be verified."
        case .restoreFailed:
            return "Could not restore purchases. Please try again."
        case .unknown:
            return "An unknown error occurred."
        }
    }
}
```

## EntitlementManager

```swift
import Foundation

/// Manages user entitlements and persists them securely
actor EntitlementManager {

    static let shared = EntitlementManager()

    // MARK: - Feature Flags

    enum Feature: String, CaseIterable {
        case removeAds
        case premium
        case vip
    }

    enum Skin: String, CaseIterable {
        case dragon
        case knight
        case wizard
    }

    // MARK: - Storage Keys

    private let coinsKey = "user.coins"
    private let unlockedFeaturesKey = "user.features"
    private let unlockedSkinsKey = "user.skins"
    private let subscriptionExpirationKey = "user.subscription.expiration"

    private let defaults = UserDefaults.standard

    // MARK: - Consumables

    private(set) var coins: Int {
        get { defaults.integer(forKey: coinsKey) }
        set { defaults.set(newValue, forKey: coinsKey) }
    }

    func grantCoins(_ amount: Int) {
        coins += amount
        NotificationCenter.default.post(name: .coinsUpdated, object: coins)
    }

    func spendCoins(_ amount: Int) -> Bool {
        guard coins >= amount else { return false }
        coins -= amount
        NotificationCenter.default.post(name: .coinsUpdated, object: coins)
        return true
    }

    // MARK: - Non-Consumables

    private var unlockedFeatures: Set<String> {
        get {
            Set(defaults.stringArray(forKey: unlockedFeaturesKey) ?? [])
        }
        set {
            defaults.set(Array(newValue), forKey: unlockedFeaturesKey)
        }
    }

    func unlockFeature(_ feature: Feature) {
        var features = unlockedFeatures
        features.insert(feature.rawValue)
        unlockedFeatures = features
        NotificationCenter.default.post(name: .entitlementsUpdated, object: nil)
    }

    func hasFeature(_ feature: Feature) -> Bool {
        unlockedFeatures.contains(feature.rawValue)
    }

    // MARK: - Skins

    private var unlockedSkins: Set<String> {
        get {
            Set(defaults.stringArray(forKey: unlockedSkinsKey) ?? [])
        }
        set {
            defaults.set(Array(newValue), forKey: unlockedSkinsKey)
        }
    }

    func unlockSkin(_ skin: Skin) {
        var skins = unlockedSkins
        skins.insert(skin.rawValue)
        unlockedSkins = skins
        NotificationCenter.default.post(name: .entitlementsUpdated, object: nil)
    }

    func hasSkin(_ skin: Skin) -> Bool {
        unlockedSkins.contains(skin.rawValue)
    }

    // MARK: - Subscriptions

    func updateSubscriptionStatus(productID: String, expirationDate: Date?) {
        if let expiration = expirationDate {
            defaults.set(expiration, forKey: subscriptionExpirationKey + "." + productID)
        } else {
            defaults.removeObject(forKey: subscriptionExpirationKey + "." + productID)
        }
        NotificationCenter.default.post(name: .subscriptionUpdated, object: nil)
    }

    func isSubscriptionActive(productID: String) -> Bool {
        guard let expiration = defaults.object(forKey: subscriptionExpirationKey + "." + productID) as? Date else {
            return false
        }
        return expiration > Date()
    }

    // MARK: - Ads Check

    var shouldShowAds: Bool {
        !hasFeature(.removeAds) && !hasFeature(.premium) && !hasFeature(.vip)
    }
}

// MARK: - Notifications

extension Notification.Name {
    static let coinsUpdated = Notification.Name("coinsUpdated")
    static let entitlementsUpdated = Notification.Name("entitlementsUpdated")
    static let subscriptionUpdated = Notification.Name("subscriptionUpdated")
}
```

## Store UI Components

```swift
import SwiftUI
import StoreKit

struct StoreView: View {
    @StateObject private var store = StoreManager()
    @State private var selectedProduct: Product?
    @State private var isPurchasing = false
    @State private var showingError = false

    var body: some View {
        NavigationView {
            List {
                if store.isLoading && store.products.isEmpty {
                    ProgressView("Loading store...")
                } else {
                    Section("Coins") {
                        ForEach(store.products.filter { $0.type == .consumable }) { product in
                            ProductRow(product: product, isPurchased: false) {
                                await purchase(product)
                            }
                        }
                    }

                    Section("Upgrades") {
                        ForEach(store.products.filter { $0.type == .nonConsumable }) { product in
                            ProductRow(
                                product: product,
                                isPurchased: store.isPurchased(product.id)
                            ) {
                                await purchase(product)
                            }
                        }
                    }

                    Section("Subscriptions") {
                        ForEach(store.products.filter { $0.type == .autoRenewable }) { product in
                            SubscriptionRow(
                                product: product,
                                isPurchased: store.isPurchased(product.id)
                            ) {
                                await purchase(product)
                            }
                        }
                    }

                    Section {
                        Button("Restore Purchases") {
                            Task {
                                await store.restorePurchases()
                            }
                        }
                    }
                }
            }
            .navigationTitle("Store")
            .refreshable {
                await store.loadProducts()
            }
            .alert("Error", isPresented: $showingError) {
                Button("OK") { }
            } message: {
                Text(store.error?.localizedDescription ?? "Unknown error")
            }
            .onChange(of: store.error) { error in
                showingError = error != nil
            }
        }
    }

    private func purchase(_ product: Product) async {
        isPurchasing = true
        defer { isPurchasing = false }

        do {
            _ = try await store.purchase(product)
        } catch {
            // Error already handled in store
        }
    }
}

struct ProductRow: View {
    let product: Product
    let isPurchased: Bool
    let purchase: () async -> Void

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(product.displayName)
                    .font(.headline)
                Text(product.description)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Spacer()

            if isPurchased {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(.green)
            } else {
                Button(product.displayPrice) {
                    Task {
                        await purchase()
                    }
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding(.vertical, 4)
    }
}

struct SubscriptionRow: View {
    let product: Product
    let isPurchased: Bool
    let purchase: () async -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(product.displayName)
                    .font(.headline)
                Spacer()
                if isPurchased {
                    Text("Active")
                        .font(.caption)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.green.opacity(0.2))
                        .cornerRadius(4)
                }
            }

            Text(product.description)
                .font(.caption)
                .foregroundColor(.secondary)

            if let subscription = product.subscription {
                HStack {
                    Text(subscriptionPeriodText(subscription.subscriptionPeriod))
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                    if !isPurchased {
                        Button(product.displayPrice) {
                            Task {
                                await purchase()
                            }
                        }
                        .buttonStyle(.borderedProminent)
                    }
                }
            }
        }
        .padding(.vertical, 4)
    }

    private func subscriptionPeriodText(_ period: Product.SubscriptionPeriod) -> String {
        switch period.unit {
        case .day: return period.value == 1 ? "Daily" : "Every \(period.value) days"
        case .week: return period.value == 1 ? "Weekly" : "Every \(period.value) weeks"
        case .month: return period.value == 1 ? "Monthly" : "Every \(period.value) months"
        case .year: return period.value == 1 ? "Yearly" : "Every \(period.value) years"
        @unknown default: return ""
        }
    }
}
```

## Server-Side Validation

```swift
import Foundation

/// Server-side receipt validation (recommended for high-value purchases)
struct ServerValidator {

    let serverURL: URL

    struct ValidationRequest: Codable {
        let signedTransaction: String
        let productID: String
        let userID: String
    }

    struct ValidationResponse: Codable {
        let valid: Bool
        let productID: String
        let transactionID: String
        let purchaseDate: Date
        let expirationDate: Date?
        let error: String?
    }

    /// Validate a transaction with your server
    func validate(transaction: Transaction, userID: String) async throws -> ValidationResponse {
        // Get the JWS representation
        guard let jwsRepresentation = transaction.jwsRepresentation else {
            throw ValidationError.missingJWS
        }

        let request = ValidationRequest(
            signedTransaction: jwsRepresentation,
            productID: transaction.productID,
            userID: userID
        )

        var urlRequest = URLRequest(url: serverURL)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = try JSONEncoder().encode(request)

        let (data, response) = try await URLSession.shared.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse,
              200..<300 ~= httpResponse.statusCode else {
            throw ValidationError.serverError
        }

        return try JSONDecoder().decode(ValidationResponse.self, from: data)
    }

    enum ValidationError: Error {
        case missingJWS
        case serverError
        case invalidResponse
    }
}
```

## Error Handling and Recovery

```swift
extension StoreManager {

    /// Handle all possible purchase outcomes
    func handlePurchaseResult(_ result: Product.PurchaseResult) async -> PurchaseOutcome {
        switch result {
        case .success(let verification):
            switch verification {
            case .verified(let transaction):
                // Valid purchase
                await transaction.finish()
                return .success(transaction)

            case .unverified(_, let verificationError):
                // Transaction failed verification
                // DO NOT grant content - potential fraud
                return .verificationFailed(verificationError)
            }

        case .userCancelled:
            // User tapped cancel - not an error
            return .cancelled

        case .pending:
            // Ask to Buy or requires action
            return .pending

        @unknown default:
            return .unknown
        }
    }

    enum PurchaseOutcome {
        case success(Transaction)
        case cancelled
        case pending
        case verificationFailed(Error)
        case unknown
    }
}

// MARK: - Network Error Handling

extension StoreManager {

    /// Retry logic for network failures
    func purchaseWithRetry(_ product: Product, maxAttempts: Int = 3) async throws -> Transaction? {
        var lastError: Error?

        for attempt in 1...maxAttempts {
            do {
                return try await purchase(product)
            } catch {
                lastError = error

                // Don't retry user cancellation or verification failures
                if case StoreError.verificationFailed = error {
                    throw error
                }

                // Wait before retry (exponential backoff)
                if attempt < maxAttempts {
                    try await Task.sleep(nanoseconds: UInt64(pow(2.0, Double(attempt))) * 1_000_000_000)
                }
            }
        }

        throw lastError ?? StoreError.unknown
    }
}

// MARK: - Transaction Recovery

extension StoreManager {

    /// Check for interrupted/unfinished transactions at app launch
    func recoverUnfinishedTransactions() async {
        // Check for transactions that weren't finished
        for await result in Transaction.unfinished {
            do {
                let transaction = try checkVerification(result)

                // Re-grant content
                if let product = products.first(where: { $0.id == transaction.productID }) {
                    await handlePurchase(transaction, product: product)
                }

                // Now finish
                await transaction.finish()
            } catch {
                // Log verification failure
            }
        }
    }
}
```
