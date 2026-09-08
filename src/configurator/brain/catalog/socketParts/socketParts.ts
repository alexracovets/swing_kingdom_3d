import type { CatalogPart } from "../../model/types";

const EMPTY_4X4_GLB = "models/emptys/Empty_4_4.glb";

export const SOCKET_PART_RAILING_ID = "socket-railing-4x4";

export const SOCKET_PARTS_4X4: CatalogPart[] = [
  {
    id: SOCKET_PART_RAILING_ID,
    label: "Railing Slats",
    category: "fun-item",
    subcategory: "railing",
    glb: EMPTY_4X4_GLB,
    glbMesh: "Railing_Slats_4_4",
    socketFit: "4x4",
    commercial: true,
    status: "ready",
    materials: [
      { name: "Board", role: "accent" },
      { name: "Screw", role: "native" },
    ],
  },
  {
    id: "socket-staircase-4x4",
    label: "Staircase",
    category: "access",
    subcategory: "step",
    glb: EMPTY_4X4_GLB,
    glbMesh: "5_Staircase",
    socketFit: "4x4",
    commercial: true,
    status: "ready",
    materials: [
      { name: "Board", role: "accent" },
      { name: "Screw", role: "native" },
    ],
  },
  {
    id: "socket-ramp-4x4",
    label: "Ramp with Rope",
    category: "climber",
    subcategory: "rock-wall",
    glb: EMPTY_4X4_GLB,
    glbMesh: "12_Ramp_with_Rope",
    socketFit: "4x4",
    commercial: true,
    status: "ready",
    materials: [
      { name: "Board", role: "accent" },
      { name: "Screw", role: "native" },
    ],
  },
];

export const DEFAULT_SOCKET_PART: Record<string, string> = {
  "4x4": SOCKET_PART_RAILING_ID,
};
