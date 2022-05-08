import Position from "./Position";

// A minimal sprite class loosely inspired by Pygame implementation of sprites
export type SpriteParams = {
  pos: Position;
  width: number;
  height: number;
};

class Sprite {
  public pos: Position;
  public width: number;
  public height: number;

  constructor(params: SpriteParams) {
    const { pos, width, height } = params;
    this.pos = pos;
    this.width = width;
    this.height = height;
  }

  get left() {
    return this.pos.x;
  }

  get right() {
    return this.pos.x + this.width;
  }

  get top() {
    return this.pos.y;
  }

  get bottom() {
    return this.pos.y + this.height;
  }

  get centerX() {
    return this.pos.x + this.width / 2;
  }

  get centerY() {
    return this.pos.y + this.height / 2;
  }
}

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
