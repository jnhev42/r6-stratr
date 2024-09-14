import { MapFloorName, PlayerId } from "./data";
import { Model, OpConfig, Phase, Floor, Piece, Coords } from "./model";
import { View } from "./view";

export class StratController {
  model: Model;
  view: View;

  init(model: Model, view: View) {
    this.model = model;
    this.view = view;
  }

  addPiece(piece: Piece, floor: MapFloorName, phaseName: string) {
    this.model.getFloor(floor, phaseName)!.pieces.push(piece);
    this.view.update(this);
  }

  removePiece(piece: Piece) {
    // remove from model
    // this.model.map.phases
    this.model.removePiece(piece);
    this.view.update(this);
  }

  updatePosition(piece: Piece, coords: Coords) {
    piece.position = { x: coords.x, y: coords.y };
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
