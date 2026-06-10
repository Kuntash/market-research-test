import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState<{ status: string, message: string } | null>(null)

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Market Research Platform
      </h1>
      <p className="text-gray-700 text-lg mb-8">
        Welcome to your serious investor operating system.
      </p>
      
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">System Status</h2>
        {health ? (
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 bg-green-500 rounded-full"></span>
            <p className="text-green-700 font-medium">{health.message}</p>
          </div>
        ) : (
          <div className="flex items-center space-x-2 animate-pulse">
            <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>
            <p className="text-yellow-700 font-medium">Connecting to backend...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
