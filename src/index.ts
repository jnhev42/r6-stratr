console.log("hello :DDDD");

type Side = "atk" | "def";

type Strat = {
  side: Side;
};

let a: Strat = { side: "def" };

console.log(a.side);

import Konva from "konva";

Konva.hitOnDragEnabled = true;

const stage = new Konva.Stage({
  container: "container",
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true
});

const mapLayer = new Konva.Layer();
stage.add(mapLayer);

Konva.Image.fromURL('/assets/maps/consulate/ConsulateRWTopFloorB.jpg', function (map) {
  map.setAttrs({
    x: 0,
    y: 0,
    width: 1000,
    height: 700
  });
  mapLayer.add(map);
});

const pieceLayer = new Konva.Layer();
stage.add(pieceLayer);

const box = new Konva.Rect({
  x: 50,
  y: 50,
  width: 50,
  height: 50,
  fill: "#00D2FF",
  stroke: "black",
  strokeWidth: 4,
  draggable: true,
});
pieceLayer.add(box);

stage.on('wheel', (e) => {
  // stop default scrolling
  e.evt.preventDefault();

  var oldScale = stage.scaleX();
  var pointer = stage.getPointerPosition();

  var mousePointTo = {
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

  var newScale = direction > 0 ? oldScale * 0.95 : oldScale / 0.95;

  stage.scale({ x: newScale, y: newScale });

  var newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
});

box.on("mouseover", () => (document.body.style.cursor = "pointer"));
box.on("mouseout", () => (document.body.style.cursor = "default"));