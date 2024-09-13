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
  Thatcher: "emp",
  Ash: "m120",
  Thermite: "exothermic",
  Twitch: "shock_drone",
  Fuze: "cluster_charge",
  Capitao: ["smoke_bolt", "fire_bolt"],
  Hibana: "xkarios",
  Ying: "candela",
  Zofia: ["impact_stun", "impact_concuss"],
  Dokkaebi: "call",
  Lion: "ee_one_d",
  Finka: "adrenal",
  Maverick: "suri",
  Nomad: "airjab",
  Gridlock: "trax",
  Amaru: "garra",
  Kali: "lance",
  Ace: "selma",
  Zero: "argus",
  Flores: "ratero",
  Osa: "talon",
  Sens: "rou",
  Grim: "bees",
  Ram: "bugi",
  Deimos: "deathmark",
} as const;
export type AttackerGadget =
  (typeof AttackerGadgets)[keyof typeof AttackerGadgets];

export const AttackerSecondaryGadgets = {
  FragGrenade: "FragGrenade",
  SmokeGrenade: "SmokeGrenade",
  Flashbang: "Flashbang",
  ImpactEmp: "ImpactEmp",
  CanOpener: "CanOpener",
  Claymore: "Claymore",
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
  Caviera: "Caveira",
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
  Smoke: "babe",
  Mute: "jammer",
  Castle: "armor_panel",
  Kapkan: "edd",
  Tachanka: "molly",
  Jager: "ads",
  Bandit: "batteries",
  Frost: "mats",
  Valkyire: "black_eye",
  Echo: "yokai",
  Mira: "window",
  Lesion: "gu",
  Ela: "grzmot",
  Maestro: "evil_eye",
  Alibi: "clone",
  Kaid: "claw",
  Mozzie: "pest",
  Goyo: "gas_can",
  Wamai: "disc",
  Oryx: "dash",
  Melusi: "banshee",
  Aruni: "surya",
  Fenrir: "fnat",
  Tubarao: "zoto",
} as const;
export type DefenderGadget =
  (typeof DefenderGadgets)[keyof typeof DefenderGadgets];

export const DefenderSecondaryGadgets = {
  C4: "C4",
  Shield: "Shield",
  BulletproofCamera: "BulletproofCamera",
  ObservationBlocker: "ObservationBlocker",
  BarbedWire: "BarbedWire",
  Impact: "Impact",
  ProximityAlarm: "ProximityAlarm",
} as const;
export type DefenderSecondaryGadget =
  (typeof DefenderSecondaryGadgets)[keyof typeof DefenderSecondaryGadgets];

export const Operators = {
  ...Attackers,
  ...Defenders,
} as const;
export type Operator = (typeof Operators)[keyof typeof Operators];

export const SecondaryGadgets = {
  ...AttackerSecondaryGadgets,
  ...DefenderSecondaryGadgets,
};
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

export const MapFloors = {
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
