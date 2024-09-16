import {
  MapFloor,
  MapFloorName,
  MapFloors,
  MapName,
  Operator,
  PieceKind,
  PlayerId,
  PlayerIds,
  SecondaryGadget,
  Side,
} from "./data";
import { StratController } from "./controller";

export type Lineup = {
  side: Side;
  P1?: OpConfig;
  P2?: OpConfig;
  P3?: OpConfig;
  P4?: OpConfig;
  P5?: OpConfig;
};

export const newLineup = (side: Side): Lineup => ({
  side,
});

export type Coords = {
  x: number;
  y: number;
};

export type R6Map = {
  name: MapName;
  phases: Phase[];
};

export type OpConfig = {
  username: string | null;
  character: Operator | null;
  secondary: SecondaryGadget | null;
  note: string | null;
};
export const newOpConfig = (
  username: string | null,
  character: Operator | null,
  secondary: SecondaryGadget | null,
  note: string | null
) => ({
  username,
  character,
  secondary,
  note,
});

export type Piece = {
  kind: PieceKind; // what kind of util is it (op, gadget, etc)
  visibility: PlayerId[];
  position: Coords;
};
export const newPiece = (kind: PieceKind, position: Coords): Piece => ({
  kind,
  position,
  visibility: [],
});

export type Floor = {
  floorName: MapFloorName;
  pieces: Piece[];
};
export const newFloor = (floorName: MapFloorName): Floor => ({
  floorName,
  pieces: [],
});

export type Floors = {
  B?: Floor;
  ["1F"]: Floor;
  ["2F"]: Floor;
  ["3F"]?: Floor;
};

export type Phase = {
  phaseName: string;
  floors: Floors;
};
export const newPhase = (phaseName: string, mapName: MapName): Phase => ({
  phaseName,
  floors: Object.fromEntries(
    (MapFloors[mapName] as MapFloor).map((f) => [f, newFloor(f)])
  ),
});

export class Model {
  controller: StratController;

  stratName: string;
  map: R6Map;
  lineup: Lineup;

  constructor(stratName: string, mapName: MapName, side: Side) {
    this.stratName = stratName;
    this.map = {
      name: mapName,
      phases: [newPhase("default", mapName)],
    };
    this.lineup = newLineup(side);
  }

  init(controller: StratController) {
    this.controller = controller;
  }

  getFloor(floor: MapFloorName, phaseName: string): Floor | undefined {
    const phase = this.map.phases.find(
      (phase) => phase.phaseName === phaseName
    );
    if (!phase) return undefined;
    return phase.floors[floor];
  }

  *pieces(): Generator<[Piece, MapFloorName, string], void, unknown> {
    for (const phase of this.map.phases) {
      for (const floor of Object.values(phase.floors)) {
        for (const piece of floor.pieces) {
          yield [piece, floor.floorName, phase.phaseName];
        }
      }
    }
  }

  removePiece(toDelete: Piece) {
    for (const [piece, floor, phase] of this.pieces()) {
      if (piece == toDelete) {
        const target = this.getFloor(floor, phase)!.pieces;
        target.splice(target.indexOf(piece), 1);
      }
    }
  }
}
