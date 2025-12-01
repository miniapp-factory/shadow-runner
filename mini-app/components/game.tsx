"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

export default function Game() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(2);

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
      if (
        playerRect.right > obstacleRect.left &&
        playerRect.left < obstacleRect.right &&
        playerRect.bottom > obstacleRect.top
      ) {
        setGameOver(true);
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
      { duration: 300, easing: "ease-out" }
    );
  };

  const restart = () => {
    setGameOver(false);
    setScore(0);
    speedRef.current = 2;
    const obstacle = obstacleRef.current;
    if (obstacle) obstacle.style.transform = "translateX(0)";
  };

  return (
    <div
      className="relative w-full h-[400px] bg-black overflow-hidden"
      onClick={jump}
      onKeyDown={(e) => e.key === " " && jump()}
      tabIndex={0}
    >
      <div ref={playerRef} className="absolute bottom-0 left-10 w-10 h-10 bg-blue-500"></div>
      <div ref={obstacleRef} className="absolute bottom-0 right-0 w-10 h-20 bg-red-500"></div>
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
