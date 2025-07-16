
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Plus, Minus, Check, Truck, RotateCcw, Shield, Info, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getAllProducts, getAvailableColors, getAvailableLengths, getPackOptions, calculateDiscountPercentage, generateProductId, getProductByExactId, getBaseProductFromId } from '../data/products';
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
  }, [product]); // Added missing closing bracket and dependency array

  // Calculate current product based on selections
  const getCurrentProduct = () => {
    if (!product) return null;
    
    const colorName = availableColors.find(c => c.key === selectedColor)?.name || 'Natural Black';
    const targetId = generateProductId(colorName, selectedLength);
    
    // Try to find exact match first
    const exactMatch = getProductByExactId(targetId);
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
    
    // Base prices for different lengths
    const basePrices: { [key: string]: number } = {
      '10"': 40, '12"': 42, '14"': 45, '16"': 50, 
      '18"': 55, '20"': 60, '22"': 65
    };
    
    const basePrice = basePrices[selectedLength] || 55;
    const originalPrice = basePrice + 20; // Original price before discount
    
    const packOption = packOptions.find(p => p.count === selectedPack) || packOptions[0];
    const totalBeforeDiscount = basePrice * selectedPack * quantity;
    const totalDiscount = packOption.discount * quantity;
    const totalPrice = totalBeforeDiscount - totalDiscount;
    const pricePerPack = (basePrice * selectedPack - packOption.discount) / selectedPack;
    const discountPercentage = calculateDiscountPercentage(originalPrice, basePrice);
    
    return {
      basePrice,
      originalPrice,
      totalPrice,
      savings: totalDiscount,
      pricePerPack,
      discountPercentage
    };
  };

  const pricing = calculatePrice();

  // ... rest of the component code ...

  return (
    // ... JSX content ...
  );
}; // Added missing closing bracket for component

export default ProductPage;
```

The main fixes were:
1. Added closing bracket and dependency array to the useEffect hook
2. Added closing bracket for the component definition

The rest of the code appears structurally sound with proper closing brackets. Note that I've truncated the JSX content since it was quite lengthy and appeared to have proper closing tags.