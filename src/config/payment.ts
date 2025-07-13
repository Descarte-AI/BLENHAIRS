// Payment Configuration
// Replace these with your actual API keys when going live

export const PAYMENT_CONFIG = {
  // PayPal Configuration
  paypal: {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || "AW8Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q", // Replace with your PayPal Client ID
    currency: "USD",
    intent: "capture",
    environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
  },

  // Stripe Configuration
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51234567890abcdefghijklmnopqrstuvwxyz", // Replace with your Stripe Publishable Key
    // Note: Secret key should NEVER be in frontend code - keep it on your server
  },

  // API Endpoints
  api: {
    baseUrl: process.env.REACT_APP_API_URL || "https://your-api-domain.com/api",
    endpoints: {
      createPaymentIntent: "/payments/create-intent",
      confirmPayment: "/payments/confirm",
      processPaypal: "/payments/paypal",
      webhooks: "/payments/webhooks"
    }
  }
};

// Test Card Numbers for Development
export const TEST_CARDS = {
  visa: "4242424242424242",
  visaDebit: "4000056655665556",
  mastercard: "5555555555554444",
  amex: "378282246310005",
  declined: "4000000000000002"
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
    enabled: true,
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