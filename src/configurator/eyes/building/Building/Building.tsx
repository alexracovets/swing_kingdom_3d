"use client";

import { useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import type { RenderableInstance } from "@brain";
import { useConfigurator } from "@store";
import { InstanceSockets } from "../../sockets";
import { usePreparedModel } from "../usePreparedModel";
import { SelectionBox } from "../SelectionBox";

export interface BuildingProps {
  instance: RenderableInstance;
}

const DEFAULT_GLB = "models/buildings/Super59_5ft_Deck.glb";

const toUrl = (p: string) => `/${p.replace(/^\/+/, "")}`;

export function Building({ instance }: BuildingProps) {
  const { position, rotationY, scale, materials, uid, base } = instance;
  const url = toUrl(base.glb ?? DEFAULT_GLB);

  const { model, bounds } = usePreparedModel(url, materials);

  const select = useConfigurator((s) => s.select);
  const selected = useConfigurator((s) => s.selectedUid === uid);

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
      <group position={bounds.offset}>
        <primitive object={model} />
        <InstanceSockets instance={instance} glbUrl={url} selected={selected} />
      </group>
      {selected && <SelectionBox size={bounds.size} />}
    </group>
  );
}

useGLTF.preload(toUrl(DEFAULT_GLB));
