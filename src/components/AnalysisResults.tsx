import React, { useState } from 'react';
import { StyleAnalysis, ClothingRecommendation } from '../types/fashion';
import { 
  Ruler, 
  Palette, 
  Star, 
  Heart, 
  ShoppingBag, 
  TrendingUp,
  Filter,
  Sparkles,
  Package
} from 'lucide-react';
import PersonalAnalysis from './PersonalAnalysis';

interface AnalysisResultsProps {
  analysis: StyleAnalysis;
  recommendations: ClothingRecommendation[];
  onAddToWishlist: (item: ClothingRecommendation) => void;
  wishlistItems: string[];
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  analysis, 
  recommendations, 
  onAddToWishlist,
  wishlistItems 
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'measurements' | 'recommendations' | 'styling'>('personal');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'match' | 'price' | 'rating'>('match');

  const getBodyShapeIcon = (shape: string) => {
    const icons: Record<string, string> = {
      'rectangle': '▭',
      'pear': '🍐',
      'apple': '🍎',
      'hourglass': '⧗',
      'inverted-triangle': '▽',
      'oval': '⭕'
    };
    return icons[shape] || '👤';
  };

  const getSkinToneColor = (category: string) => {
    const colors: Record<string, string> = {
      'warm': '#D97706',
      'cool': '#2563EB', 
      'neutral': '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  const filteredRecommendations = recommendations
    .filter(item => filterCategory === 'all' || item.category === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.matchScore - a.matchScore;
      }
    });

  const categories = Array.from(new Set(recommendations.map(item => item.category)));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Your Fashion Analysis</h2>
          {/* <div className="flex gap-2"> */}
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button> */}
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Share2 className="w-4 h-4" />
              Share Results
            </button> */}
          {/* </div> */}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'personal', label: 'Personal Analysis', icon: Sparkles },
            { id: 'measurements', label: 'Measurements', icon: Ruler },
            { id: 'recommendations', label: 'Recommendations', icon: ShoppingBag },
            { id: 'styling', label: 'Style Tips', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Personal Analysis Tab */}
      {activeTab === 'personal' && (
        <PersonalAnalysis
          demographics={analysis.demographics}
          currentOutfit={analysis.currentOutfit}
          outfitImprovement={analysis.outfitImprovement}
          bodyShape={analysis.bodyShape}
          skinTone={analysis.skinTone}
        />
      )}

      {/* Measurements Tab */}
      {activeTab === 'measurements' && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Body Measurements</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Chest', value: analysis.measurements.chest, unit: analysis.measurements.unit },
              { label: 'Waist', value: analysis.measurements.waist, unit: analysis.measurements.unit },
              { label: 'Hips', value: analysis.measurements.hips, unit: analysis.measurements.unit },
              { label: 'Shoulders', value: analysis.measurements.shoulders, unit: analysis.measurements.unit },
              { label: 'Arm Length', value: analysis.measurements.armLength, unit: analysis.measurements.unit },
              { label: 'Leg Length', value: analysis.measurements.legLength, unit: analysis.measurements.unit },
              { label: 'Neck', value: analysis.measurements.neckSize, unit: analysis.measurements.unit },
            ].map((measurement, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {measurement.value}{measurement.unit}
                </div>
                <div className="text-sm text-gray-600">{measurement.label}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Measurement Accuracy</span>
            </div>
            <p className="text-sm text-yellow-700">
              Confidence: {Math.round(analysis.measurements.confidence * 100)}% - 
              These measurements are AI estimates. For best fit, consider professional measuring.
            </p>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Filter:</span>
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="match">Best Match</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <div className="ml-auto text-sm text-gray-600">
                {filteredRecommendations.length} items found
              </div>
            </div>
          </div>

          {/* Recommendations Grid - Text Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                {/* No Image - Just Icon */}
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-8">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {Math.round(item.matchScore * 100)}% match
                    </div>
                    <button
                      onClick={() => onAddToWishlist(item)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                        wishlistItems.includes(item.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlistItems.includes(item.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{item.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-1 text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-blue-600">${item.price}</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      Size {item.size}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color.toLowerCase() }}></div>
                      <span className="text-sm text-gray-600">{item.color}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.occasion.slice(0, 2).map((occ, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {occ}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <h5 className="text-xs font-medium text-gray-700">Why it's perfect for you:</h5>
                    {item.reasons.slice(0, 2).map((reason, index) => (
                      <p key={index} className="text-xs text-gray-600">• {reason}</p>
                    ))}
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all">
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Style Guide</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Do's for Your Body Type
              </h4>
              <div className="space-y-3">
                {analysis.bodyShape.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-green-800">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-blue-600" />
                Color Recommendations
              </h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Best Colors for You:</h5>
                  <div className="grid grid-cols-4 gap-2">
                    {analysis.skinTone.recommendedColors.map((color, index) => (
                      <div key={index} className="text-center">
                        <div 
                          className="w-8 h-8 rounded-full mx-auto mb-1 border-2 border-gray-200"
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></div>
                        <span className="text-xs text-gray-600">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Colors to Avoid:</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skinTone.avoidColors.map((color, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-1">Seasonal Palette:</h5>
                  <p className="text-blue-700 text-sm">{analysis.skinTone.seasonalPalette}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;