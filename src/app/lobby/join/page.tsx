// components/Join.tsx
'use client'

import { useState } from 'react'
import { Client } from 'boardgame.io/client'
import { P2P } from '@boardgame.io/p2p'
import { useRouter } from 'next/navigation'
import FarkleGame from '@/app/game/game'

const Join = () => {
  const [matchID, setMatchID] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleJoin = async () => {
    if (!matchID) {
      setError('Please enter a match ID')
      return
    }

    try {
      const client = Client({
        game: FarkleGame,
        matchID: matchID,
        playerID: '1',
        multiplayer: P2P({
          isHost: false,
          onError: (error) => console.error('P2P Error:', error),
        }),
      })

      // Start the client first
      client.start()

      // Wait for connection to be established
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          client.stop()
          reject(new Error('Connection timeout'))
        }, 10000)

        const unsubscribe = client.subscribe((state) => {
          console.log(state);
          if (state) {
            // Check if state exists first
            clearTimeout(timeout)
            unsubscribe()
            resolve(true)
          }
        })
      })

      router.push(`/game/${matchID}?role=join`)
    } catch (err) {
      setError('Failed to connect to host. Please check the match ID.')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-800 dark:bg-gray-900 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Join Game</h2>

      <div className="w-full max-w-xs space-y-4">
        <div>
          <input
            type="text"
            value={matchID}
            onChange={(e) => setMatchID(e.target.value.toUpperCase())}
            placeholder="Enter Match ID"
            className="w-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        <button
          onClick={handleJoin}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Join Game
        </button>
      </div>
    </div>
  )
}

export default Join
