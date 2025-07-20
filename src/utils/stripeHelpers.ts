import { PAYMENT_CONFIG, TEST_CARDS } from '../config/payment';

// Stripe Payment Helper Functions
export interface StripePaymentData {
  amount: number; // in cents
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Create Payment Intent (simulated for frontend-only demo)
export const createPaymentIntent = async (paymentData: StripePaymentData) => {
  try {
    // In a real application, this would call your backend API
    // For demo purposes, we'll simulate the payment intent creation
    
    console.log('Creating payment intent with data:', paymentData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful payment intent creation
    const paymentIntent = {
      id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: 'requires_payment_method',
      created: Math.floor(Date.now() / 1000),
      metadata: {
        customer_email: paymentData.customerInfo.email,
        customer_name: paymentData.customerInfo.name,
        items_count: paymentData.items.length.toString()
      }
    };
    
    return { success: true, paymentIntent };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { success: false, error: 'Failed to create payment intent' };
  }
};

// Confirm Payment (simulated for frontend-only demo)
export const confirmPayment = async (paymentIntentId: string, paymentMethodData: any) => {
  try {
    console.log('Confirming payment for intent:', paymentIntentId);
    console.log('Payment method data:', paymentMethodData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if using test card that should be declined
    if (paymentMethodData.card?.number === TEST_CARDS.declined) {
      return {
        success: false,
        error: 'Your card was declined. Please try a different payment method.'
      };
    }
    
    // Simulate successful payment
    const confirmedPayment = {
      id: paymentIntentId,
      status: 'succeeded',
      amount_received: paymentMethodData.amount,
      currency: 'usd',
      payment_method: {
        id: `pm_${Date.now()}`,
        type: 'card',
        card: {
          brand: getCardBrand(paymentMethodData.card?.number || ''),
          last4: (paymentMethodData.card?.number || '').slice(-4),
          exp_month: paymentMethodData.card?.exp_month,
          exp_year: paymentMethodData.card?.exp_year
        }
      },
      receipt_url: `https://pay.stripe.com/receipts/${paymentIntentId}`,
      created: Math.floor(Date.now() / 1000)
    };
    
    return { success: true, payment: confirmedPayment };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return { success: false, error: 'Payment confirmation failed' };
  }
};

// Get card brand from number
export const getCardBrand = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6/.test(cleanNumber)) return 'discover';
  
  return 'unknown';
};

// Validate card number using Luhn algorithm
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleanNumber)) return false;
  if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Validate expiry date
export const validateExpiryDate = (expiryDate: string): boolean => {
  const [month, year] = expiryDate.split('/');
  
  if (!month || !year) return false;
  
  const monthNum = parseInt(month);
  const yearNum = parseInt(`20${year}`);
  
  if (monthNum < 1 || monthNum > 12) return false;
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (yearNum < currentYear) return false;
  if (yearNum === currentYear && monthNum < currentMonth) return false;
  
  return true;
};

// Validate CVV
export const validateCVV = (cvv: string, cardBrand: string = 'visa'): boolean => {
  const cleanCVV = cvv.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleanCVV)) return false;
  
  // American Express uses 4-digit CVV, others use 3-digit
  const expectedLength = cardBrand === 'amex' ? 4 : 3;
  
  return cleanCVV.length === expectedLength;
};

// Format card number with spaces
export const formatCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const cardBrand = getCardBrand(cleanNumber);
  
  if (cardBrand === 'amex') {
    // American Express: 4-6-5 format
    return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  } else {
    // Others: 4-4-4-4 format
    return cleanNumber.replace(/(\d{4})/g, '$1 ').trim();
  }
};

// Calculate total with tax and shipping
export const calculateOrderTotal = (subtotal: number, taxRate: number = 0.08, shipping: number = 0) => {
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100
  };
};

// Convert dollars to cents for Stripe
export const dollarsToCents = (dollars: number): number => {
  return Math.round(dollars * 100);
};

// Convert cents to dollars
export const centsToDollars = (cents: number): number => {
  return Math.round(cents) / 100;
};