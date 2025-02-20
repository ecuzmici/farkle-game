"use client;"
// app/game/game.ts
export interface GameState {
  dice: number[];
  scores: {
    '0': number;
    '1': number;
  };
  currentRoundScore: number;
  selectedDice: boolean[];
  isRollPhase: boolean;
}

const FarkleGame = {
  name: 'farkle',

  setup: () => ({
    dice: Array(6).fill(1),
    scores: {
      '0': 0,
      '1': 0
    },
    currentRoundScore: 0,
    selectedDice: Array(6).fill(false),
    isRollPhase: true
  }),

  moves: {
    rollDice: (G, ctx) => {
      if (!G.isRollPhase) return;

      G.dice = G.dice.map((_, index) => 
        G.selectedDice[index] ? G.dice[index] : Math.floor(Math.random() * 6) + 1
      );

      const availableScore = calculatePossibleScore(G.dice.filter((_, i) => !G.selectedDice[i]));
      if (availableScore === 0) {
        G.currentRoundScore = 0;
        G.selectedDice = Array(6).fill(false);
        G.isRollPhase = false;
        ctx.events.endTurn();
      }
    },

    selectDice: (G, ctx, selectedIndexes: number[]) => {
      if (!G.isRollPhase || !selectedIndexes) return;
      
      const selectedDice = selectedIndexes.map(i => G.dice[i]);
      const score = calculateScore(selectedDice);
      
      if (score > 0) {
        selectedIndexes.forEach(i => {
          G.selectedDice[i] = true;
        });
        G.currentRoundScore += score;
        G.isRollPhase = false;
      }
    },

    bankScore: (G, ctx) => {
      if (!G.isRollPhase) {
        if (!G.scores[ctx.currentPlayer]) {
          G.scores[ctx.currentPlayer] = 0;
        }
        G.scores[ctx.currentPlayer] += G.currentRoundScore;
        G.currentRoundScore = 0;
        G.selectedDice = Array(6).fill(false);
        G.isRollPhase = true;
        ctx.events.endTurn();
      }
    },

    continueRolling: (G) => {
      if (!G.isRollPhase) {
        if (G.selectedDice.every(d => d)) {
          G.selectedDice = Array(6).fill(false);
        }
        G.isRollPhase = true;
      }
    }
  },

  turn: {
    onBegin: (G) => {
      G.selectedDice = Array(6).fill(false);
      G.isRollPhase = true;
    }
  },

  endIf: (G) => {
    if (!G.scores) return false;
    
    if (G.scores['0'] >= 10000 || G.scores['1'] >= 10000) {
      return { winner: G.scores['0'] > G.scores['1'] ? '0' : '1' };
    }
    return false;
  }
};

function calculateScore(dice: number[]): number {
  if (dice.length === 0) return 0;
  
  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  let score = 0;

  // Three or more of a kind
  Object.entries(counts).forEach(([value, count]) => {
    const numValue = parseInt(value);
    if (count >= 3) {
      const baseScore = numValue === 1 ? 1000 : numValue * 100;
      score += baseScore * Math.pow(2, count - 3);
      counts[value] -= 3;
    }
  });

  // Individual 1s and 5s
  if (counts[1]) score += counts[1] * 100;
  if (counts[5]) score += counts[5] * 50;

  return score;
}

function calculatePossibleScore(dice: number[]): number {
  if (dice.length === 0) return 0;
  
  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Check if any scoring combination is possible
  if (counts[1] || counts[5]) return 1;
  for (const count of Object.values(counts)) {
    if (count >= 3) return 1;
  }
  return 0;
}

export default FarkleGame;
