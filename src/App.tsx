

import React, { useState, useEffect } from 'react';
import { Sparkles, User, TrendingUp } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import AnalysisResults from './components/AnalysisResults';
import { geminiService } from './services/geminiService';
import { StyleAnalysis, ClothingRecommendation, WishlistItem, UserProfile } from './types/fashion';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string>();
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<ClothingRecommendation[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<'upload' | 'results'>('upload');

  // Load saved data from localStorage and initialize Gemini API
  useEffect(() => {
    const savedWishlist = localStorage.getItem('fashion-wishlist');
    const savedProfile = localStorage.getItem('user-profile');
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey) {
      geminiService.initialize(apiKey);
    }

    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('fashion-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Save user profile to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('user-profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  const handleImageUpload = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisError(undefined);

    try {
      const analysisResult = await geminiService.analyzeBodyImage(file);
      setAnalysis(analysisResult);

      const outfitRecs = await geminiService.generateOutfitRecommendations(
        analysisResult.bodyShape,
        analysisResult.skinTone,
        analysisResult.measurements,
        'casual',
        [50, 300],
        ['comfortable', 'stylish', 'versatile']
      );

      const clothingRecommendations: ClothingRecommendation[] = outfitRecs.recommendations.map((rec: any, index: number) => ({
        id: `rec-${index}`,
        name: rec.name,
        category: rec.category,
        size: rec.size,
        color: rec.color,
        brand: rec.brand || 'Premium Brand',
        price: rec.price,
        image: '',
        matchScore: rec.matchScore,
        reasons: rec.reasons,
        occasion: rec.occasion,
        inStock: true,
        rating: 4.2 + Math.random() * 0.8,
        reviews: Math.floor(Math.random() * 500) + 50,
        url: `#product-${index}`
      }));

      setRecommendations(clothingRecommendations);

      const profile: UserProfile = {
        id: `user-${Date.now()}`,
        preferences: {
          style: ['casual', 'elegant'],
          colors: analysisResult.skinTone.recommendedColors,
          brands: [],
          priceRange: [50, 300],
          occasions: ['casual', 'work', 'evening']
        },
        measurements: analysisResult.measurements,
        bodyShape: analysisResult.bodyShape,
        skinTone: analysisResult.skinTone,
        demographics: analysisResult.demographics,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setUserProfile(profile);
      setActiveSection('results');

    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToWishlist = (item: ClothingRecommendation) => {
    const wishlistItem: WishlistItem = {
      id: item.id,
      productId: item.id,
      name: item.name,
      image: '',
      price: item.price,
      brand: item.brand,
      addedAt: new Date(),
      priority: 'medium'
    };

    setWishlistItems(prev => {
      const exists = prev.find(w => w.id === item.id);
      if (exists) return prev;
      return [...prev, wishlistItem];
    });
  };

  const resetAnalysis = () => {
    setAnalysis(null);
    setRecommendations([]);
    setActiveSection('upload');
    setAnalysisError(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Fashion Analyzer</h1>
                <p className="text-sm text-gray-600">Powered by Gemini AI</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {userProfile && (
                <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-2 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Profile Saved</span>
                </div>
              )}

              <button
                onClick={resetAnalysis}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {analysis && (
          <div className="mb-8">
            <div className="flex justify-center gap-2 bg-white rounded-2xl shadow-lg p-2 max-w-md mx-auto">
              {[
                { id: 'upload', label: 'Upload', icon: Sparkles },
                { id: 'results', label: 'Analysis', icon: TrendingUp }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Your Photo</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload a clear, full-body photo and let our AI analyze your body shape, measurements,
                and skin tone to provide personalized fashion recommendations.
              </p>
            </div>

            <ImageUploader
              onImageUpload={handleImageUpload}
              isAnalyzing={isAnalyzing}
              error={analysisError}
            />

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">What You'll Get</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: User,
                    title: 'Personal Analysis',
                    description: 'Demographics, current style, and outfit analysis'
                  },
                  {
                    icon: Sparkles,
                    title: 'Body Shape Detection',
                    description: 'AI determines your body type and provides specific recommendations'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Size Recommendations',
                    description: 'Accurate size suggestions across different clothing categories'
                  },
                  {
                    icon: Sparkles,
                    title: 'Style Improvement',
                    description: 'Specific suggestions to enhance your current look'
                  }
                ].map((feature, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'results' && analysis && (
          <AnalysisResults
            analysis={analysis}
            recommendations={recommendations}
            onAddToWishlist={handleAddToWishlist}
            wishlistItems={wishlistItems.map(item => item.id)}
          />
        )}

        {analysis && (
          <div className="mt-12 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Fashion Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">{recommendations.length}</span>
                </div>
                <h4 className="font-semibold text-gray-800">Recommendations</h4>
                <p className="text-gray-600 text-sm">Personalized items</p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-red-600">{wishlistItems.length}</span>
                </div>
                <h4 className="font-semibold text-gray-800">Wishlist</h4>
                <p className="text-gray-600 text-sm">Saved items</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">
                    {Math.round(analysis.confidence * 100)}%
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800">AI Confidence</h4>
                <p className="text-gray-600 text-sm">Analysis accuracy</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">AI Fashion Analyzer</span>
          </div>
          <p className="text-gray-400 text-sm">
            Powered by Gemini AI • Privacy-First Design • Personalized Fashion Intelligence
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
