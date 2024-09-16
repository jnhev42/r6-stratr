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

// set left bar buttons
const leftBarBtns =
  document.querySelectorAll<HTMLButtonElement>(".leftMenuBtn");
const leftBarWrappers = document.querySelectorAll<HTMLElement>(".left-lil-box");
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
    lilBoxes.forEach((box) => box.classList.remove("top-active"));
    let target: HTMLElement | null = document.querySelector(`.${button.value}`);
    target!.classList.add("top-active");
  });
});

leftBarBtns.forEach((button) => {
  button.addEventListener("click", () => {
    leftBarWrappers.forEach((box) => box.classList.remove("left-active"));
    let target: HTMLElement | null = document.querySelector(`.${button.value}`);
    target!.classList.add("left-active");
  });
});

// pop ups
const opPopUp = document.querySelector(".operator-popup");
const utilPopUp = document.querySelector(".util-popup");

(async () => {
  await essentialStartup();
  const model = new Model("balls", "Consulate", "atk");
  const controller = new StratController();
  const view = new View(controller);

  // initialise the MVC
  model.init(controller);
  controller.init(model, view);
  view.init(model, controller);

  initDrag(controller);
  initLineupSelect(model);
  populatePopupSelect(model, "operator", opPopUp as HTMLElement);
  populatePopupSelect(model, "gadget", utilPopUp as HTMLElement);
  initLineupNames(model);

  // initial refresh
  refreshDisplayInfo(model);

  console.log(model);

  // saving and loading
  saveBtn?.addEventListener("click", () => {
    const { controller, ...newModel } = model;
    localStorage.setItem("strat", JSON.stringify(newModel));
  });

  loadBtn?.addEventListener("click", () => {
    let newStrat = JSON.parse(localStorage.getItem("strat")!);
  });
})();

// initialises the dragging functionality from the top bar to the canvas
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

// initialises the names in the lineup
function initLineupNames(model: Model) {
  const usernameInputs =
    document.querySelectorAll<HTMLInputElement>(".username-inp");

  usernameInputs.forEach((inp) => {
    inp.addEventListener("blur", () => {
      setUsername(inp.getAttribute("data") as PlayerId, inp.value, model);
    });
  });
}

// initialises the lineup button event listeners
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

// populates the popups
function populatePopupSelect(
  model: Model,
  type: "operator" | "gadget",
  popupElement: HTMLElement
) {
  let items =
    type === "operator"
      ? model.lineup.side === "atk"
        ? Attackers
        : Defenders
      : model.lineup.side === "atk"
        ? AttackerSecondaryGadgets
        : DefenderSecondaryGadgets;

  Object.keys(items).forEach((item) => {
    const div = document.createElement("div");
    const img = document.createElement("img");

    div.setAttribute("data", item);
    img.src = `assets/ops/icons/${item}.png`;
    img.alt = item;

    div.appendChild(img);

    div.addEventListener("click", () => {
      if (type === "operator") {
        let opSelected: Operator = div.getAttribute("data") as Operator;

        if (currentPlayerSelected && opSelected) {
          setOperator(currentPlayerSelected, opSelected, model);
        }
      } else if (type === "gadget") {
        let gadgetSelected: SecondaryGadget = div.getAttribute(
          "data"
        ) as SecondaryGadget;

        if (currentPlayerSelected && gadgetSelected) {
          setGadget(currentPlayerSelected, gadgetSelected, model);
        }
      }

      popupElement?.classList.remove("popup-active");
    });

    popupElement?.appendChild(div);
  });
}

// I this this might want to be done in the controller :p
function setOperator(player: PlayerId, operator: Operator, model: Model) {
  if (model.lineup[player]) {
    model.lineup[player].character = operator;
  } else {
    model.lineup[player] = newOpConfig(null, operator, null, null);
  }
  refreshDisplayInfo(model);
}

// I this this might want to be done in the controller :p
function setGadget(player: PlayerId, gadget: SecondaryGadget, model: Model) {
  if (model.lineup[player]) {
    model.lineup[player].secondary = gadget;
  } else {
    console.error("can't add becuase no existing player");
  }
  refreshDisplayInfo(model);
}

function setUsername(player: PlayerId, username: string, model: Model) {
  if (model.lineup[player]) {
    model.lineup[player].username = username;
  } else {
    model.lineup[player] = newOpConfig(username, null, null, null);
  }
  refreshDisplayInfo(model);
}

// refresh all of the display elements (go over the model)
function refreshDisplayInfo(model: Model) {
  const { side, ...players } = model.lineup;

  // Left bar info
  document.querySelector(".info-map-name")!.innerHTML =
    `Map: ${model.map.name}`;

  // Lineup && Top bar
  Object.keys(players).forEach((player) => {
    const playerInfo: OpConfig = model.lineup[player];
    const div: HTMLDivElement = dragBoxes.get(
      player as PlayerId
    ) as HTMLDivElement;

    // Top bar
    const icon = div.children[0];
    const ability = div.children[1];
    const gadget = div.children[2];

    icon.children[0].setAttribute(
      "src",
      `assets/ops/icons/${playerInfo.character}.png`
    );
    icon.children[0].setAttribute("data", playerInfo.character as string);

    ability.children[0].setAttribute(
      "src",
      `assets/ops/icons/${PrimaryGadgets[`${playerInfo.character}G`]}.png`
    );
    ability.children[0].setAttribute(
      "data",
      PrimaryGadgets[`${playerInfo.character}G`]
    );

    if (playerInfo.secondary) {
      gadget.children[0].setAttribute(
        "src",
        `assets/ops/icons/${SecondaryGadgets[`${playerInfo.secondary}`]}.png`
      );
      gadget.children[0].setAttribute(
        "data",
        SecondaryGadgets[`${playerInfo.secondary}`]
      );
    }
  });
}
