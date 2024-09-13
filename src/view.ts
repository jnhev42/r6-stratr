import Konva from "konva";
import { konvaImageFromUrl, konvaMakeStageZoomable } from "./util";
import { PieceController, StratController } from "./controller";
import { Floor, Model, Piece } from "./model";
import { MapFloorName } from "./data";

export class StageView {
  stage: Konva.Stage;
  floors: FloorView[];

  constructor(floors: FloorView[]) {
    this.floors = floors;
    this.stage = new Konva.Stage({
      container: "container",
      width: 700,
      height: 500,
      draggable: true,
    });
    for (const floor of this.floors) {
      this.stage.add(floor.bp.layer);
      this.stage.add(floor.pieces.layer);
    }
    konvaMakeStageZoomable(this.stage);
  }
}

export class BlueprintView {
  layer: Konva.Layer;
  image: Konva.Image;

  constructor(url: string) {
    this.layer = new Konva.Layer();
    this.image = konvaImageFromUrl(url);

    this.layer.add(this.image);

    this.image.width(700); // temp vals for because it annoys the fuck out of me
    this.image.height(500);
  }
}

export type FloorView = {
  bp: BlueprintView;
  pieces: PiecesView;
};

export class PiecesView {
  layer: Konva.Layer;
  pieces: PieceView[];

  constructor() {
    this.layer = new Konva.Layer();
    this.pieces = [];
  }

  addPiece(controller: StratController, modelPiece: Piece) {
    const piece = new PieceView(controller, modelPiece);

    this.layer.add(piece.image);
    this.pieces.push(piece);
  }

  removePiece() {}

  update(controller: StratController, currentPieces: Piece[]) {
    let newPieces = new Set(currentPieces);
    console.log(newPieces, this.pieces);
    for (const pv of this.pieces) {
      if (currentPieces.some((pm) => pm === pv.piece)) {
        console.log("updating", pv.piece.kind);
        pv.update();
        newPieces.delete(pv.piece);
      } else {
        console.log("destroying", pv.piece.kind);
        pv.destroy();
        this.pieces = this.pieces.filter((e) => e !== pv);
      }
    }

    for (const [newPiece, _] of newPieces.entries()) {
      console.log("adding", newPiece);
      this.addPiece(controller, newPiece);
    }
  }
}

export class PieceView {
  image: Konva.Image;
  piece: Piece;

  constructor(controller: StratController, piece: Piece) {
    this.image = konvaImageFromUrl(`/assets/Ops/Icons/${piece.kind}.png`);
    this.piece = piece;
    this.image.setDraggable(true);
    this.image.on("mouseover", () => (document.body.style.cursor = "pointer"));
    this.image.on("mouseout", () => (document.body.style.cursor = "default"));

    this.image.width(75); // temp vals for because it annoys the fuck out of me
    this.image.height(75);

    this.image.x(piece.position.x);
    this.image.y(piece.position.y);

    const that = this;
    this.image.on("dragend", function () {
      let x = that.image.x();
      let y = that.image.y();

      controller.updatePosition(that.piece, { x, y });

      console.log("x: ", that.image.x(), "y: ", that.image.y());
    });

    this.image.on("mousedown", function () {
      console.log("x: ", that.image.x(), "y: ", that.image.y());
      controller.removePiece(that.piece);
    });
  }

  destroy() {
    this.image.destroy();
  }

  update() {
    this.image.setPosition(this.piece.position);
  }
}

export class View {
  model: Model;
  controller: StratController;
  currentFloor: MapFloorName = "2F";
  currentPhase: string = "default";
  pieces: PiecesView;

  constructor(controller: StratController) {
    this.controller = controller;
    this.pieces = new PiecesView();
  }

  init(model: Model, controller: StratController): StageView {
    this.model = model;
    this.controller = controller;

    const floor: FloorView = {
      bp: new BlueprintView("/assets/maps/consulate/ConsulateRWTopFloorB.jpg"),
      pieces: this.pieces,
    };

    return new StageView([floor]);
  }

  update(controller: StratController) {
    this.pieces.update(
      controller,
      this.model.map.phases[0].floors[this.currentFloor]!.pieces
    );
  }
}
