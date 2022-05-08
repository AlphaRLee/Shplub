import Sprite, { SpriteParams } from "./Sprite";
import { AnimationController, Animation, AnimationState } from "./AnimationController";
import random from "random";

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
            image: this.imageRepo.neutral.idle,
            duration: 10,
          },
        ],
        repeat: true,
      },
      blink: {
        name: "blink",
        frames: [
          {
            image: this.imageRepo.neutral.eyesClosed,
            duration: 5,
          },
          {
            image: this.imageRepo.neutral.idle,
            duration: 8,
          },
        ],
        repeat: true,
      },
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
        },
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
        },
      },
    };

    const c = this.animations.neutral;
  }

  draw(ctx: CanvasRenderingContext2D, tickCount: number) {
    // if (!this.animationController.state.animation) {
    //   this.animationController.setAnimation(this.animations.walk.right, tickCount);
    // }

    const animation = this.selectIdleAnimation();
    if (animation) {
      this.animationController.setAnimation(animation, tickCount);
    }

    const { image, velocity } = this.animationController.tick(tickCount);
    if (velocity) {
      this.pos.x += velocity.x;
      this.pos.y += velocity.y;
    }

    ctx.drawImage(image, this.pos.x, this.pos.y);
  }

  private selectIdleAnimation(): Animation<Shplub> {
    const animState = this.animationController.state;
    let animation = animState.animation;
    if (!animation) return this.animations.neutral;

    if (!animState.animationIsDone) return undefined;

    switch (animation.name) {
      case "neutral":
        break;
      case "blink":
        if (animState.timesRepeated > random.poisson(1)()) return this.animations.neutral;
        break;
      default:
        if (animState.timesRepeated < random.poisson(5)()) return undefined;
        break;
    }

    if (animState.timesRepeated < random.poisson(5)()) {
      if (animation.name === "neutral" && animState.timesRepeated > random.poisson(4)()) {
        return this.animations.blink;
      } else if (animation.name === "blink" && animState.timesRepeated > random.poisson(1)()) {
        return this.animations.neutral;
      } else {
        return undefined;
      }
    }

    const halfWindowWidth = window.innerWidth / 2;
    const directionRand = random.float();
    const directionCutoff = this.sigmoid((6 * (this.centerX - halfWindowWidth)) / halfWindowWidth);
    animation = directionRand > directionCutoff ? this.animations.walk.right : this.animations.walk.left;

    const neutralRand = random.float();
    animation = neutralRand < 0.7 ? this.animations.neutral : animation;

    return animation;
  }

  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }
}

export default Shplub;
