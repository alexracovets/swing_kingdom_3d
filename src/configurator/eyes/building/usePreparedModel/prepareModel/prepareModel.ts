import { Box3, type Group, Mesh, MeshStandardMaterial, type Object3D, Vector3 } from "three";
import type { ResolvedMaterial } from "@brain";
import { getMaterial } from "../../../materials";

export interface ModelBounds {
  offset: [number, number, number];
  size: Vector3;
}

const boundsCache = new Map<string, ModelBounds>();

export function getModelBounds(url: string, scene: Object3D): ModelBounds {
  const cached = boundsCache.get(url);
  if (cached) return cached;

  const box = new Box3().setFromObject(scene);
  const size = new Vector3();
  const center = new Vector3();
  box.getSize(size);
  box.getCenter(center);

  const bounds: ModelBounds = {
    offset: [-center.x, -box.min.y, -center.z],
    size,
  };
  boundsCache.set(url, bounds);
  return bounds;
}

export function paintClone(source: Object3D, materials: ResolvedMaterial[]): Group {
  const root = source.clone(true) as Group;
  const bySlot = new Map(materials.map((m) => [m.slot, m]));

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.castShadow = true;
    obj.receiveShadow = true;

    const swap = (mat: MeshStandardMaterial) => {
      const resolved = bySlot.get(mat.name);
      return resolved ? getMaterial(resolved) : mat;
    };

    obj.material = Array.isArray(obj.material)
      ? obj.material.map(swap)
      : swap(obj.material as MeshStandardMaterial);
  });

  return root;
}

export function materialsKey(materials: ResolvedMaterial[]): string {
  return materials.map((m) => `${m.slot}:${m.color}`).join("|");
}
