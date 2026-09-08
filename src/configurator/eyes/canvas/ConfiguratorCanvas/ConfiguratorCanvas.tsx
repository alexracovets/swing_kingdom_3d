"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useConfigurator } from "@store";
import { PlaygroundScene } from "../../scene";

export function ConfiguratorCanvas() {
  const select = useConfigurator((s) => s.select);

  return (
    <Canvas
      className="h-full w-full touch-none"
      shadows="variance"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [6, 4.5, 7.5], fov: 45, near: 0.5, far: 100 }}
      onPointerMissed={() => select(null)}
    >
      <Suspense fallback={null}>
        <PlaygroundScene />
      </Suspense>
    </Canvas>
  );
}
