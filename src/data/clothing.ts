import { ClothingItem, OutfitRecommendation } from '../types/pose';

export const clothingItems: ClothingItem[] = [
  {
    id: '1',
    name: 'Classic White Shirt',
    type: 'shirt',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'White',
    price: 79.99,
    brand: 'Premium Cotton Co.',
    size: 'M',
    material: '100% Cotton',
    rating: 4.8,
    reviews: 234,
  },
  {
    id: '2',
    name: 'Navy Blue Blazer',
    type: 'jacket',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Navy Blue',
    price: 149.99,
    brand: 'Executive Style',
    size: 'M',
    material: 'Wool Blend',
    rating: 4.9,
    reviews: 156,
  },
  {
    id: '3',
    name: 'Elegant Black Dress',
    type: 'dress',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Black',
    price: 129.99,
    brand: 'Chic Boutique',
    size: 'M',
    material: 'Polyester Blend',
    rating: 4.7,
    reviews: 89,
  },
  {
    id: '4',
    name: 'Casual Denim Jacket',
    type: 'jacket',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Denim Blue',
    price: 89.99,
    brand: 'Urban Denim',
    size: 'M',
    material: '100% Denim',
    rating: 4.6,
    reviews: 312,
  },
  {
    id: '5',
    name: 'Floral Summer Dress',
    type: 'dress',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Floral Print',
    price: 94.99,
    brand: 'Summer Vibes',
    size: 'M',
    material: 'Cotton Blend',
    rating: 4.5,
    reviews: 178,
  },
  {
    id: '6',
    name: 'Striped Cotton Shirt',
    type: 'shirt',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Blue & White',
    price: 65.99,
    brand: 'Casual Comfort',
    size: 'M',
    material: '100% Cotton',
    rating: 4.4,
    reviews: 267,
  },
  {
    id: '7',
    name: 'Red Evening Gown',
    type: 'dress',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Crimson Red',
    price: 199.99,
    brand: 'Glamour Elite',
    size: 'M',
    material: 'Silk Blend',
    rating: 4.9,
    reviews: 45,
  },
  {
    id: '8',
    name: 'Leather Jacket',
    type: 'jacket',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Black Leather',
    price: 249.99,
    brand: 'Rebel Style',
    size: 'M',
    material: 'Genuine Leather',
    rating: 4.8,
    reviews: 123,
  },
  {
    id: '9',
    name: 'Business Suit',
    type: 'jacket',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Charcoal Gray',
    price: 299.99,
    brand: 'Corporate Elite',
    size: 'M',
    material: 'Wool',
    rating: 4.9,
    reviews: 87,
  },
  {
    id: '10',
    name: 'Vintage Denim Shirt',
    type: 'shirt',
    image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'Light Blue',
    price: 72.99,
    brand: 'Retro Fashion',
    size: 'M',
    material: 'Denim',
    rating: 4.3,
    reviews: 198,
  },
];

export const outfitRecommendations: OutfitRecommendation[] = [
  {
    id: 'casual-1',
    name: 'Casual Weekend',
    items: [clothingItems[3], clothingItems[5]], // Denim jacket + striped shirt
    occasion: 'Weekend Casual',
    confidence: 0.92,
  },
  {
    id: 'business-1',
    name: 'Professional Meeting',
    items: [clothingItems[1], clothingItems[0]], // Navy blazer + white shirt
    occasion: 'Business Professional',
    confidence: 0.95,
  },
  {
    id: 'evening-1',
    name: 'Elegant Evening',
    items: [clothingItems[6]], // Red evening gown
    occasion: 'Formal Evening',
    confidence: 0.88,
  },
  {
    id: 'smart-casual-1',
    name: 'Smart Casual',
    items: [clothingItems[7], clothingItems[0]], // Leather jacket + white shirt
    occasion: 'Smart Casual',
    confidence: 0.85,
  },
];