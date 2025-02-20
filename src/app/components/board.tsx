// components/Board.tsx
'use client';
import { useState } from 'react';
import Die from './die';

interface BoardProps {
  G: {
    dice: number[];
    selectedDice: boolean[];
    currentRoundScore: number;
  };
  moves: {
    rollDice: () => void;
    selectDice: (indexes: number[]) => void;
    bankScore: () => void;
    continueRolling: () => void;
  };
  ctx: {
    currentPlayer: string;
  };
  playerID: string;
}

const Board = ({ G, moves, ctx, playerID }: BoardProps) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const isMyTurn = playerID === ctx.currentPlayer;

  const handleDieClick = (index: number) => {
    if (!isMyTurn || G.selectedDice[index]) return;
    
    setSelectedIndexes(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleConfirmSelection = () => {
    if (selectedIndexes.length > 0) {
      moves.selectDice(selectedIndexes);
      setSelectedIndexes([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4">
        {G.dice.map((value, index) => (
          <div
            key={index}
            onClick={() => handleDieClick(index)}
            className={`
              cursor-pointer transform transition-all duration-200
              ${G.selectedDice[index] ? 'opacity-50' : 'hover:scale-105'}
              ${selectedIndexes.includes(index) ? 'ring-2 ring-blue-500 rounded-xl' : ''}
              ${!isMyTurn ? 'cursor-not-allowed' : ''}
            `}
          >
            <Die side={value} />
          </div>
        ))}
      </div>

      <div className="space-x-4 mt-6">
        <button
          onClick={() => moves.rollDice()}
          disabled={!isMyTurn || selectedIndexes.length > 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Roll Dice
        </button>

        <button
          onClick={handleConfirmSelection}
          disabled={!isMyTurn || selectedIndexes.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </button>

        {G.currentRoundScore > 0 && (
          <>
            <button
              onClick={() => moves.continueRolling()}
              disabled={!isMyTurn}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue Rolling
            </button>

            <button
              onClick={() => moves.bankScore()}
              disabled={!isMyTurn}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bank & End Turn
            </button>
          </>
        )}
      </div>

      <div className="mt-4 text-white">
        {isMyTurn ? `Current Score: ${G.currentRoundScore}` : "Opponent's Turn"}
      </div>
    </div>
  );
};

export default Board;
