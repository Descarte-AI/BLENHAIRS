import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus, Check, Truck, RotateCcw, Shield, Info, CreditCard, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { 
  getAllProducts, 
  getAvailableColors, 
  getAvailableLengths, 
  getPackOptions, 
  getPriceForLength,
  getColorMultiplier,
  calculateDiscountPercentage,
  getSimilarProducts
} from '../data/products';
import PaymentModal from './PaymentModal';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('natural-black');
  const [selectedLength, setSelectedLength] = useState('14"');
  const [selectedPack, setSelectedPack] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showColorGuide, setShowColorGuide] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    title: '',
    review: ''
  });

  // Find the product by ID
  const product = getAllProducts().find(p => p.id === id);

  // Available options
  const availableColors = getAvailableColors();
  const availableLengths = getAvailableLengths();
  const packOptions = getPackOptions();

  // Initialize selections with product defaults
  useEffect(() => {
    if (product) {
      // Extract color and length from product
      const colorKey = product.color.toLowerCase().replace(' ', '-');
      const length = product.length;
      
      setSelectedColor(colorKey);
      setSelectedLength(length);
      setSelectedPack(1);
      setCurrentImageIndex(0);
      setQuantity(1);
      setActiveTab('description');
    }
  }, [product]);

  // Calculate current product based on selections
  const getCurrentProduct = () => {
    if (!product) return null;
    
    // Try to find a product that matches the selected color and length
    const colorName = availableColors.find(c => c.key === selectedColor)?.name || 'Natural Black';
    const matchingProduct = getAllProducts().find(p => 
      p.color === colorName && p.length === selectedLength
    );
    
    if (matchingProduct) {
      return matchingProduct;
    }
    
    // If no exact match, create a variant based on the original product
    return {
      ...product,
      color: colorName,
      length: selectedLength,
      name: `${colorName} Afro Kinky Bulk Hair - ${selectedLength}`
    };
  };

  const currentProduct = getCurrentProduct();

  // Calculate pricing
  const calculatePrice = () => {
    if (!currentProduct) return { basePrice: 0, totalPrice: 0, savings: 0, pricePerPack: 0, originalPrice: 0, discountPercentage: 0 };
    
    const basePrice = getPriceForLength(selectedLength);
    const colorMultiplier = getColorMultiplier(selectedColor);
    const adjustedPrice = Math.round(basePrice * colorMultiplier);
    const originalPrice = adjustedPrice + 20; // Original price before discount
    
    const packOption = packOptions.find(p => p.count === selectedPack) || packOptions[0];
    const totalBeforeDiscount = adjustedPrice * selectedPack * quantity;
    const totalDiscount = packOption.discount * quantity;
    const totalPrice = totalBeforeDiscount - totalDiscount;
    const pricePerPack = (adjustedPrice * selectedPack - packOption.discount) / selectedPack;
    const discountPercentage = calculateDiscountPercentage(originalPrice, adjustedPrice);
    
    return {
      basePrice: adjustedPrice,
      originalPrice,
      totalPrice,
      savings: totalDiscount,
      pricePerPack,
      discountPercentage
    };
  };

  const pricing = calculatePrice();

  // Handle add to cart
  const handleAddToCart = () => {
    if (!currentProduct) return;
    
    const cartItem = {
      id: Date.now(), // Unique cart item ID
      name: `${currentProduct.name} (${selectedPack} Pack${selectedPack > 1 ? 's' : ''})`,
      price: pricing.pricePerPack,
      image: currentProduct.image,
      shade: currentProduct.color,
      length: selectedLength,
      quantity: quantity * selectedPack,
      selectedPacks: selectedPack
    };
    
    addToCart(cartItem);
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
    successDiv.innerHTML = `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      <span>Added to cart!</span>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    setIsPaymentModalOpen(true);
  };

  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the review to your backend
    console.log('Review submitted:', reviewForm);
    
    // Show success message
    alert('Thank you for your review! It will be published after moderation.');
    
    // Reset form and close modal
    setReviewForm({
      name: '',
      email: '',
      rating: 5,
      title: '',
      review: ''
    });
    setShowReviewModal(false);
  };

  // Get similar products
  const similarProducts = currentProduct ? getSimilarProducts(currentProduct) : [];

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/collection/afro-kinky-bulk')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </button>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => navigate('/collection/afro-kinky-bulk')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Afro Kinky Collection
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">{currentProduct?.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/collection/afro-kinky-bulk')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Collection</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={currentProduct?.images?.[currentImageIndex] || currentProduct?.image}
                  alt={currentProduct?.name}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                
                {/* Image Navigation */}
                {currentProduct?.images && currentProduct.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? currentProduct.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === currentProduct.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {currentProduct?.images && currentProduct.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {currentProduct.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {currentProduct?.images && currentProduct.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {currentProduct.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                        index === currentImageIndex ? 'ring-2 ring-gray-900' : ''
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${currentProduct.name} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Product Title & Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {currentProduct?.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={`${i < Math.floor(currentProduct?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="text-gray-600 ml-2">
                      {currentProduct?.rating} ({currentProduct?.reviews} reviews)
                    </span>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="text-gray-900 hover:text-gray-700 font-medium underline"
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-gray-900">
                      ${pricing.pricePerPack.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ${pricing.originalPrice}
                    </span>
                    <div className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-bold">
                      -{pricing.discountPercentage}%
                    </div>
                  </div>
                </div>
                
                {selectedPack > 1 && pricing.savings > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-green-800 font-semibold">
                      Bundle Savings: Save ${pricing.savings.toFixed(2)} total!
                    </p>
                  </div>
                )}
                
                <p className="text-gray-600">
                  or 4 payments of ${(pricing.pricePerPack / 4).toFixed(2)}
                </p>
              </div>

              {/* Color Selection */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-semibold text-gray-900">Color:</h3>
                  <span className="text-gray-600">{availableColors.find(c => c.key === selectedColor)?.name}</span>
                  <button
                    onClick={() => setShowColorGuide(true)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Info size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.key}
                      onClick={() => setSelectedColor(color.key)}
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all ${
                        selectedColor === color.key
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ 
                          background: color.colorCode.includes('gradient') 
                            ? color.colorCode 
                            : color.colorCode 
                        }}
                      ></div>
                      <span className="font-medium text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selection */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="font-semibold text-gray-900">Length:</h3>
                  <span className="text-gray-600">{selectedLength}</span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Info size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {availableLengths.map((length) => (
                    <button
                      key={length}
                      onClick={() => setSelectedLength(length)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all ${
                        selectedLength === length
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pack Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pack Size:</h3>
                <div className="space-y-3">
                  {packOptions.map((pack) => (
                    <button
                      key={pack.count}
                      onClick={() => setSelectedPack(pack.count)}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                        selectedPack === pack.count
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPack === pack.count ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
                          }`}>
                            {selectedPack === pack.count && (
                              <Check size={12} className="text-white ml-0.5 mt-0.5" />
                            )}
                          </div>
                          <span className="font-medium">{pack.label}</span>
                          {pack.badge && (
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              pack.badge === 'Popular' ? 'bg-blue-100 text-blue-600' :
                              pack.badge === 'Best Value' ? 'bg-green-100 text-green-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {pack.badge}
                            </span>
                          )}
                        </div>
                        {pack.discount > 0 && (
                          <span className="text-green-600 font-semibold">
                            Save ${pack.discount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Quantity:</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-6 py-3 font-semibold min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-gray-600">
                    Total: {quantity * selectedPack} pack{quantity * selectedPack > 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Total Price */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-gray-900">${pricing.totalPrice.toFixed(2)}</span>
                </div>
                {pricing.savings > 0 && (
                  <p className="text-green-600 font-semibold mt-2">
                    You save ${pricing.savings.toFixed(2)}!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>Buy Now - ${pricing.totalPrice.toFixed(2)}</span>
                </button>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full border-2 border-gray-900 text-gray-900 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>

                <div className="flex space-x-4">
                  <button className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart size={18} />
                    <span>Add to Wishlist</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="mx-auto mb-2 text-green-600" size={24} />
                  <p className="text-sm font-semibold">Free Shipping</p>
                  <p className="text-xs text-gray-600">Worldwide</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="mx-auto mb-2 text-blue-600" size={24} />
                  <p className="text-sm font-semibold">30-Day Returns</p>
                  <p className="text-xs text-gray-600">Easy returns</p>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-2 text-purple-600" size={24} />
                  <p className="text-sm font-semibold">100% Human Hair</p>
                  <p className="text-xs text-gray-600">Premium quality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {['description', 'installation', 'reviews', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <h3 className="text-xl font-bold mb-4">Product Description</h3>
                  <p className="text-gray-700 mb-6">{currentProduct?.description}</p>
                  
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    {currentProduct?.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check size={16} className="text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-xl p-6">
                    <div>
                      <h5 className="font-semibold mb-2">Specifications</h5>
                      <p><strong>Weight:</strong> {currentProduct?.weight}</p>
                      <p><strong>Texture:</strong> {currentProduct?.texture}</p>
                      <p><strong>Length:</strong> {selectedLength}</p>
                      <p><strong>Color:</strong> {currentProduct?.color}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Care Instructions</h5>
                      <p>• Wash with sulfate-free shampoo</p>
                      <p>• Deep condition weekly</p>
                      <p>• Air dry when possible</p>
                      <p>• Use heat protectant</p>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">Styling Tips</h5>
                      <p>• Perfect for braids and locs</p>
                      <p>• Can be colored darker</p>
                      <p>• Heat resistant up to 350°F</p>
                      <p>• Blends with natural hair</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'installation' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Installation Guide</h3>
                  
                  {/* Video Tutorial */}
                  <div className="mb-8">
                    <h4 className="font-semibold mb-4">Video Tutorial</h4>
                    <div className="bg-gray-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-gray-600">Professional Installation Tutorial</p>
                      <p className="text-sm text-gray-500 mt-2">Watch our step-by-step video guide</p>
                    </div>
                  </div>

                  {/* Step-by-step Guide */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        step: 1,
                        title: "Prepare Your Hair",
                        description: "Wash and completely dry your natural hair. Detangle gently and section into small parts.",
                        image: "/IMG-20250629-WA0197.jpg",
                        tip: "Use a wide-tooth comb to prevent breakage"
                      },
                      {
                        step: 2,
                        title: "Section the Hair",
                        description: "Create clean, even sections using a rat-tail comb. Each section should be about 1/4 inch wide.",
                        image: "/IMG-20250629-WA0183.jpg",
                        tip: "Smaller sections create neater, longer-lasting styles"
                      },
                      {
                        step: 3,
                        title: "Attach the Extensions",
                        description: "Take a small amount of bulk hair and attach it to your natural hair using your preferred method.",
                        image: "/IMG-20250629-WA0200.jpg",
                        tip: "Don't braid too tightly to avoid tension"
                      },
                      {
                        step: 4,
                        title: "Braid or Twist",
                        description: "Begin braiding or twisting from the root, incorporating the bulk hair smoothly with your natural hair.",
                        image: "/IMG-20250629-WA0168.jpg",
                        tip: "Keep consistent tension throughout"
                      },
                      {
                        step: 5,
                        title: "Secure the Ends",
                        description: "Secure the ends with small elastic bands or by burning the tips (for synthetic blends only).",
                        image: "/IMG-20250629-WA0180.jpg",
                        tip: "For human hair, use small clear elastics"
                      },
                      {
                        step: 6,
                        title: "Final Styling",
                        description: "Style as desired and apply light oil or serum for shine and moisture.",
                        image: "/IMG-20250629-WA0185.jpg",
                        tip: "Less is more when it comes to products"
                      }
                    ].map((step) => (
                      <div key={step.step} className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                        </div>
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <p className="text-gray-700 mb-3">{step.description}</p>
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                          <p className="text-blue-800 text-sm">
                            <strong>Pro Tip:</strong> {step.tip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Customer Reviews</h3>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Write a Review
                    </button>
                  </div>

                  {/* Review Summary */}
                  <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {currentProduct?.rating}
                        </div>
                        <div className="flex items-center justify-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={20} 
                              className={`${i < Math.floor(currentProduct?.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-600">Based on {currentProduct?.reviews} reviews</p>
                      </div>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center space-x-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">
                              {rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {[
                      {
                        name: "Sarah M.",
                        rating: 5,
                        date: "2 weeks ago",
                        title: "Amazing quality!",
                        review: "This hair is absolutely beautiful! The texture is perfect and it blends seamlessly with my natural hair. I've gotten so many compliments.",
                        verified: true
                      },
                      {
                        name: "Maya K.",
                        rating: 5,
                        date: "1 month ago",
                        title: "Perfect for protective styling",
                        review: "I use this for my daughter's braids and it's perfect. Soft, manageable, and lasts a long time. Will definitely order again!",
                        verified: true
                      },
                      {
                        name: "Aisha T.",
                        rating: 4,
                        date: "3 weeks ago",
                        title: "Great value",
                        review: "Good quality hair for the price. Easy to work with and the color matches perfectly. Shipping was fast too.",
                        verified: true
                      }
                    ].map((review, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold">{review.name}</h4>
                              {review.verified && (
                                <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={14} 
                                    className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <h5 className="font-semibold mb-2">{review.title}</h5>
                        <p className="text-gray-700">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Shipping & Returns</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <Truck className="text-green-600" size={20} />
                        <span>Shipping Information</span>
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">Free Worldwide Shipping</p>
                          <p className="text-sm text-gray-600">On all orders, no minimum required</p>
                        </div>
                        <div>
                          <p className="font-medium">Processing Time</p>
                          <p className="text-sm text-gray-600">1-2 business days</p>
                        </div>
                        <div>
                          <p className="font-medium">Delivery Time</p>
                          <p className="text-sm text-gray-600">5-7 business days (US)</p>
                          <p className="text-sm text-gray-600">7-14 business days (International)</p>
                        </div>
                        <div>
                          <p className="font-medium">Tracking</p>
                          <p className="text-sm text-gray-600">Provided for all orders</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <RotateCcw className="text-blue-600" size={20} />
                        <span>Returns & Exchanges</span>
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium">30-Day Return Policy</p>
                          <p className="text-sm text-gray-600">Easy returns within 30 days</p>
                        </div>
                        <div>
                          <p className="font-medium">Condition</p>
                          <p className="text-sm text-gray-600">Items must be unused and in original packaging</p>
                        </div>
                        <div>
                          <p className="font-medium">Return Shipping</p>
                          <p className="text-sm text-gray-600">Free return shipping provided</p>
                        </div>
                        <div>
                          <p className="font-medium">Refund Processing</p>
                          <p className="text-sm text-gray-600">3-5 business days after receipt</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold mb-4">Need Help?</h4>
                    <p className="text-gray-700 mb-4">
                      Have questions about shipping or returns? Our customer service team is here to help!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href="https://wa.me/+1234567890?text=Hi! I have a question about shipping and returns."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                      >
                        Chat on WhatsApp
                      </a>
                      <a
                        href="mailto:support@blenhairs.com"
                        className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
                      >
                        Email Support
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Similar Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((similarProduct) => (
                  <div
                    key={similarProduct.id}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(similarProduct.id)}
                  >
                    <img
                      src={similarProduct.image}
                      alt={similarProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{similarProduct.name}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">${similarProduct.price}</span>
                        {similarProduct.originalPrice && (
                          <span className="text-gray-400 line-through">${similarProduct.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Write a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={reviewForm.email}
                  onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({...reviewForm, rating: star})}
                      className="focus:outline-none"
                    >
                      <Star 
                        size={24} 
                        className={`${star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} hover:text-yellow-400 transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  required
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Summarize your experience"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewForm.review}
                  onChange={(e) => setReviewForm({...reviewForm, review: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Tell us about your experience with this product"
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Color Guide Modal */}
      {showColorGuide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Color Guide</h3>
              <button
                onClick={() => setShowColorGuide(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Choose the perfect color that matches your natural hair or desired look.
              </p>
              
              <div className="space-y-4">
                {availableColors.map((color) => (
                  <div key={color.key} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div 
                      className="w-12 h-12 rounded-full border border-gray-300"
                      style={{ 
                        background: color.colorCode.includes('gradient') 
                          ? color.colorCode 
                          : color.colorCode 
                      }}
                    ></div>
                    <div>
                      <h4 className="font-semibold">{color.name}</h4>
                      <p className="text-sm text-gray-600">
                        {color.key === 'natural-black' && 'Perfect for natural black hair, most popular choice'}
                        {color.key === 'dark-brown' && 'Rich brown tone, great for adding warmth'}
                        {color.key === 'medium-brown' && 'Warm brown shade, perfect for lighter skin tones'}
                        {color.key === 'mix-1b-99j' && 'Black with burgundy highlights, trendy ombre effect'}
                        {color.key === 'mix-1b-purple' && 'Black with purple highlights, bold and stylish'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Color Matching Tips:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Choose a color that matches your natural hair root color</li>
                  <li>• Human hair can be dyed darker but not lighter</li>
                  <li>• Mix colors can create beautiful ombre effects</li>
                  <li>• When in doubt, go slightly darker than your natural color</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold">Length Guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Choose the perfect length for your desired hairstyle.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableLengths.map((length) => (
                  <div key={length} className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold mb-2">{length}</h4>
                    <p className="text-sm text-gray-600">
                      {length === '10"' && 'Shoulder length, perfect for short protective styles'}
                      {length === '12"' && 'Just below shoulders, versatile length'}
                      {length === '14"' && 'Mid-back length, popular choice for most styles'}
                      {length === '16"' && 'Longer mid-back, great for fuller looks'}
                      {length === '18"' && 'Lower back length, dramatic and beautiful'}
                      {length === '20"' && 'Waist length, perfect for long braids'}
                      {length === '22"' && 'Extra long, stunning for special occasions'}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">Length Selection Tips:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Consider your height and body proportions</li>
                  <li>• Longer lengths require more maintenance</li>
                  <li>• 14"-18" are the most popular and versatile lengths</li>
                  <li>• You can always trim longer hair to your desired length</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        total={pricing.totalPrice}
        items={[{
          id: currentProduct?.id || '',
          name: currentProduct?.name || '',
          price: pricing.pricePerPack,
          image: currentProduct?.image || '',
          shade: currentProduct?.color || '',
          length: selectedLength,
          quantity: quantity * selectedPack,
          selectedPacks: selectedPack
        }]}
      />
    </>
  );
};

export default ProductPage;