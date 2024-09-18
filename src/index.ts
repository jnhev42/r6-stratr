import Konva from "konva";
import { View } from "./view";
import { Coords, Model, newOpConfig, OpConfig, Piece } from "./model";
import { HistoryController, StratController } from "./controller";
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
const utilBoxes = document.querySelectorAll<HTMLElement>(".util-box");

// pop ups
const opPopUp = document.querySelector(".operator-popup");
const utilPopUp = document.querySelector(".util-popup");

let currentPlayerSelected: PlayerId | null = null;

const dragBoxes = new Map<PlayerId, Element>(
  Object.values(PlayerIds).map((playerId, index) => [playerId, utilBoxes[index]])
);

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



(async () => {
  
  let newStrat: Model | null = JSON.parse(localStorage.getItem("strat"));
  
  let model: Model;
  if (newStrat) {
    model = new Model(newStrat.stratName, "Consulate", "atk");
  } else {
    model = new Model("test", "Consulate", "atk");
  }
  
  await essentialStartup();
  const controller = new StratController();
  const view = new View(controller);
  
  // initialise the MVC
  model.init(controller);
  controller.init(model, view);
  view.init(model, controller);
  
  console.log(model)
  
  // init event things
  initDrag(controller);
  initLineupSelect(model);
  populatePopupSelect(model, "operator", opPopUp as HTMLElement);
  populatePopupSelect(model, "gadget", utilPopUp as HTMLElement);
  initLineupNames(model);

  // initial refresh
  refreshDisplayInfo(model);

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

    let draggedEl = dragged as HTMLElement;
    let dataVal = draggedEl!.attributes.getNamedItem("data")?.value;

    let newPiece: Piece = {
      kind: dataVal as PieceKind,
      visibility: [],
      position: { x, y },
    };

    controller.addPiece(newPiece, "2F", "default");
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
        if (currentPlayerSelected in model.m.lineup) {
          utilPopUp?.classList.add("popup-active");
        }
      } else if (btnType === "note") {
        // note functionality here
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
      ? model.m.lineup.side === "atk"
        ? Attackers
        : Defenders
      : model.m.lineup.side === "atk"
        ? AttackerSecondaryGadgets
        : DefenderSecondaryGadgets;

  Object.keys(items).forEach((item) => {
    const div = document.createElement("div");
    const img = document.createElement("img");

    img.src = `assets/ops/icons/${item}.png`;
    img.alt = item;
    div.setAttribute("data", item);

    div.appendChild(img);

    div.addEventListener("click", () => {
      if (currentPlayerSelected) {
        if (type === "operator") {
          setOperator(currentPlayerSelected, item as Operator, model);
        } else if (type === "gadget") {
          setGadget(currentPlayerSelected, item as SecondaryGadget, model);
        }
      }
      popupElement?.classList.remove("popup-active");
    });
    popupElement?.appendChild(div);
  });
}

function setOperator(player: PlayerId, operator: Operator, model: Model) {
  if (model.m.lineup[player]) {
    model.m.lineup[player].character = operator;
  } else {
    model.m.lineup[player] = newOpConfig(null, operator, null, null);
  }
  refreshDisplayInfo(model);
}

function setGadget(player: PlayerId, gadget: SecondaryGadget, model: Model) {
  if (model.m.lineup[player]) {
    model.m.lineup[player].secondary = gadget;
  } else {
    console.error("No existing player");
  }
  refreshDisplayInfo(model);
}

function setUsername(player: PlayerId, username: string, model: Model) {
  if (model.m.lineup[player]) {
    model.m.lineup[player].username = username;
  } else {
    model.m.lineup[player] = newOpConfig(username, null, null, null);
  }
  refreshDisplayInfo(model);
}

// refresh all of the display elements (go over the model)
function refreshDisplayInfo(model: Model) {
  const { side, ...players } = model.m.lineup;

  // Left bar info
  document.querySelector(".info-map-name")!.innerHTML =
    `Map: ${model.m.map.name}`;

  // Top bar
  Object.keys(players).forEach((player) => {
    const playerInfo: OpConfig = model.m.lineup[player];
    const div: HTMLDivElement = dragBoxes.get(
      player as PlayerId
    ) as HTMLDivElement;

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
