import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Virtual Try Room</h1>
              <p className="text-indigo-100">AI-Powered Fashion Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium">Powered by TensorFlow.js</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;