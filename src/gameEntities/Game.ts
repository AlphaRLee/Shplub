import { loadImageRepo } from "./ImageRepo";
import Shplub from "./Shplub";

class Game {
  private canvas: HTMLCanvasElement;
  private frameCount: number = 0;
  private imageRepo = loadImageRepo();
  private shplub: Shplub;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.shplub = new Shplub(
      {
        pos: { x: window.innerWidth / 2, y: window.innerHeight * 0.6 },
        width: 150,
        height: 130,
      },
      this.imageRepo.shplub
    );

    this.createUserEvents();
  }

  private createUserEvents() {
    this.canvas.addEventListener("mousedown", this.pressEventHandler);
    this.canvas.addEventListener("mousemove", this.dragEventHandler);
    this.canvas.addEventListener("mouseup", this.releaseEventHandler);
    this.canvas.addEventListener("mouseout", this.pressCancelEventHandler);

    this.canvas.addEventListener("touchstart", this.pressEventHandler);
    this.canvas.addEventListener("touchmove", this.dragEventHandler);
    this.canvas.addEventListener("touchend", this.releaseEventHandler);
    this.canvas.addEventListener("touchcancel", this.pressCancelEventHandler);
  }

  public draw(ctx: CanvasRenderingContext2D, frameCount: number) {
    this.frameCount = frameCount;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = "green";
    ctx.fillRect(ctx.canvas.width / 4, 200, ctx.canvas.width / 2, 100);

    this.shplub.draw(ctx, frameCount);
  }

  private pressEventHandler = (event: MouseEvent) => {
    console.log("!!! pressy", event.x, event.y);
  };

  private dragEventHandler = (event: MouseEvent) => {};

  private releaseEventHandler = (event: MouseEvent) => {};

  private pressCancelEventHandler = (event: MouseEvent) => {};
}

export default Game;
