import React, { useState } from 'react';
import { X, CreditCard, Shield, Lock, CheckCircle, Star, Truck } from 'lucide-react';
import { PAYMENT_CONFIG, TEST_CARDS } from '../config/payment';
import { 
  createPaymentIntent, 
  confirmPayment, 
  validateCardNumber, 
  validateExpiryDate, 
  validateCVV, 
  formatCardNumber,
  getCardBrand,
  calculateOrderTotal,
  dollarsToCents
} from '../utils/stripeHelpers';
import { sendOrderNotificationEmail, sendCustomerConfirmationEmail } from '../utils/emailService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: any[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, items }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card'>('card');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [cardBrand, setCardBrand] = useState('');
  const [paymentError, setPaymentError] = useState('');

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    // Card validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid or expired date';
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!validateCVV(formData.cvv, cardBrand)) {
      newErrors.cvv = 'Invalid CVV';
    }
    
    if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Special handling for card number
    if (name === 'cardNumber') {
      processedValue = formatCardNumber(value);
      setCardBrand(getCardBrand(value));
    }
    
    // Special handling for expiry date
    if (name === 'expiryDate') {
      processedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (processedValue.length > 5) processedValue = processedValue.slice(0, 5);
    }
    
    // Special handling for CVV
    if (name === 'cvv') {
      processedValue = value.replace(/\D/g, '');
      const maxLength = cardBrand === 'amex' ? 4 : 3;
      if (processedValue.length > maxLength) processedValue = processedValue.slice(0, maxLength);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
    
    // Clear payment error
    if (paymentError) {
      setPaymentError('');
    }
  };

  const processStripePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');
    
    try {
      // Calculate order totals
      const orderTotals = calculateOrderTotal(total, 0.08, 0); // 8% tax, free shipping
      
      // Create payment intent
      const paymentData = {
        amount: dollarsToCents(orderTotals.total),
        currency: 'usd',
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        },
        shippingAddress: {
          line1: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.zipCode,
          country: 'US'
        },
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price
        }))
      };
      
      const intentResult = await createPaymentIntent(paymentData);
      
      if (!intentResult.success) {
        throw new Error(intentResult.error || 'Failed to create payment intent');
      }
      
      // Confirm payment with card details
      const paymentMethodData = {
        amount: dollarsToCents(orderTotals.total),
        card: {
          number: formData.cardNumber.replace(/\s/g, ''),
          exp_month: parseInt(formData.expiryDate.split('/')[0]),
          exp_year: parseInt(`20${formData.expiryDate.split('/')[1]}`),
          cvc: formData.cvv
        },
        billing_details: {
          name: formData.nameOnCard,
          email: formData.email,
          address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zipCode,
            country: 'US'
          }
        }
      };
      
      const confirmResult = await confirmPayment(intentResult.paymentIntent.id, paymentMethodData);
      
      if (!confirmResult.success) {
        throw new Error(confirmResult.error || 'Payment failed');
      }
      
      // Send order notification emails
      const orderDetails = {
        orderId: confirmResult.payment.id,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        products: items.map(item => ({
          name: item.name,
          color: item.shade || item.color,
          length: item.length,
          packs: item.selectedPacks || 1,
          quantity: item.quantity || 1,
          price: item.price * (item.quantity || 1)
        })),
        total: orderTotals.total,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'US'
        },
        paymentMethod: 'Credit Card',
        orderDate: new Date().toISOString()
      };
      
      // Send emails (in background, don't wait for completion)
      sendOrderNotificationEmail(orderDetails).catch(console.error);
      sendCustomerConfirmationEmail(orderDetails).catch(console.error);
      
      return {
        success: true,
        transactionId: confirmResult.payment.id,
        amount: orderTotals.total,
        method: 'Credit Card',
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await processStripePayment();
      
      if (result.success) {
        setPaymentSuccess(true);
        
        setTimeout(() => {
          alert(`🎉 Payment Successful! 

Transaction ID: ${result.transactionId}
Amount: $${result.amount}
Payment Method: Credit Card

Your premium hair extensions will be shipped within 24 hours with free tracking!

Thank you for choosing Blen Hairs! 💫`);
          onClose();
          setPaymentSuccess(false);
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      setPaymentError(errorMessage);
    }
  };

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const subtotal = total;
  const tax = total * 0.08;
  const finalTotal = subtotal + tax;

  // Success overlay
  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <Lock size={24} className="text-white" />
            <div>
              <h2 className="text-2xl font-bold">Secure Checkout</h2>
              <p className="opacity-90 text-sm">SSL Encrypted & Protected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <h3 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h3>
            
            {/* Items */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.shade} • {item.length}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              ))}
              
              {/* Pricing Breakdown */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center space-x-1">
                    <Truck size={14} />
                    <span>Shipping:</span>
                  </span>
                  <span className="font-bold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 text-gray-900">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-bold mb-3 text-gray-900">Your Purchase is Protected</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Shield size={14} className="text-green-600" />
                  <span>SSL Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span>30-Day Return</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck size={14} className="text-blue-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Choose Payment Method</h3>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className="p-4 border-2 border-gray-900 bg-gray-50 text-gray-900 rounded-xl flex flex-col items-center space-y-2"
                >
                  <CreditCard size={24} />
                  <span className="font-bold">Credit/Debit Card</span>
                  <span className="text-sm text-gray-600">Powered by Stripe</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Error Display */}
              {paymentError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 font-medium">{paymentError}</p>
                </div>
              )}
              
              {/* Test Card Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-800 mb-2">Test Mode - Use Test Cards</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Success:</strong> 4242 4242 4242 4242</p>
                  <p><strong>Declined:</strong> 4000 0000 0000 0002</p>
                  <p><strong>Requires Auth:</strong> 4000 0025 0000 3155</p>
                  <p>Use any future expiry date and any 3-digit CVC</p>
                </div>
              </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold mb-3 text-gray-900">Contact Information</h4>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold mb-3 text-gray-900">Shipping Address</h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                            errors.firstName ? 'border-red-500' : 'border-gray-200'
                          }`}
                          required
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                            errors.lastName ? 'border-red-500' : 'border-gray-200'
                          }`}
                          required
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="address"
                        placeholder="Street address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.address ? 'border-red-500' : 'border-gray-200'
                        }`}
                        required
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                            errors.city ? 'border-red-500' : 'border-gray-200'
                          }`}
                          required
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                            errors.state ? 'border-red-500' : 'border-gray-200'
                          }`}
                          required
                        >
                          <option value="">State</option>
                          {usStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="ZIP code"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                            errors.zipCode ? 'border-red-500' : 'border-gray-200'
                          }`}
                          required
                        />
                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold mb-3 text-gray-900">Payment Information</h4>
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card number"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                        maxLength={23}
                        required
                      />
                      {cardBrand && (
                        <div className="mt-1 text-sm text-gray-600 capitalize">
                          {cardBrand} card detected
                        </div>
                      )}
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        name="nameOnCard"
                        placeholder="Name on card"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.nameOnCard ? 'border-red-500' : 'border-gray-200'
                        }`}
                        required
                      />
                      {errors.nameOnCard && <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                            errors.expiryDate ? 'border-red-500' : 'border-gray-200'
                          }`}
                          maxLength={5}
                          required
                        />
                        {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                            errors.cvv ? 'border-red-500' : 'border-gray-200'
                          }`}
                          required
                        />
                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={20} />
                      <span>Complete Order - ${finalTotal.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </form>

            {/* Security Footer */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 bg-green-50 p-3 rounded-lg">
                <Shield size={14} className="text-green-600" />
                <span>Your payment information is encrypted and secure</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Powered by Stripe - Your Stripe keys are configured</p>
                <p>Test mode: Use the test card numbers above</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;