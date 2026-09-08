"use client";

import { Environment } from "@react-three/drei";
import {
  SHADOW_BIAS,
  SHADOW_BLUR_SAMPLES,
  SHADOW_CAMERA_EXTENT,
  SHADOW_CAMERA_FAR,
  SHADOW_CAMERA_NEAR,
  SHADOW_MAP_SIZE,
  SHADOW_RADIUS,
} from "../../constants";

export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[SHADOW_MAP_SIZE, SHADOW_MAP_SIZE]}
        shadow-camera-near={SHADOW_CAMERA_NEAR}
        shadow-camera-far={SHADOW_CAMERA_FAR}
        shadow-camera-left={-SHADOW_CAMERA_EXTENT}
        shadow-camera-right={SHADOW_CAMERA_EXTENT}
        shadow-camera-top={SHADOW_CAMERA_EXTENT}
        shadow-camera-bottom={-SHADOW_CAMERA_EXTENT}
        shadow-radius={SHADOW_RADIUS}
        shadow-blurSamples={SHADOW_BLUR_SAMPLES}
        shadow-bias={SHADOW_BIAS}
      />
      <Environment preset="city" environmentIntensity={0.3} />
    </>
  );
}
