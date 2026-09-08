export type { Vec3 } from "./model";
export type { Feet } from "./model";
export type { PartCategory } from "./model";
export type { ProductLine } from "./model";
export type { ColorScheme } from "./model";
export type { ColorRole } from "./model";
export type { MaterialSlot } from "./model";
export type { DerivedTransform } from "./model";
export type { CatalogPart } from "./model";
export type { PartInstance } from "./model";
export type { PlaygroundConfig } from "./model";
export { DEFAULT_SCHEME } from "./model";
export { nextUid } from "./model";
export { __resetUidCounter } from "./model";
export { makeInstance } from "./model";
export { createDefaultConfig } from "./model";

export { FT_TO_UNIT } from "./constants";
export { INSTANCE_SPACING_UNITS } from "./constants";

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
export { resolveInstance } from "./scene";
export { deckHeightUnits } from "./scene";
export { nextInstancePosition } from "./scene";
export type { RenderableInstance } from "./scene";
export type { ResolvedScene } from "./scene";

export { serializeConfig } from "./serialization";
export { deserializeConfig } from "./serialization";
