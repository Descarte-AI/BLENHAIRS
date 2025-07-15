import React, { useState } from 'react';
import { X, CreditCard, Shield, Lock, CheckCircle, Star, Truck } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { sendOrderNotificationEmail, sendCustomerConfirmationEmail } from '../utils/emailService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: any[];
}

// PayPal Configuration - Replace with your actual credentials
const PAYPAL_CONFIG = {
  clientId: "AW8Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q9Q", // Replace with your PayPal Client ID
  currency: "USD",
  intent: "capture"
};

// Stripe Configuration - Replace with your actual keys
const STRIPE_CONFIG = {
  publishableKey: "pk_test_51234567890abcdefghijklmnopqrstuvwxyz", // Replace with your Stripe Publishable Key
  // Note: Secret key should be on server side only
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, total, items }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
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
    
    if (paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const processPayment = async (paymentData: any) => {
    // Simulate API call to your payment processor
    // In real implementation, this would call your backend API
    
    try {
      setIsProcessing(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success
      const paymentResult = {
        success: true,
        transactionId: `txn_${Date.now()}`,
        amount: total * 1.08, // Including tax
        method: paymentMethod,
        timestamp: new Date().toISOString()
      };
      
      // Send order notification emails
      const orderDetails = {
        orderId: paymentResult.transactionId,
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
        total: paymentResult.amount,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: 'US'
        },
        paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'PayPal',
        orderDate: paymentResult.timestamp
      };
      
      // Send emails (in background, don't wait for completion)
      sendOrderNotificationEmail(orderDetails).catch(console.error);
      sendCustomerConfirmationEmail(orderDetails).catch(console.error);
      
      return paymentResult;
    } catch (error) {
      throw new Error('Payment processing failed');
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
      const paymentData = {
        ...formData,
        amount: total * 1.08,
        items: items,
        paymentMethod: 'card'
      };
      
      const result = await processPayment(paymentData);
      
      if (result.success) {
        setPaymentSuccess(true);
        
        setTimeout(() => {
          alert(`🎉 Payment Successful! 

Transaction ID: ${result.transactionId}
Amount: $${result.amount.toFixed(2)}
Payment Method: Credit Card

Your premium hair extensions will be shipped within 24 hours with free tracking!

Thank you for choosing Blen Hairs! 💫`);
          onClose();
          setPaymentSuccess(false);
        }, 2000);
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = async (details: any) => {
    try {
      const orderDetails = {
        orderId: details.id,
        customerName: `${formData.firstName} ${formData.lastName}` || details.payer?.name?.given_name + ' ' + details.payer?.name?.surname,
        customerEmail: formData.email || details.payer?.email_address,
        products: items.map(item => ({
          name: item.name,
          color: item.shade || item.color,
          length: item.length,
          packs: item.selectedPacks || 1,
          quantity: item.quantity || 1,
          price: item.price * (item.quantity || 1)
        })),
        total: total * 1.08,
        shippingAddress: {
          street: formData.address || 'PayPal Address',
          city: formData.city || 'PayPal City',
          state: formData.state || 'PayPal State',
          zipCode: formData.zipCode || 'PayPal ZIP',
          country: 'US'
        },
        paymentMethod: 'PayPal',
        orderDate: new Date().toISOString()
      };
      
      const paymentData = {
        paypalOrderId: details.id,
        amount: total * 1.08,
        items: items,
        paymentMethod: 'paypal'
      };
      
      const result = await processPayment(paymentData);
      
      if (result.success) {
        // Send notification emails
        sendOrderNotificationEmail(orderDetails).catch(console.error);
        sendCustomerConfirmationEmail(orderDetails).catch(console.error);
        
        setPaymentSuccess(true);
        
        setTimeout(() => {
          alert(`🎉 PayPal Payment Successful! 

Transaction ID: ${details.id}
Amount: $${(total * 1.08).toFixed(2)}
Payment Method: PayPal

Your premium hair extensions will be shipped within 24 hours!

Thank you for your purchase! 💫`);
          onClose();
          setPaymentSuccess(false);
        }, 2000);
      }
    } catch (error) {
      alert('Payment verification failed. Please contact support.');
    }
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal error:', error);
    alert(`Payment failed: ${error.message || 'Unknown error'}`);
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-t-3xl">
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center space-y-2 transition-all ${
                    paymentMethod === 'card' 
                      ? 'border-gray-900 bg-gray-50 text-gray-900' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard size={24} />
                  <span className="font-bold">Credit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center space-y-2 transition-all ${
                    paymentMethod === 'paypal' 
                      ? 'border-blue-500 bg-blue-50 text-blue-600' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                  </svg>
                  <span className="font-bold">PayPal</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'paypal' ? (
              <div className="text-center space-y-4">
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg text-blue-800 mb-3">Pay with PayPal</h4>
                  <p className="text-blue-700 mb-4">
                    Complete your secure payment with PayPal
                  </p>
                  
                  <PayPalScriptProvider options={PAYPAL_CONFIG}>
                    <PayPalButtons
                      style={{ 
                        layout: "vertical",
                        color: "blue",
                        shape: "pill",
                        label: "paypal",
                        height: 50
                      }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{
                            description: `${items.map(i => i.name).join(', ')}`,
                            amount: {
                              value: finalTotal.toFixed(2),
                              breakdown: {
                                item_total: {
                                  value: finalTotal.toFixed(2),
                                  currency_code: "USD"
                                }
                              }
                            },
                            items: items.map(item => ({
                              name: item.name,
                              description: `${item.shade}, ${item.length}`,
                              quantity: item.quantity?.toString() || "1",
                              unit_amount: {
                                value: item.price.toFixed(2),
                                currency_code: "USD"
                              }
                            }))
                          }]
                        });
                      }}
                      onApprove={(data, actions) => {
                        setIsProcessing(true);
                        return actions.order!.capture().then((details) => {
                          handlePayPalSuccess(details);
                        });
                      }}
                      onError={(err) => {
                        handlePayPalError(err);
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                          if (value.length <= 19) {
                            setFormData({ ...formData, cardNumber: value });
                          }
                        }}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                          errors.cardNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                        maxLength={19}
                        required
                      />
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
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                            if (value.length <= 5) {
                              setFormData({ ...formData, expiryDate: value });
                            }
                          }}
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
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              setFormData({ ...formData, cvv: value });
                            }
                          }}
                          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                            errors.cvv ? 'border-red-500' : 'border-gray-200'
                          }`}
                          maxLength={4}
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
            )}

            {/* Security Footer */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-600 bg-green-50 p-3 rounded-lg">
                <Shield size={14} className="text-green-600" />
                <span>Your payment information is encrypted and secure</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Demo Mode: Use test card 4242 4242 4242 4242 for testing</p>
                <p>Replace API keys in PaymentModal.tsx with your actual credentials</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;