export const createNewEmptyCells = (GRID_SIZE = 4) => {
  const cells = [];

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    cells.push({
      x: i % GRID_SIZE,
      y: Math.floor(i / GRID_SIZE),
      tile: null,
      mergeTile: null,
    });
  }

  return cells;
};

let tileId = 1;
export const addRandomTile = (board) => {
  const emptyCells = board.filter((cell) => !cell.tile);

  if (!emptyCells.length) {
    return { board, boardChanged: false };
  }

  const targetCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  const newTile = {
    id: tileId++,
    x: targetCell.x,
    y: targetCell.y,
    value: 2,
  };

  const nextBoard = board.map((cell) =>
    cell === targetCell ? { ...cell, tile: newTile } : cell,
  );

  return { board: nextBoard, boardChanged: true };
};

export const initialiseBoard = () => {
  let board = createNewEmptyCells();
  board = addRandomTile(board).board;
  board = addRandomTile(board).board;
  return board;
};

export const gridCellsByRow = (board) => {
  return board.reduce((rows, cell) => {
    rows[cell.y] ||= [];
    rows[cell.y][cell.x] = cell;
    return rows;
  }, []);
};

export const gridCellsByColumn = (board) => {
  return board.reduce((cols, cell) => {
    cols[cell.x] ||= [];
    cols[cell.x][cell.y] = cell;
    return cols;
  }, []);
};

export const mergeTiles = (board) => {
  let boardChanged = false;

  const nextBoard = board.map((cell) => {
    if (!cell.tile || !cell.mergeTile) return cell;

    boardChanged = true;

    return {
      ...cell,
      tile: {
        ...cell.tile,
        value: cell.tile.value + cell.mergeTile.value,
      },
      mergeTile: null,
    };
  });

  return { board: nextBoard, boardChanged };
};

const slideTiles = (axes, board) => {
  let boardChanged = false;

  axes.forEach((axis) => {
    for (let i = 1; i < axis.length; i++) {
      const sourceCell = axis[i];
      if (!sourceCell.tile) continue;

      let targetIndex = null;

      for (let j = i - 1; j >= 0; j--) {
        const targetCell = axis[j];

        if (!targetCell.tile) {
          targetIndex = j;
          continue;
        }

        if (
          targetCell.tile.value === sourceCell.tile.value &&
          !targetCell.mergeTile
        ) {
          targetIndex = j;
        }

        break;
      }

      if (targetIndex === null) continue;

      const targetCell = axis[targetIndex];
      const movingTile = {
        ...sourceCell.tile,
        x: targetCell.x,
        y: targetCell.y,
      };

      boardChanged = true;

      if (targetCell.tile) {
        targetCell.mergeTile = movingTile;
      } else {
        targetCell.tile = movingTile;
      }

      sourceCell.tile = null;
    }
  });

  return { board, boardChanged };
};

export const slideMovement = (movement, board) => {
  let axesGetter;

  if (movement === "ArrowUp") {
    axesGetter = (b) => gridCellsByRow(b);
  } else if (movement === "ArrowDown") {
    axesGetter = (b) => [...gridCellsByRow(b)].map((r) => [...r].reverse());
  } else if (movement === "ArrowLeft") {
    axesGetter = (b) => gridCellsByColumn(b);
  } else if (movement === "ArrowRight") {
    axesGetter = (b) => [...gridCellsByColumn(b)].map((c) => [...c].reverse());
  } else {
    return { board, boardChanged: false };
  }

  const clonedBoard = board.map((cell) => ({
    ...cell,
    tile: cell.tile ? { ...cell.tile } : null,
    mergeTile: null,
  }));

  const slideOp = slideTiles(axesGetter(clonedBoard), clonedBoard);
  if (!slideOp.boardChanged) return { board, boardChanged: false };

  const mergeOp = mergeTiles(slideOp.board);
  const finalBoard = mergeOp.boardChanged ? mergeOp.board : slideOp.board;

  return addRandomTile(finalBoard);
};

export const flatTiles = (board) => {
  return board.flatMap((cell) => [cell.tile, cell.mergeTile].filter(Boolean));
};
