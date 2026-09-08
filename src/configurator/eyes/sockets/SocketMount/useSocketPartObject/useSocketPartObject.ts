"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { Object3D } from "three";
import type { ResolvedMaterial } from "@brain";
import { materialsKey } from "../../../prepare";
import { paintClone } from "../../../prepare";

const toUrl = (p: string) => `/${p.replace(/^\/+/, "")}`;

export function useSocketPartObject(
  glb: string,
  meshName: string | undefined,
  materials: ResolvedMaterial[],
): Object3D | null {
  const { scene } = useGLTF(toUrl(glb));

  const key = materialsKey(materials);

  return useMemo(() => {
    const source = meshName ? scene.getObjectByName(meshName) : scene;
    if (!source) return null;
    return paintClone(source, materials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, meshName, key]);
}
