import React, { useState } from 'react';
import { Player } from '../../types';
import { ChevronDown, X, Plus } from 'lucide-react';

interface CurrentTeamPanelProps {
  onTeamChange: (team: Player[]) => void;
  currentTeam: Player[];
}

export const CurrentTeamPanel: React.FC<CurrentTeamPanelProps> = ({ 
  onTeamChange, 
  currentTeam 
}) => {
  const [team, setTeam] = useState<Player[]>(currentTeam);
  const [isExpanded, setIsExpanded] = useState(true);
  const [playerInput, setPlayerInput] = useState('');

  const handleRemovePlayer = (index: number) => {
    const updated = team.filter((_, i) => i !== index);
    setTeam(updated);
    onTeamChange(updated);
  };

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      'GK': 'bg-yellow-500/20 text-yellow-200',
      'DEF': 'bg-blue-500/20 text-blue-200',
      'MID': 'bg-purple-500/20 text-purple-200',
      'FWD': 'bg-red-500/20 text-red-200',
    };
    return colors[position] || 'bg-slate-500/20 text-slate-200';
  };

  const positionCounts = {
    GK: team.filter(p => p.position === 'GK').length,
    DEF: team.filter(p => p.position === 'DEF').length,
    MID: team.filter(p => p.position === 'MID').length,
    FWD: team.filter(p => p.position === 'FWD').length,
  };

  const totalCost = team.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="card animate-slide-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">👥</span>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">Current Team</h3>
            <p className="text-sm text-slate-400">{team.length}/15 Players • £{totalCost.toFixed(1)}m</p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-slate-700">
          {/* Formation Stats */}
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(positionCounts).map(([pos, count]) => (
              <div key={pos} className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-400 mb-1">{pos}</p>
                <p className="text-lg font-bold text-white">{count}/5</p>
              </div>
            ))}
          </div>

          {/* Player List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {team.length === 0 ? (
              <p className="text-center text-slate-400 py-4">No players added yet</p>
            ) : (
              team.map((player, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-800 p-3 rounded-lg hover:bg-slate-700 transition-colors animate-fade-in"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{player.name}</p>
                    <p className="text-xs text-slate-400">{player.team}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPositionColor(player.position)}}`}>  
                      {player.position}
                    </span>
                    <span className="text-sm font-medium text-slate-300">£{player.price.toFixed(1)}m</span>
                    <button
                      onClick={() => handleRemovePlayer(idx)}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Player Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              placeholder="Add player name..."
              className="input-field flex-1"
            />
            <button className="btn-secondary px-4">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};