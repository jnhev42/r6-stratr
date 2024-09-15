import Konva from "konva";
import { View } from "./view";
import { Coords, Model, OpConfig, Piece } from "./model";
import { StratController } from "./controller";
import { essentialStartup } from "./util";
import { Operator, PlayerId, PlayerIds, SecondaryGadgets } from "./data";
import { PrimaryGadgets } from "./data";

Konva.hitOnDragEnabled = true;

const saveBtn = document.querySelector("#save");
const loadBtn = document.querySelector("#load");

// set up lineup buttons
const lineupBtns = document.querySelectorAll<HTMLButtonElement>(".lineup-btn");

// set up top bar buttons
const topBarBtns = document.querySelectorAll<HTMLButtonElement>(".menuBtn");
const lilBoxes = document.querySelectorAll<HTMLElement>(".lil-box");

const utilBoxes = document.querySelectorAll(".util-box")

const dragBoxes = new Map<PlayerId, Element>()
Object.values(PlayerIds).forEach((playerId, index) => {
  const element = utilBoxes[index];
  if (element) {
    dragBoxes.set(playerId, element);
  }
})

topBarBtns.forEach((button) => {
  button.addEventListener("click", () => {
    lilBoxes.forEach((box) => box.classList.remove("active"));
    let target: HTMLElement | null = document.querySelector(`.${button.value}`);
    target!.classList.add("active");
  });
});

// test data
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

  initDrag(controller);
  initSelect(model);

  console.log(model);

  saveBtn?.addEventListener("click", () => {
    const { controller, ...newModel } = model;
    localStorage.setItem("strat", JSON.stringify(newModel));
  });

  loadBtn?.addEventListener("click", () => {
    let newStrat = JSON.parse(localStorage.getItem("strat")!);
  });

  // test code
  controller.addPiece(testPieceGrid, "2F", "default");
  controller.addPiece(testPieceGrim, "2F", "default");
})();

function initDrag(controller: StratController) {
  const source = document.querySelectorAll("#draggable");
  let dragged: EventTarget | null = null;

  source.forEach((innerSource) => {
    innerSource.addEventListener("dragstart", (event) => {
      dragged = event.target;
    });
  });

  const target: HTMLCanvasElement | null = document.querySelector(".konvajs-content");

  target?.addEventListener("dragover", (event: DragEvent) => {
    event.preventDefault();
  });

  target?.addEventListener("drop", (event: DragEvent) => {
    event.preventDefault();

    // get mouse pos relative to canvas
    // also this does it to the canvas and not the layer :p
    let rect = target.getBoundingClientRect();
    // ok I used 15 but I don't know why this works, the math just worked in my head I didn't actually look at any numbers,
    // this can't stay this way ofc (it makes it drop where the cursor is)
    let x = event.clientX - rect.left - 15;
    let y = event.clientY - rect.top - 15;

    console.log(event.x, event.y);
    console.log(x, y);

    let draggedEl = dragged as HTMLElement;
    let dataVal = draggedEl!.attributes.getNamedItem("data")?.value;

    let gridTestTwo: Piece = {
      kind: dataVal,
      visibility: [],
      position: { x, y },
    };

    controller.addPiece(gridTestTwo, "2F", "default");
    dragged = null;
  });
}

function initSelect(model: Model) {

  lineupBtns.forEach((button: HTMLButtonElement) => {
    button.addEventListener("click", () => {
  
      let btnType: string = button.classList[1];
      let player: PlayerId = button.value;
  
      let operator: Operator = "Grim"
  
      if (btnType === "icon") {
        button.innerHTML = operator; // ?
        setIcon(player, operator, model);
      }

      setUtil(player, model);
  
    });
  });
}

function setIcon(player: PlayerId, operator: Operator, model: Model) {
  model.setPlayer(player, operator)
}

function setUtil(player: PlayerId, model: Model) {
  const playerInfo: OpConfig = model.getPlayer(player);
  const div: HTMLDivElement = dragBoxes.get(player);

  console.log(playerInfo, div)

  const icon = div.children[0]
  const ability = div.children[1]
  const gadget = div.children[2]

  icon.children[0].setAttribute("src", `assets/Ops/Icons/${playerInfo.character}.png`)
  icon.children[0].setAttribute("data", playerInfo.character)
  
  ability.children[0].setAttribute("src", `assets/Ops/Icons/${PrimaryGadgets[`${playerInfo.character}G`]}.png`)
  ability.children[0].setAttribute("data", PrimaryGadgets[`${playerInfo.character}G`])
  
  gadget.children[0].setAttribute("src", `assets/Ops/Icons/${SecondaryGadgets[`${playerInfo.secondary}`]}.png`)
  gadget.children[0].setAttribute("data", SecondaryGadgets[`${playerInfo.secondary}`])
}