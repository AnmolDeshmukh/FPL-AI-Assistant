import React, { useState } from 'react';
import { UserSettings } from '../../types';
import { ChevronDown } from 'lucide-react';

interface UserInfoPanelProps {
  onSettingsChange: (settings: UserSettings) => void;
  currentSettings: UserSettings;
}

export const UserInfoPanel: React.FC<UserInfoPanelProps> = ({ 
  onSettingsChange, 
  currentSettings 
}) => {
  const [settings, setSettings] = useState<UserSettings>(currentSettings);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (field: keyof UserSettings, value: any) => {
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    onSettingsChange(updated);
  };

  return (
    <div className="card animate-slide-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">👤</span>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">Your Info</h3>
            <p className="text-sm text-slate-400">Budget & Team Details</p>
          </div>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Total Budget (£)
            </label>
            <input
              type="number"
              value={settings.budget}
              onChange={(e) => handleChange('budget', parseFloat(e.target.value))}
              className="input-field"
              placeholder="100.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bank Balance (£)
            </label>
            <input
              type="number"
              value={settings.bankBalance}
              onChange={(e) => handleChange('bankBalance', parseFloat(e.target.value))}
              className="input-field"
              placeholder="0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Current Gameweek
            </label>
            <input
              type="number"
              value={settings.gameweek}
              onChange={(e) => handleChange('gameweek', parseInt(e.target.value))}
              className="input-field"
              placeholder="1"
              min="1"
              max="38"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Optimization Mode
            </label>
            <select
              value={settings.mode}
              onChange={(e) => handleChange('mode', e.target.value as 'wildcard' | 'transfer')}
              className="input-field"
            >
              <option value="wildcard">Wildcard (Build New Squad)</option>
              <option value="transfer">Transfer (1 Player Swap)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Risk Profile
            </label>
            <div className="flex gap-2">
              {['conservative', 'balanced', 'aggressive'].map((profile) => (
                <button
                  key={profile}
                  onClick={() => handleChange('riskProfile', profile as any)}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                    settings.riskProfile === profile
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {profile.charAt(0).toUpperCase() + profile.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};