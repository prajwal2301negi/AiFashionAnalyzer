

import React from 'react';
import {
  User,
  Calendar,
  Star,
  Sparkles,
  TrendingUp,
  Eye,
  Ruler,
} from 'lucide-react';
import {
  Demographics,
  CurrentOutfit,
  OutfitImprovement,
  BodyShape,
  SkinTone,
} from '../types/fashion';

interface PersonalAnalysisProps {
  demographics: Demographics;
  currentOutfit: CurrentOutfit;
  outfitImprovement: OutfitImprovement;
  bodyShape: BodyShape;
  skinTone: SkinTone;
}

const PersonalAnalysis: React.FC<PersonalAnalysisProps> = ({
  demographics,
  currentOutfit,
  outfitImprovement,
  bodyShape,
  skinTone,
}) => {
  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'female':
        return '♀️';
      case 'male':
        return '♂️';
      default:
        return '⚧️';
    }
  };

  const getFitColor = (fit: string) => {
    switch (fit) {
      case 'fitted':
        return 'bg-green-100 text-green-800';
      case 'loose':
        return 'bg-blue-100 text-blue-800';
      case 'oversized':
        return 'bg-yellow-100 text-yellow-800';
      case 'tight':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Personal Analysis Header */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          Personal Analysis
        </h2>
        <p className="text-gray-600">AI-detected personal characteristics</p>
      </div>

      {/* Demographics */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Demographics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <div className="text-3xl mb-2">{getGenderIcon(demographics.gender)}</div>
            <h4 className="font-bold text-gray-800 mb-1">Gender</h4>
            <p className="text-gray-600 capitalize">{demographics.gender}</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800 mb-1">Age Range</h4>
            <p className="text-gray-600">{demographics.ageRange}</p>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
            <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-bold text-gray-800 mb-1">Confidence</h4>
            <p className="text-gray-600">{Math.round(demographics.confidence * 100)}%</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-xl">
          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Current Style
          </h4>
          <p className="text-purple-800 font-medium capitalize mb-2">{demographics.currentStyle}</p>
          <p className="text-gray-700 text-sm">{demographics.styleDescription}</p>
        </div>
      </div>

      {/* Current Outfit Analysis */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-green-600" />
          Current Outfit Analysis
        </h3>
        <p className="text-gray-600 mb-6">What you're wearing right now</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Wear */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              Top Wear
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-800">{currentOutfit.topWear.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: currentOutfit.topWear.color.toLowerCase() }}
                  ></div>
                  <span className="font-medium text-gray-800">{currentOutfit.topWear.color}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fit:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getFitColor(
                    currentOutfit.topWear.fit
                  )}`}
                >
                  {currentOutfit.topWear.fit}
                </span>
              </div>
              {currentOutfit.topWear.material && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium text-gray-800">{currentOutfit.topWear.material}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Wear */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              Bottom Wear
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-800">{currentOutfit.bottomWear.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: currentOutfit.bottomWear.color.toLowerCase() }}
                  ></div>
                  <span className="font-medium text-gray-800">{currentOutfit.bottomWear.color}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fit:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getFitColor(
                    currentOutfit.bottomWear.fit
                  )}`}
                >
                  {currentOutfit.bottomWear.fit}
                </span>
              </div>
              {currentOutfit.bottomWear.material && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium text-gray-800">{currentOutfit.bottomWear.material}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-bold text-gray-800 mb-3">Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600">Footwear:</span>
              <span className="ml-2 font-medium text-gray-800">{currentOutfit.footwear}</span>
            </div>
            <div>
              <span className="text-gray-600">Accessories:</span>
              <span className="ml-2 font-medium text-gray-800">
                {currentOutfit.accessories.length > 0
                  ? currentOutfit.accessories.join(', ')
                  : 'none visible'}
              </span>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm">{currentOutfit.overallFit}</p>
          </div>
        </div>
      </div>

      {/* Body Shape */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-purple-600" />
          Body Analysis
        </h3>
        <p className="text-gray-600 mb-4">AI-powered body shape detection</p>

        <div className="text-center mb-4">
          <div className="text-4xl mb-2">📐</div>
          <h4 className="text-xl font-bold text-gray-800 mb-1">Body Shape</h4>
          <p className="text-2xl font-bold text-purple-600 capitalize mb-2">{bodyShape.type}</p>
          <div className="flex items-center justify-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">
              {Math.round(bodyShape.confidence * 100)}% confidence
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{bodyShape.description}</p>

        <div className="space-y-2">
          <h5 className="font-medium text-gray-800">Key Characteristics:</h5>
          {bodyShape.characteristics.slice(0, 3).map((char, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>{char}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Recommended Sizes */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Best Colors for You</h3>
        <p className="text-sm text-gray-600 mb-4">
          Based on your skin tone, these colors will enhance your appearance and work well across outfits:
        </p>
        <div className="flex flex-wrap gap-2">
          {skinTone.recommendedColors.map((color, index) => (
            <span
              key={index}
              className="text-sm px-3 py-1 rounded-full font-medium text-white shadow"
              style={{ backgroundColor: color.toLowerCase() }}
            >
              {color}
            </span>
          ))}
        </div>
      </div>

      {/* Outfit Improvement */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Outfit Improvement
        </h3>
        <p className="text-gray-600 mb-6">Ways to enhance your current look</p>

        <div className="space-y-4">
          {outfitImprovement.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-green-800 font-medium mb-1">{suggestion}</p>
                {outfitImprovement.reasoning[index] && (
                  <p className="text-green-700 text-sm">{outfitImprovement.reasoning[index]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Tips */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {outfitImprovement.accessoryTips.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Accessory Tips:</h4>
              <ul className="space-y-1">
                {outfitImprovement.accessoryTips.map((tip, index) => (
                  <li key={index} className="text-blue-700 text-sm">• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {outfitImprovement.colorRecommendations.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Color Suggestions:</h4>
              <div className="flex flex-wrap gap-2">
                {outfitImprovement.colorRecommendations.map((color, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalAnalysis;
