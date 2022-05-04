import React, { useRef, useEffect } from "react";

interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
  [index: string]: any;
}

function Canvas(props: CanvasProps) {
  const { draw, ...rest } = props;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let frameCount = 0;
    let animationFrameId: number;

    const render = () => {
      frameCount++;
      draw(ctx, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return <canvas ref={canvasRef} {...rest} />;
}

export default Canvas;
