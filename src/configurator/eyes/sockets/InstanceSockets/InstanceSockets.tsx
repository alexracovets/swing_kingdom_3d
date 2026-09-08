"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { RenderableInstance } from "@brain";
import { readSocketAnchors } from "../readSocketAnchors";
import { SocketGizmo } from "../SocketGizmo";
import { SocketMount } from "../SocketMount";

export interface InstanceSocketsProps {
  instance: RenderableInstance;
  glbUrl: string;
  selected: boolean;
}

export function InstanceSockets({
  instance,
  glbUrl,
  selected,
}: InstanceSocketsProps) {
  const { scene } = useGLTF(glbUrl);
  const defs = useMemo(
    () => instance.base.sockets ?? [],
    [instance.base.sockets],
  );

  const anchors = useMemo(
    () => readSocketAnchors(glbUrl, scene, defs),
    [glbUrl, scene, defs],
  );

  if (defs.length === 0) return null;

  return (
    <>
      {instance.sockets.map((socket) => {
        const anchor = anchors.find((a) => a.id === socket.def.id);
        if (!anchor) return null;
        return (
          <group key={socket.def.id}>
            <SocketMount socket={socket} anchor={anchor} />
            {selected && (
              <SocketGizmo uid={instance.uid} socket={socket} anchor={anchor} />
            )}
          </group>
        );
      })}
    </>
  );
}
