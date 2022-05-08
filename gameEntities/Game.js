import { loadImageRepo } from "./ImageRepo";
import Shplub from "./Shplub";
var Game = /** @class */ (function () {
    function Game(canvas) {
        this.tickCount = 0;
        this.imageRepo = loadImageRepo();
        this.pressEventHandler = function (event) {
            console.log("!!! pressy", event.x, event.y);
        };
        this.dragEventHandler = function (event) { };
        this.releaseEventHandler = function (event) { };
        this.pressCancelEventHandler = function (event) { };
        this.canvas = canvas;
        this.shplub = new Shplub({
            pos: { x: window.innerWidth / 2 - 150 / 2, y: window.innerHeight * 0.6 },
            width: 150,
            height: 130,
        }, this.imageRepo.shplub);
        this.createUserEvents();
    }
    Game.prototype.createUserEvents = function () {
        this.canvas.addEventListener("mousedown", this.pressEventHandler);
        this.canvas.addEventListener("mousemove", this.dragEventHandler);
        this.canvas.addEventListener("mouseup", this.releaseEventHandler);
        this.canvas.addEventListener("mouseout", this.pressCancelEventHandler);
        this.canvas.addEventListener("touchstart", this.pressEventHandler);
        this.canvas.addEventListener("touchmove", this.dragEventHandler);
        this.canvas.addEventListener("touchend", this.releaseEventHandler);
        this.canvas.addEventListener("touchcancel", this.pressCancelEventHandler);
    };
    Game.prototype.draw = function (ctx, tickCount) {
        this.tickCount = tickCount;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.shplub.draw(ctx, tickCount);
    };
    return Game;
}());
export default Game;
//# sourceMappingURL=Game.js.map