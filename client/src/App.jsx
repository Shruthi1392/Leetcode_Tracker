import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Header from './components/Header';

function App() {
  const [username, setUsername] = useState('');

  return (
    <div>
      <Header />
      <div className="p-4">
        <input
          type="text"
          placeholder="Enter LeetCode username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <Dashboard username={username} />
        <Problems username={username} />
      </div>
    </div>
  );
}

export default App;
