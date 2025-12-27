import { useEffect, useState } from "react";
import { GRID_SIZE } from "../config";

let tileId = 1;

const createNewEmptyCells = () => {
  const cells = [];

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = {
      x: i % GRID_SIZE,
      y: Math.floor(i / GRID_SIZE),
      tile: null,
      mergeTile: null,
    };
    cells.push(cell);
  }

  return cells;
};

export default function useGame() {
  const [board, setBoard] = useState(createNewEmptyCells);

  const ping = () => {
    console.log("useGame:ping:invoked");
    console.log(board);
  };

  const addRandomTile = () => {
    const emptyCells = board.filter((cell) => !cell.tile);
    if (!emptyCells.length) return;
    const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    cell.tile = { id: tileId++, x: cell.x, y: cell.y, value: 2 };
  };

  const gridCellsByColumn = () => {
    const cellsByColumn = board.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
    return cellsByColumn;
  };

  const gridCellsByRow = () => {
    const cellsByRow = board.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
    return cellsByRow;
  };

  const slideTiles = (axes) => {
    let boardChanged = false;

    axes.forEach((axis) => {
      for (let i = 1; i < axis.length; i++) {
        const cell = axis[i];
        if (!cell.tile) continue;

        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = axis[j];
          const canMove =
            !moveToCell.tile ||
            (!moveToCell.mergeTile &&
              moveToCell.tile.value === cell.tile.value);
          if (!canMove) break;
          lastValidCell = moveToCell;
        }

        if (!lastValidCell) continue;

        boardChanged = true;
        const movingTile = cell.tile;
        movingTile.x = lastValidCell.x;
        movingTile.y = lastValidCell.y;

        if (lastValidCell.tile) {
          lastValidCell.mergeTile = movingTile;
        } else {
          lastValidCell.tile = movingTile;
        }
        cell.tile = null;
      }
    });

    board.forEach((cell) => {
      if (cell.tile && cell.mergeTile) {
        cell.tile.value += cell.mergeTile.value;
        cell.mergeTile = null;
        boardChanged = true;
      }
    });

    if (!boardChanged) return;
    addRandomTile();
    setBoard((prev) => [...prev]);
  };

  const slideUp = () => slideTiles(gridCellsByColumn());
  const slideDown = () =>
    slideTiles(gridCellsByColumn().map((column) => column.reverse()));
  const slideLeft = () => slideTiles(gridCellsByRow());
  const slideRight = () =>
    slideTiles(gridCellsByRow().map((row) => row.reverse()));

  const tiles = board
    .flatMap((cell) => {
      const cellTiles = [];
      if (cell.tile) cellTiles.push(cell.tile);
      if (cell.mergeTile) cellTiles.push(cell.mergeTile);
      return cellTiles;
    })
    .filter((tile) => tile !== null);

  const useGameEffect = () => {
    console.log("useGameEffect:invoked");
    addRandomTile();
    setBoard((prev) => [...prev]);
  };
  useEffect(useGameEffect, []);
  return {
    ping,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    tiles,
    board,
  };
}
