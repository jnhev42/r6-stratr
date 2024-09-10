import { MapFloor, MapFloors, MapName, PlayerId, Side } from "./data";

export class Lineup {
  inner: Map<PlayerId, OpConfig>;
  side: Side;
  constructor(side: Side) {
    this.inner = new Map();
    this.side = side;
  }
}

export type Coords = {
  x: number;
  y: number;
}

export type R6Map = {
  name: MapName,
  phases: Phase[],
}

export class Op {
  icon: string;
  name: string;
  ability: string;
  gadget: string;

  constructor(icon: string, name: string, ability: string, gadget: string) {
    this.icon = icon;
    this.name = name;
    this.ability = ability;
    this.gadget = gadget;
  }
}

export class OpConfig {
  username: string;
  character: Op;
  note: string;

  constructor(username: string, character: Op, note: string) {
    this.username = username;
    this.character = character;
    this.note = note;
  }
}

export type Piece = {
  owner: string;
  kind: string; // what kind of util is it (op, gadget, etc)
  visibility: string;
  visibilityGlobal: boolean;
  Position: Coords;
}

export class Floor {
  floorName: string;
  pieces: Piece[];

  constructor(name: string) {
    this.floorName = name;
    this.pieces = [];
  }
}

export class Phase {
  phaseName: string;
  floors: Floor[];

  constructor(name: string, mapName: MapName) {
    this.phaseName = name;
    console.log(mapName);
    this.floors = Array.from(
      MapFloors[mapName] as MapFloor, 
      name => new Floor(name)
    );
  }
}

export class Strat {
  stratName: string;
  map: R6Map;
  lineup: Lineup;
 
  constructor(stratName: string, mapName: MapName, side: Side) {
    this.stratName = stratName;
    this.map = {
      name: mapName,
      phases: [new Phase("default", mapName)]
    };
    this.lineup = new Lineup(side);
  }
}