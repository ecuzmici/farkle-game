'use client';
import { useState } from 'react';
import Die from './die';
import { GameState } from '../game/game';

interface BoardProps {
  G: GameState;
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
  const isHotDice = G.selectedDice.every(d => d);

  const handleDieClick = (index: number) => {
    if (!isMyTurn || G.selectedDice[index] || !G.diceAvailableForSelection) return;
    
    const newSelectedIndexes = selectedIndexes.includes(index) 
      ? selectedIndexes.filter(i => i !== index)
      : [...selectedIndexes, index];
  
    setSelectedIndexes(newSelectedIndexes);
  };

  const handleConfirmSelection = () => {
    if (selectedIndexes.length > 0) {
      console.log(selectedIndexes)
      moves.selectDice(selectedIndexes);
      setSelectedIndexes([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Game Status Header */}
      <div className="mb-6 text-white text-center">
        <div className="text-xl mb-2">Player {parseInt(playerID) + 1}</div>
        <div>Total Score: {G.scores[playerID]}</div>
      </div>

      {/* Dice Grid */}
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4">
        {G.dice.map((value, index) => (
          <div
            key={index}
            onClick={() => handleDieClick(index)}
            className={`
              cursor-pointer transform transition-all duration-200
              ${G.selectedDice[index] ? 'opacity-50' : 'hover:scale-105'}
              ${selectedIndexes.includes(index) ? 'ring-2 ring-blue-500 rounded-xl' : ''}
              ${(!isMyTurn || !G.diceAvailableForSelection) ? 'cursor-not-allowed' : ''}
            `}
          >
            <Die side={value} />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-x-4 mt-6">
        <button
          onClick={() => moves.rollDice()}
          disabled={!isMyTurn || !G.canRoll || selectedIndexes.length > 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Roll Dice
        </button>

        <button
          onClick={handleConfirmSelection}
          disabled={!isMyTurn || !G.diceAvailableForSelection || selectedIndexes.length === 0}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </button>

        {G.currentRoundScore > 0 && (
          <>
            <button
              onClick={() => moves.continueRolling()}
              disabled={!isMyTurn || G.diceAvailableForSelection}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue Rolling
            </button>

            <button
              onClick={() => moves.bankScore()}
              disabled={
                !isMyTurn || 
                G.diceAvailableForSelection
              }
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bank & End Turn
            </button>
          </>
        )}
      </div>

      {/* Game Status Footer */}
      <div className="mt-6 text-white space-y-2 text-center">
        {isMyTurn ? (
          <>
            <div className="text-lg">Current Round Score: {G.currentRoundScore}</div>
            {isHotDice && (
              <div className="text-green-400">Hot Dice! Roll again with all dice!</div>
            )}
            <div className="text-sm">
              {G.canRoll ? "Roll the dice!" : 
               G.diceAvailableForSelection ? "Select scoring dice!" :
               "Choose to continue rolling or bank your points!"}
            </div>
          </>
        ) : (
          <div className="text-xl">Opponent's Turn</div>
        )}
      </div>
    </div>
  );
};

export default Board;
