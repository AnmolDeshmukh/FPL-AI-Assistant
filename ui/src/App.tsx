import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { UserInfoPanel } from './components/InputPanel/UserInfoPanel';
import { CurrentTeamPanel } from './components/InputPanel/CurrentTeamPanel';
import { OptimizedSquadPanel } from './components/Results/OptimizedSquadPanel';
import { TransferRecommendationPanel } from './components/Results/TransferRecommendationPanel';
import { OptimizeButton } from './components/Actions/OptimizeButton';
import { UserSettings, Squad, Player, OptimizationResult } from './types';

const defaultUserSettings: UserSettings = {
  budget: 100,
  currentTeam: [],
  gameweek: 1,
  mode: 'wildcard',
  bankBalance: 0,
  riskProfile: 'balanced',
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OptimizationResult | null>(null);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual backend call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSquad: Squad = {
        id: '1',
        players: [
          {
            id: 1,
            name: 'Manuel Akanji',
            position: 'DEF',
            team: 'Manchester City',
            price: 4.6,
            predictedPoints: 6.5,
            form: 7.2,
            minutes_last_3: 270,
            opponent: 'Arsenal',
            difficulty: 3,
          },
          // Add more mock players as needed
        ],
        totalCost: 82.5,
        totalPoints: 98.3,
        formation: { gk: 2, def: 5, mid: 5, fwd: 3 },
        teamDistribution: { 'Manchester City': 3, 'Arsenal': 3, 'Liverpool': 2, 'Chelsea': 2, 'Other': 5 },
      };

      const mockResult: OptimizationResult = {
        squad: mockSquad,
        recommendations: [],
        transferSuggestion: {
          sell: mockSquad.players[0],
          buy: mockSquad.players[0],
          pointsGain: 5.2,
        },
        analysis: 'This squad is optimized for maximum points with balanced risk.',
      };

      setResults(mockResult);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} isMenuOpen={isMenuOpen} />
      
      <main className="pt-24 pb-12 max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            <UserInfoPanel 
              onSettingsChange={setUserSettings}
              currentSettings={userSettings}
            />
            <CurrentTeamPanel 
              onTeamChange={(team) => setUserSettings({ ...userSettings, currentTeam: team })}
              currentTeam={userSettings.currentTeam}
            />
            <OptimizeButton 
              onClick={handleOptimize}
              loading={loading}
              mode={userSettings.mode}
            />
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-6">
            {userSettings.mode === 'wildcard' ? (
              <OptimizedSquadPanel 
                squad={results?.squad}
                loading={loading}
              />
            ) : (
              <TransferRecommendationPanel 
                recommendation={results?.transferSuggestion}
                loading={loading}
              />
            )}
            
            {results?.analysis && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Analysis</h3>
                <p className="text-slate-300 leading-relaxed">{results.analysis}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}