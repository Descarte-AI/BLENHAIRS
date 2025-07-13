import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  product: {
    id: number;
    name: string;
    shade: string;
    length: string;
  };
  onPaymentSuccess: (details: any) => void;
  onPaymentError: (error: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ 
  amount, 
  product,
  onPaymentSuccess,
  onPaymentError
}) => {
  const paypalClientId = import.meta.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 
                        'AWtYvGQjF5-6w1HlYQ3hJ5Z4mX3q4K9XxY7WbV9cC0dE1fA2B3C4D5E6F'; // Fallback sandbox ID

  return (
    <div className="paypal-button-container">
      <PayPalScriptProvider options={{ 
        "client-id": paypalClientId,
        currency: "USD",
        intent: "capture",
      }}>
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "blue",
            shape: "pill",
            label: "paypal",
            height: 55
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                description: `${product.name} (${product.shade}, ${product.length})`,
                amount: {
                  value: amount.toString(),
                  breakdown: {
                    item_total: {
                      value: amount.toString(),
                      currency_code: "USD"
                    }
                  }
                },
                items: [{
                  name: product.name,
                  description: `${product.shade}, ${product.length}`,
                  quantity: "1",
                  unit_amount: {
                    value: amount.toString(),
                    currency_code: "USD"
                  }
                }]
              }]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order!.capture().then((details) => {
              onPaymentSuccess(details);
            });
          }}
          onError={(err) => {
            onPaymentError(err);
            console.error("PayPal error:", err);
          }}
        />
      </PayPalScriptProvider>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 font-semibold">
          Secure payment powered by PayPal
        </p>
      </div>
      
      {/* PayPal Credit Option */}
      <div className="paypal-credit-container mt-3">
        <PayPalButtons
          fundingSource="paylater"
          style={{ 
            layout: "vertical",
            color: "silver",
            shape: "pill",
            label: "paylater",
            height: 55
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount.toString()
                }
              }]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order!.capture().then((details) => {
              onPaymentSuccess(details);
            });
          }}
          onError={(err) => {
            onPaymentError(err);
            console.error("PayPal Credit error:", err);
          }}
        />
      </div>
    </div>
  );
};

export default PayPalButton;