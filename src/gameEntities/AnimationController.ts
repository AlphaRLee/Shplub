import Position from "./Position";

export interface AnimationFrame<T> {
  image: HTMLImageElement;

  // Use pre-defined duration or calculate the duration only once when the frame starts
  duration?: number;
  durationFn?: (animationState: AnimationState<T>, outerState: T) => number;
  velocity?: Position; // Position change to apply every tick

  // The next frame index to use from the array of animation frames. Used first tick after this frame's duration ends.
  // If not defined, increments to next frame
  // If defined as function
  nextFrameIndex?: number | ((animationState: AnimationState<T>, outerState: T) => number);
}

export interface Animation<T> {
  name: string;
  frames: AnimationFrame<T>[];
  repeat?: boolean;
  startFrameIndex?: number; // Index of frame to start animation on
  restartFrameIndex?: number; // Index of frame to restart animation on after looping
}

export interface AnimationState<T> {
  animation?: Animation<T>;
  frameIndex?: number;
  frame?: AnimationFrame<T>;
  animationStartTime?: number;
  frameStartTime?: number;
  animationIsDone?: boolean;
  timesRepeated?: number;
}

export type SpriteAnimationOutput<T> = Pick<AnimationFrame<T>, "image" | "velocity"> &
  Pick<AnimationState<T>, "animationIsDone" | "timesRepeated">;

export class AnimationController<T> {
  private _state: AnimationState<T>;
  private outerState: T;

  constructor(outerState: T) {
    this.outerState = outerState;
    this._state = {};
  }

  public get state(): Readonly<AnimationState<T>> {
    return this._state;
  }

  public setAnimation(animation: Animation<T>, tickCount: number) {
    this._state.animation = animation;
    this._state.animationStartTime = tickCount;
    const startingIndex = animation.startFrameIndex || 0;
    this.setFrame(startingIndex, tickCount);
    this._state.animationIsDone = false;
    this._state.timesRepeated = 0;
  }

  public tick(tickCount: number): SpriteAnimationOutput<T> {
    // Store the frame before the next potential frame
    const currentFrame = this._state.frame;

    const maxDuration = this._state.frame.duration;
    const currentDuration = tickCount - this._state.frameStartTime;
    if (currentDuration > maxDuration) {
      this.nextFrame(tickCount);
    }

    let output: SpriteAnimationOutput<T> = {
      image: currentFrame.image,
      animationIsDone: this._state.animationIsDone,
      timesRepeated: this._state.timesRepeated,
    };
    if (currentFrame.velocity) output.velocity = currentFrame.velocity;

    return output;
  }

  private nextFrame(tickCount: number) {
    let frameIndex = this.getNextFrameIndex();
    if (typeof frameIndex === "undefined") {
      this.endAnimation();
    }

    this.setFrame(frameIndex, tickCount);
  }

  /**
   * Get next frame index or return undefined if there is no next frame
   * @param nextFrameIndex Attempted next frame to use. If outside of frames array length then animation repeat property will be considered, else returns undefined
   * @returns Next frame index
   */
  private getNextFrameIndex(): number | undefined {
    const nextFrameIndex = this.getNextFrameIndexFromFrame();

    const animation = this._state.animation;
    if (nextFrameIndex < animation.frames.length) return nextFrameIndex;

    if (animation.repeat) {
      this._state.timesRepeated++;
      return animation.restartFrameIndex || 0;
    } else {
      return undefined;
    }
  }

  private getNextFrameIndexFromFrame(): number | never {
    const stateNextFrameIndex = this._state.frame.nextFrameIndex;
    switch (typeof stateNextFrameIndex) {
      case "function":
        return stateNextFrameIndex(this._state, this.outerState);
      case "number":
        return stateNextFrameIndex;
      case "undefined":
        return this._state.frameIndex + 1;
      default:
        console.error("animationFrame.nextFrameIndex is an unrecognized type. animationFrame:", this._state.frame);
        throw new Error("animationFrame.nextFrameIndex is an unrecognized type.");
    }
  }

  private setFrame(frameIndex: number | undefined, tickCount: number) {
    if (typeof frameIndex !== "undefined") {
      const frame = this._state.animation.frames[frameIndex];
      this._state.frameIndex = frameIndex;

      // Calculate dynamic values at the beginning of frame
      this.setDuration(frame);

      this._state.frame = frame;
      this._state.frameStartTime = tickCount;
    } else {
      this._state.frameIndex = undefined;
      this._state.frame = undefined;
      this._state.frameStartTime = undefined;
    }
  }

  private setDuration(frame: AnimationFrame<T>) {
    if (frame.durationFn) {
      frame.durationFn(this._state, this.outerState);
    }
  }

  private endAnimation() {
    this._state.animationIsDone = true;
  }
}
