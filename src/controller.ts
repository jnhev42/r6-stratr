import { Model, OpConfig, Phase, Floor, Piece, Coords } from "./model";
import { View } from "./view";

export class StratController {
  model: Model;
  view: View;

  init(model: Model, view: View) {
    this.model = model;
    this.view = view;
  }

  addPiece(floor: Floor, piece: Piece) {
    floor.pieces.push(piece);
    this.view.update(this);
  }

  removePiece(piece: Piece) {
    // remove from model
    // this.model.map.phases

    this.view.update(this);
  }

  updatePosition(piece: Piece, coords: Coords) {
    piece.position = { x: coords.x, y: coords.y };
  }
}

export class PieceController {}
