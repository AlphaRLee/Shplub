import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";

function GameCanvas(props: any) {
  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "green";
    ctx.fillRect(ctx.canvas.width / 4, 200, ctx.canvas.width / 2, 100);
  };

  // Set canvas to be fullscreen
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  return (
    <div style={{ position: "fixed", left: 0, top: 0 }}>
      <Canvas draw={draw} width={canvasWidth} height={canvasHeight} />
    </div>
  );
}

export default GameCanvas;
