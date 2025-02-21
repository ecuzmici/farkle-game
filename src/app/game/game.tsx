// @ts-nocheck
export interface GameState {
  dice: {
    '0': number[];
    '1': number[];
  };
  scores: {
    '0': number;
    '1': number;
  };
  currentRoundScore: number;
  selectedDice: boolean[];
  canRoll: boolean;
  diceAvailableForSelection: boolean;
  farkle: [boolean, boolean]; // Array of two booleans for individual Farkle flags
}

const FarkleGame = {
  name: 'farkle',
  numPlayers: 2,

  setup: () => ({
    dice: {
      '0': Array(6).fill(0),
      '1': Array(6).fill(0),
    },
    scores: {
      '0': 0,
      '1': 0,
    },
    currentRoundScore: 0,
    selectedDice: Array(6).fill(false),
    canRoll: true,
    diceAvailableForSelection: false,
    farkle: [false, false], // Initialize both players' Farkle flags to false
    winningScore: 10000, // Standard Farkle winning score
  }),

  moves: {
    rollDice: ({ G, ctx, events }) => {
      if (!G.canRoll) return;

      const currentPlayer = ctx.currentPlayer;
      const newDice = Array(6).fill(0).map((_, index) =>
        G.selectedDice[index] ? G.dice[currentPlayer][index] : Math.floor(Math.random() * 6) + 1
      );

      const unselectedDice = newDice.filter((_, i) => !G.selectedDice[i]);
      const availableScore = calculatePossibleScore(unselectedDice);

      if (availableScore === false) {
        console.log("BUST");
        // Farkle (no scoring dice): End turn with zero score
        G.currentRoundScore = 0;
        G.selectedDice = Array(6).fill(false);
        G.canRoll = true;
        G.farkle[parseInt(currentPlayer)] = true; // Set Farkle flag for the current player
        G.diceAvailableForSelection = false;
        events.endTurn();
        return;
      }

      G.dice[currentPlayer] = newDice;
      G.canRoll = false;
      G.farkle[parseInt(currentPlayer)] = false; // Reset Farkle flag for the current player after a successful roll
      G.diceAvailableForSelection = true;

      // Check for Hot Dice (all dice scored)
      if (G.selectedDice.every(d => d)) {
        G.selectedDice = Array(6).fill(false);
      }
    },

    selectDice: ({ G, ctx }, selectedIndexes: number[]) => {
      if (!selectedIndexes?.length) return;

      const currentPlayer = ctx.currentPlayer;
      const selectedDiceValues = selectedIndexes.map(i => G.dice[currentPlayer][i]);
      const score = calculateScore(selectedDiceValues);

      if (score > 0) {
        selectedIndexes.forEach(i => {
          G.selectedDice[i] = true;
        });

        G.currentRoundScore += score;

        // Allow rolling again if not all dice are selected
        if (!G.selectedDice.every(d => d)) {
          G.canRoll = true;
        }

        // Reset dice selection availability
        G.diceAvailableForSelection = false;
      }
    },

    bankScore: ({ G, ctx, events }) => {
      if (G.diceAvailableForSelection) return;

      G.scores[ctx.currentPlayer] += G.currentRoundScore;
      G.currentRoundScore = 0;
      G.selectedDice = Array(6).fill(false);
      G.canRoll = true;
      G.diceAvailableForSelection = false;
      G.farkle[parseInt(ctx.currentPlayer)] = false; // Reset Farkle flag for the current player on bank
      events.endTurn();
    },

    continueRolling: ({ G }) => {
      if (G.diceAvailableForSelection || G.currentRoundScore === 0) return;

      G.canRoll = true;
      G.diceAvailableForSelection = false;
    },
  },

  turn: {
    onBegin: ({G, ctx}) => {
      const currentPlayer = ctx.currentPlayer;

      // Reset state at the start of each turn
      G.dice[currentPlayer] = Array(6).fill(0);
      G.selectedDice = Array(6).fill(false);
      G.canRoll = true;
      G.diceAvailableForSelection = false;
      G.farkle[parseInt(currentPlayer)] = false;
    },
    order: {
      first: () => 0,
      next: ({ ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers,
    },
  },

  endIf: ({G, ctx}) => {
    if (!G.scores) return false;

    const winningPlayer =
      Object.entries(G.scores).find(([_, score]) => score >= G.winningScore);

    if (winningPlayer) {
      const [winnerID] = winningPlayer;

      // Allow final round for other players to beat the high score
      if (ctx.playOrderPos === ctx.numPlayers - 1) {
        return { winner: winnerID };
      }
    }

    return false;
  },
};

export function calculateScore(dice: number[]): number {
  if (!dice.length) return 0;

  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  let score = 0;

  // Check for straight (1-6)
  if ([1, 2, 3, 4, 5, 6].every(n => counts[n] === 1)) {
    return 1500;
  }

  // Check for three pairs
  const pairs = Object.values(counts).filter(count => count === 2).length;
  if (pairs === 3) {
    return 1500;
  }

  // Check for two triplets
  const triplets = Object.values(counts).filter(count => count >= 3).length;
  if (triplets === 2) {
    return 2500;
  }

  // Check for four of a kind + a pair
  if (Object.values(counts).includes(4) && pairs === 1) {
    return 1500;
  }

  // Process multiple dice combinations
  Object.entries(counts).forEach(([value, count]) => {
    const numValue = parseInt(value);

    if (count === 6) {
      score += 3000; // Six of a kind
    } else if (count === 5) {
      score += 2000; // Five of a kind
    } else if (count === 4) {
      score += 1000; // Four of a kind
    } else if (count >= 3) {
      score += numValue === 1 ? 1000 : numValue * 100; // Three of a kind
    }

    // Add remaining single dice scores for "1" and "5"
    if (count < 3 && numValue === 1) {
      score += count * 100; // Each "1" is worth additional points
    }
    if (count < 3 && numValue === 5) {
      score += count * 50; // Each "5" is worth additional points
    }
  });

  return score;
}

export function calculatePossibleScore(dice: number[]): boolean {
  if (!dice.length) return false;
  
  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  if (
    counts[1] || 
    counts[5] || 
    Object.values(counts).some(count => count >= 3) ||
    (dice.length === 6 && [1,2,3,4,5,6].every(n => dice.includes(n))) ||
    (dice.length >= 5 && [1,2,3,4,5].every(n => dice.includes(n))) ||
    (dice.length === 6 && Object.values(counts).every(count => count === 2))
  ) {
    return true;
  }

  return false;
}

export default FarkleGame;
