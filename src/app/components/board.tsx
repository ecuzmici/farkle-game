'use client'
import Die from './die'

interface BoardProps {
  G: {
    dice: number[]
    scores: {
      '0': number
      '1': number
    }
    currentRoundScore: number
    selectedDice: boolean[]
    targetScore: number
  }
  moves: {
    rollDice: () => void
    selectDice: (indexes: number[]) => void
    scoreAndPass: () => void
    scoreAndContinue: () => void
  }
  playerID: string
  ctx: {
    currentPlayer: string
  }
}

const Board = ({ G, moves, playerID, ctx }: BoardProps) => {
  const isMyTurn = playerID === ctx.currentPlayer;
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const handleDieClick = (index: number) => {
    if (!isMyTurn || G.selectedDice[index]) return;
    
    // Toggle selection
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedIndexes.length > 0) {
      moves.selectDice(selectedIndexes);
      setSelectedIndexes([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900">
      {/* Score Display */}
      <div className="w-full flex justify-between mb-8 text-white">
        <div className={`p-4 rounded ${playerID === '0' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          Player 1: {G.scores['0']}
        </div>
        <div className={`p-4 rounded ${playerID === '1' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          Player 2: {G.scores['1']}
        </div>
      </div>

      {/* Current Round Score */}
      {isMyTurn && (
        <div className="mb-6 text-white">
          Current Round: {G.currentRoundScore}
        </div>
      )}

      {/* Dice Grid */}
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 mb-6">
        {G.dice.map((value, index) => (
          <div
            key={index}
            onClick={() => handleDieClick(index)}
            className={`cursor-pointer transform transition-transform 
              ${G.selectedDice[index] ? 'opacity-50' : 'hover:scale-105'}
              ${selectedIndexes.includes(index) ? 'ring-2 ring-blue-500' : ''}
              ${!isMyTurn ? 'cursor-not-allowed' : ''}`}
          >
            <Die side={value} />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {isMyTurn && (
        <div className="space-x-4">
          <button
            onClick={() => moves.rollDice()}
            disabled={selectedIndexes.length > 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Roll Dice
          </button>

          <button
            onClick={handleConfirmSelection}
            disabled={selectedIndexes.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Selection
          </button>

          {G.currentRoundScore > 0 && (
            <>
              <button
                onClick={() => moves.scoreAndContinue()}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Continue Rolling
              </button>

              <button
                onClick={() => moves.scoreAndPass()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Bank Points & Pass
              </button>
            </>
          )}
        </div>
      )}

      {!isMyTurn && (
        <div className="text-white text-lg">
          Waiting for other player...
        </div>
      )}
    </div>
  );
};

export default Board;
