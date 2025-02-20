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
  numPlayers: 2,

  setup: () => ({
    dice: Array(6).fill(1),
    scores: {
      '0': 0,
      '1': 0,
    },
    currentRoundScore: 0,
    selectedDice: Array(6).fill(false),
    canRoll: true,
    diceAvailableForSelection: false,
  }),

  moves: {
    rollDice: ({ G, ctx, events }) => {
      if (!G.canRoll) return;

      const newDice = Array(6).fill(0).map((_, index) =>
        G.selectedDice[index] ? G.dice[index] : Math.floor(Math.random() * 6) + 1
      );

      const unselectedDice = newDice.filter((_, i) => !G.selectedDice[i]);
      const availableScore = calculatePossibleScore(unselectedDice);

      if (availableScore === 0) {
        // Farkle: End turn with zero score
        G.currentRoundScore = 0;
        G.selectedDice = Array(6).fill(false);
        G.canRoll = false;
        G.diceAvailableForSelection = false;
        events.endTurn();
        return;
      }

      G.dice = newDice;
      G.canRoll = false;
      G.diceAvailableForSelection = true;

      // Check for Hot Dice (all dice scored)
      if (G.selectedDice.every(d => d)) {
        G.selectedDice = Array(6).fill(false);
      }
    },

    selectDice: ({G, ctx}, selectedIndexes: number[]) => {
      // Ensure selectedIndexes is not empty
      console.log("Parameters received in selectDice:");
      console.log("G:", G);
      console.log("ctx:", ctx);
      console.log("selectedIndexes:", selectedIndexes); // Should match what you passed
      if (!selectedIndexes?.length) return;
      // Extract the values of the selected dice
      const selectedDiceValues = selectedIndexes.map(i => G.dice[i]);
    
      // Calculate score for the selected dice
      const score = calculateScore(selectedDiceValues);
    
      // If the selected dice form a valid scoring combination
      if (score > 0) {
        // Mark the selected dice as "used"
        selectedIndexes.forEach(i => {
          G.selectedDice[i] = true;
        });
    
        // Add the score to the current round score
        G.currentRoundScore += score;
    
        // Allow rolling again if not all dice are selected
        if (!G.selectedDice.every(d => d)) {
          G.canRoll = true;
        }
    
        // Reset dice selection availability
        G.diceAvailableForSelection = false;
      }
    },

    bankScore: ({G, ctx, events}) => {
      if (G.diceAvailableForSelection) return;

      G.scores[ctx.currentPlayer] += G.currentRoundScore;
      G.currentRoundScore = 0;
      G.selectedDice = Array(6).fill(false);
      G.canRoll = true;
      G.diceAvailableForSelection = false;

      events.endTurn();
    },

    continueRolling: ({G ,ctx}) => {
      if (G.diceAvailableForSelection || G.currentRoundScore === 0) return;

      G.canRoll = true;
      G.diceAvailableForSelection = false;
    },
  },

  turn: {
    onBegin: (G: GameState) => {
      G.selectedDice = Array(6).fill(false);
      G.canRoll = true;
      G.diceAvailableForSelection = false;
    },
    order: {
      first: () => 0,
      next: ({ G, ctx }) => {
        console.log("Current playOrderPos:", ctx.playOrderPos);
        console.log("Number of players:", ctx.numPlayers);
    
        const nextPos = (ctx.playOrderPos + 1) % ctx.numPlayers;
        console.log("Next playOrderPos:", nextPos);
    
        return nextPos;
      },
    },
  },

  endIf: (G: GameState) => {
    if (!G?.scores) return false;
    if (G.scores['0'] >= 10000 || G.scores['1'] >= 10000) {
      return { winner: G.scores['0'] > G.scores['1'] ? '0' : '1' };
    }
    return false;
  },
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
    }
    
    // Add remaining single dice
    if (counts[1]) score += counts[1] * 100;
    if (counts[5]) score += counts[5] * 50;
  });

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
