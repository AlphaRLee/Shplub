import Sprite, { SpriteParams } from "./Sprite";

class Shplub extends Sprite {
  public imageRepo: any;

  constructor(params: SpriteParams, imageRepo: any) {
    super(params);
    this.imageRepo = imageRepo;
  }

  draw(ctx: CanvasRenderingContext2D, frameCount: number) {
    ctx.drawImage(this.imageRepo.neutral, this.pos.x, this.pos.y);
  }
}

export default Shplub;
