// @ts-nocheck
export interface GameState {
  dice: {
    '0': number[]
    '1': number[]
  }
  scores: {
    '0': number
    '1': number
  }
  currentRoundScore: number
  selectedDice: boolean[]
  canRoll: boolean
  diceAvailableForSelection: boolean
  farkle: [boolean, boolean]
  winningScore: number
}

export const FarkleGame = {
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
    farkle: [false, false],
    winningScore: 2000,
  }),

  moves: {
    rollDice: ({ G, ctx, events }) => {
      // Check for Hot Dice (all dice scored)
      if (G.selectedDice.every((d) => d)) {
        G.selectedDice = Array(6).fill(false) // Reset selected dice
        G.canRoll = true // Allow rolling again
        G.diceAvailableForSelection = false // Reset dice availability for selection
      }

      if (!G.canRoll) return

      const currentPlayer = ctx.currentPlayer
      const newDice = Array(6)
        .fill(0)
        .map((_, index) =>
          G.selectedDice[index]
            ? G.dice[currentPlayer][index]
            : Math.floor(Math.random() * 6) + 1
        )

      const unselectedDice = newDice.filter((_, i) => !G.selectedDice[i])
      const availableScore = calculatePossibleScore(unselectedDice)

      if (!availableScore) {
        // Farkle (no scoring dice): End turn with zero score
        G.currentRoundScore = 0
        G.selectedDice = Array(6).fill(false)
        G.canRoll = false
        G.farkle[parseInt(currentPlayer)] = true // Set Farkle flag for the current player
        G.diceAvailableForSelection = false
        events.endTurn()
        return
      }

      G.dice[currentPlayer] = newDice
      G.canRoll = false
      G.farkle[parseInt(currentPlayer)] = false // Reset Farkle flag for the current player after a successful roll
      G.diceAvailableForSelection = true
    },

    selectDice({ G, ctx, events }, selectedIndexes) {
      if (!selectedIndexes?.length) return;

      const currentPlayer = ctx.currentPlayer;
      const selectedValues = selectedIndexes.map(
        (i) => G.dice[currentPlayer][i]
      );
      const score = calculateScore(selectedValues);

      if (score > 0) {
        selectedIndexes.forEach((i) => {
          G.selectedDice[i] = true;
        });

        G.currentRoundScore += score;

        if (!G.selectedDice.every((d) => d)) {
          G.canRoll = true;
        }

        G.diceAvailableForSelection = false;
      } else {
        // If score is 0, end the turn
        G.currentRoundScore = 0;
        G.selectedDice = Array(6).fill(false);
        G.canRoll = true;
        G.diceAvailableForSelection = false;
        events.endTurn();
      }
    },

    bankScore({ G, ctx, events }) {
      if (G.diceAvailableForSelection) return

      G.scores[ctx.currentPlayer] += G.currentRoundScore
      G.currentRoundScore = 0
      G.selectedDice = Array(6).fill(false)
      G.canRoll = true

      // Check if the current player has reached or exceeded the winning score
      if (G.scores[ctx.currentPlayer] >= G.winningScore) {
        G.winner = `Player ${parseInt(ctx.currentPlayer) + 1}` // Set winner
        events.endGame() // End the game
        return
      }

      events.endTurn()
    },
  },

  turn: {
    onBegin({ G, ctx }) {
      const currentPlayer = ctx.currentPlayer

      // Reset state at the start of each turn
      G.dice[currentPlayer] = Array(6).fill(0)
      G.selectedDice = Array(6).fill(false)
      G.canRoll = true
      G.farkle[parseInt(currentPlayer)] = false
    },

    order: {
      first: () => 0,
      next({ ctx }) {
        return (ctx.playOrderPos + 1) % ctx.numPlayers
      },
    },
  },

  endIf: ({ G, ctx }) => {
    if (!G.scores) return false;

    const winningPlayer = Object.entries(G.scores).find(
      ([_, score]) => score >= G.winningScore
    );

    if (winningPlayer) {
      const [winnerID] = winningPlayer;
      return { winner: winnerID };
    }

    return false;
  },
}

export function calculateScore(dice: number[]): number {
  if (!dice.length) return 0

  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  let score = 0

  // Check for full straight (1-6)
  if ([1, 2, 3, 4, 5, 6].every((n) => counts[n] === 1)) {
    return 1500
  }

  // Check for partial straights
  if ([1, 2, 3, 4, 5].every((n) => counts[n] >= 1)) {
    score += 500
    ;[1, 2, 3, 4, 5].forEach((n) => counts[n]--)
  } else if ([2, 3, 4, 5, 6].every((n) => counts[n] >= 1)) {
    score += 750
    ;[2, 3, 4, 5, 6].forEach((n) => counts[n]--)
  }

  // Check if remaining dice are scoring dice
  const remainingDice = Object.entries(counts).flatMap(([value, count]) => 
    Array(count).fill(parseInt(value))
  )
  const allScoringDice = remainingDice.every((d) => d === 1 || d === 5 || counts[d] >= 3)
  if (!allScoringDice) return 0

  // Process multiple dice combinations
  Object.entries(counts).forEach(([valueStr, count]) => {
    const value = parseInt(valueStr)

    // Handle three or more of a kind
    if (count >= 3) {
      let baseScore = value === 1 ? 1000 : value * 100 // Base score for three of a kind
      score += baseScore * Math.pow(2, count - 3) // Double the score for each additional die
      count = 0 // Remove all counted dice
    }

    // Add remaining single dice scores for "1" and "5"
    if (value === 1 && count > 0) {
      score += count * 100 // Each "1" is worth additional points
    }
    if (value === 5 && count > 0) {
      score += count * 50 // Each "5" is worth additional points
    }
  })

  return score
}


export function calculatePossibleScore(dice: number[]): boolean {
  if (!dice.length) return false

  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  // Check for a full straight (1-6)
  if ([1, 2, 3, 4, 5, 6].every((n) => counts[n] === 1)) {
    return true
  }

  // Check for partial straights
  if ([1, 2, 3, 4, 5].every((n) => counts[n] >= 1)) {
    return true
  }

  if ([2, 3, 4, 5, 6].every((n) => counts[n] >= 1)) {
    return true
  }

  // Check for three of a kind or more
  if (Object.values(counts).some((count) => count >= 3)) {
    return true
  }

  // Check for single scoring dice (1s and 5s)
  if (counts[1] > 0 || counts[5] > 0) {
    return true
  }

  return false // No scoring combinations found
}

export default FarkleGame
