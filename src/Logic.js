export const generateEmptyBoard = (size = 4) => {
    return Array(size).fill().map(() => Array(size).fill(0))
};

export const addRandomTile = (board) => {
    const emptyCells = [];
    board.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 0) emptyCells.push([i, j]);
        });
    });

    if (emptyCells.length === 0) return board;

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;

    return board;
};

export const slideRow = (row, direction = 'left') => {
  let newRow = direction === 'left' ? [...row] : [...row].reverse();
  let scoreGained = 0;

  // Slide all non-zero numbers to the front
  newRow = newRow.filter(n => n !== 0);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      scoreGained += newRow[i];
      newRow[i + 1] = 0;
    }
  }

  // Slide again after merging
  newRow = newRow.filter(n => n !== 0);
  while (newRow.length < row.length) newRow.push(0);

  if (direction === 'right') newRow.reverse();
  return [newRow, scoreGained];
};


export const transpose = (board) => board[0].map((_, i) => board.map(row => row[i]));


export function isGameOver(board) {
  // Check for empty tiles
  for (let row of board) if (row.includes(0)) return false;

  // Check horizontal merges
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[r].length - 1; c++)
      if (board[r][c] === board[r][c + 1]) return false;

  // Check vertical merges
  for (let c = 0; c < board[0].length; c++)
    for (let r = 0; r < board.length - 1; r++)
      if (board[r][c] === board[r + 1][c]) return false;

  return true;
}
