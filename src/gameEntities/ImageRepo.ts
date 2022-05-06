import shplubNeutralImg from "../assets/shplub/shplub_neutral.svg";

const imageSources = {
  shplub: {
    neutral: shplubNeutralImg,
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
