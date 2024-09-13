import { MapFloorName } from "./data";
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

  removePiece(piece: Piece, floor: MapFloorName, phaseName: string) {
    // remove from model
    // this.model.map.phases
    const target = this.model.getFloor(floor, phaseName)!;

    target.pieces = target.pieces.filter((p) => p !== piece);

    this.view.update(this);
  }

  updatePosition(piece: Piece, coords: Coords) {
    piece.position = { x: coords.x, y: coords.y };
  }
}
