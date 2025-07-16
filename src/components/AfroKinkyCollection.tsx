import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { getAllProducts } from '../data/products';

const AfroKinkyCollection = () => {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});

  const products = getAllProducts();

  const handleProductClick = (productId: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 100);
  };

  const handleMouseEnter = (productId: string) => {
    setHoveredProduct(productId);
    // Start image carousel for products with multiple images
    const product = products.find(p => p.id === productId);
    if (product && product.images.length > 1) {
      let imageIndex = 0;
      const interval = setInterval(() => {
        imageIndex = (imageIndex + 1) % product.images.length;
        setCurrentImageIndex(prev => ({ ...prev, [productId]: imageIndex }));
      }, 1000);
      
      // Store interval ID to clear it later
      (window as any)[`interval_${productId}`] = interval;
    }
  };

  const handleMouseLeave = (productId: string) => {
    setHoveredProduct(null);
    // Clear image carousel interval
    const interval = (window as any)[`interval_${productId}`];
    if (interval) {
      clearInterval(interval);
      delete (window as any)[`interval_${productId}`];
    }
    // Reset to first image
    setCurrentImageIndex(prev => ({ ...prev, [productId]: 0 }));
  };

  const getCurrentImage = (product: any) => {
    const index = currentImageIndex[product.id] || 0;
    return product.images[index] || product.image;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Afro Kinky Bulk Collection
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Premium 100% human hair extensions perfect for braiding, dreadlocks, and protective styling
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              onMouseEnter={() => handleMouseEnter(product.id)}
              onMouseLeave={() => handleMouseLeave(product.id)}
            >
              <div className="relative h-80 overflow-hidden">
                {/* Product Image */}
                <img
                  src={getCurrentImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.popular && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Popular
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save ${product.originalPrice - product.price}
                    </div>
                  )}
                </div>

                {/* Image Indicators for Carousel */}
                {product.images.length > 1 && hoveredProduct === product.id && (
                  <div className="absolute top-4 right-4 flex space-x-1">
                    {product.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === (currentImageIndex[product.id] || 0)
                            ? 'bg-white'
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Quick View Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button
                    onClick={() => handleProductClick(product.id)}
                    className="w-full bg-white text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-xl"
                  >
                    <Eye size={18} />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                
                {/* Product Name */}
                <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">
                  {product.name}
                </h3>
                
                {/* Color and Length */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: product.colorCode }}
                    ></div>
                    <span className="text-sm text-gray-600">{product.color}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{product.length}</span>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-2xl text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-lg">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <div className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-sm font-bold">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>

                {/* View Product Button */}
                <button
                  onClick={() => handleProductClick(product.id)}
                  className="w-full mt-4 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need Help Choosing the Perfect Hair?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our hair experts are here to help you find the perfect match for your style and needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/+1234567890?text=Hi! I need help choosing the perfect Afro Kinky Bulk hair for my style."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-colors duration-300"
              >
                Chat on WhatsApp
              </a>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-bold transition-colors duration-300">
                View Size Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AfroKinkyCollection;