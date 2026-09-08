"use client";

import type { ResolvedSocket } from "@brain";
import type { SocketAnchor } from "../readSocketAnchors";
import { useSocketPartObject } from "./useSocketPartObject";

export interface SocketMountProps {
  socket: ResolvedSocket;
  anchor: SocketAnchor;
}

export function SocketMount({ socket, anchor }: SocketMountProps) {
  const glb = socket.part?.glb;
  const object = useSocketPartObject(
    glb ?? "",
    socket.part?.glbMesh,
    socket.materials,
  );

  if (!socket.part || !glb || !object) return null;

  return (
    <group position={anchor.position} quaternion={anchor.quaternion}>
      <primitive key={socket.partId ?? "none"} object={object} />
    </group>
  );
}
