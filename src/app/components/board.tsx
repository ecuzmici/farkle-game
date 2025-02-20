// components/Board.tsx
"use client";
import { useState } from 'react';
import Die from './die';
import { GameState } from '@/app/game/game';

interface BoardProps {
  G: GameState;
  moves: {
    rollDice: () => void;
    selectDice: (indexes: number[]) => void;
    bankScore: () => void;
    continueRolling: () => void;
  };
  playerID: string;
  ctx: {
    currentPlayer: string;
  };
}

const Board = ({ G, moves, playerID, ctx }: BoardProps) => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      {/* Score Display */}
      <div className="w-full max-w-2xl flex justify-between mb-8">
        <div className={`p-4 rounded ${playerID === '0' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          <span className="text-white font-semibold">Player 1: {G.scores['0']}</span>
        </div>
        <div className={`p-4 rounded ${playerID === '1' ? 'bg-blue-600' : 'bg-gray-700'}`}>
          <span className="text-white font-semibold">Player 2: {G.scores['1']}</span>
        </div>
      </div>

      {/* Current Round Score */}
      {isMyTurn && (
        <div className="mb-6">
          <span className="text-white text-xl">Round Score: {G.currentRoundScore}</span>
        </div>
      )}

      {/* Dice Grid */}
      <div className="grid grid-cols-3 grid-rows-2 gap-6 p-6 bg-gray-800 rounded-xl mb-8">
        {G.dice.map((value, index) => (
          <div
            key={index}
            onClick={() => handleDieClick(index)}
            className={`
              transform transition-all duration-200 
              ${G.selectedDice[index] ? 'opacity-50' : 'hover:scale-105'}
              ${selectedIndexes.includes(index) ? 'ring-2 ring-blue-500 rounded-xl' : ''}
              ${!isMyTurn ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Roll Dice
          </button>

          <button
            onClick={handleConfirmSelection}
            disabled={selectedIndexes.length === 0}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Selection
          </button>

          {G.currentRoundScore > 0 && (
            <>
              <button
                onClick={() => moves.continueRolling()}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 
                  transition-colors"
              >
                Continue Rolling
              </button>

              <button
                onClick={() => moves.bankScore()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
                  transition-colors"
              >
                Bank & End Turn
              </button>
            </>
          )}
        </div>
      )}

      {!isMyTurn && (
        <div className="text-white text-xl animate-pulse">
          Waiting for other player...
        </div>
      )}
    </div>
  );
};

export default Board;