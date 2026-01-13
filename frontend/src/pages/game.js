import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GRID_SIZE, WINNING_SCORE } from "../config";
import "../styles/game.css";

import Tile from "../components/tile";

import {
  flatTiles,
  initialiseBoard,
  slideMovement,
} from "../board/boardOperations.js";
import { getHighestTileValue, noMovesLeft } from "../board/boardUtils.js";
import { updateGameHistory } from "../board/updateGameHistory.js";
import { useNavigate } from "react-router-dom";

const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
  <div key={i} className="cell" />
));

function GamePage() {
  const [game, setGame] = useState({ board: initialiseBoard(), moves: 0 });
  const [duration, setDuration] = useState(0);
  const timerRef = useRef();
  const navigate = useNavigate();

  const highestTileScore = useMemo(
    () => getHighestTileValue(game.board),
    [game.board],
  );
  const isNoMovesLeft = useMemo(() => noMovesLeft(game.board), [game.board]);
  const isGameOver = isNoMovesLeft || highestTileScore >= WINNING_SCORE;

  const handleKeyListener = useCallback((e) => {
    setGame((prev) => {
      const operation = slideMovement(e.key, prev.board);
      if (!operation.boardChanged) return prev;
      return { board: operation.board, moves: prev.moves + 1 };
    });
  }, []);

  const tiles = useMemo(() => flatTiles(game.board), [game.board]);
  const tilesDesign = tiles.map((tile) => <Tile key={tile.id} {...tile} />);

  useEffect(() => {
    const handleGameOver = async () => {
      if (!isGameOver) return;
      await updateGameHistory({
        duration,
        highestTileScore,
        moves: game.moves,
      });
      navigate("/history");
    };
    handleGameOver();
  }, [isGameOver, game.moves, duration, highestTileScore, navigate]);

  const isTimerRunning = game.moves > 0 && !isGameOver;
  useEffect(() => {
    if (!isTimerRunning) return;
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyListener);
    return () => window.removeEventListener("keydown", handleKeyListener);
  }, [handleKeyListener]);

  return (
    <div className="game-page">
      <h1>game phase: under progress</h1>
      <div id="grid" style={{ "--cellDimensionCount": GRID_SIZE }}>
        {cells}
        {tilesDesign}
      </div>
      <div className="stats">
        <p>Highest Tile: {highestTileScore}</p>
        <p>Moves: {game.moves}</p>
        <p>Duration: {duration}s</p>
      </div>
    </div>
  );
}

export default GamePage;
