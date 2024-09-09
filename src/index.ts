import Konva from "konva";
import { makeView } from "./view";

Konva.hitOnDragEnabled = true;

(async () => {
  const stageView = await makeView();
})();
