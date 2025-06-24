import React, { useState } from 'react';
import Calendar from './components/Calendar';
import './index.css';

function App() {
  const [filter, setFilter] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 to-purple-200'} min-h-screen p-4 transition-colors duration-300`}>
      <header className="text-center text-4xl font-bold mb-4 text-purple-700 dark:text-white drop-shadow-md sticky top-0 z-10">
        Survey Sparrow Calendar
      </header>

      <div className="flex justify-between items-center max-w-md mx-auto mb-4">
        <input
          type="text"
          placeholder="🔍 Filter events..."
          className="w-full px-4 py-2 border rounded shadow-sm text-black"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-2 px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </div>

      <Calendar filter={filter} />
    </div>
  );
}

export default App;
