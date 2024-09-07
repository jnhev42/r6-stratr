console.log("hello :DDDD");

type Side = "atk" | "def";

type Strat = {
  side: Side;
};

let a: Strat = { side: "def" };

console.log(a.side);

import Konva from "konva";

const stage = new Konva.Stage({
  container: "container",
  width: window.innerWidth,
  height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

const box = new Konva.Rect({
  x: 50,
  y: 50,
  width: 100,
  height: 50,
  fill: "#00D2FF",
  stroke: "black",
  strokeWidth: 4,
  draggable: true,
});
layer.add(box);

box.on("mouseover", () => (document.body.style.cursor = "pointer"));
box.on("mouseout", () => (document.body.style.cursor = "default"));
