export type {
  Vec3,
  Feet,
  PartCategory,
  ProductLine,
  ColorScheme,
  ColorRole,
  MaterialSlot,
  DerivedTransform,
  CatalogPart,
  PartInstance,
  PlaygroundConfig,
} from "./model";
export { DEFAULT_SCHEME } from "./model";
export { nextUid } from "./model";
export { __resetUidCounter } from "./model";
export { makeInstance } from "./model";
export { createDefaultConfig } from "./model";

export { BUILDING_PART_ID } from "./catalog";
export { BUILDING_PART } from "./catalog";
export { BUILDING_VARIANTS } from "./catalog";
export { listParts } from "./catalog";
export { getPart } from "./catalog";
export { requirePart } from "./catalog";
export { partsByCategory } from "./catalog";
export { resolveRenderable } from "./catalog";

export { ACCENT_FALLBACK_GRAY } from "./materials";
export { resolveSlotColor } from "./materials";
export { resolvePartMaterials } from "./materials";
export type { ResolvedMaterial } from "./materials";
export type { ResolveOptions } from "./materials";

export { resolveScene } from "./scene";
export { deckHeightUnits } from "./scene";
export type { RenderableInstance } from "./scene";
export type { ResolvedScene } from "./scene";

export { serializeConfig } from "./serialization";
export { deserializeConfig } from "./serialization";
