"use client";

import { Color, MeshStandardMaterial } from "three";
import type { ResolvedMaterial } from "@brain";

const cache = new Map<string, MeshStandardMaterial>();

const PUSH_BACK_SOURCES = new Set<ResolvedMaterial["source"]>([
  "vinyl-main",
  "accent",
  "accent-fallback",
]);

export function getMaterial(resolved: ResolvedMaterial): MeshStandardMaterial {
  const pushBack = PUSH_BACK_SOURCES.has(resolved.source);
  const key = pushBack ? `${resolved.color}|pb` : resolved.color;
  let mat = cache.get(key);
  if (!mat) {
    mat = new MeshStandardMaterial({
      color: new Color(resolved.color),
      roughness: 0.72,
      metalness: 0.05,
      polygonOffset: pushBack,
      polygonOffsetFactor: pushBack ? 1 : 0,
      polygonOffsetUnits: pushBack ? 1 : 0,
    });
    cache.set(key, mat);
  }
  return mat;
}
