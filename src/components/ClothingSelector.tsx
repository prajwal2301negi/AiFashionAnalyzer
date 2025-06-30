import React, { useState } from 'react';
import { ClothingItem } from '../types/pose';
import { Shirt, Package, Zap, Star, Heart, Filter, Search, Grid, List } from 'lucide-react';

interface ClothingSelectorProps {
  items: ClothingItem[];
  selectedItem: ClothingItem | null;
  onSelectItem: (item: ClothingItem) => void;
  favorites: ClothingItem[];
  onToggleFavorite: (item: ClothingItem) => void;
}

const ClothingSelector: React.FC<ClothingSelectorProps> = ({
  items,
  selectedItem,
  onSelectItem,
  favorites,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'shirt':
        return <Shirt className="w-4 h-4" />;
      case 'jacket':
        return <Package className="w-4 h-4" />;
      case 'dress':
        return <Zap className="w-4 h-4" />;
      default:
        return <Shirt className="w-4 h-4" />;
    }
  };

  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.color.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesFavorites = !showFavoritesOnly || favorites.some(fav => fav.id === item.id);
      
      return matchesSearch && matchesType && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const uniqueTypes = Array.from(new Set(items.map(item => item.type)));

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Package className="w-6 h-6 text-indigo-600" />
          Smart Wardrobe
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`p-2 rounded-lg transition-colors ${
              showFavoritesOnly 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search clothing, brands, colors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}s
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating')}
            className="px-3 py-1 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </select>

          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm">
            <Filter className="w-3 h-3" />
            <span>{filteredAndSortedItems.length} items</span>
          </div>
        </div>
      </div>

      {/* Clothing Items */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 gap-4' 
          : 'space-y-3'
      } max-h-96 overflow-y-auto`}>
        {filteredAndSortedItems.map((item) => {
          const isFavorite = favorites.some(fav => fav.id === item.id);
          
          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`cursor-pointer rounded-xl p-4 transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                selectedItem?.id === item.id
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className={`flex items-center gap-4 ${viewMode === 'list' ? '' : 'flex-col text-center'}`}>
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`object-cover rounded-lg ${
                      viewMode === 'grid' ? 'w-full h-32' : 'w-16 h-16'
                    }`}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item);
                    }}
                    className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                      isFavorite 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white bg-opacity-80 text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className={`flex-1 ${viewMode === 'grid' ? 'w-full' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(item.type)}
                    <h3 className="font-semibold text-sm text-gray-800">
                      {item.name}
                    </h3>
                  </div>
                  
                  {item.brand && (
                    <p className="text-xs text-gray-500 mb-1">{item.brand}</p>
                  )}
                  
                  <p className="text-xs text-gray-600 mb-1">{item.color}</p>
                  
                  {item.material && (
                    <p className="text-xs text-gray-500 mb-2">{item.material}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-indigo-600">
                      ${item.price}
                    </p>
                    
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{item.rating}</span>
                        {item.reviews && (
                          <span className="text-xs text-gray-500">({item.reviews})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No items found matching your criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setShowFavoritesOnly(false);
            }}
            className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-gray-800">{items.length}</p>
            <p className="text-xs text-gray-500">Total Items</p>
          </div>
          <div>
            <p className="text-lg font-bold text-red-600">{favorites.length}</p>
            <p className="text-xs text-gray-500">Favorites</p>
          </div>
          <div>
            <p className="text-lg font-bold text-indigo-600">{uniqueTypes.length}</p>
            <p className="text-xs text-gray-500">Categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingSelector;