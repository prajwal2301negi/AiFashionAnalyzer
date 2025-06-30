import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  Filter, 
  TrendingUp, 
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  Users,
  MessageCircle,
  Camera,
  Zap
} from 'lucide-react';
import { ClothingRecommendation, WishlistItem } from '../types/fashion';

interface ShoppingFeaturesProps {
  recommendations: ClothingRecommendation[];
  wishlistItems: WishlistItem[];
  onAddToCart: (item: ClothingRecommendation) => void;
  onRemoveFromWishlist: (itemId: string) => void;
}

const ShoppingFeatures: React.FC<ShoppingFeaturesProps> = ({
  recommendations,
  wishlistItems,
  onAddToCart,
  onRemoveFromWishlist
}) => {
  const [activeFeature, setActiveFeature] = useState<'wishlist' | 'compare' | 'social' | 'ar'>('wishlist');
  const [compareItems, setCompareItems] = useState<ClothingRecommendation[]>([]);

  const addToCompare = (item: ClothingRecommendation) => {
    if (compareItems.length < 3 && !compareItems.find(i => i.id === item.id)) {
      setCompareItems([...compareItems, item]);
    }
  };

  const removeFromCompare = (itemId: string) => {
    setCompareItems(compareItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Feature Navigation */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Smart Shopping Features</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistItems.length },
            { id: 'compare', label: 'Compare', icon: Filter, count: compareItems.length },
            { id: 'social', label: 'Social Shopping', icon: Users },
            { id: 'ar', label: 'AR Try-On', icon: Camera }
          ].map(feature => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeFeature === feature.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <feature.icon className="w-4 h-4" />
              {feature.label}
              {feature.count !== undefined && feature.count > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {feature.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Wishlist Feature */}
      {activeFeature === 'wishlist' && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Your Wishlist ({wishlistItems.length})
            </h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Share Wishlist
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Add All to Cart
              </button>
            </div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">Your wishlist is empty</h4>
              <p className="text-gray-500">Add items from your recommendations to save them for later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  {/* No Image - Just Icon */}
                  <div className="relative bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg mb-4">
                    <Package className="w-12 h-12 text-red-600 mx-auto" />
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.priority} priority
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-800 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                  <p className="text-lg font-bold text-blue-600 mb-3">${item.price}</p>
                  
                  {item.notes && (
                    <p className="text-xs text-gray-500 mb-3 italic">"{item.notes}"</p>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onAddToCart(item as any)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Compare Feature */}
      {activeFeature === 'compare' && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-500" />
              Compare Products ({compareItems.length}/3)
            </h3>
            <button
              onClick={() => setCompareItems([])}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>

          {compareItems.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">No items to compare</h4>
              <p className="text-gray-500 mb-4">Add up to 3 items to compare their features</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {recommendations.slice(0, 3).map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded mb-2">
                      <Package className="w-8 h-8 text-blue-600 mx-auto" />
                    </div>
                    <h5 className="font-medium text-sm mb-1">{item.name}</h5>
                    <p className="text-xs text-gray-600 mb-2">${item.price}</p>
                    <button
                      onClick={() => addToCompare(item)}
                      className="w-full bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Add to Compare
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Feature</th>
                    {compareItems.map((item) => (
                      <th key={item.id} className="text-center py-3 px-4 min-w-48">
                        <div className="relative">
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg mx-auto mb-2 w-20 h-20 flex items-center justify-center">
                            <Package className="w-8 h-8 text-blue-600" />
                          </div>
                          <button
                            onClick={() => removeFromCompare(item.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                        <h4 className="font-medium text-sm">{item.name}</h4>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Price', key: 'price', format: (val: any) => `$${val}` },
                    { label: 'Brand', key: 'brand' },
                    { label: 'Size', key: 'size' },
                    { label: 'Color', key: 'color' },
                    { label: 'Match Score', key: 'matchScore', format: (val: any) => `${Math.round(val * 100)}%` },
                    { label: 'Rating', key: 'rating', format: (val: any) => `${val}/5` },
                    { label: 'Reviews', key: 'reviews' }
                  ].map((feature) => (
                    <tr key={feature.key} className="border-b">
                      <td className="py-3 px-4 font-medium text-gray-700">{feature.label}</td>
                      {compareItems.map((item) => (
                        <td key={item.id} className="py-3 px-4 text-center">
                          {feature.format ? feature.format((item as any)[feature.key]) : (item as any)[feature.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Social Shopping Feature */}
      {activeFeature === 'social' && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            Social Shopping
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Style Community */}
            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Style Community
              </h4>
              
              <div className="space-y-3">
                {[
                  { user: 'Sarah M.', body: 'Similar body type', comment: 'This dress looks amazing! Perfect for summer events.', item: 'Floral Midi Dress', rating: 5 },
                  { user: 'Emma K.', body: 'Same measurements', comment: 'Great fit and quality. Size M was perfect for me.', item: 'Classic White Shirt', rating: 4 },
                  { user: 'Lisa R.', body: 'Similar style', comment: 'Love the color! Goes well with everything in my wardrobe.', item: 'Navy Blazer', rating: 5 }
                ].map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-purple-600">{review.user[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{review.user}</p>
                          <p className="text-xs text-purple-600">{review.body}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">"{review.comment}"</p>
                    <p className="text-xs text-gray-500">on {review.item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Styles */}
            <div className="border border-gray-200 rounded-xl p-4">
              <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending for Your Body Type
              </h4>
              
              <div className="space-y-3">
                {[
                  { trend: 'High-waisted jeans', popularity: 89, reason: 'Flatters your waist' },
                  { trend: 'Wrap dresses', popularity: 76, reason: 'Perfect for your shape' },
                  { trend: 'Structured blazers', popularity: 82, reason: 'Enhances shoulders' },
                  { trend: 'A-line skirts', popularity: 71, reason: 'Balances proportions' }
                ].map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{trend.trend}</p>
                      <p className="text-xs text-gray-600">{trend.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">{trend.popularity}%</p>
                      <p className="text-xs text-gray-500">popular</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AR Try-On Feature */}
      {activeFeature === 'ar' && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Camera className="w-5 h-5 text-green-500" />
            AR Virtual Try-On
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Try Before You Buy</h4>
                <p className="text-gray-600">Use your camera to see how clothes look on you</p>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <Camera className="w-4 h-4" />
                  Start AR Try-On
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-700">3D Fitting</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <RotateCcw className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-700">360° View</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-4">AR-Ready Items</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {recommendations.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-2 rounded">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 text-sm">{item.name}</h5>
                      <p className="text-xs text-gray-600">{item.brand} • ${item.price}</p>
                    </div>
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                      Try AR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* E-commerce Features */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Premium Shopping Experience</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <Truck className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-800 mb-2">Free Shipping</h4>
            <p className="text-sm text-gray-600">On orders over $75</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
            <RotateCcw className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-800 mb-2">Easy Returns</h4>
            <p className="text-sm text-gray-600">30-day return policy</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-800 mb-2">Secure Payment</h4>
            <p className="text-sm text-gray-600">256-bit SSL encryption</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
            <CreditCard className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <h4 className="font-medium text-gray-800 mb-2">Flexible Payment</h4>
            <p className="text-sm text-gray-600">Buy now, pay later</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingFeatures;