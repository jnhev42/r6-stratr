import { MapFloorName, PlayerId } from "./data";
import {
  Model,
  OpConfig,
  Phase,
  Floor,
  Piece,
  Coords,
  StratModel,
} from "./model";
import { diff } from "./undo";
import { View } from "./view";

export class StratController {
  model: Model;
  view: View;
  hist: HistoryController;

  init(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.hist = new HistoryController(this.model.m, () =>
      this.view.update(this)
    );
  }

  addPiece(piece: Piece, floor: MapFloorName, phaseName: string) {
    this.model.getFloor(floor, phaseName)!.pieces.push(piece);
    this.hist.restorePoint();
    this.view.update(this);
  }

  removePiece(piece: Piece) {
    this.model.removePiece(piece);
    this.hist.restorePoint();
    this.view.update(this);
  }

  updatePosition(piece: Piece, coords: Coords) {
    piece.position = { x: coords.x, y: coords.y };
    this.hist.restorePoint();
  }

  showPiece(piece: Piece, from: PlayerId) {
    if (!piece.visibility.includes(from)) {
      piece.visibility.push(from);
    }
  }

  hidePiece(piece: Piece, from: PlayerId) {
    const idx = piece.visibility.indexOf(from);
    if (idx >= 0) {
      piece.visibility.splice(idx, 1);
    }
  }
}

export class HistoryController {
  lastModel: StratModel;
  model: StratModel;
  diffs: diff.Diff[];
  updateView: () => void;

  constructor(model: StratModel, updateView: () => void) {
    this.model = model;
    this.lastModel = structuredClone(this.model);
    this.diffs = [];
    this.updateView = updateView;
    this.register();
  }

  restorePoint() {
    const d = diff.map(this.lastModel, this.model);
    if (d === undefined) return;
    this.diffs.push(d);
    this.lastModel = structuredClone(this.model);
  }

  undo() {
    const d = this.diffs.pop();
    if (d === undefined) return;

    this.model = diff.undo(this.model, d);

    this.lastModel = structuredClone(this.model);
    this.updateView();
  }

  register() {
    const that = this;
    document.addEventListener("keydown", (evt) => {
      if (evt.ctrlKey && evt.key === "z") {
        that.undo();
      }
    });
  }
}
