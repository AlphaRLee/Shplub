import React, { useState, useEffect, useRef } from "react";
import Game from "../gameEntities/Game";

function GameCanvas(props: any) {
  const [game, setGame] = useState<Game | undefined>();

  const canvasRef = useRef<HTMLCanvasElement | undefined>();

  // Main logic loop for canvas
  const draw = (ctx: CanvasRenderingContext2D, tickCount: number) => {
    if (!game) return;
    game.draw(ctx, tickCount);
  };

  // Set canvas to be fullscreen
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  useEffect(() => {
    // useEffect is triggered after first render, so canvasRef.current will always be initialized
    setGame(new Game(canvasRef.current));
  }, []);

  // Render looping logic on canvas
  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let tickCount = 0;
    let animationFrameId: number;

    const render = () => {
      tickCount++;
      draw(ctx, tickCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return (
    <div style={{ position: "fixed", left: 0, top: 0 }}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
}

export default GameCanvas;
