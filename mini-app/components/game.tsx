"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export default function Game() {
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(2);
  const moveInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver) return;
      setScore((s) => s + 1);
      speedRef.current += 0.01;
    }, 1000);

    const move = () => {
      if (gameOver) return;
      const player = playerRef.current;
      const obstacle = obstacleRef.current;
      if (!player || !obstacle) return;
      const playerRect = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();
      const triangle = obstacle.querySelector('.triangle');
      if (triangle) {
        const triRect = triangle.getBoundingClientRect();
        if (
          playerRect.right > triRect.left &&
          playerRect.left < triRect.right &&
          playerRect.bottom > triRect.top
        ) {
          setGameOver(true);
        }
      }
      obstacle.style.transform = `translateX(-${speedRef.current}px)`;
      requestAnimationFrame(move);
    };
    requestAnimationFrame(move);
    return () => clearInterval(interval);
  }, [gameOver]);

  const jump = () => {
    if (gameOver) return;
    const player = playerRef.current;
    if (!player) return;
    player.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(-150px)" }, { transform: "translateY(0)" }],
      { duration: 600, easing: "ease-in-out" }
    );
  };

  const restart = () => {
    setGameOver(false);
    setScore(0);
    speedRef.current = 2;
    const obstacle = obstacleRef.current;
    if (obstacle) obstacle.style.transform = "translateX(0)";
  };

  const stopMove = () => {
    if (moveInterval.current) {
      clearInterval(moveInterval.current);
      moveInterval.current = null;
    }
  };

  const startMoveLeft = () => {
    setPlayerX((prev) => Math.max(prev - 5, 0));
    moveInterval.current = setInterval(() => {
      setPlayerX((prev) => Math.max(prev - 5, 0));
    }, 50);
  };
  const startMoveRight = () => {
    setPlayerX((prev) => prev + 5);
    moveInterval.current = setInterval(() => {
      setPlayerX((prev) => prev + 5);
    }, 50);
  };

  return (
    <div
      className="relative w-full h-[400px] bg-black overflow-hidden flex flex-col items-center justify-center"
      onKeyDown={(e) => e.key === " " && jump()}
      tabIndex={0}
    >
      <div className="flex space-x-4 mb-4">
        <Button
          onMouseDown={startMoveLeft}
          onMouseUp={stopMove}
          onTouchStart={startMoveLeft}
          onTouchEnd={stopMove}
        >
          Left
        </Button>
        <Button onClick={jump}>Jump</Button>
        <Button
          onMouseDown={startMoveRight}
          onMouseUp={stopMove}
          onTouchStart={startMoveRight}
          onTouchEnd={stopMove}
        >
          Right
        </Button>
      </div>
      <div
        ref={playerRef}
        className="absolute bottom-0 w-10 h-10 bg-blue-500"
        style={{ left: `${playerX}px` }}
      ></div>
      <div ref={obstacleRef} className="absolute bottom-0 right-0 w-10 h-20">
        <div className="box w-10 h-10 bg-green-500 absolute bottom-0"></div>
        <div className="triangle w-10 h-10 absolute bottom-0" style={{clipPath:"polygon(50% 0%, 0% 100%, 100% 100%)"}}></div>
      </div>
      <div className="absolute top-0 left-0 p-2 text-white">{score}</div>
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white">
          <h1 className="text-2xl mb-4">Game Over</h1>
          <Button onClick={restart}>Restart</Button>
        </div>
      )}
    </div>
  );
}
