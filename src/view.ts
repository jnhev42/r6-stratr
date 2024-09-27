import Konva from "konva";
import { konvaImageFromUrl, konvaMakeStageZoomable } from "./util";
import { StratController } from "./controller";
import { Floor, Model, Piece } from "./model";
import { MapFloorName } from "./data";

export type CurrentView = {
  floor: MapFloorName;
  phaseName: string;
};

export class StageView {
  stage: Konva.Stage;
  floors: FloorView[];

  constructor(floors: FloorView[]) {
    this.floors = floors;
    this.stage = new Konva.Stage({
      container: "container",
      width: 1200,
      height: 700,
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

    this.layer.on("click", () => {
      console.log(this.layer.getRelativePointerPosition())
    });

    this.image.width(1200); // temp vals for because it annoys the fuck out of me
    this.image.height(700);
  }
}

export type FloorView = {
  bp: BlueprintView;
  pieces: PiecesView;
};

export class PiecesView {
  layer: Konva.Layer;
  pieces: PieceView[];
  current: CurrentView;

  constructor(current: CurrentView) {
    this.current = current;
    this.layer = new Konva.Layer();
    this.pieces = [];
  }

  addPiece(controller: StratController, modelPiece: Piece) {
    const piece = new PieceView(controller, this.current, modelPiece);

    this.layer.add(piece.image);
    this.pieces.push(piece);
  }

  removePiece() {}

  update(controller: StratController, currentPieces: Piece[]) {
    let newPieces = new Set(currentPieces);
    for (const pv of this.pieces) {
      if (currentPieces.some((pm) => pm === pv.piece)) {
        pv.update();
        newPieces.delete(pv.piece);
      } else {
        pv.destroy();
        this.pieces = this.pieces.filter((e) => e !== pv);
      }
    }

    for (const [newPiece, _] of newPieces.entries()) {
      this.addPiece(controller, newPiece);
    }
  }
}

export class PieceView {
  image: Konva.Image;
  piece: Piece;
  current: CurrentView;

  constructor(controller: StratController, current: CurrentView, piece: Piece) {
    this.current = current;
    this.image = konvaImageFromUrl(`/assets/Ops/Icons/${piece.kind}.png`);
    this.piece = piece;
    this.image.setDraggable(true);
    this.image.on("mouseover", () => (document.body.style.cursor = "pointer"));
    this.image.on("mouseout", () => (document.body.style.cursor = "default"));

    this.image.width(30); // temp vals for because it annoys the fuck out of me
    this.image.height(30);

    this.image.x(piece.position.x);
    this.image.y(piece.position.y);

    const that = this;
    this.image.on("dragend", function () {
      let x = that.image.x();
      let y = that.image.y();

      controller.updatePosition(that.piece, { x, y });
    });

    this.image.on("dblclick", function () {
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
  current: CurrentView = {
    floor: "2F",
    phaseName: "default",
  };
  pieces: PiecesView;

  constructor(controller: StratController) {
    this.controller = controller;
    this.pieces = new PiecesView(this.current);
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
      this.model.getFloor(this.current.floor, this.current.phaseName)!.pieces
    );
  }
}
