"use client";

import { Environment, Grid, OrbitControls } from "@react-three/drei";
import { useConfigurator } from "@store";
import { BUILDING_PART_ID } from "@brain";
import { Building } from "../../building";

export function PlaygroundScene() {
  const instances = useConfigurator((s) => s.scene.instances);

  return (
    <>
      <color attach="background" args={["#eef1f4"]} />
      <fog attach="fog" args={["#eef1f4", 30, 70]} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-radius={4}
        shadow-blurSamples={16}
        shadow-bias={-0.0005}
      />
      <Environment preset="city" environmentIntensity={0.3} />

      <Grid
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.6}
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9aa4ad"
        cellColor="#c6ccd2"
        fadeDistance={38}
        infiniteGrid
        position={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.22} />
      </mesh>

      {instances.map((inst) =>
        inst.base.id === BUILDING_PART_ID ? (
          <Building key={inst.uid} instance={inst} />
        ) : null,
      )}

      <OrbitControls
        makeDefault
        enablePan
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={3}
        maxDistance={26}
      />
    </>
  );
}
