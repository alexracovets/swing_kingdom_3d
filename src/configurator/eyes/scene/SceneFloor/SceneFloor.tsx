"use client";

import { Grid } from "@react-three/drei";
import {
  GRID_CELL_COLOR,
  GRID_CELL_SIZE,
  GRID_FADE_DISTANCE,
  GRID_SECTION_COLOR,
  GRID_SECTION_SIZE,
} from "../../constants";

export function SceneFloor() {
  return (
    <>
      <Grid
        args={[40, 40]}
        cellSize={GRID_CELL_SIZE}
        cellThickness={0.6}
        sectionSize={GRID_SECTION_SIZE}
        sectionThickness={1}
        sectionColor={GRID_SECTION_COLOR}
        cellColor={GRID_CELL_COLOR}
        fadeDistance={GRID_FADE_DISTANCE}
        infiniteGrid
        position={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.22} />
      </mesh>
    </>
  );
}
