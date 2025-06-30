import React, { useState } from 'react';
import { Carrot as Mirror, Palette, Sliders, RotateCcw, Download, Share2 } from 'lucide-react';
import { ClothingItem } from '../types/pose';

interface VirtualMirrorProps {
  selectedClothing: ClothingItem | null;
  pose: any;
  onColorChange: (color: string) => void;
  onSizeAdjust: (adjustment: number) => void;
}

const VirtualMirror: React.FC<VirtualMirrorProps> = ({
  selectedClothing,
  onColorChange,
  onSizeAdjust,
}) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sizeAdjustment, setSizeAdjustment] = useState(0);

  const colorOptions = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Navy', value: '#1E3A8A' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Green', value: '#059669' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Gray', value: '#6B7280' },
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handleSizeChange = (adjustment: number) => {
    setSizeAdjustment(adjustment);
    onSizeAdjust(adjustment);
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSizeAdjustment(0);
    setSelectedColor('#000000');
    onSizeAdjust(0);
    onColorChange('#000000');
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Mirror className="w-6 h-6 text-pink-600" />
          Virtual Mirror
        </h2>
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {selectedClothing ? (
        <div className="space-y-6">
          {/* Color Customization */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Options
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color.value
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Adjustment */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Size Adjustment
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Size: {sizeAdjustment > 0 ? '+' : ''}{sizeAdjustment}%</label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={sizeAdjustment}
                  onChange={(e) => handleSizeChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>

          {/* Visual Filters */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Visual Filters</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Brightness: {brightness}%</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contrast: {contrast}%</label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Saturation: {saturation}%</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Current Item Preview */}
          <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-2">Current Styling</h4>
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-16 rounded-lg border-2 border-gray-200"
                style={{
                  backgroundImage: `url(${selectedClothing.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                }}
              />
              <div>
                <p className="font-medium text-gray-800">{selectedClothing.name}</p>
                <p className="text-sm text-gray-600">Custom styled</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-xs text-gray-500">
                    Size: {sizeAdjustment > 0 ? '+' : ''}{sizeAdjustment}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Save Look
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Mirror className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a clothing item to start customizing</p>
        </div>
      )}
    </div>
  );
};

export default VirtualMirror;