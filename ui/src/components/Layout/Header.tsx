import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FPL AI</h1>
            <p className="text-xs text-slate-400">Fantasy Premier League Assistant</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Dashboard</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Predictions</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Optimize</a>
          <a href="#" className="text-slate-300 hover:text-white transition-colors">Settings</a>
        </nav>

        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </header>
  );
};
