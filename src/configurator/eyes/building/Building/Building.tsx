"use client";

import { useCallback, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { Box3, type Group, Mesh, type Object3D, Vector3 } from "three";
import type { RenderableInstance, ResolvedMaterial } from "@brain";
import { useConfigurator } from "@store";
import { getMaterial } from "../../materials";

export interface BuildingProps {
  instance: RenderableInstance;
}

const DEFAULT_GLB = "models/buildings/Super59_5ft_Deck.glb";

const toUrl = (p: string) => `/${p.replace(/^\/+/, "")}`;

function paintClone(source: Object3D, materials: ResolvedMaterial[]): Group {
  const root = source.clone(true) as Group;
  const bySlot = new Map(materials.map((m) => [m.slot, m]));
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.castShadow = true;
    obj.receiveShadow = true;
    const swap = (name: string) => {
      const resolved = bySlot.get(name);
      return resolved ? getMaterial(resolved) : null;
    };
    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map((m) => swap(m.name) ?? m);
    } else {
      obj.material = swap(obj.material.name) ?? obj.material;
    }
  });
  return root;
}

export function Building({ instance }: BuildingProps) {
  const { position, rotationY, scale, materials, uid, base } = instance;
  const url = toUrl(base.glb ?? DEFAULT_GLB);

  const { scene } = useGLTF(url);

  const select = useConfigurator((s) => s.select);
  const selected = useConfigurator((s) => s.selectedUid === uid);

  const slotKey = materials.map((m) => `${m.slot}:${m.color}`).join("|");
  const model = useMemo(
    () => paintClone(scene, materials),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scene, slotKey],
  );

  const { modelOffset, size } = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const s = new Vector3();
    const c = new Vector3();
    box.getSize(s);
    box.getCenter(c);
    return {
      modelOffset: [-c.x, -box.min.y, -c.z] as [number, number, number],
      size: s,
    };
  }, [scene]);

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      select(uid);
    },
    [select, uid],
  );

  return (
    <group
      position={position}
      rotation={[0, rotationY, 0]}
      scale={scale}
      onClick={onClick}
    >
      <primitive object={model} position={modelOffset} />

      {selected && (
        <mesh position={[0, size.y / 2, 0]}>
          <boxGeometry args={[size.x * 1.04, size.y * 1.04, size.z * 1.04]} />
          <meshBasicMaterial color="#26c6da" wireframe transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload(toUrl(DEFAULT_GLB));
