// app/game/game.ts
export interface GameState {
  dice: number[];
  scores: {
    '0': number;
    '1': number;
  };
  currentRoundScore: number;
  selectedDice: boolean[];
  targetScore: number;
}

const FarkleGame = {
  setup: (): GameState => ({
    dice: Array(6).fill(1),
    scores: {
      '0': 0,
      '1': 0
    },
    currentRoundScore: 0,
    selectedDice: Array(6).fill(false),
    targetScore: 2000
  }),

  moves: {
    rollDice: (G: GameState) => {
      // Only roll unselected dice
      G.dice = G.dice.map((die, index) => 
        G.selectedDice[index] ? die : Math.floor(Math.random() * 6) + 1
      );
    },

    selectDice: (G: GameState, ctx, selectedIndexes: number[]) => {
      const selected = selectedIndexes.map(i => G.dice[i]);
      const score = calculateScore(selected);
      
      if (score > 0) {
        selectedIndexes.forEach(i => {
          G.selectedDice[i] = true;
        });
        G.currentRoundScore += score;
      }
    },

    bankScore: (G: GameState, ctx) => {
      G.scores[ctx.currentPlayer] += G.currentRoundScore;
      G.currentRoundScore = 0;
      G.selectedDice = Array(6).fill(false);
      G.dice = Array(6).fill(1);
      ctx.events.endTurn();
    },

    continueRolling: (G: GameState) => {
      if (G.selectedDice.every(d => d)) {
        // Hot dice - reset all dice
        G.selectedDice = Array(6).fill(false);
      }
    }
  },

  turn: {
    onBegin: (G: GameState) => {
      G.currentRoundScore = 0;
      G.selectedDice = Array(6).fill(false);
    }
  },

  endIf: (G: GameState) => {
    if (G.scores['0'] >= G.targetScore || G.scores['1'] >= G.targetScore) {
      return { winner: G.scores['0'] > G.scores['1'] ? '0' : '1' };
    }
  }
};

function calculateScore(dice: number[]): number {
  if (dice.length === 0) return 0;
  
  const sorted = [...dice].sort((a, b) => a - b);
  
  // Check for straights
  if (dice.length === 6) {
    if (sorted.join(',') === '1,2,3,4,5,6') return 1500;
  }
  if (dice.length === 5) {
    if (sorted.join(',') === '1,2,3,4,5') return 500;
    if (sorted.join(',') === '2,3,4,5,6') return 750;
  }

  // Count occurrences
  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Check for three or more of a kind
  let score = 0;
  Object.entries(counts).forEach(([value, count]) => {
    const numValue = parseInt(value);
    if (count >= 3) {
      score += numValue === 1 ? 1000 : numValue * 100;
      score *= Math.pow(2, count - 3); // Double for each additional die
    } else {
      // Add single 1s and 5s
      if (numValue === 1) score += count * 100;
      if (numValue === 5) score += count * 50;
    }
  });

  return score;
}

export default FarkleGame;