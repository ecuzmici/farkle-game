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
  }
  ctx: {
    currentPlayer: string
    gameover?: { winner: string }
  }
  playerID: string
}

const Board = ({ G, moves, ctx, playerID }: BoardProps) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([])
  const [bust, setBust] = useState<boolean>(false)
  const isMyTurn = playerID === ctx.currentPlayer
  const isHotDice = G.selectedDice.every((d) => d)
  const currentPlayerIndex = parseInt(playerID)
  const opponentID = (currentPlayerIndex + 1) % 2

  const handleDieClick = (index: number) => {
    if (!isMyTurn || G.selectedDice[index] || !G.diceAvailableForSelection) return
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

  const handleRollOrContinue = useCallback(() => {
    if (!isMyTurn || selectedIndexes.length > 0) return
    moves.rollDice()
    setTimeout(() => {
      if (G.farkle[currentPlayerIndex]) {
        setBust(true)
      } else if (G.selectedDice.every((d) => d)) {
        setSelectedIndexes([])
      }
    }, 500)
  }, [isMyTurn, selectedIndexes.length, moves, G.farkle, currentPlayerIndex, G.selectedDice])

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col p-8">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Game Status Header */}
        <div className="flex justify-between mb-8">
          <div className={`p-4 rounded-lg shadow-md ${isMyTurn ? 'bg-blue-800' : 'bg-gray-800'} flex-1`}>
            <div className="text-lg font-semibold mb-2">Your Score</div>
            <div className="text-sm">Score: {G.scores[playerID]} / {G.winningScore}</div>
            {G.farkle[currentPlayerIndex] && <div className="text-red-500 text-md mt-1">Bust!</div>}
          </div>
          <div className={`p-4 rounded-lg shadow-md ${!isMyTurn ? 'bg-blue-800' : 'bg-gray-800'} flex-1 ml-4`}>
            <div className="text-lg font-semibold mb-2">Opponent's Score</div>
            <div className="text-sm">Score: {G.scores[opponentID.toString()]} / {G.winningScore}</div>
            {G.farkle[opponentID] && <div className="text-red-500 text-md mt-1">Bust!</div>}
          </div>
        </div>

        {/* Bust Message */}
        {bust && (
          <div className="mb-8 p-4 bg-red-600 text-white rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold">Bust!</h2>
            <p>You rolled no scoring dice and lost your turn.</p>
            <p>It's now your opponent's turn.</p>
          </div>
        )}

        {!ctx.gameover && (
          <div className="flex-1 flex flex-col sm:flex-row justify-between">
            {/* Player Dice Grid */}
            <div className="mb-8 sm:mb-0 sm:w-1/2 sm:pr-4">
              <div className="mb-4">Your Dice</div>
              <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 rounded-lg shadow-md bg-gray-800">
                {G.dice[playerID].map((value, index) => (
                  <div
                    key={index}
                    onClick={() => handleDieClick(index)}
                    className={`
                      cursor-pointer transform transition-all duration-200 p-2
                      ${G.selectedDice[index] ? 'opacity-50 pointer-events-none' : 'hover:scale-105'}
                      ${selectedIndexes.includes(index) ? 'ring-4 ring-blue-500 rounded-xl bg-blue-700 shadow-lg scale-105' : ''}
                      ${!isMyTurn || !G.diceAvailableForSelection ? 'cursor-not-allowed pointer-events-none' : ''}
                    `}
                  >
                    <Die side={G.selectedDice[index] ? 0 : value} />
                  </div>
                ))}
              </div>
            </div>

            {/* Opponent Dice Grid */}
            <div className="sm:w-1/2 sm:pl-4">
              <div className="mb-4">Opponent's Dice</div>
              <div className="grid grid-cols-3 grid-rows-2 gap-4 p-4 rounded-lg shadow-md bg-gray-800">
                {G.dice[opponentID].map((value, index) => (
                  <div key={index} className="opacity-50 p-2">
                    <Die side={value} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!bust && !ctx.gameover && (
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleRollOrContinue}
              disabled={!isMyTurn || selectedIndexes.length > 0}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {G.canRoll ? 'Roll Dice' : 'Continue Rolling'}
            </button>

            <button
              onClick={handleConfirmSelection}
              disabled={!isMyTurn || !G.diceAvailableForSelection || selectedIndexes.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
                transition-colors focus:outline-none focus:ring-2 focus:ring-green-500
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Selection
            </button>

            {G.currentRoundScore > 0 && (
              <button
                onClick={() => moves.bankScore()}
                disabled={!isMyTurn || G.diceAvailableForSelection}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 
                  transition-colors focus:outline-none focus:ring-2 focus:ring-red-500
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bank & End Turn
              </button>
            )}
          </div>
        )}

        {/* Game Status Footer */}
        {!bust && !ctx.gameover && (
          <div className="mt-8 text-gray-300 space-y-2 text-center">
            {isMyTurn ? (
              <>
                <div className="text-lg">Current Round Score: {G.currentRoundScore}</div>
                {isHotDice && <div className="text-green-400">Hot Dice! Roll again with all dice!</div>}
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
        )}

        {/* Winner Display */}
        {ctx.gameover && (
          <div className="mt-8 text-4xl font-bold text-yellow-400 animate-pulse text-center">
            {ctx.gameover.winner === playerID ? 'You Win!' : 'Opponent Wins!'}
          </div>
        )}
      </div>
    </div>
  )
}

export default Board
