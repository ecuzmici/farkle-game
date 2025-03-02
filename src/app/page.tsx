import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col items-center justify-center p-8">
      <div className="p-8 rounded-lg shadow-md bg-gray-800 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-8">Farkle</h1>
        <div className="space-y-4">
          <Link
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            href="/lobby/host"
          >
            Host Game
          </Link>

          <Link
            className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
              transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            href="/lobby/join"
          >
            Join Game
          </Link>
        </div>
      </div>
    </div>
  )
}
