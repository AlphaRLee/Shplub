import Sprite, { SpriteParams } from "./Sprite";
import { AnimationController, Animation, AnimationState } from "./AnimationController";
import random from "random";
import Position from "./Position";
import Game from "./Game";

class Shplub extends Sprite {
  public imageRepo: any;
  private game: Game;
  public animations: any;
  private animationController: AnimationController<Game>;
  private prevImage: HTMLImageElement;
  public activityState: "idle" | "looking" | "squishing" | "squished" | "unsquishing";

  constructor(params: SpriteParams, imageRepo: any, game: Game) {
    super(params);
    this.imageRepo = imageRepo;
    this.game = game;
    this.animationController = new AnimationController(this.game);

    this.activityState = "idle";

    const squishDuration = 3;
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
      squish: {
        neutral: {
          name: "squish.neutral",
          frames: [
            {
              image: this.imageRepo.squish.neutral[0],
              duration: squishDuration,
            },
            {
              image: this.imageRepo.squish.neutral[1],
              duration: squishDuration,
            },
            {
              image: this.imageRepo.squish.neutral[2],
              duration: squishDuration * 3,
            },
          ],
          onEnd: (animState: AnimationState<Game>, game: Game) => {
            game.shplub.activityState = "squished";
          },
        },
        squished: {
          name: "squish.squished",
          frames: [
            {
              image: this.imageRepo.squish.neutral[2],
              duration: 2,
            },
          ],
          repeat: true,
        },
        neutralReverse: {
          name: "squish.neutralReverse",
          frames: [
            {
              image: this.imageRepo.squish.neutral[2],
              duration: squishDuration,
            },
            {
              image: this.imageRepo.squish.neutral[1],
              duration: squishDuration,
            },
            {
              image: this.imageRepo.squish.neutral[0],
              duration: squishDuration,
            },
            {
              image: this.imageRepo.neutral.idle,
              duration: squishDuration,
            },
            {
              image: this.imageRepo.squish.neutral[1],
              duration: squishDuration,
            },
            {
              image: this.imageRepo.idle,
              duration: squishDuration,
            },
          ],
          onEnd: (animState: AnimationState<Game>, game: Game) => {
            game.shplub.activityState = "idle";
          },
          // repeat: true,
        },
      },
      walk: {
        left: {
          name: "walk.left",
          frames: [
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
          data: {
            startPos: { ...this.pos },
          },
          onEnd: this.restoreYPos,
        },
        right: {
          name: "walk.right",
          frames: [
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
          data: {
            startPos: { ...this.pos },
          },
          onEnd: this.restoreYPos,
        },
      },
    };
  }

  private restoreYPos = (animState: AnimationState<Game>) => {
    this.pos.y = animState.animation.data.startPos.y;
  };

  public tick(ctx: CanvasRenderingContext2D, tickCount: number) {
    const animation = this.selectAnimation();

    if (animation) {
      this.setAnimation(animation, tickCount);
    }

    const { image, velocity } = this.animationController.tick(tickCount);
    if (velocity) {
      this.pos.x += velocity.x;
      this.pos.y += velocity.y;
    }

    // Fallback to old image if needed
    if (image) {
      this.prevImage = image;
    }
    ctx.drawImage(image || this.prevImage, this.pos.x, this.pos.y);
  }

  public setAnimation(animation: Animation<Game>, tickCount: number) {
    this.animationController.setAnimation(animation, tickCount);
  }

  private selectAnimation(): Animation<Game> {
    switch (this.activityState) {
      case "idle":
        return this.selectIdleAnimation();
      case "squishing":
        return this.animations.squish.neutral;
      case "squished":
        return this.animations.squish.squished;
      case "unsquishing":
        return this.animations.squish.neutralReverse;
      case "looking":
        break;
    }
  }

  private selectIdleAnimation(): Animation<Game> {
    const animState = this.animationController.state;
    let animation = animState.animation;
    if (!animation) return this.animations.neutral;

    if (!animState.animationIsDone && !animState.animationIsRepeating) return undefined;

    switch (animation.name) {
      case "neutral":
        break;
      case "blink":
        if (animState.timesRepeated > random.poisson(1)()) return this.animations.neutral;
        break;
      case "squish.neutral":
      case "squish.neutralReverse":
        return this.animations.neutral;
      case "walk":
      default:
        if (animState.timesRepeated < random.poisson(4)()) return undefined;
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

  public isPosInside(pos: Position) {
    return pos.x >= this.left && pos.x <= this.right && pos.y >= this.top && pos.y <= this.bottom;
  }
}

export default Shplub;
