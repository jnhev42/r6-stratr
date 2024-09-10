import Konva from "konva";
import { makeView } from "./view";
import { Strat } from "./model";

Konva.hitOnDragEnabled = true;

(async () => {
  const model = new Strat("balls", "Consulate", "atk");
  console.log(model);
  const stageView = await makeView();
})();
