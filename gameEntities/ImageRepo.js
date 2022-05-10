import happyBDayImg from "../assets/shplub/happy_bday.svg";
import shplubNeutralImg from "../assets/shplub/shplub_neutral.svg";
import shplubNeutralEyesClosed from "../assets/shplub/shplub_neutral_eyes_closed.svg";
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
import shplubSquished0Img from "../assets/shplub/shplub_squished0.svg";
import shplubSquished1Img from "../assets/shplub/shplub_squished1.svg";
import shplubSquished2Img from "../assets/shplub/shplub_squished2.svg";
import shplubSquishedSquint0Img from "../assets/shplub/shplub_squished_squint0.svg";
import shplubSquishedSquint1Img from "../assets/shplub/shplub_squished_squint1.svg";
import shplubSquishedSquint2Img from "../assets/shplub/shplub_squished_squint2.svg";
var imageSources = {
    bday: happyBDayImg,
    shplub: {
        neutral: { idle: shplubNeutralImg, eyesClosed: shplubNeutralEyesClosed },
        look: {
            left: [shplubLookLeft0Img, shplubLookLeft1Img, shplubLookLeft2Img],
            right: [shplubLookRight0Img, shplubLookRight1Img, shplubLookRight2Img],
        },
        walk: {
            left: [shplubWalkLeft1Img, shplubWalkLeft2Img, shplubLookLeft2Img],
            right: [shplubWalkRight1Img, shplubWalkRight2Img, shplubLookRight2Img],
        },
        squish: {
            neutral: [shplubSquished0Img, shplubSquished1Img, shplubSquished2Img],
            squint: [shplubSquishedSquint0Img, shplubSquishedSquint1Img, shplubSquishedSquint2Img],
        },
    },
};
var castToImages = function (imageTree) {
    var output = {};
    Object.entries(imageTree).forEach(function (_a) {
        var k = _a[0], v = _a[1];
        if (typeof v === "string") {
            output[k] = new Image();
            output[k].src = v;
        }
        else if (Array.isArray(v)) {
            output[k] = v.map(function (e) {
                var img = new Image();
                img.src = e;
                return img;
            });
        }
        else {
            output[k] = castToImages(v);
        }
    });
    return output;
};
export var loadImageRepo = function () { return castToImages(imageSources); };
//# sourceMappingURL=ImageRepo.js.map