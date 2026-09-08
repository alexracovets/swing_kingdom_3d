import type { CatalogPart, PartCategory } from "../../model/types";
import { BUILDING_PART, BUILDING_VARIANTS } from "../building";

const ALL_PARTS: CatalogPart[] = [BUILDING_PART, ...BUILDING_VARIANTS];

const BY_ID = new Map(ALL_PARTS.map((p) => [p.id, p]));

export function listParts(): readonly CatalogPart[] {
  return ALL_PARTS;
}

export function getPart(id: string): CatalogPart | undefined {
  return BY_ID.get(id);
}

export function requirePart(id: string): CatalogPart {
  const part = BY_ID.get(id);
  if (!part) throw new Error(`Unknown catalog part: ${id}`);
  return part;
}

export function partsByCategory(category: PartCategory): CatalogPart[] {
  return ALL_PARTS.filter((p) => p.category === category);
}

export function resolveRenderable(id: string): {
  base: CatalogPart;
  transform: CatalogPart["derivedFrom"];
} {
  const part = requirePart(id);
  if (!part.derivedFrom) return { base: part, transform: undefined };
  return { base: requirePart(part.derivedFrom.base), transform: part.derivedFrom };
}
