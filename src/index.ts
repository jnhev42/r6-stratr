import Konva from "konva";
import { View } from "./view";
import { Model, Piece } from "./model";
import { StratController } from "./controller";
import { essentialStartup } from "./util";

Konva.hitOnDragEnabled = true;

const saveBtn = document.querySelector("#save");
const loadBtn = document.querySelector("#load");

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

  model.init(controller);
  controller.init(model, view);
  view.init(model, controller);

  console.log(model);

  // test code

  controller.addPiece(
    model.map.phases.find((phase) => phase.phaseName === "default")!.floors[
      "2F"
    ],
    testPieceGrid
  );

  controller.addPiece(
    model.map.phases.find((phase) => phase.phaseName === "default")!.floors[
      "2F"
    ],
    testPieceGrim
  );

  saveBtn?.addEventListener("click", () => {
    const { controller, ...newModel } = model;
    localStorage.setItem("strat", JSON.stringify(newModel));
  });

  loadBtn?.addEventListener("click", () => {
    let newStrat = JSON.parse(localStorage.getItem("strat")!);
  });
})();
