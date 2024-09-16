import Konva from "konva";
import { View } from "./view";
import { Coords, Model, newOpConfig, OpConfig, Piece } from "./model";
import { StratController } from "./controller";
import { essentialStartup } from "./util";
import {
  AttackerGadget,
  Attackers,
  AttackerSecondaryGadget,
  AttackerSecondaryGadgets,
  DefenderGadget,
  Defenders,
  DefenderSecondaryGadget,
  DefenderSecondaryGadgets,
  Operator,
  PieceKind,
  PlayerId,
  PlayerIds,
  SecondaryGadget,
  SecondaryGadgets,
} from "./data";
import { PrimaryGadgets } from "./data";

Konva.hitOnDragEnabled = true;

const saveBtn = document.querySelector("#save");
const loadBtn = document.querySelector("#load");

// set up lineup buttons
const lineupBtns = document.querySelectorAll<HTMLButtonElement>(".lineup-btn");

// set up top bar buttons
const topBarBtns = document.querySelectorAll<HTMLButtonElement>(".menuBtn");
const lilBoxes = document.querySelectorAll<HTMLElement>(".lil-box");

const utilBoxes = document.querySelectorAll(".util-box");

let currentPlayerSelected: PlayerId | null = null;

const dragBoxes = new Map<PlayerId, Element>();
Object.values(PlayerIds).forEach((playerId, index) => {
  const element = utilBoxes[index];
  if (element) {
    dragBoxes.set(playerId, element);
  }
});

topBarBtns.forEach((button) => {
  button.addEventListener("click", () => {
    lilBoxes.forEach((box) => box.classList.remove("active"));
    let target: HTMLElement | null = document.querySelector(`.${button.value}`);
    target!.classList.add("active");
  });
});

// pop ups
const opPopUp = document.querySelector(".operator-popup");
const utilPopUp = document.querySelector(".util-popup");

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
  initLineupSelect(model);
  initLineupPopupSelect(model);
  initGadgetPopupSelect(model);

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
  const source = document.querySelectorAll(".draggable");
  let dragged: EventTarget | null = null;

  source.forEach((innerSource) => {
    innerSource.addEventListener("dragstart", (event) => {
      dragged = event.target;
    });
  });

  const target: HTMLCanvasElement | null =
    document.querySelector(".konvajs-content");

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
      kind: dataVal as PieceKind,
      visibility: [],
      position: { x, y },
    };

    controller.addPiece(gridTestTwo, "2F", "default");
    dragged = null;
  });
}

function initLineupSelect(model: Model) {
  lineupBtns.forEach((button: HTMLButtonElement) => {
    button.addEventListener("click", () => {
      let btnType: string = button.classList[1];
      currentPlayerSelected = button.value as PlayerId;

      if (btnType === "icon") {
        opPopUp?.classList.add("popup-active");
      } else if (btnType === "gadget") {
        if (currentPlayerSelected in model.lineup) {
          utilPopUp?.classList.add("popup-active");
        }
      } else if (btnType === "note") {
        // note functionality here
      } else {
        console.log("tf");
      }
    });
  });
}

// maybe merge these functions?
// populate the lineup popup
function initLineupPopupSelect(model: Model) {
  let ops = model.lineup.side === "atk" ? Attackers : Defenders;

  Object.keys(ops).forEach((op) => {
    const div = document.createElement("div");
    const img = document.createElement("img");

    div.setAttribute("data", op);
    img.src = `assets/ops/icons/${op}.png`;
    img.alt = op;

    div.appendChild(img);

    div.addEventListener("click", () => {
      let opSelected: Operator = div.getAttribute("data") as Operator;

      console.log(currentPlayerSelected, opSelected);

      if (currentPlayerSelected && opSelected) {
        setOperator(currentPlayerSelected, opSelected, model);
        refreshDisplayInfo(model);
      }

      opPopUp?.classList.remove("popup-active");
    });

    opPopUp?.append(div);
  });
}

// populate the gadget popup
function initGadgetPopupSelect(model: Model) {
  let gadgets =
    model.lineup.side === "atk"
      ? AttackerSecondaryGadgets
      : DefenderSecondaryGadgets;

  Object.keys(gadgets).forEach((gadget) => {
    const div = document.createElement("div");
    const img = document.createElement("img");

    div.setAttribute("data", gadget);
    img.src = `assets/ops/icons/${gadget}.png`;
    img.alt = gadget;

    div.appendChild(img);

    div.addEventListener("click", () => {
      let gadgetSelected: SecondaryGadget = div.getAttribute(
        "data"
      ) as SecondaryGadget;

      if (currentPlayerSelected && gadgetSelected) {
        setGadget(currentPlayerSelected, gadgetSelected, model);
        refreshDisplayInfo(model);
      }

      utilPopUp?.classList.remove("popup-active");
    });

    utilPopUp?.append(div);
  });
}

function setOperator(player: PlayerId, operator: Operator, model: Model) {
  model.lineup[player] = newOpConfig(null, operator, null, "");
}

function setGadget(player: PlayerId, gadget: SecondaryGadget, model: Model) {
  if (model.lineup[player]) {
    model.lineup[player].secondary = gadget;
  } else {
    console.error("can't add becuase no existing player");
  }
}

// refresh all of the display elements (go over the model)
function refreshDisplayInfo(model: Model) {
  const { side, ...players } = model.lineup;

  Object.keys(players).forEach((player) => {
    const playerInfo: OpConfig = model.lineup[player];
    const div: HTMLDivElement = dragBoxes.get(
      player as PlayerId
    ) as HTMLDivElement;

    const icon = div.children[0];
    const ability = div.children[1];
    const gadget = div.children[2];

    icon.children[0].setAttribute(
      "src",
      `assets/Ops/Icons/${playerInfo.character}.png`
    );
    icon.children[0].setAttribute("data", playerInfo.character);

    ability.children[0].setAttribute(
      "src",
      `assets/Ops/abilities/${PrimaryGadgets[`${playerInfo.character}G`]}.png`
    );
    ability.children[0].setAttribute(
      "data",
      PrimaryGadgets[`${playerInfo.character}G`]
    );

    if (playerInfo.secondary) {
      gadget.children[0].setAttribute(
        "src",
        `assets/Ops/utility/${SecondaryGadgets[`${playerInfo.secondary}`]}.png`
      );
      gadget.children[0].setAttribute(
        "data",
        SecondaryGadgets[`${playerInfo.secondary}`]
      );
    }
  });
}
