import shplubNeutralImg from "../assets/shplub/shplub_neutral.svg";
import shplubLookLeft0Img from "../assets/shplub/shplub_look_left0.svg";
import shplubLookLeft1Img from "../assets/shplub/shplub_look_left1.svg";
import shplubLookLeft2Img from "../assets/shplub/shplub_look_left2.svg";
import shplubLookRight0Img from "../assets/shplub/shplub_look_right0.svg";
import shplubLookRight1Img from "../assets/shplub/shplub_look_right1.svg";
import shplubLookRight2Img from "../assets/shplub/shplub_look_right2.svg";
import shplubWalkLeft1Img from "../assets/shplub/shplub_walk_left1.svg";
import shplubWalkLeft2Img from "../assets/shplub/shplub_walk_left2.svg";
import shplubWalkRight1Img from "../assets/shplub/shplub_walk_right1.svg";
import shplubWalkRight2Img from "../assets/shplub/shplub_walk_right2.svg";

const imageSources = {
  shplub: {
    neutral: shplubNeutralImg,
    look: {
      left: [shplubLookLeft0Img, shplubLookLeft1Img, shplubLookLeft2Img],
      right: [shplubLookRight0Img, shplubLookRight1Img, shplubLookRight2Img],
    },
    walk: {
      left: [shplubWalkLeft1Img, shplubWalkLeft2Img, shplubLookLeft2Img],
      right: [shplubWalkRight1Img, shplubWalkRight2Img, shplubLookRight2Img],
    },
  },
};

const castToImages = (imageTree: any): any => {
  let output = {};

  Object.entries(imageTree).forEach(([k, v]) => {
    if (typeof v === "string") {
      output[k] = new Image();
      output[k].src = v;
    } else if (Array.isArray(v)) {
      output[k] = v.map((e) => {
        const img = new Image();
        img.src = e;
        return img;
      });
    } else {
      output[k] = castToImages(v);
    }
  });

  return output;
};

export const loadImageRepo = () => castToImages(imageSources);
