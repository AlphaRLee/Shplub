import React, { useState, useEffect, useRef } from "react";
import Game from "../gameEntities/Game";
function GameCanvas(props) {
    var _a = useState(), game = _a[0], setGame = _a[1];
    var canvasRef = useRef();
    // Main logic loop for canvas
    var draw = function (ctx, tickCount) {
        if (!game)
            return;
        game.tick(ctx, tickCount);
    };
    // Set canvas to be fullscreen
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    useEffect(function () {
        // useEffect is triggered after first render, so canvasRef.current will always be initialized
        setGame(new Game(canvasRef.current));
    }, []);
    // Render looping logic on canvas
    useEffect(function () {
        var canvas = canvasRef.current;
        var ctx = canvas.getContext("2d");
        var tickCount = 0;
        var animationFrameId;
        var render = function () {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            draw(ctx, tickCount);
            tickCount++;
            animationFrameId = window.requestAnimationFrame(render);
        };
        render();
        return function () {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [draw]);
    return (React.createElement("div", { style: { position: "fixed", left: 0, top: 0 } },
        React.createElement("canvas", { ref: canvasRef, width: canvasWidth, height: canvasHeight })));
}
export default GameCanvas;
//# sourceMappingURL=GameCanvas.js.map