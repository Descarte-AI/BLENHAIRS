import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, CreditCard, Play } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/collection/afro-kinky-bulk');
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate('/collection/afro-kinky-bulk');
  };

const categories = [
  {
    id: 'hair-extensions',
    name: 'Afro Kinky Bulk',
    description: 'Premium quality hair extensions for length and volume',
    image: '/IMG-20250629-WA0189.jpg',
    productCount: 25,
    popular: true
  },
  {
    id: 'afro-kinky-bulk',
    name: 'Afro Kinky Bulk',
    description: 'Natural textured bulk hair for braiding and styling',
    image: '/IMG-20250629-WA0197.jpg',
    productCount: 18,
    popular: true
  },
  {
    id: 'v-part-wig',
    name: 'Afro Kinky Bulk',
    description: 'Easy-to-wear V part wigs for instant transformation',
    image: '/IMG-20250629-WA0185.jpg',
    productCount: 12
  },
  {
    id: 'spring-twist',
    name: 'Afro Kinky Bulk',
    description: 'Bouncy spring twist hair for protective styling',
    image: '/IMG-20250629-WA0200.jpg',
    productCount: 15,
    popular: true
  },
  {
    id: 'clip-ins',
    name: 'Afro Kinky Bulk',
    description: 'Temporary clip-in extensions for instant length',
    image: '/IMG-20250629-WA0193.jpg',
    productCount: 20
  },
  {
    id: 'bulk-braiding-hair',
    name: 'Afro Kinky Bulk',
    description: 'High-quality bulk hair perfect for braiding',
    image: '/IMG-20250629-WA0180.jpg',
    productCount: 22
  },
  {
    id: 'crochet-hair',
    name: 'Afro Kinky Bulk',
    description: 'Pre-styled crochet hair for quick installation',
    image: '/WhatsApp Image 2025-06-29 at 14.09.11_581cec0e.jpg',
    productCount: 16
  },
  {
    id: 'lace-wigs',
    name: 'Afro Kinky Bulk',
    description: 'Natural-looking lace front and full lace wigs',
    image: '/IMG-20250629-WA0168.jpg',
    productCount: 14
  }
];

  return (
    <>
      {/* Main Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/IMG-20250629-WA0197.jpg"
            alt="Premium Afro Kinky Bulk Hair"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          {/* Special Offer Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-8 rounded-full inline-block mb-8 shadow-2xl animate-pulse">
            <span className="font-bold text-lg">🔥 30% OFF FIRST ORDER + FREE SHIPPING</span>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8 text-white/90">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="text-yellow-400" size={18} />
              <span className="font-semibold">4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Shield className="text-green-400" size={18} />
              <span className="font-semibold">100% Human Hair</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Truck className="text-blue-400" size={18} />
              <span className="font-semibold">Free Worldwide Shipping</span>
            </div>
          </div>

          <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight">
            Premium Afro Kinky
            <span className="block text-yellow-300 mt-2">
              Bulk Hair
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-4xl mx-auto leading-relaxed">
            100% Human Hair • Perfect for Braiding & Dreadlocks • Multiple Colors & Lengths Available
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button 
              onClick={handleShopNow}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-3 shadow-2xl"
            >
              <span>Shop Collection - Save 30%</span>
              <ArrowRight size={28} />
            </button>
            <button 
              onClick={handleShopNow}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-2xl flex items-center justify-center space-x-3"
            >
              <span>View Afro Kinky Collection</span>
              <ArrowRight size={28} />
            </button>
          </div>

          {/* Payment Options */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-white font-semibold mb-4 text-lg">Secure Payment Options:</p>
            <div className="flex justify-center items-center space-x-8">
              <div className="flex items-center space-x-2 text-white">
                <CreditCard size={24} />
                <span className="font-semibold">Credit Cards</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                </svg>
                <span className="font-semibold">PayPal</span>
              </div>
            </div>
          </div>

          {/* Customer Proof */}
          <div className="text-white/90 text-center">
            <p className="text-xl mb-4 font-semibold">
              Trusted by 15,000+ customers worldwide
            </p>
            <div className="flex justify-center items-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-yellow-400 fill-current" />
              ))}
              <span className="ml-3 font-semibold text-lg">
                Based on 3,247 verified reviews
              </span>
            </div>
          </div>
        </div>
      </section>

    

      {/* Before & After Gallery */}
     <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <p className="font-lato text-xl text-gray-700 max-w-3xl mx-auto">
            Discover our complete range of premium hair products designed for every style and occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                {category.popular && (
                  <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    Popular
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-cormorant text-xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white/90 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">
                      {category.productCount} products
                    </span>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    
    </>
  );
};

export default Hero;