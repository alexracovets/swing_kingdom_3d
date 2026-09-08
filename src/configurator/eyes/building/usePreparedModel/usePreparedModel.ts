"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import type { ResolvedMaterial } from "@brain";
import { getModelBounds } from "./prepareModel";
import { materialsKey } from "./prepareModel";
import { paintClone } from "./prepareModel";
import type { ModelBounds } from "./prepareModel";

export interface PreparedModel {
  model: Group;
  bounds: ModelBounds;
}

export function usePreparedModel(
  url: string,
  materials: ResolvedMaterial[],
): PreparedModel {
  const { scene } = useGLTF(url);

  const bounds = useMemo(() => getModelBounds(url, scene), [url, scene]);

  const key = materialsKey(materials);
  const model = useMemo(
    () => paintClone(scene, materials),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene, key],
  );

  return { model, bounds };
}
