import { loadImageRepo } from "./ImageRepo";
import Shplub from "./Shplub";
import EventBuilder from "./EventBuilder";
import EventListener from "./EventListener";
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
        }, this.imageRepo.shplub, this);
        this.eventBuilder = new EventBuilder(this.shplub);
        this.eventListener = new EventListener(this.shplub, this.eventBuilder);
        this.createUserEvents();
    }
    Game.prototype.createUserEvents = function () {
        this.canvas.addEventListener("mousedown", this.eventBuilder.pressEventHandler);
        this.canvas.addEventListener("mousemove", this.eventBuilder.moveEventHandler);
        this.canvas.addEventListener("mouseup", this.eventBuilder.releaseEventHandler);
        this.canvas.addEventListener("mouseout", this.eventBuilder.pressCancelEventHandler);
        this.canvas.addEventListener("touchstart", this.eventBuilder.pressEventHandler);
        this.canvas.addEventListener("touchmove", this.eventBuilder.moveEventHandler);
        this.canvas.addEventListener("touchend", this.eventBuilder.releaseEventHandler);
        this.canvas.addEventListener("touchcancel", this.eventBuilder.pressCancelEventHandler);
    };
    Game.prototype.tick = function (ctx, tickCount) {
        this.tickCount = tickCount;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(this.imageRepo.bday, ctx.canvas.width / 2 - 500, 20);
        var emittedEvents = this.eventBuilder.tick(tickCount);
        this.eventListener.tick(emittedEvents, tickCount);
        this.shplub.tick(ctx, tickCount);
    };
    return Game;
}());
export default Game;
//# sourceMappingURL=Game.js.map