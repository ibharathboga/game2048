import { useEffect, useMemo, useState } from "react";
import { GRID_SIZE } from "../config";
import "../styles/game.css";

import Tile from "../components/tile";

import {
  flatTiles,
  initialiseBoard,
  slideMovement,
} from "../board/boardOperations.js";

const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
  <div key={i} className="cell" />
));

function GamePage() {
  const [game, setGame] = useState({ board: initialiseBoard(), moves: 0 });

  const tiles = useMemo(() => flatTiles(game.board), [game.board]);
  const tilesDesign = tiles.map((tile) => <Tile key={tile.id} {...tile} />);

  const handleKeyListener = (e) => {
    setGame((prev) => {
      const operation = slideMovement(e.key, prev.board);
      if (!operation.boardChanged) return prev;
      return { board: operation.board, moves: prev.moves + 1 };
    });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyListener);
    console.log("useEffect:invoked");
    return () => window.removeEventListener("keydown", handleKeyListener);
  }, []);

  return (
    <div className="game-page">
      <h1>game phase: under progress</h1>
      <div id="grid" style={{ "--cellDimensionCount": GRID_SIZE }}>
        {cells}
        {tilesDesign}
      </div>
      <div className="stats">
        {/* <p>Highest Tile: {highestTileScore}</p> */}
        <p>Moves: {game.moves}</p>
        {/* <p>Duration: {duration}s</p> */}
      </div>
    </div>
  );
}

export default GamePage;
