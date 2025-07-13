import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2, CreditCard, Shield, Truck, Star, Lock, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PaymentModal from './PaymentModal';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showPayment, setShowPayment] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discount, setDiscount] = useState(0);

  const shipping = 0; // Free shipping
  const tax = total * 0.08;
  const subtotalWithDiscount = total - discount;
  const finalTotal = subtotalWithDiscount + shipping + tax;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome30') {
      setDiscount(total * 0.3);
      setAppliedPromo('WELCOME30 - 30% OFF');
      setPromoCode('');
    } else if (promoCode.toLowerCase() === 'save10') {
      setDiscount(10);
      setAppliedPromo('SAVE10 - $10 OFF');
      setPromoCode('');
    } else {
      alert('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setDiscount(0);
    setAppliedPromo('');
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard size={40} className="text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate('/collection/afro-kinky-bulk')}
              className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/collection/afro-kinky-bulk')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium">Continue Shopping</span>
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {items.reduce((sum, item) => sum + (item.quantity || 1), 0)} items
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span>Color: {item.shade}</span>
                            <span>Length: {item.length}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-600">Qty:</span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                  {item.quantity || 1}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  ${(item.price * (item.quantity || 1)).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  ${item.price} each
                                </div>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Truck className="text-green-600" size={32} />
                    <h3 className="font-semibold text-gray-900">Free Shipping</h3>
                    <p className="text-sm text-gray-600">On all orders worldwide</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Shield className="text-blue-600" size={32} />
                    <h3 className="font-semibold text-gray-900">30-Day Returns</h3>
                    <p className="text-sm text-gray-600">Easy return policy</p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Star className="text-yellow-500" size={32} />
                    <h3 className="font-semibold text-gray-900">4.9/5 Rating</h3>
                    <p className="text-sm text-gray-600">From verified customers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-6">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Promo Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Tag className="text-green-600" size={16} />
                          <span className="text-sm font-medium text-green-800">{appliedPromo}</span>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 mt-6"
                  >
                    <Lock size={20} />
                    <span>Secure Checkout</span>
                  </button>

                  {/* Payment Methods */}
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600 mb-3">We accept:</p>
                    <div className="flex justify-center items-center space-x-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <CreditCard size={20} />
                        <span className="text-sm font-medium">Cards</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                        </svg>
                        <span className="text-sm font-medium">PayPal</span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Shield size={16} />
                      <span className="text-sm">Your payment information is encrypted and secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        total={finalTotal}
        items={items}
      />
    </>
  );
};

export default CartPage;