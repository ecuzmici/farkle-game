// app/game/game.ts
export interface GameState {
  dice: number[];
  scores: {
    '0': number;
    '1': number;
  };
  currentRoundScore: number;
  selectedDice: boolean[];
  canRoll: boolean;
  diceAvailableForSelection: boolean;
}

const FarkleGame = {
  name: 'farkle',
  minPlayers: 2,
  maxPlayers: 2,

  setup: () => ({
    dice: Array(6).fill(1),
    scores: {
      '0': 0,
      '1': 0
    },
    currentRoundScore: 0,
    selectedDice: Array(6).fill(false),
    canRoll: true,
    diceAvailableForSelection: false
  }),

  moves: {
    rollDice: (G: GameState, ctx) => {
      if (!G.canRoll) return G;

      const newDice = G.dice.map((_, index) => 
        G.selectedDice[index] ? G.dice[index] : Math.floor(Math.random() * 6) + 1
      );

      const unselectedDice = newDice.filter((_, i) => !G.selectedDice[i]);
      const availableScore = calculatePossibleScore(unselectedDice);

      if (availableScore === 0) {
        return {
          ...G,
          dice: newDice,
          currentRoundScore: 0,
          selectedDice: Array(6).fill(false),
          canRoll: false,
          diceAvailableForSelection: false
        };
      }

      return {
        ...G,
        dice: newDice,
        canRoll: false,
        diceAvailableForSelection: true
      };
    },

    selectDice: (G: GameState, ctx, selectedIndexes: number[]) => {
      if (!G.diceAvailableForSelection || !selectedIndexes?.length) return G;

      const selectedDice = selectedIndexes.map(i => G.dice[i]);
      const score = calculateScore(selectedDice);

      if (score > 0) {
        const newSelectedDice = Array(6).fill(false)
          .map((_, i) => G.selectedDice[i] || selectedIndexes.includes(i));

        const isHotDice = newSelectedDice.every(d => d);

        return {
          ...G,
          selectedDice: isHotDice ? Array(6).fill(false) : newSelectedDice,
          currentRoundScore: G.currentRoundScore + score,
          diceAvailableForSelection: false,
          canRoll: true
        };
      }

      return G;
    },

    bankScore: (G: GameState, ctx) => {
      if (G.diceAvailableForSelection) return G;
      if (G.scores[ctx.currentPlayer] === 0 && G.currentRoundScore < 500) return G;

      const newScores = { ...G.scores };
      newScores[ctx.currentPlayer] = G.scores[ctx.currentPlayer] + G.currentRoundScore;

      return {
        ...G,
        scores: newScores,
        currentRoundScore: 0,
        selectedDice: Array(6).fill(false),
        canRoll: true,
        diceAvailableForSelection: false
      };
    },

    continueRolling: (G: GameState) => {
      if (G.diceAvailableForSelection || G.currentRoundScore === 0) return G;

      return {
        ...G,
        canRoll: true,
        diceAvailableForSelection: false
      };
    }
  },

  turn: {
    onBegin: (G: GameState) => ({
      ...G,
      selectedDice: Array(6).fill(false),
      canRoll: true,
      diceAvailableForSelection: false
    }),
    order: {
      first: () => 0,
      next: (G, ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers
    }
  },

  endIf: (G: GameState) => {
    if (!G?.scores) return;
    if (G.scores['0'] >= 10000 || G.scores['1'] >= 10000) {
      return { winner: G.scores['0'] > G.scores['1'] ? '0' : '1' };
    }
    return false;
  }
};

function calculateScore(dice: number[]): number {
  if (!dice.length) return 0;
  
  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  let score = 0;

  // Check for straight (1-6)
  if (dice.length === 6 && [1,2,3,4,5,6].every(n => dice.includes(n))) {
    return 3000;
  }

  // Check for three pairs
  if (dice.length === 6 && Object.values(counts).every(count => count === 2)) {
    return 1500;
  }

  // Process multiple dice combinations
  Object.entries(counts).forEach(([value, count]) => {
    const numValue = parseInt(value);
    
    if (count === 6) {
      score += 3000;
    } else if (count === 5) {
      score += 2000;
    } else if (count === 4) {
      score += 1000;
    } else if (count >= 3) {
      score += numValue === 1 ? 1000 : numValue * 100;
      counts[value] = count - 3;
    }
  });

  // Add remaining single dice
  if (counts[1]) score += counts[1] * 100;
  if (counts[5]) score += counts[5] * 50;

  return score;
}

function calculatePossibleScore(dice: number[]): number {
  if (!dice.length) return 0;
  
  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  if (
    counts[1] || 
    counts[5] || 
    Object.values(counts).some(count => count >= 3) ||
    (dice.length === 6 && [1,2,3,4,5,6].every(n => dice.includes(n))) ||
    (dice.length === 6 && Object.values(counts).every(count => count === 2))
  ) {
    return 1;
  }

  return 0;
}

export default FarkleGame;
