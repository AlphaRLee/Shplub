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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import Sprite from "./Sprite";
import { AnimationController } from "./AnimationController";
import random from "random";
var Shplub = /** @class */ (function (_super) {
    __extends(Shplub, _super);
    function Shplub(params, imageRepo, game) {
        var _this = _super.call(this, params) || this;
        _this.restoreYPos = function (animState) {
            _this.pos.y = animState.animation.data.startPos.y;
        };
        _this.imageRepo = imageRepo;
        _this.game = game;
        _this.animationController = new AnimationController(_this.game);
        _this.activityState = "idle";
        var squishDuration = 3;
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
            squish: {
                neutral: {
                    name: "squish.neutral",
                    frames: [
                        {
                            image: _this.imageRepo.squish.neutral[0],
                            duration: squishDuration,
                        },
                        {
                            image: _this.imageRepo.squish.neutral[1],
                            duration: squishDuration,
                        },
                        {
                            image: _this.imageRepo.squish.neutral[2],
                            duration: squishDuration * 3,
                        },
                    ],
                    onEnd: function (animState, game) {
                        game.shplub.activityState = "squished";
                    },
                },
                squished: {
                    name: "squish.squished",
                    frames: [
                        {
                            image: _this.imageRepo.squish.neutral[2],
                            duration: 2,
                        },
                    ],
                    repeat: true,
                },
                neutralReverse: {
                    name: "squish.neutralReverse",
                    frames: [
                        {
                            image: _this.imageRepo.squish.neutral[2],
                            duration: squishDuration,
                        },
                        {
                            image: _this.imageRepo.squish.neutral[1],
                            duration: squishDuration,
                        },
                        {
                            image: _this.imageRepo.squish.neutral[0],
                            duration: squishDuration,
                        },
                        {
                            image: _this.imageRepo.neutral.idle,
                            duration: squishDuration,
                        },
                        {
                            image: _this.imageRepo.squish.neutral[1],
                            duration: squishDuration,
                        },
                        {
                            image: _this.imageRepo.idle,
                            duration: squishDuration,
                        },
                    ],
                    onEnd: function (animState, game) {
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
                    data: {
                        startPos: __assign({}, _this.pos),
                    },
                    onEnd: _this.restoreYPos,
                },
                right: {
                    name: "walk.right",
                    frames: [
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
                    data: {
                        startPos: __assign({}, _this.pos),
                    },
                    onEnd: _this.restoreYPos,
                },
            },
        };
        return _this;
    }
    Shplub.prototype.tick = function (ctx, tickCount) {
        var animation = this.selectAnimation();
        if (animation) {
            this.setAnimation(animation, tickCount);
        }
        var _a = this.animationController.tick(tickCount), image = _a.image, velocity = _a.velocity;
        if (velocity) {
            this.pos.x += velocity.x;
            this.pos.y += velocity.y;
        }
        // Fallback to old image if needed
        if (image) {
            this.prevImage = image;
        }
        ctx.drawImage(image || this.prevImage, this.pos.x, this.pos.y);
    };
    Shplub.prototype.setAnimation = function (animation, tickCount) {
        this.animationController.setAnimation(animation, tickCount);
    };
    Shplub.prototype.selectAnimation = function () {
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
    };
    Shplub.prototype.selectIdleAnimation = function () {
        var animState = this.animationController.state;
        var animation = animState.animation;
        if (!animation)
            return this.animations.neutral;
        if (!animState.animationIsDone && !animState.animationIsRepeating)
            return undefined;
        switch (animation.name) {
            case "neutral":
                break;
            case "blink":
                if (animState.timesRepeated > random.poisson(1)())
                    return this.animations.neutral;
                break;
            case "squish.neutral":
            case "squish.neutralReverse":
                return this.animations.neutral;
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
    Shplub.prototype.isPosInside = function (pos) {
        return pos.x >= this.left && pos.x <= this.right && pos.y >= this.top && pos.y <= this.bottom;
    };
    return Shplub;
}(Sprite));
export default Shplub;
//# sourceMappingURL=Shplub.js.map