import Konva from "konva";

// assets\Ops\Icons\recruit_blue.png

const LOADING_IMAGE = new Image();
LOADING_IMAGE.src = "assets/Ops/Icons/haha.jpg";
export const essentialStartup = (): Promise<void> => {
  if (LOADING_IMAGE.complete) return new Promise(() => {});
  return new Promise((res) => (LOADING_IMAGE.onload = () => res()));
};

export const konvaImageFromUrl = (url: string): Konva.Image => {
  const konvaImage = new Konva.Image({
    image: LOADING_IMAGE,
  });

  const actualImage = new Image();
  actualImage.onload = function () {
    konvaImage.image(actualImage);
  };
  actualImage.src = url;

  return konvaImage;
};

export const konvaMakeStageZoomable = (stage: Konva.Stage) => {
  stage.on("wheel", (e) => {
    // stop default scrolling
    e.evt.preventDefault();

    let oldScale = stage.scaleX();
    let pointer = stage.getPointerPosition();

    if (pointer === null) return;

    let mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? 1 : -1;

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
      direction = -direction;
    }

    let newScale = direction > 0 ? oldScale * 0.95 : oldScale / 0.95;

    stage.scale({ x: newScale, y: newScale });

    let newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  });
};
