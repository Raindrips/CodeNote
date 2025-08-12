import React, { useState, useCallback } from 'react';
import ChessPiece from './ChessPiece';
import { initialBoard, isValidMove, makeMove, isInCheck, isCheckmate, getBestMove } from '../lib/chessLogic';

const ChessBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('red'); // 'red' or 'black'
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'check', 'checkmate', 'draw'
  const [moveHistory, setMoveHistory] = useState([]);

  const handleSquareClick = useCallback((row, col) => {
    if (gameStatus === 'checkmate') return;

    const piece = board[row][col];
    
    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = board[selectedRow][selectedCol];
      
      // 如果点击的是同一个位置，取消选择
      if (selectedRow === row && selectedCol === col) {
        setSelectedSquare(null);
        return;
      }
      
      // 如果点击的是己方棋子，切换选择
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);
        return;
      }
      
      // 尝试移动棋子
      if (selectedPiece && selectedPiece.color === currentPlayer) {
        if (isValidMove(board, selectedRow, selectedCol, row, col)) {
          const newBoard = makeMove(board, selectedRow, selectedCol, row, col);
          setBoard(newBoard);
          setMoveHistory(prev => [...prev, { from: [selectedRow, selectedCol], to: [row, col], piece: selectedPiece }]);
          
          // 切换玩家
          const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';
          setCurrentPlayer(nextPlayer);
          
          // 检查游戏状态
          if (isInCheck(newBoard, nextPlayer)) {
            if (isCheckmate(newBoard, nextPlayer)) {
              setGameStatus('checkmate');
            } else {
              setGameStatus('check');
            }
          } else {
            setGameStatus('playing');
          }
        }
      }
      
      setSelectedSquare(null);
    } else {
      // 选择棋子
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);
      }
    }
  }, [board, selectedSquare, currentPlayer, gameStatus]);

  const resetGame = () => {
    setBoard(initialBoard);
    setSelectedSquare(null);
    setCurrentPlayer('red');
    setGameStatus('playing');
    setMoveHistory([]);
  };

  const handleAiMove = useCallback(() => {
    if (gameStatus === 'checkmate' || currentPlayer === 'red') return;

    const bestMove = getBestMove(board, 'black');
    if (bestMove) {
      const { from, to } = bestMove;
      const newBoard = makeMove(board, from[0], from[1], to[0], to[1]);
      setBoard(newBoard);
      setMoveHistory(prev => [...prev, { from: from, to: to, piece: board[from[0]][from[1]] }]);

      const nextPlayer = 'red';
      setCurrentPlayer(nextPlayer);

      if (isInCheck(newBoard, nextPlayer)) {
        if (isCheckmate(newBoard, nextPlayer)) {
          setGameStatus('checkmate');
        } else {
          setGameStatus('check');
        }
      } else {
        setGameStatus('playing');
      }
    }
  }, [board, currentPlayer, gameStatus]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">中国象棋</h1>
        <div className="flex items-center justify-center gap-4">
          <div className="text-lg">
            当前玩家: <span className={currentPlayer === 'red' ? 'text-red-600' : 'text-gray-800'}>
              {currentPlayer === 'red' ? '红方' : '黑方'}
            </span>
          </div>
          {gameStatus === 'check' && (
            <div className="text-yellow-600 font-bold">将军!</div>
          )}
          {gameStatus === 'checkmate' && (
            <div className="text-red-600 font-bold">
              {currentPlayer === 'red' ? '黑方' : '红方'}获胜!
            </div>
          )}
        </div>
      </div>
      
      <div className="relative bg-yellow-100 p-4 border-4 border-yellow-800 rounded-lg shadow-lg">
        {/* 棋盘网格 */}
        <div className="grid grid-cols-9 gap-0 bg-yellow-200">
          {board.map((row, rowIndex) => 
            row.map((piece, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 border border-gray-600 flex items-center justify-center cursor-pointer
                  hover:bg-yellow-300 transition-colors duration-150
                  ${selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex 
                    ? 'bg-blue-300 ring-2 ring-blue-500' 
                    : 'bg-yellow-100'
                  }
                  ${rowIndex === 4 && colIndex >= 3 && colIndex <= 5 ? 'border-b-2 border-red-600' : ''}
                  ${rowIndex === 5 && colIndex >= 3 && colIndex <= 5 ? 'border-t-2 border-red-600' : ''}
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <ChessPiece 
                    type={piece.type} 
                    color={piece.color}
                    isSelected={selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex}
                  />
                )}
              </div>
            ))
          )}
        </div>
        
        {/* 楚河汉界标识 */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-xs font-bold text-gray-700 bg-yellow-100 px-2 py-1 rounded">
            楚河 ————— 汉界
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex gap-4">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          重新开始
        </button>
        <button
          onClick={handleAiMove}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          disabled={currentPlayer === 'red'}
        >
          AI走棋
        </button>
      </div>
      
      {/* 移动历史 */}
      {moveHistory.length > 0 && (
        <div className="mt-4 max-w-md">
          <h3 className="text-lg font-semibold mb-2">走棋记录</h3>
          <div className="max-h-32 overflow-y-auto bg-gray-100 p-2 rounded">
            {moveHistory.map((move, index) => (
              <div key={index} className="text-sm">
                {index + 1}. {move.piece.type} {String.fromCharCode(97 + move.from[1])}{9 - move.from[0]} → {String.fromCharCode(97 + move.to[1])}{9 - move.to[0]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessBoard;

