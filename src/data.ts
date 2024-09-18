export const Attackers = {
  Sledge: "Sledge",
  Thatcher: "Thatcher",
  Ash: "Ash",
  Thermite: "Thermite",
  Twitch: "Twitch",
  Montagne: "Montagne",
  Glaz: "Glaz",
  Fuze: "Fuze",
  Blitz: "Blitz",
  IQ: "IQ",
  Buck: "Buck",
  Blackbeard: "Blackbeard",
  Capitao: "Capitao",
  Hibana: "Hibana",
  Jackal: "Jackal",
  Ying: "Ying",
  Zofia: "Zofia",
  Dokkaebi: "Dokkaebi",
  Lion: "Lion",
  Finka: "Finka",
  Maverick: "Maverick",
  Nomad: "Nomad",
  Gridlock: "Gridlock",
  Nokk: "Nokk",
  Amaru: "Amaru",
  Kali: "Kali",
  Iana: "Iana",
  Ace: "Ace",
  Zero: "Zero",
  Flores: "Flores",
  Osa: "Osa",
  Sens: "Sens",
  Grim: "Grim",
  Brava: "Brava",
  Ram: "Ram",
  Deimos: "Deimos",
  Striker: "Striker",
} as const;
export type Attacker = (typeof Attackers)[keyof typeof Attackers];

export const AttackerGadgets = {
  ThatcherG: "Emp",
  AshG: "M120",
  ThermiteG: "Exothermic",
  TwitchG: "Shock_drone",
  FuzeG: "Cluster_charge",
  CapitaoG: ["Smoke_bolt", "Fire_bolt"],
  HibanaG: "Xkarios",
  YingG: "Candela",
  ZofiaG: ["Impact_grenade", "Impact_concuss"],
  DokkaebiG: "Call",
  LionG: "Ee_one_d",
  FinkaG: "Adrenal",
  MaverickG: "Suri",
  NomadG: "Airjab",
  GridlockG: "Trax",
  AmaruG: "Garra",
  KaliG: "Lance",
  AceG: "Selma",
  ZeroG: "Argus",
  FloresG: "Ratero",
  OsaG: "Talon",
  SensG: "Rou",
  GrimG: "Bees",
  RamG: "Bugi",
  DeimosG: "Deathmark",
} as const;
export type AttackerGadget =
  (typeof AttackerGadgets)[keyof typeof AttackerGadgets];

export const AttackerSecondaryGadgets = {
  CanOpener: "CanOpener",
  Claymore: "Claymore",
  Flashbang: "Flashbang",
  FragGrenade: "FragGrenade",
  ImpactEmp: "ImpactEmp",
  SmokeGrenade: "SmokeGrenade",
  Softbreach: "Softbreach",
} as const;
export type AttackerSecondaryGadget =
  (typeof AttackerSecondaryGadgets)[keyof typeof AttackerSecondaryGadgets];

export const Defenders = {
  Smoke: "Smoke",
  Mute: "Mute",
  Castle: "Castle",
  Pulse: "Pulse",
  Doc: "Doc",
  Rook: "Rook",
  Kapkan: "Kapkan",
  Tachanka: "Tachanka",
  Jager: "Jager",
  Bandit: "Bandit",
  Frost: "Frost",
  Valkyrie: "Valkyire",
  Caveira: "Caveira",
  Echo: "Echo",
  Mira: "Mira",
  Lesion: "Lesion",
  Ela: "Ela",
  Vigil: "Vigil",
  Maestro: "Maestro",
  Alibi: "Alibi",
  Clash: "Clash",
  Kaid: "Kaid",
  Mozzie: "Mozzie",
  Warden: "Warden",
  Goyo: "Goyo",
  Wamai: "Wamai",
  Oryx: "Oryx",
  Melusi: "Melusi",
  Aruni: "Aruni",
  Thunderbird: "Thunderbird",
  Thorn: "Thorn",
  Azami: "Azami",
  Solis: "Solis",
  Fenrir: "Fenrir",
  Tubarao: "Tubarao",
  Sentry: "Sentry",
  Skopos: "Skopos",
} as const;
export type Defender = (typeof Defenders)[keyof typeof Defenders];

export const DefenderGadgets = {
  SmokeG: "Babe",
  MuteG: "Jammer",
  CastleG: "Armor_panel",
  KapkanG: "Edd",
  TachankaG: "Shumikha",
  JagerG: "Ads",
  BanditG: "Batteries",
  FrostG: "Welcome_mat",
  ValkyireG: "Black_eye",
  EchoG: "Yokai",
  MiraG: "Window",
  LesionG: "Gu",
  ElaG: "Grzmot",
  MaestroG: "Evil_eye",
  AlibiG: "Prisma",
  KaidG: "Claw",
  MozzieG: "Pest",
  GoyoG: "Volcan",
  WamaiG: "Disc",
  OryxG: "Dash",
  MelusiG: "Banshee",
  AruniG: "Surya",
  ThunderbirdG: "Kona",
  ThornG: "Razer",
  AzamiG: "Kiba",
  FenrirG: "Fnat",
  TubaraoG: "Zoto",
} as const;
export type DefenderGadget =
  (typeof DefenderGadgets)[keyof typeof DefenderGadgets];

export const DefenderSecondaryGadgets = {
  BarbedWire: "BarbedWire",
  BulletproofCamera: "BulletproofCamera",
  Impact: "Impact",
  Nitro: "Nitro",
  ObservationBlocker: "ObservationBlocker",
  ProximityAlarm: "ProximityAlarm",
  Shield: "Shield",
} as const;
export type DefenderSecondaryGadget =
  (typeof DefenderSecondaryGadgets)[keyof typeof DefenderSecondaryGadgets];

export const Operators = {
  ...Attackers,
  ...Defenders,
} as const;
export type Operator = (typeof Operators)[keyof typeof Operators];

export const PrimaryGadgets = {
  ...AttackerGadgets,
  ...DefenderGadgets,
} as const;
export type PrimaryGadget =
  (typeof PrimaryGadgets)[keyof typeof PrimaryGadgets];

export const SecondaryGadgets = {
  ...AttackerSecondaryGadgets,
  ...DefenderSecondaryGadgets,
} as const;
export type SecondaryGadget =
  (typeof SecondaryGadgets)[keyof typeof SecondaryGadgets];

export const PieceKinds = {
  ...Operators,
  ...AttackerGadgets,
  ...DefenderGadgets,
  ...AttackerSecondaryGadgets,
  ...DefenderSecondaryGadgets,
} as const;
export type PieceKind = (typeof PieceKinds)[keyof typeof PieceKinds];

export const MapNames = {
  Bank: "Bank",
  Border: "Border",
  Chalet: "Chalet",
  Clubhouse: "Clubhouse",
  Consulate: "Consulate",
  Kafe: "Kafe",
  Nighthaven: "Nighthaven",
  Lair: "Lair",
  Skyscraper: "Skyscraper",
} as const;
export type MapName = (typeof MapNames)[keyof typeof MapNames];

export const MapFloors: { readonly [key in MapName]: MapFloorName[] } = {
  Bank: ["B", "1F", "2F"],
  Border: ["1F", "2F"],
  Chalet: ["B", "1F", "2F"],
  Clubhouse: ["B", "1F", "2F"],
  Consulate: ["B", "1F", "2F"],
  Kafe: ["1F", "2F", "3F"],
  Nighthaven: ["B", "1F", "2F"],
  Lair: ["B", "1F", "2F"],
  Skyscraper: ["1F", "2F"],
} as const;
export type MapFloor = (typeof MapFloors)[keyof typeof MapFloors];
export type MapFloorName = "B" | "1F" | "2F" | "3F";

export type Side = "atk" | "def";

export const PlayerIds = {
  P1: "P1",
  P2: "P2",
  P3: "P3",
  P4: "P4",
  P5: "P5",
} as const;
export type PlayerId = (typeof PlayerIds)[keyof typeof PlayerIds];

export const getOperatorGadget = (op: Operator): PrimaryGadget | undefined => {
  return PrimaryGadgets[op.concat("G")];
};
