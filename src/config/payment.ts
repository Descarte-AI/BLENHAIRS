// Payment Configuration
// Stripe Configuration with your actual API keys

export const PAYMENT_CONFIG = {
  // PayPal Configuration
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "demo_paypal_client_id",
    currency: "USD",
    intent: "capture",
    environment: import.meta.env.PROD ? 'live' : 'sandbox'
  },

  // Stripe Configuration
  stripe: {
    publishableKey: "pk_test_51Rmqwp4EwiCKm6QZl5S0GqIdbspqC1ew4N7JeNZnBKdSB0Jj8Q1vuJZ4H4p5jazdwEX1RSEODHssd8NI6mji30MR00vPk59Cak",
    // Note: Secret key (sk_test_51•••••6BV) should NEVER be in frontend code - keep it on your server
    currency: "USD",
    environment: "test" // Change to "live" when ready for production
  },

  // API Endpoints
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "https://api.stripe.com/v1",
    endpoints: {
      createPaymentIntent: "/payments/create-intent",
      confirmPayment: "/payments/confirm",
      processPaypal: "/payments/paypal"
    }
  }
};

// Test Card Numbers for Development
export const TEST_CARDS = {
  visa: "4242424242424242",
  visaDebit: "4000056655665556",
  mastercard: "5555555555554444",
  amex: "378282246310005",
  declined: "4000000000000002",
  requiresAuth: "4000002500003155"
};

// Payment Methods Configuration
export const PAYMENT_METHODS = {
  card: {
    enabled: true,
    name: "Credit/Debit Card",
    icon: "CreditCard",
    description: "Visa, Mastercard, American Express"
  },
  paypal: {
    enabled: false, // Disabled for now, focusing on Stripe
    name: "PayPal",
    icon: "PayPal",
    description: "Pay with your PayPal account"
  }
};

// Currency Configuration
export const CURRENCY_CONFIG = {
  code: "USD",
  symbol: "$",
  locale: "en-US"
};

// Tax Configuration
export const TAX_CONFIG = {
  rate: 0.08, // 8% tax rate
  included: false // Tax is added to subtotal
};

// Shipping Configuration
export const SHIPPING_CONFIG = {
  freeShippingThreshold: 0, // Free shipping on all orders
  defaultRate: 0,
  expeditedRate: 15.99,
  internationalRate: 0 // Free international shipping
};