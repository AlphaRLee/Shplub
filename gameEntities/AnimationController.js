var AnimationController = /** @class */ (function () {
    function AnimationController(outerState) {
        this.outerState = outerState;
        this._state = {};
    }
    Object.defineProperty(AnimationController.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    AnimationController.prototype.setAnimation = function (animation, tickCount) {
        this._state.animation = animation;
        this._state.animationStartTime = tickCount;
        var startingIndex = animation.startFrameIndex || 0;
        this.setFrame(startingIndex, tickCount);
        this._state.animationIsDone = false;
        this._state.timesRepeated = 0;
    };
    AnimationController.prototype.tick = function (tickCount) {
        this._state.animationIsDone = false;
        // Store the frame before the next potential frame
        var currentFrame = this._state.frame;
        var maxDuration = this._state.frame.duration;
        var currentDuration = tickCount - this._state.frameStartTime;
        if (currentDuration >= maxDuration) {
            this.nextFrame(tickCount);
        }
        var output = {
            image: currentFrame.image,
            animationIsDone: this._state.animationIsDone,
            timesRepeated: this._state.timesRepeated,
        };
        if (currentFrame.velocity)
            output.velocity = currentFrame.velocity;
        return output;
    };
    AnimationController.prototype.nextFrame = function (tickCount) {
        var frameIndex = this.getNextFrameIndex();
        this.setFrame(frameIndex, tickCount);
    };
    /**
     * Get next frame index or return undefined if there is no next frame
     * @returns Next frame index
     */
    AnimationController.prototype.getNextFrameIndex = function () {
        var nextFrameIndex = this.getOrEvaluate(this._state.frame.nextFrameIndex, this._state.frameIndex + 1);
        var animation = this._state.animation;
        if (nextFrameIndex < animation.frames.length)
            return nextFrameIndex;
        this._state.animationIsDone = true;
        var repeat = this.getOrEvaluate(animation.repeat, false);
        if (repeat) {
            this._state.timesRepeated++;
            return animation.restartFrameIndex || 0;
        }
        else {
            return undefined;
        }
    };
    AnimationController.prototype.setFrame = function (frameIndex, tickCount) {
        if (typeof frameIndex !== "undefined") {
            var frame = this._state.animation.frames[frameIndex];
            this._state.frameIndex = frameIndex;
            // Calculate dynamic values at the beginning of frame
            this.setDuration(frame);
            this._state.frame = frame;
            this._state.frameStartTime = tickCount;
        }
        else {
            this._state.frameIndex = undefined;
            this._state.frame = undefined;
            this._state.frameStartTime = undefined;
        }
    };
    AnimationController.prototype.setDuration = function (frame) {
        if (frame.durationFn) {
            frame.durationFn(this._state, this.outerState);
        }
    };
    AnimationController.prototype.getOrEvaluate = function (property, fallback) {
        if (typeof property === "undefined") {
            if (typeof fallback === "function") {
                var fallbackFn = fallback;
                return fallbackFn(this._state, this.outerState);
            }
            else {
                return fallback;
            }
        }
        if (typeof property === "function") {
            var propFn = property;
            return propFn(this._state, this.outerState);
        }
        return property;
    };
    return AnimationController;
}());
export { AnimationController };
//# sourceMappingURL=AnimationController.js.map