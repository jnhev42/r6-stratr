console.log("hello :DDDD");

type Side = "atk" | "def";

type Strat = {
    side: Side;
};

let a: Strat = { side: "def" };

console.log(a.side);

import { Canvas, Rect } from 'fabric'; 

const canvas_elem = document.querySelector("#strat-canvas") as HTMLCanvasElement;
console.log(canvas_elem);
const canvas = new Canvas(canvas_elem);
console.log(canvas.height, canvas.width, canvas);
const rect = new Rect({
    top: 100,
    left: 100,
    width: 50,
    height: 50,
    fill: "red"
});
canvas.add(rect)
console.log(canvas.add(rect));
