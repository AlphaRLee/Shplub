import Sprite, { SpriteParams } from "./Sprite";
import { AnimationController, Animation, AnimationState } from "./AnimationController";

type ShplubAnim = Animation<Shplub>;

class Shplub extends Sprite {
  public imageRepo: any;
  public animations: any;
  private animationController: AnimationController<Shplub>;

  constructor(params: SpriteParams, imageRepo: any) {
    super(params);
    this.imageRepo = imageRepo;
    this.animationController = new AnimationController(this);

    const walkAnimDuration = 10;
    const walkXVelocity = 6;

    this.animations = {
      neutral: {
        name: "neutral",
        frames: [
          {
            image: this.imageRepo.neutral,
            duration: 2,
          },
        ],
        repeat: true,
      } as ShplubAnim,
      walk: {
        left: {
          name: "walk.left",
          frames: [
            {
              image: this.imageRepo.walk.left[0],
              duration: walkAnimDuration,
              velocity: { x: 0, y: 0 },
            },
            {
              image: this.imageRepo.walk.left[1],
              duration: walkAnimDuration,
              velocity: { x: 0, y: 0 },
            },
            {
              image: this.imageRepo.walk.left[0],
              duration: walkAnimDuration,
              velocity: { x: -walkXVelocity * 0.25, y: -1 },
            },
            {
              image: this.imageRepo.walk.left[2],
              duration: walkAnimDuration,
              velocity: { x: -walkXVelocity * 0.5, y: 0 },
            },
            {
              image: this.imageRepo.walk.left[2],
              duration: walkAnimDuration,
              velocity: { x: -walkXVelocity * 0.25, y: 1 },
            },
          ],
          repeat: true,
          startFrameIndex: 1,
          restartFrameIndex: 0,
        } as ShplubAnim,
        right: {
          name: "walk.right",
          frames: [
            {
              image: this.imageRepo.walk.right[0],
              duration: walkAnimDuration,
              velocity: { x: 0, y: 0 },
            },
            {
              image: this.imageRepo.walk.right[1],
              duration: walkAnimDuration,
              velocity: { x: 0, y: 0 },
            },
            {
              image: this.imageRepo.walk.right[0],
              duration: walkAnimDuration,
              velocity: { x: walkXVelocity * 0.25, y: -1 },
            },
            {
              image: this.imageRepo.walk.right[2],
              duration: walkAnimDuration,
              velocity: { x: walkXVelocity * 0.5, y: 0 },
            },
            {
              image: this.imageRepo.walk.right[2],
              duration: walkAnimDuration,
              velocity: { x: walkXVelocity * 0.25, y: 1 },
            },
          ],
          repeat: true,
          startFrameIndex: 1,
          restartFrameIndex: 0,
        } as ShplubAnim,
      },
    };
  }

  draw(ctx: CanvasRenderingContext2D, tickCount: number) {
    if (!this.animationController.state.animation) {
      this.animationController.setAnimation(this.animations.walk.right, tickCount);
    }

    const { image, velocity } = this.animationController.tick(tickCount);
    if (velocity) {
      this.pos.x += velocity.x;
      this.pos.y += velocity.y;
    }

    ctx.drawImage(image, this.pos.x, this.pos.y);
  }

  selectIdleAnimation() {
    const animState = this.animationController.state;
    const animation = animState.animation;
    if (!animation) return this.animations.neutral;

    if (!animState.animationIsDone) return animation;

    const rand = Math.random();
  }
}

export default Shplub;
