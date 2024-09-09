
export type Side = "atk" | "def";

export type Op = {
  icon: String;
  name: String;
  ability: String;
  gadget: String;
}

export type OpConfig = {
  username: String;
  character: Op;
  Note: String;
}

export type Piece = {
  owner: String;
  kind: String;
  visibility: String;
  visibilityGlobal: Boolean;
  Floor: Number;
  Position: [Number, Number];
}

export type Phase = {
  name: String;
  pieces: Piece[];
}

export type Strat = {
  mapName: String;
  side: Side;
  lineup: OpConfig[];
  phases: Phase[];
};
