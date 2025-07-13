import { PAYMENT_CONFIG, TAX_CONFIG, SHIPPING_CONFIG } from '../config/payment';

// Calculate order totals
export const calculateOrderTotals = (subtotal: number, shippingMethod: 'standard' | 'expedited' = 'standard') => {
  const shipping = subtotal >= SHIPPING_CONFIG.freeShippingThreshold 
    ? 0 
    : shippingMethod === 'expedited' 
      ? SHIPPING_CONFIG.expeditedRate 
      : SHIPPING_CONFIG.defaultRate;
  
  const tax = subtotal * TAX_CONFIG.rate;
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total
  };
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Validate credit card number using Luhn algorithm
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
export const validateCVV = (cvv: string, cardType: string = 'visa'): boolean => {
  const cleanCVV = cvv.replace(/\s/g, '');
  
  if (!/^\d+$/.test(cleanCVV)) return false;
  
  // American Express uses 4-digit CVV, others use 3-digit
  const expectedLength = cardType === 'amex' ? 4 : 3;
  
  return cleanCVV.length === expectedLength;
};

// Get card type from number
export const getCardType = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6/.test(cleanNumber)) return 'discover';
  
  return 'unknown';
};

// Format card number with spaces
export const formatCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  const cardType = getCardType(cleanNumber);
  
  if (cardType === 'amex') {
    // American Express: 4-6-5 format
    return cleanNumber.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  } else {
    // Others: 4-4-4-4 format
    return cleanNumber.replace(/(\d{4})/g, '$1 ').trim();
  }
};

// Create payment payload for API
export const createPaymentPayload = (formData: any, items: any[], totals: any) => {
  return {
    amount: Math.round(totals.total * 100), // Convert to cents
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {
      order_id: `order_${Date.now()}`,
      customer_email: formData.email,
      items_count: items.length,
      subtotal: Math.round(totals.subtotal * 100),
      tax: Math.round(totals.tax * 100),
      shipping: Math.round(totals.shipping * 100)
    },
    shipping: {
      name: `${formData.firstName} ${formData.lastName}`,
      address: {
        line1: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zipCode,
        country: 'US'
      }
    },
    receipt_email: formData.email
  };
};

// Handle payment errors
export const handlePaymentError = (error: any): string => {
  if (error.type === 'card_error' || error.type === 'validation_error') {
    return error.message;
  }
  
  switch (error.code) {
    case 'card_declined':
      return 'Your card was declined. Please try a different payment method.';
    case 'expired_card':
      return 'Your card has expired. Please use a different card.';
    case 'incorrect_cvc':
      return 'Your card\'s security code is incorrect.';
    case 'processing_error':
      return 'An error occurred while processing your card. Please try again.';
    case 'rate_limit':
      return 'Too many requests. Please wait a moment and try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// Generate order confirmation
export const generateOrderConfirmation = (paymentResult: any, items: any[], totals: any) => {
  return {
    orderId: paymentResult.id || `order_${Date.now()}`,
    transactionId: paymentResult.charges?.data[0]?.id || paymentResult.id,
    amount: totals.total,
    currency: 'USD',
    status: 'confirmed',
    items: items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity || 1,
      price: item.price,
      total: item.price * (item.quantity || 1)
    })),
    totals,
    timestamp: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
  };
};