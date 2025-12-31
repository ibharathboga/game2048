export const getHighestTileValue = (board) => {
  return board.reduce((max, cell) => {
    const tileValue = cell.tile?.value || 0;
    const mergeValue = cell.mergeTile?.value || 0;
    return Math.max(max, tileValue, mergeValue);
  }, 0);
};

export const noMovesLeft = (board, GRID_SIZE = 4) => {
  const hasEmptyCell = board.some((cell) => cell.tile === null);
  if (hasEmptyCell) return false;

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = board.find((c) => c.x === x && c.y === y);
      const tileValue = cell.tile?.value;

      const rightCell = board.find((c) => c.x === x + 1 && c.y === y);
      if (rightCell && rightCell.tile?.value === tileValue) return false;

      const downCell = board.find((c) => c.x === x && c.y === y + 1);
      if (downCell && downCell.tile?.value === tileValue) return false;
    }
  }
  return true;
};
