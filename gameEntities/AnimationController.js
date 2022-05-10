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
        var _a, _b, _c, _d;
        // Clean up old animation first, if any
        (_b = (_a = this._state.animation) === null || _a === void 0 ? void 0 : _a.onEnd) === null || _b === void 0 ? void 0 : _b.call(_a, this._state, this.outerState);
        this._state.animation = animation;
        this._state.animationStartTime = tickCount;
        var startingIndex = animation.startFrameIndex || 0;
        this.setFrame(startingIndex, tickCount);
        this._state.animationIsDone = false;
        this._state.animationIsRepeating = false;
        this._state.animationIsInterrupted = false;
        this._state.timesRepeated = 0;
        (_d = (_c = this._state.animation).onStart) === null || _d === void 0 ? void 0 : _d.call(_c, this._state, this.outerState);
    };
    AnimationController.prototype.tick = function (tickCount) {
        var _a, _b;
        // Store the frame before the next potential frame
        var currentFrame = this._state.frame;
        var output = {
            image: currentFrame === null || currentFrame === void 0 ? void 0 : currentFrame.image,
            animationIsDone: this._state.animationIsDone,
            animationIsRepeating: this._state.animationIsRepeating,
            animationIsInterrupted: this._state.animationIsInterrupted,
            timesRepeated: this._state.timesRepeated,
        };
        // Exit early if animation is finished
        if (this._state.animationIsDone || this._state.animationIsInterrupted) {
            return output;
        }
        // Reset repeating state
        this._state.animationIsRepeating = false;
        if ((_b = (_a = this._state.animation).onTick) === null || _b === void 0 ? void 0 : _b.call(_a, this._state, this.outerState)) {
            this.interruptAnimation();
        }
        var maxDuration = this._state.frame.duration;
        var currentDuration = tickCount - this._state.frameStartTime;
        if (!this._state.animationIsInterrupted && currentDuration >= maxDuration) {
            this.nextFrame(tickCount);
        }
        output.animationIsDone = this._state.animationIsDone;
        output.animationIsRepeating = this._state.animationIsRepeating;
        output.animationIsInterrupted = this._state.animationIsInterrupted;
        output.timesRepeated = this._state.timesRepeated;
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
        var _a, _b;
        var nextFrameIndex = this.getOrEvaluate(this._state.frame.nextFrameIndex, this._state.frameIndex + 1);
        var animation = this._state.animation;
        if (nextFrameIndex < animation.frames.length)
            return nextFrameIndex;
        var repeat = this.getOrEvaluate(animation.repeat, false);
        if (repeat) {
            this._state.animationIsRepeating = true;
            (_b = (_a = this._state.animation).onRepeat) === null || _b === void 0 ? void 0 : _b.call(_a, this._state, this.outerState);
            this._state.timesRepeated++;
            return animation.restartFrameIndex || 0;
        }
        else {
            this.endAnimation();
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
    AnimationController.prototype.endAnimation = function () {
        var _a, _b;
        this._state.animationIsDone = true;
        (_b = (_a = this._state.animation).onEnd) === null || _b === void 0 ? void 0 : _b.call(_a, this._state, this.outerState);
    };
    AnimationController.prototype.interruptAnimation = function () {
        this._state.animationIsInterrupted = true;
        this.endAnimation();
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