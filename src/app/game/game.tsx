const FarkleGame = {
  setup: () => ({
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
    rollDice: (G, ctx) => {
      // Only roll unselected dice
      G.dice = G.dice.map((die, index) => 
        G.selectedDice[index] ? die : Math.floor(Math.random() * 6) + 1
      );
    },

    selectDice: (G, ctx, selectedIndexes) => {
      // Calculate score for selected combination
      const selected = selectedIndexes.map(i => G.dice[i]);
      const score = calculateScore(selected);
      
      if (score > 0) {
        selectedIndexes.forEach(i => {
          G.selectedDice[i] = true;
        });
        G.currentRoundScore += score;
      }
    },

    scoreAndPass: (G, ctx) => {
      // Bank the current round score
      G.scores[ctx.currentPlayer] += G.currentRoundScore;
      
      // Reset for next turn
      G.currentRoundScore = 0;
      G.selectedDice = Array(6).fill(false);
      G.dice = Array(6).fill(1);
      
      ctx.events.endTurn();
    },

    scoreAndContinue: (G, ctx) => {
      // Check if all dice are used
      if (G.selectedDice.every(d => d)) {
        // "Hot dice" - reset all dice for new roll
        G.selectedDice = Array(6).fill(false);
      }
    }
  },

  turn: {
    onBegin: (G, ctx) => {
      G.currentRoundScore = 0;
      G.selectedDice = Array(6).fill(false);
    }
  },

  endIf: (G, ctx) => {
    if (G.scores['0'] >= G.targetScore || G.scores['1'] >= G.targetScore) {
      return { winner: G.scores['0'] > G.scores['1'] ? '0' : '1' };
    }
  }
};

// Helper function to calculate score based on Kingdom Come: Deliverance rules
function calculateScore(dice) {
  if (dice.length === 0) return 0;
  
  // Sort dice for easier combination checking
  const sorted = [...dice].sort((a, b) => a - b);
  
  // Check for straights
  if (dice.length === 6) {
    if (sorted.join(',') === '1,2,3,4,5,6') return 1500;
  }
  if (dice.length === 5) {
    if (sorted.join(',') === '1,2,3,4,5') return 500;
    if (sorted.join(',') === '2,3,4,5,6') return 750;
  }

  // Check for three or more of a kind
  const counts = dice.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  for (const [value, count] of Object.entries(counts)) {
    if (count >= 3) {
      const baseScore = value === '1' ? 1000 : Number(value) * 100;
      return baseScore * Math.pow(2, count - 3); // Double for each additional die
    }
  }

  // Check for individual 1s and 5s
  let score = 0;
  dice.forEach(die => {
    if (die === 1) score += 100;
    if (die === 5) score += 50;
  });

  return score;
}

export default FarkleGame;
