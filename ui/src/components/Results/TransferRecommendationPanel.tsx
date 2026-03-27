import React, { useState } from 'react';
import { ChevronDown, TrendingUp, ArrowRight } from 'lucide-react';
import { Player } from '../../types';

interface TransferRecommendationPanelProps {
  recommendation?: {
    sell: Player;
    buy: Player;
    pointsGain: number;
  };
  loading?: boolean;
}

export const TransferRecommendationPanel: React.FC<TransferRecommendationPanelProps> = ({ 
  recommendation,
  loading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-300">Finding best transfer...</p>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="card p-6 text-center">
        <p className="text-slate-400">Run transfer analysis to see recommendations</p>
      </div>
    );
  }

  const priceDifference = recommendation.buy.price - recommendation.sell.price;
  const isDoable = priceDifference >= 0;

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      'GK': 'bg-yellow-500/20 text-yellow-200',
      'DEF': 'bg-blue-500/20 text-blue-200',
      'MID': 'bg-purple-500/20 text-purple-200',
      'FWD': 'bg-red-500/20 text-red-200',
    };
    return colors[position] || 'bg-slate-500/20 text-slate-200';
  };

  return (
    <div className="card animate-scale-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">⚡</span>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">Best Transfer</h3>
            <p className="text-sm text-slate-400">
              Points Gain: <span className="text-emerald-400 font-bold">+{recommendation.pointsGain.toFixed(1)}</span>
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-slate-700">
          {/* Sell Player */} 
          <div>
            <p className="text-xs text-slate-400 mb-3 uppercase font-semibold">Sell</p>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">⭐</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">{recommendation.sell.name}</h4>
                  <p className="text-sm text-slate-400">{recommendation.sell.team}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">£{recommendation.sell.price.toFixed(1)}m</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getPositionColor(recommendation.sell.position)}`}> 
                    {recommendation.sell.position}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-700/50 rounded p-2 text-center">
                    <p className="text-slate-400">Form</p>
                    <p className="font-bold text-white mt-1">{recommendation.sell.form.toFixed(1)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2 text-center">
                    <p className="text-slate-400">Points</p>
                    <p className="font-bold text-orange-400 mt-1">{recommendation.sell.predictedPoints.toFixed(1)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2 text-center">
                    <p className="text-slate-400">Difficulty</p>
                    <p className="font-bold text-white mt-1">{recommendation.sell.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-3">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Buy Player */}
          <div>
            <p className="text-xs text-slate-400 mb-3 uppercase font-semibold">Buy</p>
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">✨</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">{recommendation.buy.name}</h4>
                  <p className="text-sm text-slate-400">{recommendation.buy.team}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">£{recommendation.buy.price.toFixed(1)}m</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getPositionColor(recommendation.buy.position)}`}> 
                    {recommendation.buy.position}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-700/50 rounded p-2 text-center">
                    <p className="text-slate-400">Form</p>
                    <p className="font-bold text-white mt-1">{recommendation.buy.form.toFixed(1)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2 text-center">
                    <p className="text-slate-400">Points</p>
                    <p className="font-bold text-emerald-400 mt-1">{recommendation.buy.predictedPoints.toFixed(1)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-2 text-center">
                    <p className="text-slate-400">Difficulty</p>
                    <p className="font-bold text-white mt-1">{recommendation.buy.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 mb-2">Price Difference</p>
              <p className={`text-2xl font-bold ${priceDifference > 0 ? 'text-orange-400' : 'text-emerald-400'}`}> 
                {priceDifference > 0 ? '+' : '-'}£{Math.abs(priceDifference).toFixed(1)}m
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 mb-2">Expected Gain</p>
              <p className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
                <TrendingUp className="w-5 h-5" />
                {recommendation.pointsGain.toFixed(1)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-4 text-center">
              <p className="text-xs text-slate-400 mb-2">Status</p>
              <p className={`text-lg font-bold ${isDoable ? 'text-emerald-400' : 'text-orange-400'}`}> 
                {isDoable ? '✓ Doable' : '✗ Need Bank'}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button className="btn-primary w-full">
            Apply Transfer
          </button>
        </div>
      )}
    </div>
  );
};