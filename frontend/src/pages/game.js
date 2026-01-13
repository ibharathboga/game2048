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
  const [game, setGame] = useState({
    board: initialiseBoard(),
    moves: 0,
    isNoMovesLeft: false,
    highestTileScore: 2,
  });
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();

  const handleKeyListener = useCallback((e) => {
    setGame((prev) => {
      if (prev.isNoMovesLeft || prev.highestTileScore >= WINNING_SCORE) {
        return prev;
      }
      const operation = slideMovement(e.key, prev.board);
      if (!operation.boardChanged) return prev;

      return {
        board: operation.board,
        moves: prev.moves + 1,
        isNoMovesLeft: noMovesLeft(operation.board),
        highestTileScore: getHighestTileValue(operation.board),
      };
    });
  }, []);

  const tiles = useMemo(() => flatTiles(game.board), [game.board]);
  const tilesDesign = tiles.map((tile) => <Tile key={tile.id} {...tile} />);

  const isGameOver =
    game.isNoMovesLeft || game.highestTileScore >= WINNING_SCORE;
  const isGameOverHandled = useRef(false);
  useEffect(() => {
    if (!isGameOver || isGameOverHandled.current) {
      return;
    }

    isGameOverHandled.current = true;
    window.removeEventListener("keydown", handleKeyListener);

    const handleGameOver = async () => {
      await updateGameHistory({
        duration,
        highestTileScore: game.highestTileScore,
        moves: game.moves,
      });

      navigate("/history");
    };
    handleGameOver();
  }, [
    isGameOver,
    duration,
    game.highestTileScore,
    game.moves,
    navigate,
    handleKeyListener,
  ]);

  const isTimerRunning = game.moves > 0 && !isGameOver;
  useEffect(() => {
    if (!isTimerRunning) return;
    const timerId = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [isTimerRunning]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyListener);
    return () => window.removeEventListener("keydown", handleKeyListener);
  }, [handleKeyListener]);

  return (
    <div className="game-page">
      <div id="grid" style={{ "--cellDimensionCount": GRID_SIZE }}>
        {cells}
        {tilesDesign}
      </div>
      <div className="stats">
        <p>Highest Tile: {game.highestTileScore}</p>
        <p>Moves: {game.moves}</p>
        <p>Duration: {duration}s</p>
      </div>
    </div>
  );
}

export default GamePage;
