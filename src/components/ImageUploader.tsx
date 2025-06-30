import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, X, AlertCircle, CheckCircle } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isAnalyzing: boolean;
  error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isAnalyzing, error }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const clearImage = () => {
    setUploadedImage(null);
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Photo</h2>
          <p className="text-gray-600">Get personalized fashion analysis powered by AI</p>
        </div>

        {!uploadedImage ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive || dragActive
                ? 'border-purple-400 bg-purple-50'
                : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-purple-600' : 'text-gray-400'}`} />
            
            {isDragActive ? (
              <p className="text-purple-600 font-medium">Drop your photo here!</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  <span className="font-medium text-gray-800">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">Full body preferred</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Good lighting</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Clear background</span>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-96 object-contain"
              />
              
              {!isAnalyzing && (
                <button
                  onClick={clearImage}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {isAnalyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-800 font-medium">Analyzing your photo...</p>
                    <p className="text-sm text-gray-600 mt-1">This may take a few moments</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Body shape analysis</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Skin tone detection</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Size recommendations</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;