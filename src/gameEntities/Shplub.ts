import Sprite, { SpriteParams } from "./Sprite";

// import shplubNeutralImg from "../assets/shplub/shplub_neutral.png";

class Shplub extends Sprite {
  public imageRepo: any;

  constructor(params: SpriteParams, imageRepo?: any) {
    super(params);
  }

  draw(ctx: CanvasRenderingContext2D, frameCount: number) {
    if (!this.imageRepo) return;
    ctx.drawImage(this.imageRepo.neutral, this.pos.x, this.pos.y);
  }
}

export default Shplub;
