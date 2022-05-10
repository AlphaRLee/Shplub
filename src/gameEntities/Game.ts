import { loadImageRepo } from "./ImageRepo";
import Shplub from "./Shplub";
import EventBuilder from "./EventBuilder";
import EventListener from "./EventListener";

class Game {
  private canvas: HTMLCanvasElement;
  private tickCount: number = 0;
  private imageRepo = loadImageRepo();
  public shplub: Shplub;
  public eventBuilder: EventBuilder;
  public eventListener: EventListener;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.shplub = new Shplub(
      {
        pos: { x: window.innerWidth / 2 - 150 / 2, y: window.innerHeight * 0.6 },
        width: 150,
        height: 130,
      },
      this.imageRepo.shplub,
      this
    );
    this.eventBuilder = new EventBuilder(this.shplub);
    this.eventListener = new EventListener(this.shplub, this.eventBuilder);

    this.createUserEvents();
  }

  private createUserEvents() {
    this.canvas.addEventListener("mousedown", this.eventBuilder.pressEventHandler);
    this.canvas.addEventListener("mousemove", this.eventBuilder.moveEventHandler);
    this.canvas.addEventListener("mouseup", this.eventBuilder.releaseEventHandler);
    this.canvas.addEventListener("mouseout", this.eventBuilder.pressCancelEventHandler);

    this.canvas.addEventListener("touchstart", this.eventBuilder.pressEventHandler);
    this.canvas.addEventListener("touchmove", this.eventBuilder.moveEventHandler);
    this.canvas.addEventListener("touchend", this.eventBuilder.releaseEventHandler);
    this.canvas.addEventListener("touchcancel", this.eventBuilder.pressCancelEventHandler);
  }

  public tick(ctx: CanvasRenderingContext2D, tickCount: number) {
    this.tickCount = tickCount;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.drawImage(this.imageRepo.bday, ctx.canvas.width / 2 - 500, 20);

    const emittedEvents = this.eventBuilder.tick(tickCount);
    this.eventListener.tick(emittedEvents, tickCount);

    this.shplub.tick(ctx, tickCount);
  }

  private pressEventHandler = (event: MouseEvent) => {
    console.log("!!! pressy", event.x, event.y);
  };

  private dragEventHandler = (event: MouseEvent) => {};

  private releaseEventHandler = (event: MouseEvent) => {};

  private pressCancelEventHandler = (event: MouseEvent) => {};
}

export default Game;
