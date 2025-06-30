import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Made with</span>
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-gray-400">using AI & Computer Vision</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>Real-time Pose Detection</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Open Source Technology</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Virtual Try Room • AI Fashion Technology • Privacy-First Design</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;