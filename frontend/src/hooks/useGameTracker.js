import { useEffect, useRef, useState } from "react";

import { GRID_SIZE, WINNING_SCORE } from "../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";

function useGameTracker(board) {
  const [gameState, setGameState] = useState("idle");
  const [gameStatus, setGameStatus] = useState("");
  const [highestTileScore, setHighestTileScore] = useState(0);
  const [moves, setMoves] = useState(-3);

  const timerRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const navigate = useNavigate();

  const gameTrackerHookPing = () => {
    console.log("useGameTracker:invoked");
  };

  const getHighestTileValue = (board) => {
    return board.reduce((max, cell) => {
      const tileValue = cell.tile?.value || 0;
      const mergeValue = cell.mergeTile?.value || 0;
      return Math.max(max, tileValue, mergeValue);
    }, 0);
  };

  const isGameOver = (board) => {
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

  const boardChangeEffect = async () => {
    console.log("boardChangeEffect:invoked");
    if (gameState === "over" || gameStatus === "win" || gameStatus === "loose")
      return;
    setMoves((prev) => prev + 1);

    if (moves === 0) {
      console.log("game initialised");

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setDuration((prevTime) => prevTime + 1);
      }, 1000);

      setGameState("ongoing");
      setHighestTileScore(getHighestTileValue(board));
      return;
    }

    const currHighestTileScore = getHighestTileValue(board);
    const isNoMovesLeft = isGameOver(board);
    if (isNoMovesLeft || currHighestTileScore >= WINNING_SCORE) {
      setGameState("over");
      if (timerRef.current) clearInterval(timerRef.current);
      if (currHighestTileScore >= WINNING_SCORE) setGameStatus("win");
      else setGameStatus("loose");

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/scores/`,
          { duration, highestTileScore: currHighestTileScore, moves },
          { withCredentials: true },
        );
      } catch (error) {
        toast.info(error.response?.data?.message ?? error.message, {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }

      navigate("/history");
    }
    setHighestTileScore(currHighestTileScore);
  };

  useEffect(() => {
    boardChangeEffect();
  }, [board]);

  return {
    gameTrackerHookPing,
    gameState,
    gameStatus,
    highestTileScore,
    moves,
    duration,
  };
}

export default useGameTracker;
