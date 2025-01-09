import React from 'react';
import AnimatedAvatar from './AnimatedAvatar';
import './App.css';

function App() {
  return (
    <div className="App p-2">
      <header className="App-header">
        <h1 className="text-center text-2xl font-bold text-blue-500 mb-2">
          Deliberately Expert Liquid Topography Assistant (DELTA)
        </h1>
      </header>
      <main className="flex justify-center">
        <AnimatedAvatar />
      </main>
    </div>
  );
}

export default App;