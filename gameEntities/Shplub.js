var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Sprite from "./Sprite";
import { AnimationController } from "./AnimationController";
import random from "random";
var Shplub = /** @class */ (function (_super) {
    __extends(Shplub, _super);
    function Shplub(params, imageRepo) {
        var _this = _super.call(this, params) || this;
        _this.imageRepo = imageRepo;
        _this.animationController = new AnimationController(_this);
        var walkAnimDuration = 10;
        var walkXVelocity = 6;
        _this.animations = {
            neutral: {
                name: "neutral",
                frames: [
                    {
                        image: _this.imageRepo.neutral.idle,
                        duration: 10,
                    },
                ],
                repeat: true,
            },
            blink: {
                name: "blink",
                frames: [
                    {
                        image: _this.imageRepo.neutral.eyesClosed,
                        duration: 5,
                    },
                    {
                        image: _this.imageRepo.neutral.idle,
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
                            image: _this.imageRepo.walk.left[0],
                            duration: walkAnimDuration,
                            velocity: { x: 0, y: 0 },
                        },
                        {
                            image: _this.imageRepo.walk.left[1],
                            duration: walkAnimDuration,
                            velocity: { x: 0, y: 0 },
                        },
                        {
                            image: _this.imageRepo.walk.left[0],
                            duration: walkAnimDuration,
                            velocity: { x: -walkXVelocity * 0.25, y: -1 },
                        },
                        {
                            image: _this.imageRepo.walk.left[2],
                            duration: walkAnimDuration,
                            velocity: { x: -walkXVelocity * 0.5, y: 0 },
                        },
                        {
                            image: _this.imageRepo.walk.left[2],
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
                            image: _this.imageRepo.walk.right[0],
                            duration: walkAnimDuration,
                            velocity: { x: 0, y: 0 },
                        },
                        {
                            image: _this.imageRepo.walk.right[1],
                            duration: walkAnimDuration,
                            velocity: { x: 0, y: 0 },
                        },
                        {
                            image: _this.imageRepo.walk.right[0],
                            duration: walkAnimDuration,
                            velocity: { x: walkXVelocity * 0.25, y: -1 },
                        },
                        {
                            image: _this.imageRepo.walk.right[2],
                            duration: walkAnimDuration,
                            velocity: { x: walkXVelocity * 0.5, y: 0 },
                        },
                        {
                            image: _this.imageRepo.walk.right[2],
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
        var c = _this.animations.neutral;
        return _this;
    }
    Shplub.prototype.draw = function (ctx, tickCount) {
        // if (!this.animationController.state.animation) {
        //   this.animationController.setAnimation(this.animations.walk.right, tickCount);
        // }
        var animation = this.selectIdleAnimation();
        if (animation) {
            this.animationController.setAnimation(animation, tickCount);
        }
        var _a = this.animationController.tick(tickCount), image = _a.image, velocity = _a.velocity;
        if (velocity) {
            this.pos.x += velocity.x;
            this.pos.y += velocity.y;
        }
        ctx.drawImage(image, this.pos.x, this.pos.y);
    };
    Shplub.prototype.selectIdleAnimation = function () {
        var animState = this.animationController.state;
        var animation = animState.animation;
        if (!animation)
            return this.animations.neutral;
        if (!animState.animationIsDone)
            return undefined;
        switch (animation.name) {
            case "neutral":
                break;
            case "blink":
                if (animState.timesRepeated > random.poisson(1)())
                    return this.animations.neutral;
                break;
            case "walk":
            default:
                if (animState.timesRepeated < random.poisson(4)())
                    return undefined;
                break;
        }
        if (animState.timesRepeated < random.poisson(5)()) {
            if (animation.name === "neutral" && animState.timesRepeated > random.poisson(4)()) {
                return this.animations.blink;
            }
            else if (animation.name === "blink" && animState.timesRepeated > random.poisson(1)()) {
                return this.animations.neutral;
            }
            else {
                return undefined;
            }
        }
        var halfWindowWidth = window.innerWidth / 2;
        var directionRand = random.float();
        var directionCutoff = this.sigmoid((6 * (this.centerX - halfWindowWidth)) / halfWindowWidth);
        animation = directionRand > directionCutoff ? this.animations.walk.right : this.animations.walk.left;
        var neutralRand = random.float();
        animation = neutralRand < 0.7 ? this.animations.neutral : animation;
        return animation;
    };
    Shplub.prototype.sigmoid = function (x) {
        return 1 / (1 + Math.exp(-x));
    };
    return Shplub;
}(Sprite));
export default Shplub;
//# sourceMappingURL=Shplub.js.map