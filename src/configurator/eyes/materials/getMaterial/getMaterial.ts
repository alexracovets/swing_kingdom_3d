import { Color, MeshStandardMaterial } from "three";
import type { ResolvedMaterial } from "@brain";
import {
  MATERIAL_METALNESS,
  MATERIAL_ROUGHNESS,
  POLYGON_OFFSET_FACTOR,
  POLYGON_OFFSET_UNITS,
  PUSH_BACK_SOURCES,
} from "../../constants";

const cache = new Map<string, MeshStandardMaterial>();

export function getMaterial(resolved: ResolvedMaterial): MeshStandardMaterial {
  const pushBack = PUSH_BACK_SOURCES.has(resolved.source);
  const key = pushBack ? `${resolved.color}|pb` : resolved.color;

  let mat = cache.get(key);
  if (!mat) {
    mat = new MeshStandardMaterial({
      color: new Color(resolved.color),
      roughness: MATERIAL_ROUGHNESS,
      metalness: MATERIAL_METALNESS,
      polygonOffset: pushBack,
      polygonOffsetFactor: pushBack ? POLYGON_OFFSET_FACTOR : 0,
      polygonOffsetUnits: pushBack ? POLYGON_OFFSET_UNITS : 0,
    });
    cache.set(key, mat);
  }
  return mat;
}

export function disposeMaterialCache(): void {
  for (const mat of cache.values()) mat.dispose();
  cache.clear();
}
