import StoreKit

// Product IDs must match exactly what is configured in App Store Connect
let iapProductIDs: Set<String> = ["sonopilot_pro_monthly", "sonopilot_pro_yearly"]

@MainActor
class StoreManager {
    static let shared = StoreManager()

    private(set) var products: [Product] = []

    func loadProducts() async {
        do {
            products = try await Product.products(for: iapProductIDs)
        } catch {
            print("[StoreManager] Failed to load products: \(error)")
        }
    }

    func purchase(productID: String, completion: @escaping (Bool, String?) -> Void) {
        Task {
            if products.isEmpty { await loadProducts() }
            guard let product = products.first(where: { $0.id == productID }) else {
                completion(false, "Product not found. Make sure IAP is configured in App Store Connect.")
                return
            }
            do {
                let result = try await product.purchase()
                switch result {
                case .success(let verification):
                    switch verification {
                    case .verified(let transaction):
                        await transaction.finish()
                        // Pass transactionId|productId back for server sync
                        completion(true, "\(transaction.id)|\(productID)")
                    case .unverified(_, let error):
                        completion(false, "Verification failed: \(error.localizedDescription)")
                    }
                case .userCancelled:
                    completion(false, nil) // nil = cancelled, not an error
                case .pending:
                    completion(false, "Purchase is pending approval.")
                @unknown default:
                    completion(false, "Unknown purchase result.")
                }
            } catch {
                completion(false, error.localizedDescription)
            }
        }
    }
}
