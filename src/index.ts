import Konva from "konva";
import { View } from "./view";
import { Model, Piece } from "./model";
import { StratController } from "./controller";
import { essentialStartup } from "./util";

Konva.hitOnDragEnabled = true;

const btn = document.querySelector("#potato");

const testPieceGrid: Piece = {
  kind: "Gridlock",
  visibility: [],
  position: { x: 0, y: 0 },
};

const testPieceGrim: Piece = {
  kind: "Grim",
  visibility: [],
  position: { x: 0, y: 100 },
};

(async () => {
  await essentialStartup();
  const model = new Model("balls", "Consulate", "atk");
  const controller = new StratController();
  const view = new View(controller);
  console.log(view);
  model.init(controller);
  controller.init(model, view);
  view.init(model, controller);

  console.log(model);

  // test code

  controller.addPiece(testPieceGrid, "2F", "default");

  controller.addPiece(testPieceGrim, "2F", "default");
})();
