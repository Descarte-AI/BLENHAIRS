// Email service for order notifications
// This is a mock implementation - replace with your actual email service

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  products: Array<{
    name: string;
    color: string;
    length: string;
    packs: number;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  orderDate: string;
}

export const sendOrderNotificationEmail = async (orderDetails: OrderDetails) => {
  // Mock email service - replace with actual implementation
  // You can use services like EmailJS, SendGrid, or your own backend API
  
  const emailContent = {
    to: "orders@blenhairs.com", // Your business email
    subject: `New Order #${orderDetails.orderId} - Blen Hairs`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #8B4513; padding-bottom: 10px;">
          New Order Received - #${orderDetails.orderId}
        </h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B4513; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${orderDetails.customerName}</p>
          <p><strong>Email:</strong> ${orderDetails.customerEmail}</p>
          ${orderDetails.customerPhone ? `<p><strong>Phone:</strong> ${orderDetails.customerPhone}</p>` : ''}
          <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleDateString()}</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B4513; margin-top: 0;">Shipping Address</h3>
          <p>
            ${orderDetails.shippingAddress.street}<br>
            ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state} ${orderDetails.shippingAddress.zipCode}<br>
            ${orderDetails.shippingAddress.country}
          </p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #8B4513; margin-top: 0;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #8B4513; color: white;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Specs</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.products.map(product => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px;">${product.name}</td>
                  <td style="padding: 10px; text-align: center;">
                    ${product.color}<br>
                    ${product.length}<br>
                    ${product.packs} Pack${product.packs > 1 ? 's' : ''}
                  </td>
                  <td style="padding: 10px; text-align: center;">${product.quantity}</td>
                  <td style="padding: 10px; text-align: right;">$${product.price.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px; padding-top: 20px; border-top: 2px solid #8B4513;">
            <h3 style="color: #8B4513;">Total: $${orderDetails.total.toFixed(2)}</h3>
            <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
          </div>
        </div>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #2d5a2d;">
            <strong>Action Required:</strong> Please process this order and prepare for shipment.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">
            This is an automated notification from Blen Hairs order system.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    // Mock API call - replace with your actual email service
    console.log('Sending order notification email:', emailContent);
    
    // Example with EmailJS (uncomment and configure if using EmailJS)
    /*
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'your_service_id',
        template_id: 'your_template_id',
        user_id: 'your_user_id',
        template_params: emailContent
      })
    });
    */
    
    // For now, just log success
    console.log('Order notification email sent successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Failed to send order notification email:', error);
    return { success: false, error };
  }
};

export const sendCustomerConfirmationEmail = async (orderDetails: OrderDetails) => {
  // Send confirmation email to customer
  const emailContent = {
    to: orderDetails.customerEmail,
    subject: `Order Confirmation #${orderDetails.orderId} - Blen Hairs`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B4513, #A0522D); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Thank You for Your Order!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Order #${orderDetails.orderId}</p>
        </div>
        
        <div style="padding: 30px; background: white; border: 1px solid #ddd; border-top: none;">
          <p style="font-size: 16px; color: #333;">
            Hi ${orderDetails.customerName},
          </p>
          <p style="font-size: 16px; color: #333;">
            Thank you for choosing Blen Hairs! We've received your order and are preparing it for shipment.
          </p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #8B4513; margin-top: 0;">Order Summary</h3>
            ${orderDetails.products.map(product => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <strong>${product.name}</strong><br>
                <span style="color: #666;">
                  ${product.color} • ${product.length} • ${product.packs} Pack${product.packs > 1 ? 's' : ''} • Qty: ${product.quantity}
                </span>
                <span style="float: right; font-weight: bold;">$${product.price.toFixed(2)}</span>
              </div>
            `).join('')}
            <div style="padding-top: 15px; text-align: right;">
              <h3 style="color: #8B4513; margin: 0;">Total: $${orderDetails.total.toFixed(2)}</h3>
            </div>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2d5a2d; margin-top: 0;">What's Next?</h4>
            <ul style="color: #2d5a2d; margin: 0; padding-left: 20px;">
              <li>We'll process your order within 24 hours</li>
              <li>You'll receive a tracking number via email</li>
              <li>Free worldwide shipping included</li>
              <li>Expected delivery: 5-7 business days</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://wa.me/+1234567890" style="background: #25D366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Contact us on WhatsApp
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            Questions? Reply to this email or contact us on WhatsApp for instant support.
          </p>
        </div>
      </div>
    `
  };
  
  try {
    console.log('Sending customer confirmation email:', emailContent);
    return { success: true };
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    return { success: false, error };
  }
};