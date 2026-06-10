import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState<{ status: string, message: string } | null>(null)
  const [ticker, setTicker] = useState('RELIANCE')
  const [noteContent, setNoteContent] = useState('')
  const [notes, setNotes] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if (ticker) {
      fetch(`/api/notes/${ticker}`)
        .then(res => res.json())
        .then(data => setNotes(data))
        .catch(err => console.error(err))
    }
  }, [ticker])

  const saveNote = async () => {
    if (!noteContent) return;
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, content: noteContent })
      });
      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      setNoteContent('');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-600">Market Research OS</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${health ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
            <span className="text-sm text-gray-500">{health ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar / Left Column: Ticker & Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Ticker</label>
            <div className="flex space-x-2">
              <input 
                type="text" 
                value={ticker} 
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. RELIANCE"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border h-64 flex items-center justify-center text-gray-400">
            [ TradingView Chart Placeholder ]
          </div>
        </div>

        {/* Middle Column: Fundamentals/News */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border h-full">
            <h2 className="text-lg font-semibold mb-4">Fundamentals</h2>
            <div className="space-y-4 text-gray-500 italic">
              Loading data for {ticker}...
            </div>
          </div>
        </div>

        {/* Right Column: Research Notes */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Research Notes</h2>
            
            <div className="mb-4">
              <textarea 
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                placeholder={`Add a note for ${ticker}...`}
              />
              <button 
                onClick={saveNote}
                className="mt-2 w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save Note
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {notes.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No notes yet for {ticker}.</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-gray-800">{note.content}</p>
                    <span className="text-[10px] text-gray-400 mt-2 block">
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
