"use client";

import type { Vector3 } from "three";
import { SELECTION_COLOR, SELECTION_PADDING } from "../../constants";

export interface SelectionBoxProps {
  size: Vector3;
}

export function SelectionBox({ size }: SelectionBoxProps) {
  return (
    <mesh position={[0, size.y / 2, 0]}>
      <boxGeometry
        args={[
          size.x * SELECTION_PADDING,
          size.y * SELECTION_PADDING,
          size.z * SELECTION_PADDING,
        ]}
      />
      <meshBasicMaterial
        color={SELECTION_COLOR}
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}
