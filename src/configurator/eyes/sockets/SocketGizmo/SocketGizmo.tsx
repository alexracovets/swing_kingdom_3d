"use client";

import { useCallback, useMemo, useState } from "react";
import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { partsForSocket, type ResolvedSocket } from "@brain";
import { selectEditingSocket, useConfigurator } from "@store";
import {
  SOCKET_GIZMO_COLOR,
  SOCKET_GIZMO_COLOR_ACTIVE,
  SOCKET_GIZMO_HOVER_SCALE,
  SOCKET_GIZMO_RADIUS,
} from "../../constants";
import type { SocketAnchor } from "../readSocketAnchors";
import { SocketPicker } from "../SocketPicker";

export interface SocketGizmoProps {
  uid: string;
  socket: ResolvedSocket;
  anchor: SocketAnchor;
}

export function SocketGizmo({ uid, socket, anchor }: SocketGizmoProps) {
  const editingSocket = useConfigurator(selectEditingSocket);
  const editSocket = useConfigurator((s) => s.editSocket);
  const setSocketPart = useConfigurator((s) => s.setSocketPart);
  const [hovered, setHovered] = useState(false);

  const active =
    editingSocket?.uid === uid && editingSocket.socketId === socket.def.id;

  const options = useMemo(
    () =>
      partsForSocket(socket.def.size).map((p) => ({ id: p.id, label: p.label })),
    [socket.def.size],
  );

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      editSocket(active ? null : { uid, socketId: socket.def.id });
    },
    [editSocket, active, uid, socket.def.id],
  );

  return (
    <group position={anchor.position} quaternion={anchor.quaternion}>
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? SOCKET_GIZMO_HOVER_SCALE : 1}
      >
        <sphereGeometry args={[SOCKET_GIZMO_RADIUS, 20, 20]} />
        <meshStandardMaterial
          color={active ? SOCKET_GIZMO_COLOR_ACTIVE : SOCKET_GIZMO_COLOR}
          emissive={active ? SOCKET_GIZMO_COLOR_ACTIVE : SOCKET_GIZMO_COLOR}
          emissiveIntensity={0.4}
          roughness={0.4}
        />
      </mesh>

      {active && (
        <Html center distanceFactor={8} position={[0, SOCKET_GIZMO_RADIUS * 3, 0]}>
          <SocketPicker
            title={socket.def.id}
            options={options}
            activeId={socket.partId}
            onPick={(partId) => setSocketPart(uid, socket.def.id, partId)}
            onClose={() => editSocket(null)}
          />
        </Html>
      )}
    </group>
  );
}
