"use client";

import { OrbitControls } from "@react-three/drei";
import { BUILDING_PART_ID } from "@brain";
import { useResolvedScene } from "@store";
import { Building } from "../../building";
import {
  FOG_FAR,
  FOG_NEAR,
  ORBIT_MAX_DISTANCE,
  ORBIT_MAX_POLAR,
  ORBIT_MIN_DISTANCE,
  ORBIT_MIN_POLAR,
  SCENE_BACKGROUND,
} from "../../constants";
import { SceneFloor } from "../SceneFloor";
import { SceneLights } from "../SceneLights";

export function PlaygroundScene() {
  const { instances } = useResolvedScene();

  return (
    <>
      <color attach="background" args={[SCENE_BACKGROUND]} />
      <fog attach="fog" args={[SCENE_BACKGROUND, FOG_NEAR, FOG_FAR]} />

      <SceneLights />
      <SceneFloor />

      {instances.map((inst) =>
        inst.base.id === BUILDING_PART_ID ? (
          <Building key={inst.uid} instance={inst} />
        ) : null,
      )}

      <OrbitControls
        makeDefault
        enablePan
        minPolarAngle={ORBIT_MIN_POLAR}
        maxPolarAngle={ORBIT_MAX_POLAR}
        minDistance={ORBIT_MIN_DISTANCE}
        maxDistance={ORBIT_MAX_DISTANCE}
      />
    </>
  );
}
