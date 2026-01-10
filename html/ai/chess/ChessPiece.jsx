import React from 'react';

const ChessPiece = ({ type, color, isSelected }) => {
  // 棋子的中文名称映射
  const pieceNames = {
    king: color === 'red' ? '帅' : '将',
    advisor: color === 'red' ? '仕' : '士',
    elephant: color === 'red' ? '相' : '象',
    horse: '马',
    chariot: '车',
    cannon: '炮',
    pawn: color === 'red' ? '兵' : '卒'
  };

  const pieceName = pieceNames[type] || '';
  
  return (
    <div 
      className={`
        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
        border-2 cursor-pointer transition-all duration-150
        ${color === 'red' 
          ? 'bg-red-100 border-red-600 text-red-800 hover:bg-red-200' 
          : 'bg-gray-100 border-gray-800 text-gray-900 hover:bg-gray-200'
        }
        ${isSelected ? 'ring-2 ring-blue-400 scale-110' : ''}
        shadow-md hover:shadow-lg
      `}
    >
      {pieceName}
    </div>
  );
};

export default ChessPiece;

