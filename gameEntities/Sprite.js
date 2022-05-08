var Sprite = /** @class */ (function () {
    function Sprite(params) {
        var pos = params.pos, width = params.width, height = params.height;
        this.pos = pos;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Sprite.prototype, "left", {
        get: function () {
            return this.pos.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "right", {
        get: function () {
            return this.pos.x + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "top", {
        get: function () {
            return this.pos.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "bottom", {
        get: function () {
            return this.pos.y + this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "centerX", {
        get: function () {
            return this.pos.x + this.width / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "centerY", {
        get: function () {
            return this.pos.y + this.height / 2;
        },
        enumerable: false,
        configurable: true
    });
    return Sprite;
}());
export default Sprite;
// // Edges enum
// function createEdges() {
//   const edges = {
//     NONE: { name: "NONE" },
//     LEFT: { name: "LEFT" },
//     RIGHT: { name: "RIGHT" },
//     TOP: { name: "TOP" },
//     BOTTOM: { name: "BOTTOM" },
//   };
//   edges.NONE.opposite = edges.NONE;
//   edges.LEFT.opposite = edges.RIGHT;
//   edges.RIGHT.opposite = edges.LEFT;
//   edges.TOP.opposite = edges.BOTTOM;
//   edges.BOTTOM.opposite = edges.TOP;
//   return edges;
// }
// export const edges = createEdges();
//# sourceMappingURL=Sprite.js.map