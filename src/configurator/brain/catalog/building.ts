import type { CatalogPart } from "../model/types";

export const BUILDING_PART_ID = "building";

export const BUILDING_PART: CatalogPart = {
  id: BUILDING_PART_ID,
  label: "Super 59 (5' deck)",
  category: "tower",
  subcategory: "super",
  glb: "models/buildings/Super59_5ft_Deck.glb",
  deckHeightFt: 5,
  commercial: true,
  status: "ready",
  notes:
    "Primary model. Deck-height variants (3' / 7') are Y-stretch transforms of this 5' base, not separate GLBs.",
  materials: [
    { name: "Frame", role: "vinyl", texture: "woodgrain" },
    { name: "Board", role: "accent" },
    { name: "Bolt", role: "native" },
    { name: "Screw", role: "native" },
    { name: "Angle", role: "fixed", fixedColor: "#3a3d42" },
    { name: "rubber", role: "fixed", fixedColor: "#111111" },
  ],
};

export const BUILDING_VARIANTS: CatalogPart[] = [
  {
    ...BUILDING_PART,
    id: "building-7ft",
    label: "Super 59 (7' deck)",
    deckHeightFt: 7,
    status: "derived",
    glb: undefined,
    derivedFrom: { base: BUILDING_PART_ID, stretchHeightFt: 2, note: "Raise deck 2ft" },
    notes: "Increase deck height on the Super 59 base by 2ft.",
  },
  {
    ...BUILDING_PART,
    id: "building-3ft",
    label: "Super 59 (3' deck)",
    deckHeightFt: 3,
    status: "derived",
    glb: undefined,
    derivedFrom: { base: BUILDING_PART_ID, stretchHeightFt: -2, note: "Lower deck 2ft" },
    notes: "Decrease deck height on the Super 59 base by 2ft.",
  },
];
