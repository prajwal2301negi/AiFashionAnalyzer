export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  preferences: {
    style: string[];
    colors: string[];
    brands: string[];
    priceRange: [number, number];
    occasions: string[];
  };
  measurements: BodyMeasurements;
  bodyShape: BodyShape;
  skinTone: SkinTone;
  demographics: Demographics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Demographics {
  gender: 'male' | 'female' | 'non-binary';
  ageRange: string;
  confidence: number;
  currentStyle: string;
  styleDescription: string;
}

export interface CurrentOutfit {
  topWear: {
    type: string;
    color: string;
    fit: 'loose' | 'fitted' | 'oversized' | 'tight';
    material?: string;
  };
  bottomWear: {
    type: string;
    color: string;
    fit: 'loose' | 'fitted' | 'oversized' | 'tight';
    material?: string;
  };
  footwear: string;
  accessories: string[];
  overallFit: string;
  styleNotes: string;
}

export interface OutfitImprovement {
  suggestions: string[];
  reasoning: string[];
  alternativeItems: string[];
  colorRecommendations: string[];
  accessoryTips: string[];
  stylingTips: string[];
}

export interface BodyMeasurements {
  height?: number;
  weight?: number;
  chest: number;
  waist: number;
  hips: number;
  shoulders: number;
  armLength: number;
  legLength: number;
  neckSize: number;
  confidence: number;
  unit: 'cm' | 'inches';
}

export interface BodyShape {
  type: 'rectangle' | 'pear' | 'apple' | 'hourglass' | 'inverted-triangle' | 'oval';
  confidence: number;
  description: string;
  recommendations: string[];
  characteristics: string[];
}

export interface SkinTone {
  category: 'warm' | 'cool' | 'neutral';
  subcategory: string;
  confidence: number;
  recommendedColors: string[];
  avoidColors: string[];
  seasonalPalette: string;
}

export interface ClothingRecommendation {
  id: string;
  name: string;
  category: string;
  size: string;
  color: string;
  brand: string;
  price: number;
  image: string; // Now empty string - no images
  matchScore: number;
  reasons: string[];
  occasion: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  url?: string;
  improvementType?: 'current' | 'alternative' | 'accessory';
}

export interface StyleAnalysis {
  bodyShape: BodyShape;
  skinTone: SkinTone;
  measurements: BodyMeasurements;
  demographics: Demographics;
  currentOutfit: CurrentOutfit;
  outfitImprovement: OutfitImprovement;
  recommendations: {
    clothing: ClothingRecommendation[];
    colors: string[];
    styles: string[];
    sizes: Record<string, string>;
    
  };
  confidence: number;
  analysisDate: Date;
}

export interface ShoppingPreferences {
  budget: [number, number];
  preferredBrands: string[];
  avoidedBrands: string[];
  stylePreferences: string[];
  occasionNeeds: string[];
  colorPreferences: string[];
  sizePreferences: Record<string, string>;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string; // Now empty string - no images
  price: number;
  brand: string;
  addedAt: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

export interface OutfitCombination {
  id: string;
  name: string;
  items: ClothingRecommendation[];
  occasion: string;
  season: string;
  totalPrice: number;
  matchScore: number;
  createdAt: Date;
}