import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus, Check, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import PaymentModal from './PaymentModal';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedLength, setSelectedLength] = useState('');
  const [selectedPacks, setSelectedPacks] = useState(1);

  // Find the product by ID
  const product = products.find(p => p.id === id);

  // Available options
  const availableColors = [
    { key: 'natural-black', name: 'Natural Black', color: '#1a1a1a' },
    { key: 'dark-brown', name: 'Dark Brown', color: '#3d2914' },
    { key: 'medium-brown', name: 'Medium Brown', color: '#8b4513' }
  ];

  const availableLengths = ['14"', '16"', '18"', '20"', '22"', '24"'];

  const packOptions = [
    { count: 1, discount: 0, savings: 0 },
    { count: 2, discount: 5, savings: 2.5 },
    { count: 3, discount: 15, savings: 5 },
    { count: 4, discount: 30, savings: 7.5 }
  ];

  // Initialize selections with product defaults
  useEffect(() => {
    if (product) {
      // Extract color from product name or use default
      const colorFromName = product.name.toLowerCase().includes('natural black') ? 'natural-black' :
                           product.name.toLowerCase().includes('dark brown') ? 'dark-brown' :
                           product.name.toLowerCase().includes('medium brown') ? 'medium-brown' : 'natural-black';
      
      // Extract length from product name or use default
      const lengthMatch = product.name.match(/(\d+)"/);
      const lengthFromName = lengthMatch ? `${lengthMatch[1]}"` : '18"';
      
      setSelectedColor(colorFromName);
      setSelectedLength(lengthFromName);
      setSelectedPacks(1);
      setCurrentImageIndex(0);
      setQuantity(1);
      setActiveTab('description');
    }
  }, [product]);

  // Calculate current product based on selections
  const getCurrentProduct = () => {
    if (!product) return null;
    
    const colorName = availableColors.find(c => c.key === selectedColor)?.name || 'Natural Black';
    const targetId = `afro-kinky-${selectedColor}-${selectedLength.replace('"', '')}`;
    
    // Try to find exact match first
    const exactMatch = products.find(p => p.id === targetId);
    if (exactMatch) return exactMatch;
    
    // If no exact match, create a variant based on the original product
    return {
      ...product,
      id: targetId,
      name: `Afro Kinky Bulk Hair - ${colorName} ${selectedLength}`,
      color: colorName,
      length: selectedLength,
      images: product.images // Use original images for now
    };
  };

  const currentProduct = getCurrentProduct();

  // Calculate pricing
  const calculatePrice = () => {
    if (!currentProduct) return { basePrice: 0, totalPrice: 0, savings: 0, pricePerPack: 0 };
    
    const basePrice = currentProduct.price;
    const packOption = packOptions.find(p => p.count === selectedPacks) || packOptions[0];
    const totalBeforeDiscount = basePrice * selectedPacks * quantity;
    const totalDiscount = packOption.discount * quantity;
    const totalPrice = totalBeforeDiscount - totalDiscount;
    const pricePerPack = (basePrice * selectedPacks - packOption.discount) / selectedPacks;
    
    return {
      basePrice,
      totalPrice,
      savings: totalDiscount,
      pricePerPack
    };
  };

  const pricing = calculatePrice();

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (currentProduct) {
      const cartItem = {
        ...currentProduct,
        name: `${currentProduct.name} (${selectedPacks} Pack${selectedPacks > 1 ? 's' : ''})`,
        price: pricing.pricePerPack,
        selectedColor,
        selectedLength,
        selectedPacks
      };
      
      addToCart(cartItem, quantity * selectedPacks);
    }
  };

  const nextImage = () => {
    if (currentProduct) {
      setCurrentImageIndex((prev) => (prev + 1) % currentProduct.images.length);
    }
  };

  const prevImage = () => {
    if (currentProduct) {
      setCurrentImageIndex((prev) => (prev - 1 + currentProduct.images.length) % currentProduct.images.length);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimilarProductClick = (productId: string) => {
    scrollToTop();
    setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 100);
  };

  const handleBreadcrumbClick = () => {
    scrollToTop();
    setTimeout(() => {
      navigate('/', { state: { scrollTo: 'afro-kinky-collection' } });
    }, 100);
  };

  // Get similar products (same color family)
  const similarProducts = products.filter(p => 
    p.id !== currentProduct?.id && 
    p.name.toLowerCase().includes(selectedColor.replace('-', ' '))
  ).slice(0, 4);

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'features', label: 'Features' },
    { id: 'installation', label: 'Installation Guide' },
    { id: 'care', label: 'Care Instructions' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-purple-600 transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={handleBreadcrumbClick}
              className="hover:text-purple-600 transition-colors"
            >
              Afro Kinky Bulk
            </button>
            <span>/</span>
            <span className="text-gray-900">{currentProduct?.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => {
            scrollToTop();
            setTimeout(() => navigate(-1), 100);
          }}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
              <img
                src={currentProduct?.images[currentImageIndex]}
                alt={currentProduct?.name}
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Image Navigation */}
              {currentProduct && currentProduct.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {currentProduct.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {currentProduct && currentProduct.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {currentProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'border-purple-500 shadow-lg' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentProduct?.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                  <span className="text-gray-600 ml-2">(128 reviews)</span>
                </div>
                <span className="text-green-600 font-semibold">In Stock</span>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex space-x-3">
                {availableColors.map((color) => (
                  <button
                    key={color.key}
                    onClick={() => setSelectedColor(color.key)}
                    className={`relative w-12 h-12 rounded-full border-4 transition-all duration-300 ${
                      selectedColor === color.key 
                        ? 'border-purple-500 shadow-lg scale-110' 
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  >
                    {selectedColor === color.key && (
                      <Check size={16} className="absolute inset-0 m-auto text-white" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Selected: {availableColors.find(c => c.key === selectedColor)?.name}
              </p>
            </div>

            {/* Length Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Length</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableLengths.map((length) => (
                  <button
                    key={length}
                    onClick={() => setSelectedLength(length)}
                    className={`py-2 px-4 rounded-lg border-2 font-medium transition-all duration-300 ${
                      selectedLength === length
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>

            {/* Pack Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Number of Packs</h3>
              <div className="grid grid-cols-2 gap-3">
                {packOptions.map((option) => (
                  <button
                    key={option.count}
                    onClick={() => setSelectedPacks(option.count)}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedPacks === option.count
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-lg">{option.count} Pack{option.count > 1 ? 's' : ''}</div>
                      {option.savings > 0 && (
                        <div className="text-green-600 text-sm font-medium">
                          Save ${option.savings.toFixed(2)} per pack
                        </div>
                      )}
                      {option.discount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          -${option.discount}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price per pack:</span>
                  <span className="font-semibold">${pricing.pricePerPack.toFixed(2)}</span>
                </div>
                {pricing.savings > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Bundle savings:</span>
                    <span className="font-semibold">-${pricing.savings.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-purple-600">${pricing.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-gray-600">
                  Total packs: {quantity * selectedPacks}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart - ${(pricing.totalPrice * quantity).toFixed(2)}</span>
              </button>
              
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Buy Now - ${(pricing.totalPrice * quantity).toFixed(2)}
              </button>

              <div className="flex space-x-4">
                <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Heart size={20} />
                  <span>Wishlist</span>
                </button>
                <button className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="mx-auto mb-2 text-green-600" size={24} />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over $50</p>
              </div>
              <div className="text-center">
                <RotateCcw className="mx-auto mb-2 text-blue-600" size={24} />
                <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-600">30-day policy</p>
              </div>
              <div className="text-center">
                <Shield className="mx-auto mb-2 text-purple-600" size={24} />
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-600">SSL protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
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
                <p className="text-gray-700 leading-relaxed">
                  Our premium Afro Kinky Bulk Hair is perfect for creating natural-looking protective styles. 
                  Made from 100% human hair, this bulk hair offers exceptional quality and versatility for 
                  braiding, twisting, and loc extensions.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>• 100% Human Hair</li>
                  <li>• Natural Afro Kinky Texture</li>
                  <li>• Perfect for Braiding and Twisting</li>
                  <li>• Can be Colored and Styled</li>
                  <li>• Long-lasting and Durable</li>
                </ul>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <Check className="text-green-500 mt-1" size={16} />
                      <span>100% Virgin Human Hair</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="text-green-500 mt-1" size={16} />
                      <span>Natural Afro Kinky Texture</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="text-green-500 mt-1" size={16} />
                      <span>Tangle-Free and Minimal Shedding</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Check className="text-green-500 mt-1" size={16} />
                      <span>Can be Washed and Conditioned</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hair Type:</span>
                      <span>100% Human Hair</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Texture:</span>
                      <span>Afro Kinky</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span>100g per pack</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span>Brazilian</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'installation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Installation Guide</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
                      <div>
                        <h4 className="font-medium">Prepare Your Natural Hair</h4>
                        <p className="text-gray-600">Wash and condition your hair. Detangle thoroughly and let it dry completely.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
                      <div>
                        <h4 className="font-medium">Section Your Hair</h4>
                        <p className="text-gray-600">Create clean parts and sections for even distribution of the bulk hair.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
                      <div>
                        <h4 className="font-medium">Begin Installation</h4>
                        <p className="text-gray-600">Start braiding or twisting from the root, incorporating the bulk hair gradually.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Professional Installation Video</h4>
                  <p className="text-gray-600 mb-4">Watch our step-by-step tutorial for best results.</p>
                  <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Video Tutorial Coming Soon</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">Do's</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-2">
                          <Check className="text-green-500 mt-1" size={16} />
                          <span>Wash with sulfate-free shampoo</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="text-green-500 mt-1" size={16} />
                          <span>Use leave-in conditioner regularly</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="text-green-500 mt-1" size={16} />
                          <span>Sleep with a silk or satin scarf</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="text-green-500 mt-1" size={16} />
                          <span>Moisturize regularly with natural oils</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 text-red-600">Don'ts</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">✗</span>
                          <span>Don't use harsh chemicals</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">✗</span>
                          <span>Avoid excessive heat styling</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">✗</span>
                          <span>Don't brush when wet</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-red-500 mt-1">✗</span>
                          <span>Avoid sleeping on cotton pillowcases</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Write a Review
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">4.8</div>
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="text-gray-600">Based on 128 reviews</div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-4">
                    {[
                      { name: "Sarah M.", rating: 5, review: "Amazing quality! The texture is perfect and it blends beautifully with my natural hair." },
                      { name: "Jessica L.", rating: 5, review: "I've been using this for months and it still looks great. Highly recommend!" },
                      { name: "Maria R.", rating: 4, review: "Good quality hair, easy to work with. Will definitely order again." }
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{review.name}</div>
                          <div className="flex items-center space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={16} className="text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-purple-600 font-bold mb-3">${product.price}</p>
                    <button
                      onClick={() => handleSimilarProductClick(product.id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
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

      {/* Payment Modal */}
      {isPaymentModalOpen && currentProduct && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          product={{
            ...currentProduct,
            price: pricing.totalPrice * quantity,
            color: availableColors.find(c => c.key === selectedColor)?.name || currentProduct.color,
            length: selectedLength
          }}
          quantity={quantity * selectedPacks}
        />
      )}
    </div>
  );
};

export default ProductPage;