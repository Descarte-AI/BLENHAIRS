import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Heart, Share2, Truck, Shield, RotateCcw, CreditCard, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PaymentModal from './PaymentModal';

// Import the product data from the collection
import  afroKinkyProducts  from './AfroKinkyCollection';

// Combine all products from the collection into one array
const allProducts = Object.values(afroKinkyProducts).flat();

// Find product by ID from the URL
const getProductById = (id: string | undefined) => {
  return allProducts.find(product => product.id === id);
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Product not found</h2>
          <button 
            onClick={() => navigate('/collection/afro-kinky-bulk')}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  // Generate similar products data based on the collection
  const similarProducts = allProducts.filter(
    p => p.color === product.color && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      shade: product.color,
      length: product.length,
      quantity: quantity
    });
    
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

  const handleBuyNow = () => {
    handleAddToCart();
    setShowPayment(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-sm">
              <button 
                onClick={() => navigate('/collection/afro-kinky-bulk')}
                className="text-gray-600 hover:text-black flex items-center space-x-1 font-medium"
              >
                <ArrowLeft size={16} />
                <span>Back to Collection</span>
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Afro Kinky Bulk</span>
              <span className="text-gray-400">/</span>
              <span className="text-black font-semibold">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-black shadow-lg' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-black">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart size={24} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-black transition-colors">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={
                      i < Math.floor(product.rating) 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    } />
                  ))}
                </div>
                <span className="text-gray-700 font-semibold text-lg">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="text-3xl font-bold text-black mb-3">
                  ${product.price.toFixed(2)}
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through text-xl ml-3">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Truck size={16} className="text-green-600" />
                    <span>Free worldwide shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-blue-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>

              {/* Color Display */}
              <div className="mb-6">
                <h3 className="font-bold text-black mb-3 text-lg">
                  Color: {product.color}
                </h3>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: product.colorCode }}
                  ></div>
                  <span className="text-gray-700">{product.color}</span>
                </div>
              </div>

              {/* Length Display */}
              <div className="mb-6">
                <h3 className="font-bold text-black mb-3 text-lg">
                  Length: {product.length}
                </h3>
                <div className="text-gray-700">
                  This product is available in {product.length} length
                </div>
              </div>

              {/* Product Details */}
              <div className="mb-6">
                <h3 className="font-bold text-black mb-3 text-lg">
                  Product Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <span className="font-semibold">Texture:</span> {product.texture}
                  </div>
                  <div>
                    <span className="font-semibold">Weight:</span> {product.weight}
                  </div>
                  <div>
                    <span className="font-semibold">Material:</span> 100% Human Hair
                  </div>
                  <div>
                    <span className="font-semibold">Quality:</span> Premium Grade
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="font-bold text-black mb-3 text-lg">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-3 font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <span className="text-gray-700 text-lg">
                    Total: <span className="font-bold text-2xl text-black">${(product.price * quantity).toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-200 text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingBag size={20} />
                  <span>Add to Cart - ${(product.price * quantity).toFixed(2)}</span>
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex flex-col items-center space-y-2">
                  <Truck className="text-green-600" size={24} />
                  <span className="font-semibold text-black">Free Shipping</span>
                  <span className="text-gray-600">Worldwide delivery</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <RotateCcw className="text-blue-600" size={24} />
                  <span className="font-semibold text-black">Easy Returns</span>
                  <span className="text-gray-600">30-day policy</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="text-purple-600" size={24} />
                  <span className="font-semibold text-black">Secure Payment</span>
                  <span className="text-gray-600">SSL protected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {['description', 'features', 'installation', 'care', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-2 border-b-2 font-semibold text-lg capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'installation' ? 'How to Install' : tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description || 'Premium quality afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with natural texture and movement that blends seamlessly with your natural hair.'}
                  </p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    '100% Premium Human Hair',
                    'Natural Afro Kinky Texture',
                    'Perfect for Braiding & Dreadlocks',
                    'Heat Resistant up to 350°F',
                    'Chemical Free Processing',
                    'Long Lasting Durability',
                    'Tangle Free',
                    'Natural Movement'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="text-green-600 flex-shrink-0" size={20} />
                      <span className="text-gray-700 text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'installation' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-black mb-6">Easy Installation Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        image: product.images[1]
                      },
                      {
                        step: 3,
                        title: 'Begin Braiding',
                        description: 'Start braiding the bulk hair into your natural hair using your preferred braiding technique. Keep tension even.',
                        image: product.images[2]
                      },
                      {
                        step: 4,
                        title: 'Secure and Style',
                        description: 'Secure the ends properly and style as desired. Your new protective style is ready to wear!',
                        image: product.images[3] || product.images[0]
                      }
                    ].map((step) => (
                      <div key={step.step} className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                          <h4 className="text-xl font-bold text-black">{step.title}</h4>
                        </div>
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-40 object-cover rounded-xl mb-4"
                        />
                        <p className="text-gray-700">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-black mb-6">Hair Care Instructions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      'Wash gently with sulfate-free shampoo',
                      'Use leave-in conditioner to maintain moisture',
                      'Sleep with a silk or satin scarf/pillowcase',
                      'Avoid excessive heat styling',
                      'Detangle gently when wet with wide-tooth comb',
                      'Deep condition weekly for best results'
                    ].map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="text-green-600 flex-shrink-0 mt-1" size={18} />
                        <span className="text-gray-700 text-lg">{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-black">Customer Reviews</h3>
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
                      <div key={index} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-black">{review.name}</div>
                              <div className="text-sm text-gray-600">{review.date}</div>
                            </div>
                            {review.verified && (
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
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
                        <p className="text-gray-700">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-black mb-8">You May Also Like</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => navigate(`/product/${product.id}`)}
                      />
                      
                      {product.popular && (
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
                            i < Math.floor(product.rating) 
                              ? "text-yellow-400 fill-current" 
                              : "text-gray-300"
                          } />
                        ))}
                        <span className="text-xs text-gray-600 ml-2">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      
                      <h3 
                        className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-700 transition-colors line-clamp-2"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-lg text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: product.colorCode }}
                          ></div>
                          <span className="text-sm text-gray-600">{product.length}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
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
          quantity: quantity
        }]}
      />
    </>
  );
};

export default ProductPage;