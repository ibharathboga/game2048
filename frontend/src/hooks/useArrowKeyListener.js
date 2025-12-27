import { useEffect } from "react";

export default function useArrowKeyListener({
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
}) {
  const setupArrowKeyListener = () =>
    window.addEventListener("keydown", handleKeyListener, { once: true });

  const handleKeyListener = (e) => {
    switch (e.key) {
      case "ArrowUp":
        onArrowUp();
        break;
      case "ArrowDown":
        onArrowDown();
        break;
      case "ArrowLeft":
        onArrowLeft();
        break;
      case "ArrowRight":
        onArrowRight();
        break;
    }
    setupArrowKeyListener();
  };

  useEffect(setupArrowKeyListener, []);
  return {
    handleKeyListener,
  };
}
