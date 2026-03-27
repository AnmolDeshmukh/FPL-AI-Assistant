export interface Player {
  id: number;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  team: string;
  price: number;
  predictedPoints: number;
  form: number;
  minutes_last_3: number;
  opponent: string;
  difficulty: number;
  imageUrl?: string;
}

export interface Squad {
  id: string;
  players: Player[];
  totalCost: number;
  totalPoints: number;
  formation: {
    gk: number;
    def: number;
    mid: number;
    fwd: number;
  };
  teamDistribution: Record<string, number>;
}

export interface UserSettings {
  budget: number;
  currentTeam: Player[];
  gameweek: number;
  mode: 'wildcard' | 'transfer';
  bankBalance: number;
  riskProfile: 'conservative' | 'balanced' | 'aggressive';
}

export interface Prediction {
  playerId: number;
  playerName: string;
  position: string;
  predictedPoints: number;
  confidence: number;
  difficulty: number;
}

export interface OptimizationResult {
  squad: Squad;
  recommendations: Player[];
  transferSuggestion?: {
    sell: Player;
    buy: Player;
    pointsGain: number;
  };
  analysis: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}