export type Vec3 = [number, number, number];

export type Feet = number;

export type PartCategory =
  | "access"
  | "border"
  | "bridge"
  | "climber"
  | "fun-item"
  | "roof"
  | "slide"
  | "swing-frame"
  | "swing"
  | "tower"
  | "tower-opening"
  | "tunnel";

export type ProductLine = "residential" | "commercial";

export interface ColorScheme {
  main: string;
  accent: string;
  tertiary?: string;
}

export type ColorRole =
  | "vinyl"
  | "accent"
  | "tertiary"
  | "native"
  | "own"
  | "fixed";

export interface MaterialSlot {
  name: string;
  role: ColorRole;
  ownPalette?: string[];
  fixedColor?: string;
  texture?: string;
}

export interface DerivedTransform {
  base: string;
  scale?: number | Vec3;
  stretchHeightFt?: Feet;
  removeParts?: string[];
  extendChainFt?: Feet;
  note?: string;
}

export type SocketSize = "4x4";

export interface SocketDef {
  id: string;
  size: SocketSize;
  emptyNode: string;
}

export interface CatalogPart {
  id: string;
  label: string;
  category: PartCategory;
  subcategory?: string;
  glb?: string;
  glbMesh?: string;
  derivedFrom?: DerivedTransform;
  attachTo?: { host: string; socket: string };
  sockets?: SocketDef[];
  socketFit?: SocketSize;
  materials: MaterialSlot[];
  commercial: boolean;
  deckHeightFt?: Feet;
  status: "ready" | "needs-optimize" | "no-reference" | "derived";
  notes?: string;
}

export interface PartInstance {
  uid: string;
  partId: string;
  position: Vec3;
  rotationY: number;
  parentUid?: string;
  socket?: string;
  scheme?: Partial<ColorScheme>;
  overrides?: Record<string, string>;
  sockets?: Record<string, string>;
}

export interface PlaygroundConfig {
  version: 1;
  line: ProductLine;
  scheme: ColorScheme;
  instances: PartInstance[];
}
