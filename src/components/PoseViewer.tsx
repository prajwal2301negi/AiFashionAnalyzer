import React, { useEffect, useState } from 'react';
import { Camera, CameraOff, Loader, ChevronLeft, ChevronRight, Hand, Download, Heart, Star, Ruler, Zap } from 'lucide-react';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { ClothingItem } from '../types/pose';

interface PoseViewerProps {
  selectedClothing: ClothingItem | null;
  onNavigateClothing: (direction: 'prev' | 'next') => void;
  onToggleFavorite: (item: ClothingItem) => void;
  favorites: ClothingItem[];
}

const PoseViewer: React.FC<PoseViewerProps> = ({ 
  selectedClothing, 
  onNavigateClothing, 
  onToggleFavorite,
  favorites 
}) => {
  const {
    videoRef,
    canvasRef,
    currentPose,
    gestureState,
    bodyMeasurements,
    fittingAnalysis,
    isLoading,
    startCamera,
    stopCamera,
    takeScreenshot,
    analyzeFit,
  } = usePoseDetection();
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [poseConfidence, setPoseConfidence] = useState(0);
  const [clothingOverlay, setClothingOverlay] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [showMeasurements, setShowMeasurements] = useState(false);

  useEffect(() => {
    if (currentPose) {
      setPoseConfidence(Math.round(currentPose.score * 100));
      
      // Calculate clothing overlay position based on shoulders
      const leftShoulder = currentPose.keypoints.find(kp => kp.part === 'leftShoulder');
      const rightShoulder = currentPose.keypoints.find(kp => kp.part === 'rightShoulder');
      
      if (leftShoulder && rightShoulder && leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
        const shoulderWidth = Math.abs(leftShoulder.position.x - rightShoulder.position.x);
        const fixedRatio = 262 / 190;
        const shirtRatioHeightWidth = 581 / 440;
        
        const clothingWidth = shoulderWidth * fixedRatio;
        const clothingHeight = clothingWidth * shirtRatioHeightWidth;
        
        const centerX = (leftShoulder.position.x + rightShoulder.position.x) / 2;
        const centerY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
        
        setClothingOverlay({
          width: clothingWidth,
          height: clothingHeight,
          x: centerX - clothingWidth / 2,
          y: centerY - clothingHeight / 4,
        });
      }
    }
  }, [currentPose]);

  // Handle gesture navigation
  useEffect(() => {
    if (gestureState.leftCounter >= 5) {
      onNavigateClothing('prev');
    } else if (gestureState.rightCounter >= 5) {
      onNavigateClothing('next');
    }
  }, [gestureState.leftCounter, gestureState.rightCounter, onNavigateClothing]);

  // Analyze fit when clothing or measurements change
  useEffect(() => {
    if (selectedClothing && bodyMeasurements && bodyMeasurements.confidence > 0.5) {
      const analysis = analyzeFit(bodyMeasurements, selectedClothing.type);
      // setFittingAnalysis(analysis); // This would need to be implemented in the hook
    }
  }, [selectedClothing, bodyMeasurements, analyzeFit]);

  const handleStartCamera = async () => {
    await startCamera();
    setIsCameraActive(true);
  };

  const handleStopCamera = () => {
    stopCamera();
    setIsCameraActive(false);
  };

  const handleTakeScreenshot = () => {
    const screenshot = takeScreenshot();
    if (screenshot) {
      setScreenshots(prev => [...prev, screenshot]);
      
      // Download the screenshot
      const link = document.createElement('a');
      link.download = `virtual-tryroom-${Date.now()}.png`;
      link.href = screenshot;
      link.click();
    }
  };

  const isFavorite = selectedClothing ? favorites.some(fav => fav.id === selectedClothing.id) : false;

  const getFitColor = (fit: string) => {
    switch (fit) {
      case 'perfect': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'loose': return 'text-yellow-600 bg-yellow-100';
      case 'tight': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Camera className="w-6 h-6 text-indigo-600" />
          AI Virtual Try Room
        </h2>
        <div className="flex items-center gap-3">
          {currentPose && (
            <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Pose: {poseConfidence}%
            </div>
          )}
          {bodyMeasurements && (
            <button
              onClick={() => setShowMeasurements(!showMeasurements)}
              className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-purple-200 transition-colors"
            >
              <Ruler className="w-3 h-3" />
              Measurements
            </button>
          )}
          {(gestureState.leftHandUp || gestureState.rightHandUp) && (
            <div className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
              <Hand className="w-3 h-3" />
              Gesture Active
            </div>
          )}
          {gestureState.thumbsUp && (
            <div className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              👍 Thumbs Up!
            </div>
          )}
          {gestureState.wave && (
            <div className="text-xs bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
              👋 Wave Detected!
            </div>
          )}
          <button
            onClick={isCameraActive ? handleStopCamera : handleStartCamera}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isCameraActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } disabled:opacity-50`}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : isCameraActive ? (
              <CameraOff className="w-4 h-4" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            {isLoading ? 'Loading AI...' : isCameraActive ? 'Stop Camera' : 'Start Camera'}
          </button>
        </div>
      </div>

      <div className="relative bg-gray-900 rounded-xl overflow-hidden" style={{ height: '480px' }}>
        {!isCameraActive && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
            <div className="text-center">
              <Camera className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-2">Ready for AI Fashion Experience?</p>
              <p className="text-gray-500 text-sm mb-4">Advanced pose detection with body measurements</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 max-w-md">
                <div className="flex items-center gap-1">
                  <Hand className="w-3 h-3" />
                  <span>Raise left hand: Previous</span>
                </div>
                <div className="flex items-center gap-1">
                  <Hand className="w-3 h-3" />
                  <span>Raise right hand: Next</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👍</span>
                  <span>Thumbs up: Like item</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>👋</span>
                  <span>Wave: Take screenshot</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading Advanced AI Model...</p>
              <p className="text-gray-500 text-sm mt-2">Preparing pose detection & body analysis</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: isCameraActive ? 'block' : 'none' }}
          muted
          playsInline
        />

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ display: isCameraActive ? 'block' : 'none' }}
        />

        {/* Virtual Clothing Overlay */}
        {selectedClothing && clothingOverlay && isCameraActive && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `${clothingOverlay.x}px`,
              top: `${clothingOverlay.y}px`,
              width: `${clothingOverlay.width}px`,
              height: `${clothingOverlay.height}px`,
            }}
          >
            <img
              src={selectedClothing.image}
              alt={selectedClothing.name}
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              style={{
                filter: 'brightness(1.2) contrast(1.1)',
              }}
            />
          </div>
        )}

        {/* Advanced Controls */}
        {isCameraActive && (
          <>
            <button
              onClick={() => onNavigateClothing('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => onNavigateClothing('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Screenshot Button */}
            <button
              onClick={handleTakeScreenshot}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Favorite Button */}
            {selectedClothing && (
              <button
                onClick={() => onToggleFavorite(selectedClothing)}
                className={`absolute top-4 right-16 p-3 rounded-full transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500 bg-opacity-80 text-white' 
                    : 'bg-black bg-opacity-50 hover:bg-opacity-70 text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </>
        )}

        {/* Body Measurements Overlay */}
        {showMeasurements && bodyMeasurements && isCameraActive && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-sm">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Body Measurements
            </h4>
            <div className="space-y-1">
              <p>Shoulder: {Math.round(bodyMeasurements.shoulderWidth)}px</p>
              <p>Chest: {Math.round(bodyMeasurements.chestWidth)}px</p>
              <p>Waist: {Math.round(bodyMeasurements.waistWidth)}px</p>
              <p>Torso: {Math.round(bodyMeasurements.torsoLength)}px</p>
              <p>Confidence: {Math.round(bodyMeasurements.confidence * 100)}%</p>
            </div>
          </div>
        )}

        {/* Fit Analysis */}
        {fittingAnalysis && selectedClothing && isCameraActive && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-sm max-w-xs">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Fit Analysis
            </h4>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getFitColor(fittingAnalysis.fit)}`}>
              {fittingAnalysis.fit.toUpperCase()} FIT
            </div>
            <p className="text-xs opacity-80">
              Confidence: {Math.round(fittingAnalysis.confidence * 100)}%
            </p>
            {fittingAnalysis.recommendations.length > 0 && (
              <div className="mt-2">
                <p className="text-xs font-medium">Recommendations:</p>
                {fittingAnalysis.recommendations.map((rec, index) => (
                  <p key={index} className="text-xs opacity-80">• {rec}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Item Info */}
        {selectedClothing && currentPose && isCameraActive && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white px-4 py-3 rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={selectedClothing.image}
                alt={selectedClothing.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium">{selectedClothing.name}</p>
                <p className="text-xs opacity-80">{selectedClothing.brand}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs">${selectedClothing.price}</span>
                  {selectedClothing.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{selectedClothing.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Item Details */}
      {selectedClothing && (
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <div className="flex items-center gap-4">
            <img
              src={selectedClothing.image}
              alt={selectedClothing.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-800">{selectedClothing.name}</h3>
                <button
                  onClick={() => onToggleFavorite(selectedClothing)}
                  className={`p-1 rounded-full transition-colors ${
                    isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-1">{selectedClothing.brand} • {selectedClothing.material}</p>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-indigo-600">${selectedClothing.price}</span>
                {selectedClothing.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{selectedClothing.rating}</span>
                    <span className="text-xs text-gray-500">({selectedClothing.reviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Advanced AI Controls</p>
              <p className="text-xs text-gray-500">Gestures • Voice • Touch</p>
            </div>
          </div>
        </div>
      )}

      {/* Screenshots Gallery */}
      {screenshots.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Screenshots ({screenshots.length})
          </h4>
          <div className="flex gap-2 overflow-x-auto">
            {screenshots.slice(-5).map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = `screenshot-${index + 1}.png`;
                  link.href = screenshot;
                  link.click();
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PoseViewer;