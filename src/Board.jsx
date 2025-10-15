import React, { useState, useEffect } from 'react';
import { slideRow, transpose, addRandomTile, generateEmptyBoard, isGameOver } from './Logic.js';

function Board() {
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState(() => initBoard(4));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  function initBoard(size) {
    const newBoard = generateEmptyBoard(size);
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }

  const getTileColor = (num) => {
    switch (num) {
      case 2: return 'bg-yellow-200';
      case 4: return 'bg-yellow-300';
      case 8: return 'bg-orange-300';
      case 16: return 'bg-orange-400';
      case 32: return 'bg-red-300';
      case 64: return 'bg-red-400';
      case 128: return 'bg-purple-300';
      case 256: return 'bg-purple-400';
      case 512: return 'bg-green-300';
      case 1024: return 'bg-green-400';
      case 2048: return 'bg-blue-400';
      default: return 'bg-amber-50';
    }
  };

  const moveBoard = (direction) => {
    if (gameOver) return;
    let gainedScore = 0;
    let newBoard;

    switch (direction) {
      case 'ArrowLeft':
        newBoard = board.map(row => {
          const [newRow, score] = slideRow(row, 'left');
          gainedScore += score;
          return newRow;
        });
        break;
      case 'ArrowRight':
        newBoard = board.map(row => {
          const [newRow, score] = slideRow(row, 'right');
          gainedScore += score;
          return newRow;
        });
        break;
      case 'ArrowUp':
        newBoard = transpose(board).map(row => {
          const [newRow, score] = slideRow(row, 'left');
          gainedScore += score;
          return newRow;
        });
        newBoard = transpose(newBoard);
        break;
      case 'ArrowDown':
        newBoard = transpose(board).map(row => {
          const [newRow, score] = slideRow(row, 'right');
          gainedScore += score;
          return newRow;
        });
        newBoard = transpose(newBoard);
        break;
      default: return;
    }

    if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(prev => prev + gainedScore);
      if (isGameOver(newBoard)) setGameOver(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        moveBoard(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);

  const restartGame = () => {
    setBoard(initBoard(boardSize));
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-amber-100 to-amber-100 p-4 sm:p-6">
      {/* Title */}
      <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-center text-amber-800 drop-shadow-lg">2048</h1>

      {/* Controls + Score */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6 sm:mb-8 justify-center">
        <button
          onClick={restartGame}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold shadow-lg transform transition hover:from-green-500 hover:to-green-700"
        >
          Restart
        </button>
        <button
          onClick={() => setShowInfo(true)}
          className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold shadow-lg transform transition hover:from-blue-500 hover:to-blue-700"
        >
          Info
        </button>

        <div className="bg-white shadow-xl rounded-xl px-4 sm:px-5 py-1 sm:py-2 text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-gray-500">Score:</span>
          <span>{score}</span>
        </div>

        <select
          value={boardSize}
          onChange={(e) => {
            const size = Number(e.target.value);
            setBoardSize(size);
            setBoard(initBoard(size));
            setScore(0);
            setGameOver(false);
          }}
          className="bg-white border-2 border-amber-600 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm sm:text-lg font-semibold text-gray-700 focus:outline-none focus:border-amber-700 shadow-lg hover:shadow-xl transition cursor-pointer"
        >
          <option value={4}>4x4</option>
          <option value={5}>5x5</option>
          <option value={6}>6x6</option>
        </select>
      </div>

      {/* Fully Responsive Board */}
      <div className="w-[90vw] sm:w-[80vw] max-w-[500px]">
        <div
          className="bg-amber-700 rounded-3xl p-2 sm:p-4 grid gap-2 sm:gap-4 shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gridTemplateRows: `repeat(${boardSize}, 1fr)`,
            aspectRatio: '1 / 1' // keeps board square
          }}
        >
          {board.flat().map((num, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center font-bold text-2xl sm:text-3xl rounded-lg shadow-md ${getTileColor(num)} aspect-square transition-all duration-300 ease-out`}
            >
              {num !== 0 ? num : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl text-center max-w-xs sm:max-w-sm">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-red-600">Game Over!</h2>
            <p className="mb-4 text-lg sm:text-xl font-semibold">Your final score: {score}</p>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold shadow-lg transform transition hover:from-green-500 hover:to-green-700"
            >
              Restart
            </button>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl text-center max-w-xs sm:max-w-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">How to Play</h2>
            <p className="mb-4 text-sm sm:text-lg">
              Use arrow keys to move tiles. Combine tiles with the same number to score points. Reach 2048 to win!
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold shadow-lg transform transition hover:from-blue-500 hover:to-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Board;
