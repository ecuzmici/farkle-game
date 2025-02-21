'use client'
import { useState, useCallback } from 'react'
import Die from './die'
import { GameState } from '../game/game'

interface BoardProps {
  G: GameState
  moves: {
    rollDice: () => void
    selectDice: (indexes: number[]) => void
    bankScore: () => void
    continueRolling: () => void
  }
  ctx: {
    currentPlayer: string
  }
  playerID: string
}

const Board = ({ G, moves, ctx, playerID }: BoardProps) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
  const [rolling, setRolling] = useState<boolean>(false)
  const isMyTurn = playerID === ctx.currentPlayer
  const isHotDice = G.selectedDice.every((d) => d)
  const currentPlayerIndex = parseInt(playerID)

  const handleDieClick = (index: number) => {
    if (
      !isMyTurn ||
      G.selectedDice[index] ||
      !G.diceAvailableForSelection ||
      rolling
    )
      return

    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleConfirmSelection = () => {
    if (selectedIndexes.length > 0) {
      moves.selectDice(selectedIndexes)
      setSelectedIndexes([])
    }
  }

  const handleRollDice = useCallback(() => {
    if (!isMyTurn || !G.canRoll || selectedIndexes.length > 0 || rolling) return

    setRolling(true)
    moves.rollDice()

    setTimeout(() => {
      setRolling(false)
    }, 500)
  }, [isMyTurn, G.canRoll, selectedIndexes.length, rolling, moves])

  const opponentID = (currentPlayerIndex + 1) % 2

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col items-center justify-center p-8">
      {/* Game Status Header */}
      <div className="flex justify-between w-full max-w-3xl">
        <div className="p-4 rounded-lg shadow-md bg-gray-800">
          <div className="text-lg font-semibold mb-2">Player 1</div>
          <div className="text-sm">Score: {G.scores['0']}</div>
          {G.farkle[0] && (
            <div className="text-red-500 text-sm mt-1">Farkle!</div>
          )}
        </div>

        <div className="p-4 rounded-lg shadow-md bg-gray-800">
          <div className="text-lg font-semibold mb-2">Player 2</div>
          <div className="text-sm">Score: {G.scores['1']}</div>
          {G.farkle[1] && (
            <div className="text-red-500 text-sm mt-1">Farkle!</div>
          )}
        </div>
      </div>

      {/* Opponent Dice Grid */}
      <div className="mb-4">Opponent's Dice</div>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 rounded-lg shadow-md bg-gray-800">
        {G.dice[opponentID].map((value, index) => (
          <div
            key={index}
            className={`
                    transform transition-all duration-200
                    opacity-50 
                  `}
          >
            <Die side={value} rolling={false} />
          </div>
        ))}
      </div>

      {/* Dice Grid */}
      <div className="mt-4 mb-4">Your Dice</div>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 rounded-lg shadow-md bg-gray-800">
        {G.dice[playerID].map((value, index) => (
          <div
            key={index}
            onClick={() => handleDieClick(index)}
            className={`
              cursor-pointer transform transition-all duration-200
              ${
                G.selectedDice[index]
                  ? 'opacity-50 pointer-events-none'
                  : 'hover:scale-105'
              }
              ${
                selectedIndexes.includes(index)
                  ? 'ring-2 ring-blue-500 rounded-xl'
                  : ''
              }
              ${
                !isMyTurn || !G.diceAvailableForSelection || rolling
                  ? 'cursor-not-allowed pointer-events-none'
                  : ''
              }
            `}
          >
            <Die side={value} rolling={rolling} />
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-x-4 mt-8">
        <button
          onClick={handleRollDice}
          disabled={
            !isMyTurn || !G.canRoll || selectedIndexes.length > 0 || rolling
          }
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Roll Dice
        </button>
        <button
          onClick={handleConfirmSelection}
          disabled={
            !isMyTurn ||
            !G.diceAvailableForSelection ||
            selectedIndexes.length === 0 ||
            rolling
          }
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
            transition-colors focus:outline-none focus:ring-2 focus:ring-green-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </button>

        {G.currentRoundScore > 0 && (
          <>
            <button
              onClick={() => moves.continueRolling()}
              disabled={!isMyTurn || G.diceAvailableForSelection || rolling}
              className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 
                transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue Rolling
            </button>

            <button
              onClick={() => moves.bankScore()}
              disabled={!isMyTurn || G.diceAvailableForSelection || rolling}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
                transition-colors focus:outline-none focus:ring-2 focus:ring-red-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bank & End Turn
            </button>
          </>
        )}
      </div>

      {/* Game Status Footer */}
      <div className="mt-8 text-gray-300 space-y-2 text-center">
        {isMyTurn ? (
          <>
            <div className="text-lg">
              Current Round Score: {G.currentRoundScore}
            </div>
            {isHotDice && (
              <div className="text-green-400">
                Hot Dice! Roll again with all dice!
              </div>
            )}
            <div className="text-sm">
              {G.canRoll
                ? 'Select scoring dice!'
                : G.diceAvailableForSelection
                ? 'Select scoring dice!'
                : 'Choose to continue rolling or bank your points!'}
            </div>
          </>
        ) : (
          <div className="text-xl">Opponent's Turn</div>
        )}
      </div>
    </div>
  )
}

export default Board
