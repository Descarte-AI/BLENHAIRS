import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Eye, Filter, Grid, List } from 'lucide-react';
import { useCart } from '../context/CartContext';

const products = [
  {
    id: 'afro-kinky-bulk-1',
    name: 'Afro Kinky Bulk Hair Extensions',
    category: 'afro-kinky-bulk',
    price: 45,
    originalPrice: 65,
    rating: 4.8,
    reviews: 156,
    image: '/IMG-20250629-WA0197.jpg',
    colors: ['Natural Black', 'Dark Brown', 'Medium Brown'],
    lengths: ['14"', '16"', '18"', '20"', '22"', '24"'],
    inStock: true,
    popular: true
  },
  {
    id: 'spring-twist-1',
    name: 'Spring Twist Hair',
    category: 'spring-twist',
    price: 38,
    rating: 4.9,
    reviews: 203,
    image: '/IMG-20250629-WA0200.jpg',
    colors: ['Natural Black', 'Dark Brown'],
    lengths: ['16"', '18"', '20"'],
    inStock: true,
    popular: true
  },
  {
    id: 'v-part-wig-1',
    name: 'V Part Wig Natural',
    category: 'v-part-wig',
    price: 89,
    originalPrice: 120,
    rating: 4.7,
    reviews: 89,
    image: '/IMG-20250629-WA0185.jpg',
    colors: ['Natural Black', 'Dark Brown', 'Honey Blonde'],
    lengths: ['16"', '18"', '20"', '22"'],
    inStock: true
  },
  {
    id: 'clip-ins-1',
    name: 'Clip-In Hair Extensions',
    category: 'clip-ins',
    price: 65,
    rating: 4.6,
    reviews: 124,
    image: '/IMG-20250629-WA0193.jpg',
    colors: ['Natural Black', 'Dark Brown', 'Medium Brown', 'Light Brown'],
    lengths: ['14"', '16"', '18"', '20"'],
    inStock: true
  },
  {
    id: 'bulk-braiding-1',
    name: 'Bulk Braiding Hair',
    category: 'bulk-braiding-hair',
    price: 32,
    rating: 4.8,
    reviews: 178,
    image: '/IMG-20250629-WA0180.jpg',
    colors: ['Natural Black', 'Dark Brown'],
    lengths: ['18"', '20"', '22"', '24"'],
    inStock: true,
    popular: true
  },
  {
    id: 'crochet-hair-1',
    name: 'Crochet Hair Extensions',
    category: 'crochet-hair',
    price: 42,
    rating: 4.5,
    reviews: 95,
    image: '/WhatsApp Image 2025-06-29 at 14.09.11_581cec0e.jpg',
    colors: ['Natural Black', 'Dark Brown', 'Medium Brown'],
    lengths: ['16"', '18"', '20"'],
    inStock: true
  }
];

const ProductGrid = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [filterColor, setFilterColor] = useState('all');
  const [filterLength, setFilterLength] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200]);

  // Filter products based on category
  const filteredProducts = products.filter(product => {
    if (category && product.category !== category) return false;
    if (filterColor !== 'all' && !product.colors.includes(filterColor)) return false;
    if (filterLength !== 'all' && !product.lengths.includes(filterLength)) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
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

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      shade: product.colors[0],
      length: product.lengths[0],
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

  const getCategoryTitle = () => {
    switch (category) {
      case 'afro-kinky-bulk':
        return 'Afro Kinky Bulk Hair';
      case 'spring-twist':
        return 'Spring Twist Hair';
      case 'v-part-wig':
        return 'V Part Wigs';
      case 'clip-ins':
        return 'Clip-In Extensions';
      case 'bulk-braiding-hair':
        return 'Bulk Braiding Hair';
      case 'crochet-hair':
        return 'Crochet Hair';
      default:
        return 'All Products';
    }
  };

  const allColors = [...new Set(products.flatMap(p => p.colors))];
  const allLengths = [...new Set(products.flatMap(p => p.lengths))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getCategoryTitle()}</h1>
              <p className="text-gray-600 mt-2">{sortedProducts.length} products available</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-rose-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-6">
                <Filter size={20} className="text-gray-600" />
                <h3 className="font-bold text-gray-900">Filters</h3>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Color</h4>
                <select
                  value={filterColor}
                  onChange={(e) => setFilterColor(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">All Colors</option>
                  {allColors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              {/* Length Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Length</h4>
                <select
                  value={filterLength}
                  onChange={(e) => setFilterLength(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="all">All Lengths</option>
                  {allLengths.map(length => (
                    <option key={length} value={length}>{length}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setFilterColor('all');
                  setFilterLength('all');
                  setPriceRange([0, 200]);
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => handleProductClick(product.id)}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 space-y-2">
                        {product.popular && (
                          <div className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Popular
                          </div>
                        )}
                        {product.originalPrice && (
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            Save ${product.originalPrice - product.price}
                          </div>
                        )}
                      </div>

                      {/* Wishlist */}
                      <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg">
                        <Heart size={18} className="text-gray-600 hover:text-rose-500 transition-colors" />
                      </button>

                      {/* Quick Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleProductClick(product.id)}
                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="bg-rose-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-600 transition-colors flex items-center space-x-2"
                          >
                            <ShoppingBag size={16} />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-current" />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2 cursor-pointer hover:text-rose-500 transition-colors"
                          onClick={() => handleProductClick(product.id)}>
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-2xl text-gray-900">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.colors.length} colors
                        </span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleProductClick(product.id)}
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="text-yellow-400 fill-current" />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-xl text-gray-900 mb-2 cursor-pointer hover:text-rose-500 transition-colors"
                          onClick={() => handleProductClick(product.id)}>
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-2xl text-gray-900">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-600">
                          {product.colors.length} colors • {product.lengths.length} lengths
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={() => handleProductClick(product.id)}
                        className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-600 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={() => {
                    setFilterColor('all');
                    setFilterLength('all');
                    setPriceRange([0, 200]);
                  }}
                  className="mt-4 bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;