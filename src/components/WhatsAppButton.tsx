import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = "+1234567890"; // Replace with your actual WhatsApp number
  const message = encodeURIComponent(
    "Hi! I'm interested in your Afro Kinky Bulk Hair products. Can you help me with more information?"
  );
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={24} />
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Chat with us on WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-gray-900 rounded-full animate-ping opacity-20"></div>
    </a>
  );
};

export default WhatsAppButton;