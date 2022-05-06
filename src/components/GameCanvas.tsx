import React, { useState, useEffect } from "react";
import Shplub from "../gameEntities/Shplub";
import Canvas from "./Canvas";
import { loadImageRepo } from "../gameEntities/ImageRepo";

function GameCanvas(props: any) {
  const [imageRepo, setImageRepo] = useState<any>();
  const [shplub, setShplub] = useState<Shplub | undefined>();

  // Main logic loop for canvas
  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "green";
    ctx.fillRect(ctx.canvas.width / 4, 200, ctx.canvas.width / 2, 100);

    if (!shplub) {
      return;
    }
    shplub.draw(ctx, frameCount);
  };

  // Set canvas to be fullscreen
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  useEffect(() => {
    setImageRepo(loadImageRepo());

    setShplub(
      new Shplub({
        pos: { x: window.innerWidth / 2, y: window.innerHeight * 0.6 },
        width: 150,
        height: 130,
      })
    );
  }, []);

  useEffect(() => {
    if (imageRepo?.shplub) {
      shplub.imageRepo = imageRepo.shplub;
    }
  }, [imageRepo]);

  return (
    <div style={{ position: "fixed", left: 0, top: 0 }}>
      <Canvas draw={draw} width={canvasWidth} height={canvasHeight} />
    </div>
  );
}

export default GameCanvas;
