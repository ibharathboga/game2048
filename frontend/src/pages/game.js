import { useEffect } from "react";
import { GRID_SIZE } from "../config";
import "../styles/game.css";

import Tile from "../components/tile";

import useGame from "../hooks/useGame";
import useGameTracker from "../hooks/useGameTracker";

function GamePage() {
  const {
    board,
    tiles,
    slideUp,
    slideDown,
    slideLeft,
    slideRight,
    mergeCellAt,
  } = useGame();

  const { highestTileScore, moves, duration } = useGameTracker(board);

  useEffect(() => {
    const keyMap = {
      ArrowUp: slideUp,
      ArrowDown: slideDown,
      ArrowLeft: slideLeft,
      ArrowRight: slideRight,
    };

    const handleKeyListener = (e) => {
      const action = keyMap[e.key];
      if (action) {
        action();
      }
      window.addEventListener("keydown", handleKeyListener, { once: true });
    };
    
    window.addEventListener("keydown", handleKeyListener, { once: true });

    return () => window.removeEventListener("keydown", handleKeyListener);
  }, [slideUp, slideDown, slideLeft, slideRight]);

  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
    <div key={i} className="cell" />
  ));

  const style = {
    "--cellDimensionCount": GRID_SIZE,
  };

  const tilesDesign = tiles.map((tile) => (
    <Tile
      key={tile.id}
      {...tile}
      onTransitionEndCallBack={() => mergeCellAt({ x: tile.x, y: tile.y })}
    />
  ));

  return (
    <div className="game-page">
      <div id="grid" style={style}>
        {cells}
        {tilesDesign}
      </div>
      <div className="stats">
        <p>Highest Tile: {highestTileScore}</p>
        <p>Moves: {moves}</p>
        <p>Duration: {duration}s</p>
      </div>
    </div>
  );
}

export default GamePage;
