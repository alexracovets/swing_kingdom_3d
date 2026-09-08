"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useConfigurator } from "@store";
import { disposeMaterialCache } from "../../materials";
import { PlaygroundScene } from "../../scene";
import {
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_POSITION,
} from "../../constants";
import { CanvasErrorBoundary } from "../CanvasErrorBoundary";

export function ConfiguratorCanvas() {
  const select = useConfigurator((s) => s.select);

  useEffect(() => disposeMaterialCache, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    (window as unknown as { __configurator: typeof useConfigurator }).__configurator =
      useConfigurator;
  }, []);

  return (
    <CanvasErrorBoundary>
      <Canvas
        className="h-full w-full touch-none"
        shadows="variance"
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{
          position: [...CAMERA_POSITION],
          fov: CAMERA_FOV,
          near: CAMERA_NEAR,
          far: CAMERA_FAR,
        }}
        onPointerMissed={() => select(null)}
      >
        <Suspense fallback={null}>
          <PlaygroundScene />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
