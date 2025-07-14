import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw, CreditCard, Plus, Minus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProductById, getSimilarProducts } from '../data/products';
import PaymentModal from './PaymentModal';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [selectedPacks, setSelectedPacks] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Scroll to top when component mounts or product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Reset states when product changes
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    if (product) {
      setSelectedColor(product.color.toLowerCase().replace(' ', '-'));
      setSelectedLength(product.length);
      setSelectedPacks(1);
    }
    setActiveTab('description');
  }, [id, product]);

  const product = getProductById(id || '');

  // Available options
  const availableColors = [
    { key: 'natural-black', name: 'Natural Black', colorCode: '#1B1B1B' },
    { key: 'dark-brown', name: 'Dark Brown', colorCode: '#3C2415' },
    { key: 'medium-brown', name: 'Medium Brown', colorCode: '#8B4513' }
  ];

  const availableLengths = ['14"', '16"', '18"', '20"', '22"', '24"'];

  const packOptions = [
    { value: 1, label: '1 Pack', discount: 0, savings: 0 },
    { value: 2, label: '2 Packs', discount: 5, savings: 5 },
    { value: 3, label: '3 Packs', discount: 15, savings: 15 },
    { value: 4, label: '4 Packs', discount: 30, savings: 30 }
  ];

  // Get current product based on selections
  const getCurrentProduct = () => {
    if (!product) return null;
    
    // Try to find product with selected color and length
    const colorKey = selectedColor;
    const length = selectedLength;
    
    // Get products of selected color
    const colorProducts = afroKinkyProducts[colorKey as keyof typeof afroKinkyProducts];
    if (colorProducts) {
      const foundProduct = colorProducts.find(p => p.length === length);
      if (foundProduct) return foundProduct;
    }
    
    // Fallback to original product
    return product;
  };

  const currentProduct = getCurrentProduct() || product;

  // Calculate pricing
  const basePrice = currentProduct?.price || 0;
  const selectedPackOption = packOptions.find(p => p.value === selectedPacks) || packOptions[0];
  const packDiscount = selectedPackOption.discount;
  const pricePerPack = Math.max(0, basePrice - (packDiscount / selectedPacks));
  const totalPrice = pricePerPack * selectedPacks * quantity;
  const totalSavings = (basePrice * selectedPacks * quantity) - totalPrice;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or may have been removed.
          </p>
          <button 
            onClick={() => navigate('/collection/afro-kinky-bulk')}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  const similarProducts = getSimilarProducts(product.id, 4);

  const handleAddToCart = () => {
    const selectedColorName = availableColors.find(c => c.key === selectedColor)?.name || currentProduct?.color || '';
    
    addToCart({
      id: currentProduct?.id || product.id,
      name: `${currentProduct?.name || product.name} (${selectedPacks} ${selectedPacks === 1 ? 'Pack' : 'Packs'})`,
      price: pricePerPack,
      image: currentProduct?.image || product.image,
      shade: selectedColorName,
      length: selectedLength,
      quantity: quantity * selectedPacks
    });
    
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in';
    successDiv.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      <span>Added to cart!</span>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setShowPayment(true);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-sm">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => navigate('/collection/afro-kinky-bulk'), 100);
                }}
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-1 font-medium transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Back to Collection</span>
              </button>
              <span className="text-gray-400">/</span>
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => navigate('/collection/afro-kinky-bulk'), 100);
                }}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Afro Kinky Bulk
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold truncate">{product.color} {product.length}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
                />
                
                {/* Image Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index 
                        ? 'border-gray-900 shadow-lg scale-105' 
                        : 'border-gray-200 hover:border-gray-400 hover:scale-102'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-lg text-gray-600">
                    {product.color} • {product.length} • {product.weight}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Heart size={24} />
                  </button>
                  <button className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className={
                      i < Math.floor(product.rating) 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    } />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold text-lg">
                  {product.rating} ({product.reviews} reviews)
                </span>
                {product.popular && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                    Popular Choice
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <div className="flex flex-col">
                      <span className="text-gray-400 line-through text-xl">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-green-600 font-bold text-sm">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Truck size={16} />
                    <span className="font-medium">Free worldwide shipping</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Shield size={16} />
                    <span className="font-medium">30-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-600">
                    <RotateCcw size={16} />
                    <span className="font-medium">Quality guarantee</span>
                  </div>
                </div>
              </div>

              {/* Product Specifications */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: product.colorCode }}
                    ></div>
                    <div>
                      <span className="text-sm text-gray-600">Color:</span>
                      <p className="font-semibold text-gray-900">{product.color}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Length:</span>
                    <p className="font-semibold text-gray-900">{product.length}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Texture:</span>
                    <p className="font-semibold text-gray-900">{product.texture}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Weight:</span>
                    <p className="font-semibold text-gray-900">{product.weight}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Material:</span>
                    <p className="font-semibold text-gray-900">100% Human Hair</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Quality:</span>
                    <p className="font-semibold text-gray-900">Premium Grade</p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Quantity</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors rounded-l-xl"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-3 font-bold text-lg min-w-[4rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors rounded-r-xl"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p className="font-bold text-2xl text-gray-900">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-green-800">In Stock & Ready to Ship</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Estimated Delivery</p>
                      <p className="font-bold text-gray-900">3-5 Business Days</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-gray-300 hover:border-gray-400 transform hover:scale-[1.02]"
                >
                  <ShoppingBag size={20} />
                  <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <CreditCard size={20} />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                  <Shield className="text-blue-600 mx-auto mb-2" size={24} />
                  <p className="font-bold text-gray-900 text-sm">30-Day</p>
                  <p className="text-gray-600 text-xs">Money Back</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                  <Truck className="text-green-600 mx-auto mb-2" size={24} />
                  <p className="font-bold text-gray-900 text-sm">Free</p>
                  <p className="text-gray-600 text-xs">Shipping</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { key: 'description', label: 'Description' },
                  { key: 'features', label: 'Features' },
                  { key: 'installation', label: 'How to Install' },
                  { key: 'care', label: 'Care Instructions' },
                  { key: 'reviews', label: 'Reviews' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 border-b-2 font-semibold text-lg transition-colors ${
                      activeTab === tab.key
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">
                      {product.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Perfect For:</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Protective braiding styles</li>
                          <li>• Dreadlock installations</li>
                          <li>• Twist outs and braid outs</li>
                          <li>• Natural hair blending</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">Key Benefits:</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• 100% human hair quality</li>
                          <li>• Natural texture and movement</li>
                          <li>• Long-lasting durability</li>
                          <li>• Easy to style and maintain</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-xl">
                        <Check className="text-green-600 flex-shrink-0" size={20} />
                        <span className="text-gray-700 text-lg">{feature}</span>
                      </div>
                    )) || [
                      '100% Premium Human Hair',
                      'Natural Afro Kinky Texture',
                      'Perfect for Braiding & Dreadlocks',
                      'Heat Resistant up to 350°F',
                      'Chemical Free Processing',
                      'Long Lasting Durability',
                      'Tangle Free',
                      'Natural Movement'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-xl">
                        <Check className="text-green-600 flex-shrink-0" size={20} />
                        <span className="text-gray-700 text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'installation' && (
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Easy Installation Guide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 mb-8">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white text-center">
                          <h4 className="text-2xl font-bold mb-4">Professional Installation Video</h4>
                          <p className="text-gray-200 mb-6">Watch our step-by-step guide for perfect results</p>
                          <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
                            <div className="aspect-video">
                              <iframe
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&modestbranding=1&rel=0"
                                title="How to Install Afro Kinky Bulk Hair - Professional Guide"
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          </div>
                        </div>
                      </div>
                      {[
                        {
                          step: 1,
                          title: 'Prepare Your Hair',
                          description: 'Wash and condition your natural hair thoroughly. Let it dry completely before installation. Section your hair into clean parts.',
                          image: product.images[0]
                        },
                        {
                          step: 2,
                          title: 'Section and Part',
                          description: 'Create clean, even sections where you want to install the extensions. Use a rat-tail comb for precise parting.',
                          image: product.images[1] || product.images[0]
                        },
                        {
                          step: 3,
                          title: 'Begin Braiding',
                          description: 'Start braiding the bulk hair into your natural hair using your preferred braiding technique. Keep tension even.',
                          image: product.images[2] || product.images[0]
                        },
                        {
                          step: 4,
                          title: 'Secure and Style',
                          description: 'Secure the ends properly and style as desired. Your new protective style is ready to wear!',
                          image: product.images[3] || product.images[0]
                        }
                      ].map((step) => (
                        <div key={step.step} className="bg-white rounded-2xl p-6 shadow-sm">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                              {step.step}
                            </div>
                            <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                          </div>
                          <img 
                            src={step.image} 
                            alt={step.title}
                            className="w-full h-40 object-cover rounded-xl mb-4"
                          />
                          <p className="text-gray-700 leading-relaxed">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Hair Care Instructions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      'Wash gently with sulfate-free shampoo',
                      'Use leave-in conditioner to maintain moisture',
                      'Sleep with a silk or satin scarf/pillowcase',
                      'Avoid excessive heat styling',
                      'Detangle gently when wet with wide-tooth comb',
                      'Deep condition weekly for best results',
                      'Store properly when not in use',
                      'Avoid harsh chemicals and bleaching'
                    ].map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-white p-4 rounded-xl">
                        <Check className="text-green-600 flex-shrink-0 mt-1" size={18} />
                        <span className="text-gray-700 text-lg">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={18} className={
                              i < Math.floor(product.rating) 
                                ? "text-yellow-400 fill-current" 
                                : "text-gray-300"
                            } />
                          ))}
                        </div>
                        <span className="font-semibold text-lg">{product.rating} out of 5</span>
                        <span className="text-gray-600">({product.reviews} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        {
                          name: "Sarah M.",
                          rating: 5,
                          date: "2 weeks ago",
                          review: "Amazing quality! The texture is perfect and it blends beautifully with my natural hair. Easy to braid and the color match is spot on.",
                          verified: true
                        },
                        {
                          name: "Jessica R.",
                          rating: 5,
                          date: "1 month ago",
                          review: "Best bulk hair I've ever purchased. Easy to work with and the color match is perfect. Will definitely order again!",
                          verified: true
                        },
                        {
                          name: "Amara K.",
                          rating: 4,
                          date: "3 weeks ago",
                          review: "Great quality hair, very soft and natural looking. Shipping was fast and packaging was excellent.",
                          verified: true
                        }
                      ].map((review, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{review.name}</div>
                                <div className="text-sm text-gray-600">{review.date}</div>
                              </div>
                              {review.verified && (
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                  Verified Purchase
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={14} className="text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.review}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <div key={similarProduct.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={similarProduct.image}
                        alt={similarProduct.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setTimeout(() => navigate(`/product/${similarProduct.id}`), 100);
                        }}
                      />
                      
                      {similarProduct.popular && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Popular
                        </div>
                      )}

                      <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
                        <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={
                            i < Math.floor(similarProduct.rating) 
                              ? "text-yellow-400 fill-current" 
                              : "text-gray-300"
                          } />
                        ))}
                        <span className="text-xs text-gray-600 ml-2">
                          {similarProduct.rating} ({similarProduct.reviews})
                        </span>
                      </div>
                      
                      <h3 
                        className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-700 transition-colors line-clamp-2"
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setTimeout(() => navigate(`/product/${similarProduct.id}`), 100);
                        }}
                      >
                        {similarProduct.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-gray-900">
                            ${similarProduct.price.toFixed(2)}
                          </span>
                          {similarProduct.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              ${similarProduct.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: similarProduct.colorCode }}
                          ></div>
                          <span className="text-sm text-gray-600">{similarProduct.length}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setTimeout(() => navigate(`/product/${similarProduct.id}`), 100);
                        }}
                        className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        total={product.price * quantity}
        items={[{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          shade: product.color,
          length: product.length,
          quantity: quantity,
        }]}
      />
    </>
  );
};

export default ProductPage;