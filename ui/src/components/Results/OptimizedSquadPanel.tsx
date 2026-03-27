import React, { useState } from 'react';
import { Squad, Player } from '../../types';
import { ChevronDown, Download, Share2 } from 'lucide-react';

interface OptimizedSquadPanelProps {
  squad?: Squad;
  loading?: boolean;
}

export const OptimizedSquadPanel: React.FC<OptimizedSquadPanelProps> = ({ 
  squad, 
  loading = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-300">Optimizing squad...</p>
        </div>
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="card p-6 text-center">
        <p className="text-slate-400">Run optimization to see results</p>
      </div>
    );
  }

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      'GK': 'bg-yellow-500/20 text-yellow-200',
      'DEF': 'bg-blue-500/20 text-blue-200',
      'MID': 'bg-purple-500/20 text-purple-200',
      'FWD': 'bg-red-500/20 text-red-200',
    };
    return colors[position] || 'bg-slate-500/20 text-slate-200';
  };

  const groupedPlayers = {
    GK: squad.players.filter(p => p.position === 'GK'),
    DEF: squad.players.filter(p => p.position === 'DEF'),
    MID: squad.players.filter(p => p.position === 'MID'),
    FWD: squad.players.filter(p => p.position === 'FWD'),
  };

  return (
    <div className="card animate-scale-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">🎯</span>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">Optimal Squad</h3>
            <p className="text-sm text-slate-400">
              Total Points: <span className="text-emerald-400 font-bold">{squad.totalPoints.toFixed(1)}</span> • 
              Cost: <span className="text-sky-400 font-bold">£{squad.totalCost.toFixed(1)}m</span>
            </p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-slate-700">
          {/* Formation Visualization */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-3 uppercase font-semibold">Formation</p>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {squad.formation.def}-{squad.formation.mid}-{squad.formation.fwd}
              </p>
              <p className="text-xs text-slate-400 mt-2">{squad.players.length} Players</p>
            </div>
          </div>

          {/* Players by Position */}
          <div className="space-y-4">
            {(['GK', 'DEF', 'MID', 'FWD'] as const).map(position => (
              <div key={position}>
                <h4 className="text-sm font-semibold text-slate-300 mb-2 uppercase">{position}</h4>
                <div className="space-y-2">
                  {groupedPlayers[position].map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700/50 transition-colors animate-fade-in"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white">{player.name}</p>
                        <p className="text-xs text-slate-400">{player.team} vs {player.opponent}</p>
                      </div>
                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className="text-sm font-bold text-emerald-400">{player.predictedPoints.toFixed(1)}pts</p>
                          <p className="text-xs text-slate-400">£{player.price.toFixed(1)}m</p>
                        </div>
                        <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center">
                          <span className="text-xs font-semibold text-slate-300">Diff: {player.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Team Distribution */}
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-3 uppercase font-semibold">Team Distribution</p>
            <div className="space-y-2">
              {Object.entries(squad.teamDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([team, count]) => (
                  <div key={team} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{team}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                          style={{ width: `${(count / 3) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-white w-4">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="btn-primary flex-1 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
