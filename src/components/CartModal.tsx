import React from 'react';
import { X, Plus, Minus, Trash2, CreditCard, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PaymentModal from './PaymentModal';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showPayment, setShowPayment] = React.useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setShowPayment(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="font-cormorant text-2xl font-bold text-charcoal">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="bg-rose-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-gold/90 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-charcoal">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.shade} • {item.length}</p>
                      <p className="font-bold text-rose-gold">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-charcoal">Total:</span>
                <span className="text-2xl font-bold text-rose-gold">${total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-rose-gold text-white py-4 rounded-lg font-bold text-lg hover:bg-rose-gold/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>Secure Checkout</span>
                </button>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Shield size={16} />
                  <span>SSL Encrypted • 30-Day Returns • Free US Shipping</span>
                </div>
                
                <button
                  onClick={clearCart}
                  className="w-full text-gray-600 hover:text-red-500 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        total={total}
        items={items}
      />
    </>
  );
};

export default CartModal;