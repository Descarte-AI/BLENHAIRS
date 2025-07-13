import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User, Heart, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount, total } = useCart();

  // Popular searches for afro kinky bulk
  const popularSearches = [
    'Natural Black', 'Dark Brown', 'Medium Brown', 'Light Brown', 
    '14 inch', '16 inch', '18 inch', '20 inch', '22 inch', '24 inch'
  ];

  const searchSuggestions = [
    { name: 'Natural Black Afro Kinky Bulk', category: 'natural-black', image: '/IMG-20250629-WA0197.jpg', price: 45 },
    { name: 'Dark Brown Afro Kinky Bulk', category: 'dark-brown', image: '/IMG-20250629-WA0183.jpg', price: 48 },
    { name: 'Medium Brown Afro Kinky Bulk', category: 'medium-brown', image: '/IMG-20250629-WA0200.jpg', price: 52 }
  ].filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSearchSelect = (suggestion: any) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/collection/afro-kinky-bulk?color=${suggestion.category}`);
  };

  const handleCategorySearch = (category: string) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/collection/afro-kinky-bulk?search=${category.replace(' ', '-').toLowerCase()}`);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white py-2 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone size={14} />
              <span>1-800-BLEN-HAIR</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin size={14} />
              <span>Free Worldwide Shipping</span>
            </div>
          </div>
          <div className="text-yellow-300 font-bold">
            🔥 30% OFF FIRST ORDER + FREE SHIPPING
          </div>
        </div>
      </div>

      <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-black transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 
                onClick={() => navigate('/')}
                className="font-bold text-2xl lg:text-3xl text-black cursor-pointer hover:text-gray-700 transition-colors"
              >
                Blen Hairs
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <button 
                onClick={() => handleNavClick('/')}
                className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 text-lg"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('/collection/afro-kinky-bulk')}
                className="text-gray-700 hover:text-black transition-colors font-medium px-3 py-2 text-lg"
              >
                Afro Kinky Bulk
              </button>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-3">
              <button
                className="text-gray-700 hover:text-black transition-colors p-2"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} />
              </button>
              <button className="text-gray-700 hover:text-black transition-colors p-2 relative">
                <Heart size={20} />
              </button>
              <button className="text-gray-700 hover:text-black transition-colors p-2">
                <User size={20} />
              </button>
              <button 
                className="relative text-gray-700 hover:text-black transition-colors p-2"
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
              {total > 0 && (
                <div className="hidden md:block bg-black text-white px-3 py-1 rounded-lg font-bold text-sm">
                  ${total.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4 pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search afro kinky bulk hair by color, length..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  autoFocus
                />
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                
                {/* Search Suggestions */}
                {searchQuery && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-80 overflow-y-auto z-50">
                    {searchSuggestions.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(result)}
                        className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                      >
                        <img src={result.image} alt={result.name} className="w-12 h-12 object-cover rounded-lg mr-3" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{result.name}</h4>
                          <p className="text-black font-bold">From ${result.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Popular Searches */}
                {!searchQuery && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg p-4 z-50">
                    <h4 className="font-semibold text-gray-900 mb-3">Popular Searches</h4>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleCategorySearch(search)}
                          className="bg-gray-100 hover:bg-black hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
              <nav className="space-y-2">
                <button 
                  onClick={() => handleNavClick('/')}
                  className="block w-full text-left text-gray-700 hover:text-black transition-colors font-medium py-2 px-4"
                >
                  Home
                </button>
                <button 
                  onClick={() => handleNavClick('/collection/afro-kinky-bulk')}
                  className="block w-full text-left text-gray-700 hover:text-black transition-colors font-medium py-2 px-4"
                >
                  Afro Kinky Bulk Collection
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;