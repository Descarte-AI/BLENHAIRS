import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Eye, Filter, Grid, List, ChevronDown, X, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { afroKinkyProducts } from '../data/products';

const AfroKinkyCollection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedLength, setSelectedLength] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get all products
  const allProducts = Object.values(afroKinkyProducts).flat();

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const colorFilter = selectedColor === 'all' || product.color.toLowerCase().replace(' ', '-') === selectedColor;
    const lengthFilter = selectedLength === 'all' || product.length === selectedLength;
    const priceFilter = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return colorFilter && lengthFilter && priceFilter;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
      default:
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    }
  });

  const handleProductClick = (productId: string) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Small delay to ensure smooth scroll completes before navigation
    setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 100);
  };

  const colorSections = [
    { key: 'natural-black', name: 'Natural Black', count: afroKinkyProducts['natural-black'].length, color: '#1B1B1B' },
    { key: 'dark-brown', name: 'Dark Brown', count: afroKinkyProducts['dark-brown'].length, color: '#3C2415' },
    { key: 'medium-brown', name: 'Medium Brown', count: afroKinkyProducts['medium-brown'].length, color: '#8B4513' }
  ];

  const allLengths = [...new Set(allProducts.map(p => p.length))].sort();

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={`bg-white ${isMobile ? 'p-6' : 'border border-gray-200 rounded-lg p-6 sticky top-24'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
        </div>
        {isMobile && (
          <button
            onClick={() => setShowMobileFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4 text-base">Color</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="radio"
              name="color"
              value="all"
              checked={selectedColor === 'all'}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900"
            />
            <span className="text-gray-700 group-hover:text-gray-900 font-medium">All Colors ({allProducts.length})</span>
          </label>
          {colorSections.map(color => (
            <label key={color.key} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="radio"
                name="color"
                value={color.key}
                checked={selectedColor === color.key}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-4 h-4 text-gray-900 focus:ring-gray-900"
              />
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.color }}
                ></div>
                <span className="text-gray-700 group-hover:text-gray-900 font-medium">
                  {color.name} ({color.count})
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Length Filter */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4 text-base">Length</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSelectedLength('all')}
            className={`p-2 text-sm border rounded-lg transition-colors ${
              selectedLength === 'all' 
                ? 'border-gray-900 bg-gray-900 text-white' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            All
          </button>
          {allLengths.map(length => (
            <button
              key={length}
              onClick={() => setSelectedLength(length)}
              className={`p-2 text-sm border rounded-lg transition-colors ${
                selectedLength === length 
                  ? 'border-gray-900 bg-gray-900 text-white' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {length}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-4 text-base">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-gray-900"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedColor('all');
          setSelectedLength('all');
          setPriceRange([0, 100]);
        }}
        className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Collection Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Afro Kinky Bulk Hair Collection
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Premium 100% human hair perfect for braiding, dreadlocks, and protective styling. 
              Available in multiple colors and lengths.
            </p>
            
            {/* Video Section */}
            <div className="mb-8">
              <div className="max-w-4xl mx-auto">
                <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video">
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&modestbranding=1&rel=0"
                      title="How to Install Afro Kinky Bulk Hair"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Play size={16} />
                      <span className="font-semibold">How to Install Afro Kinky Bulk Hair</span>
                    </div>
                  </div>
                </div>
               
               {/* Quick View Text at Bottom */}
               <div className={`absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-2 transition-opacity duration-300 ${
                 isHovered ? 'opacity-100' : 'opacity-0'
               }`}>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     window.scrollTo({ top: 0, behavior: 'smooth' });
                   }}
                   className="text-white font-semibold hover:text-gray-200 transition-colors"
                 >
                   Quick View
                 </button>
               </div>
                <p className="text-sm text-gray-600 mt-4">
                  Watch our step-by-step installation guide for perfect results every time
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="font-medium">4.8/5 Average Rating</span>
              </div>
              <div className="font-medium">
                {allProducts.length} Products Available
              </div>
              <div className="font-medium">
                Free Worldwide Shipping
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Mobile Filter Button & Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Filter size={18} />
                  <span className="font-medium">Filters</span>
                </button>
                <p className="text-gray-600 font-medium">
                  {sortedProducts.length} products
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 font-medium"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
            }>
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  viewMode={viewMode}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
                  <button
                    onClick={() => {
                      setSelectedColor('all');
                      setSelectedLength('all');
                      setPriceRange([0, 100]);
                    }}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white overflow-y-auto">
            <FilterSidebar isMobile={true} />
          </div>
        </div>
      )}
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode, onProductClick }: any) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageInterval, setImageInterval] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.images && product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
      }, 1500); // Change image every 1.5 seconds
      setImageInterval(interval);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
    if (imageInterval) {
      clearInterval(imageInterval);
      setImageInterval(null);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      shade: product.color,
      length: product.length,
      quantity: 1
    });
    
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

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 flex items-center space-x-6">
        <div 
          className="relative flex-shrink-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={product.images ? product.images[currentImageIndex] : product.image}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={() => onProductClick(product.id)}
          />
          
          {/* Quick View Overlay */}
          <div className={`absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <span className="text-white font-semibold text-sm">Quick View</span>
          </div>
          
          {product.popular && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Popular
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-gray-700 transition-colors truncate"
              onClick={() => onProductClick(product.id)}>
            {product.name} - {product.length}
          </h3>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-sm">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: product.colorCode }}
              ></div>
              <span className="text-sm text-gray-600">{product.color}</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {product.weight} • {product.texture}
          </div>
        </div>

        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={() => onProductClick(product.id)}
            className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <ShoppingBag size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:scale-[1.02]">
      <div 
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={product.images ? product.images[currentImageIndex] : product.image}
          alt={product.name}
          className="w-full h-64 object-cover transition-all duration-500 cursor-pointer"
          onClick={() => onProductClick(product.id)}
        />
        
        {/* Image Indicators */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Quick View Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-2">
          {product.popular && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Popular
            </div>
          )}
          {product.originalPrice && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
        </div>

        {/* Wishlist */}
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm">
          <Heart size={16} className="text-gray-600 hover:text-red-500 transition-colors" />
        </button>

        {/* Action Buttons Overlay */}
        <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  navigate('/');
                }, 100);
              }}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Eye size={16} />
              <span>View Details</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-600 ml-2">
            {product.rating} ({product.reviews})
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-gray-700 transition-colors line-clamp-2"
            onClick={() => onProductClick(product.id)}>
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-sm">
                ${product.originalPrice}
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

        <div className="text-xs text-gray-500 mb-3">
          {product.weight} • {product.texture}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onProductClick(product.id)}
            className="flex-1 bg-gray-200 text-gray-900 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <ShoppingBag size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AfroKinkyCollection;