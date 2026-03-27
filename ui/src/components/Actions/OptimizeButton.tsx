import React, { useState } from 'react';
import { Zap, Loader } from 'lucide-react';

interface OptimizeButtonProps {
  onClick: () => void;
  loading?: boolean;
  mode: 'wildcard' | 'transfer';
}

export const OptimizeButton: React.FC<OptimizeButtonProps> = ({ 
  onClick, 
  loading = false,
  mode 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
        loading
          ? 'bg-orange-600 text-white cursor-not-allowed'
          : 'btn-primary hover:shadow-2xl'
      }`}
    >
      {loading ? (
        <> 
          <Loader className="w-5 h-5 animate-spin" />
          <span>Optimizing {mode === 'wildcard' ? 'Squad' : 'Transfer'}...</span>
        </>
      ) : (
        <> 
          <Zap className="w-5 h-5" />
          <span>Optimize {mode === 'wildcard' ? 'Squad' : 'Transfer'}</span>
        </>
      )}
    </button>
  );
};