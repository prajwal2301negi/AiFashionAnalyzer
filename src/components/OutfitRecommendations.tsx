import React from 'react';
import { OutfitRecommendation} from '../types/pose';
import { Sparkles, TrendingUp, Calendar, Star } from 'lucide-react';

interface OutfitRecommendationsProps {
  recommendations: OutfitRecommendation[];
  onSelectOutfit: (outfit: OutfitRecommendation) => void;
  currentWeather?: string;
  occasion?: string;
}

const OutfitRecommendations: React.FC<OutfitRecommendationsProps> = ({
  recommendations,
  onSelectOutfit,
  currentWeather = 'sunny',
  occasion = 'casual',
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-100';
    if (confidence >= 0.8) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getOccasionIcon = (occasion: string) => {
    switch (occasion.toLowerCase()) {
      case 'business':
      case 'professional':
        return '💼';
      case 'casual':
      case 'weekend':
        return '👕';
      case 'formal':
      case 'evening':
        return '🌟';
      case 'party':
        return '🎉';
      default:
        return '👔';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          AI Outfit Recommendations
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="capitalize">{occasion}</span>
          <span>•</span>
          <span className="capitalize">{currentWeather}</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recommendations.map((outfit) => (
          <div
            key={outfit.id}
            onClick={() => onSelectOutfit(outfit)}
            className="cursor-pointer p-4 rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getOccasionIcon(outfit.occasion)}</span>
                <h3 className="font-semibold text-gray-800">{outfit.name}</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(outfit.confidence)}`}>
                {Math.round(outfit.confidence * 100)}% match
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{outfit.occasion}</p>

            <div className="flex items-center gap-3 overflow-x-auto">
              {outfit.items.map((item, index) => (
                <div key={item.id} className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-center max-w-12 truncate">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">
                  {outfit.items.length} item{outfit.items.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="text-sm font-bold text-purple-600">
                ${outfit.items.reduce((total, item) => total + item.price, 0).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No outfit recommendations available</p>
          <p className="text-sm mt-1">Try different filters or add more items to your wardrobe</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>AI-Powered Styling</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Trend Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitRecommendations;