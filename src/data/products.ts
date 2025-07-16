// Centralized product data with enhanced structure
export interface Product {
  id: string;
  name: string;
  color: string;
  colorCode: string;
  length: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  inStock: boolean;
  popular?: boolean;
  description: string;
  weight: string;
  texture: string;
  features: string[];
  category: string;
}

export const afroKinkyProducts: Product[] = [
  // Natural Black Products
  {
    id: 'afro-kinky-natural-black-14',
    name: 'Natural Black Afro Kinky Bulk Hair - 14"',
    color: 'Natural Black',
    colorCode: '#1B1B1B',
    length: '14"',
    price: 45,
    originalPrice: 65,
    rating: 4.9,
    reviews: 234,
    image: '/IMG-20250629-WA0197.jpg',
    images: ['/IMG-20250629-WA0197.jpg', '/IMG-20250629-WA0183.jpg', '/IMG-20250629-WA0168.jpg'],
    inStock: true,
    popular: true,
    description: 'Premium quality natural black afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with natural texture that blends seamlessly with your natural hair.',
    weight: '100g',
    texture: 'Afro Kinky',
    category: 'afro-kinky-bulk',
    features: [
      '100% Premium Human Hair',
      'Natural Afro Kinky Texture',
      'Perfect for Braiding & Dreadlocks',
      'Heat Resistant up to 350°F',
      'Chemical Free Processing',
      'Long Lasting Durability',
      'Tangle Free',
      'Natural Movement'
    ]
  },
  {
    id: 'afro-kinky-natural-black-16',
    name: 'Natural Black Afro Kinky Bulk Hair - 16"',
    color: 'Natural Black',
    colorCode: '#1B1B1B',
    length: '16"',
    price: 50,
    originalPrice: 70,
    rating: 4.8,
    reviews: 189,
    image: '/IMG-20250629-WA0183.jpg',
    images: ['/IMG-20250629-WA0183.jpg', '/IMG-20250629-WA0197.jpg', '/IMG-20250629-WA0200.jpg'],
    inStock: true,
    popular: true,
    description: 'Premium quality natural black afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with natural texture that blends seamlessly with your natural hair.',
    weight: '100g',
    texture: 'Afro Kinky',
    category: 'afro-kinky-bulk',
    features: [
      '100% Premium Human Hair',
      'Natural Afro Kinky Texture',
      'Perfect for Braiding & Dreadlocks',
      'Heat Resistant up to 350°F',
      'Chemical Free Processing',
      'Long Lasting Durability',
      'Tangle Free',
      'Natural Movement'
    ]
  },
  {
    id: 'afro-kinky-natural-black-18',
    name: 'Natural Black Afro Kinky Bulk Hair - 18"',
    color: 'Natural Black',
    colorCode: '#1B1B1B',
    length: '18"',
    price: 55,
    originalPrice: 75,
    rating: 4.9,
    reviews: 156,
    image: '/IMG-20250629-WA0200.jpg',
    images: ['/IMG-20250629-WA0200.jpg', '/IMG-20250629-WA0197.jpg', '/IMG-20250629-WA0183.jpg'],
    inStock: true,
    description: 'Premium quality natural black afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with natural texture that blends seamlessly with your natural hair.',
    weight: '100g',
    texture: 'Afro Kinky',
    category: 'afro-kinky-bulk',
    features: [
      '100% Premium Human Hair',
      'Natural Afro Kinky Texture',
      'Perfect for Braiding & Dreadlocks',
      'Heat Resistant up to 350°F',
      'Chemical Free Processing',
      'Long Lasting Durability',
      'Tangle Free',
      'Natural Movement'
    ]
  },
  {
    id: 'afro-kinky-natural-black-20',
    name: 'Natural Black Afro Kinky Bulk Hair - 20"',
    color: 'Natural Black',
    colorCode: '#1B1B1B',
    length: '20"',
    price: 60,
    originalPrice: 80,
    rating: 4.7,
    reviews: 143,
    image: '/IMG-20250629-WA0168.jpg',
    images: ['/IMG-20250629-WA0168.jpg', '/IMG-20250629-WA0180.jpg', '/IMG-20250629-WA0185.jpg'],
    inStock: true,
    description: 'Premium quality natural black afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with natural texture that blends seamlessly with your natural hair.',
    weight: '100g',
    texture: 'Afro Kinky',
    category: 'afro-kinky-bulk',
    features: [
      '100% Premium Human Hair',
      'Natural Afro Kinky Texture',
      'Perfect for Braiding & Dreadlocks',
      'Heat Resistant up to 350°F',
      'Chemical Free Processing',
      'Long Lasting Durability',
      'Tangle Free',
      'Natural Movement'
    ]
  },
  {
    id: 'afro-kinky-natural-black-22',
    name: 'Natural Black Afro Kinky Bulk Hair - 22"',
    color: 'Natural Black',
    colorCode: '#1B1B1B',
    length: '22"',
    price: 65,
    originalPrice: 85,
    rating: 4.8,
    reviews: 98,
    image: '/IMG-20250629-WA0180.jpg',
    images: ['/IMG-20250629-WA0180.jpg', '/IMG-20250629-WA0168.jpg', '/IMG-20250629-WA0185.jpg'],
    inStock: true,
    description: 'Premium quality natural black afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with natural texture that blends seamlessly with your natural hair.',
    weight: '100g',
    texture: 'Afro Kinky',
    category: 'afro-kinky-bulk',
    features: [
      '100% Premium Human Hair',
      'Natural Afro Kinky Texture',
      'Perfect for Braiding & Dreadlocks',
      'Heat Resistant up to 350°F',
      'Chemical Free Processing',
      'Long Lasting Durability',
      'Tangle Free',
      'Natural Movement'
    ]
  },
  // Dark Brown Products
  {
    id: 'afro-kinky-dark-brown-14',
    name: 'Dark Brown Afro Kinky Bulk Hair - 14"',
    color: 'Dark Brown',
    colorCode: '#3C2415',
    length: '14"',
    price: 48,
    originalPrice: 68,
    rating: 4.8,
    reviews: 167,
    image: '/styles.webp',
    images: ['/twists.webp', '/dark_brown_afro_kinky_bulk_human_hair_for_dreadlocks_black_women.webp', '/styles.webp'],
    inStock: true,
    popular: true,
    description: 'Premium quality dark brown afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with rich brown color that complements various skin tones.',
    weight: '100g',
    texture: 'Afro Kinky',
    category: 'afro-kinky-bulk',
    features: [
      '100% Premium Human Hair',
      'Rich Dark Brown Color',
      'Perfect for Braiding & Dreadlocks',
      'Heat Resistant up to 350°F',
      'Chemical Free Processing',
      'Long Lasting Durability',
      'Tangle Free',
      'Natural Movement'
    ]
  },
  {
    id: 'afro-kinky-dark-brown-16',
    name: 'Dark Brown Afro Kinky Bulk Hair - 16"',
    color: 'Dark Brown',
    colorCode: '#3C2415',
    length: '16"',
    price: 53,
    originalPrice: 73,
    rating: 4.7,
    reviews: 134,
    image: '/IMG-20250629-WA0189.jpg',
    images: ['/IMG-20250629-WA0189.jpg', '/IMG-20250629-WA0193.jpg', '/IMG-20250702-WA0002.jpg'],
    inStock: true,
    description: 'Premium quality dark brown afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with rich brown color that complements various skin tones.',
    weight: '100g',
    texture: 'Afro Kinky',
    category: 'afro-kinky-bulk',
    features: [
      '100% Premium Human Hair',
      'Rich Dark Brown Color',
      'Perfect for Braiding & Dreadlocks',
      'Heat Resistant up to 350°F',
      'Chemical Free Processing',
      'Long Lasting Durability',
      'Tangle Free',
      'Natural Movement'
    ]
  },
  // Medium Brown Products
  {
    id: 'afro-kinky-medium-brown-14',
    name: 'Medium Brown Afro Kinky Bulk Hair - 14"',
    color: 'Medium Brown',
    colorCode: '#8B4513',
    length: '14"',
    price: 52,
    originalPrice: 72,
    rating: 4.7,
    reviews: 145,
    image: '/IMG-20250702-WA0005.jpg',
    images: ['/IMG-20250702-WA0005.jpg', '/IMG-20250702-WA0006.jpg', '/WhatsApp Image 2025-06-29 at 14.09.11_581cec0e.jpg'],
    inStock: true,
    description: 'Premium quality medium brown afro kinky bulk hair perfect for braiding and protective styling. Made from 100% human hair with warm brown tones that enhance natural beauty.',
    weight: '100g',
    texture: 'Afro Kinky',
    category: 'afro-kinky-bulk',
    features: [
      '100% Premium Human Hair',
      'Warm Medium Brown Color',
      'Perfect for Braiding & Dreadlocks',
      'Heat Resistant up to 350°F',
      'Chemical Free Processing',
      'Long Lasting Durability',
      'Tangle Free',
      'Natural Movement'
    ]
  }
];

// Color options for variants
export const colorOptions = [
  { key: 'natural-black', name: 'Natural Black', colorCode: '#1B1B1B' },
  { key: 'dark-brown', name: 'Dark Brown', colorCode: '#3C2415' },
  { key: 'medium-brown', name: 'Medium Brown', colorCode: '#8B4513' },
  { key: 'mix-1b-99j', name: 'Mix #1B/99J', colorCode: 'linear-gradient(45deg, #1B1B1B 50%, #8B4513 50%)' },
  { key: 'mix-1b-purple', name: 'Mix #1B/Purple', colorCode: 'linear-gradient(45deg, #1B1B1B 50%, #6B46C1 50%)' }
];

// Length options
export const lengthOptions = ['10"', '12"', '14"', '16"', '18"', '20"', '22"'];

// Pack options with discounts
export const packOptions = [
  { count: 1, label: '1 Pack', discount: 0, badge: '' },
  { count: 3, label: '3 Packs (Full Head)', discount: 15, badge: 'Popular' },
  { count: 5, label: '5 Packs (Recommended)', discount: 30, badge: 'Best Value' }
];

// Utility functions
export const getAllProducts = (): Product[] => {
  return afroKinkyProducts;
};

export const getProductById = (id: string): Product | undefined => {
  return afroKinkyProducts.find(product => product.id === id);
};

export const getProductsByColor = (color: string): Product[] => {
  return afroKinkyProducts.filter(product => 
    product.color.toLowerCase().replace(' ', '-') === color.toLowerCase().replace(' ', '-')
  );
};

export const getAvailableColors = () => colorOptions;
export const getAvailableLengths = () => lengthOptions;
export const getPackOptions = () => packOptions;

// Price calculation functions
export const getPriceForLength = (length: string): number => {
  const basePrices: { [key: string]: number } = {
    '10"': 40,
    '12"': 42,
    '14"': 45,
    '16"': 50,
    '18"': 55,
    '20"': 60,
    '22"': 65
  };
  return basePrices[length] || 55;
};

export const getColorMultiplier = (colorKey: string): number => {
  const multipliers: { [key: string]: number } = {
    'natural-black': 1.0,
    'dark-brown': 1.1,
    'medium-brown': 1.15,
    'mix-1b-99j': 1.2,
    'mix-1b-purple': 1.25
  };
  return multipliers[colorKey] || 1.0;
};

export const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const getSimilarProducts = (currentProduct: Product, limit: number = 4): Product[] => {
  if (!currentProduct) return [];
  
  const sameColorProducts = afroKinkyProducts.filter(p => 
    p.color === currentProduct.color && p.id !== currentProduct.id
  );
  
  return sameColorProducts.slice(0, limit);
};