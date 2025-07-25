import React from 'react';
import ChessBoard from './components/ChessBoard';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto py-8">
        <ChessBoard />
      </div>
    </div>
  );
}

export default App;

