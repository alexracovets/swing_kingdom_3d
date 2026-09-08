import type { ColorScheme, PlaygroundConfig, PartInstance, Vec3 } from "../types";
import { BUILDING_PART_ID } from "../../catalog/building";
import { DEFAULT_SOCKET_PART } from "../../catalog/socketParts";
import { getPart } from "../../catalog/registry";

let counter = 0;

export function nextUid(prefix = "inst"): string {
  counter += 1;
  return `${prefix}_${counter.toString(36)}`;
}

export function __resetUidCounter(): void {
  counter = 0;
}

export const DEFAULT_SCHEME: ColorScheme = {
  main: "#f4f1ea",
  accent: "#3b6ea5",
};

export function defaultSocketMap(partId: string): Record<string, string> | undefined {
  const part = getPart(partId);
  if (!part?.sockets?.length) return undefined;
  const map: Record<string, string> = {};
  for (const socket of part.sockets) {
    const fallback = DEFAULT_SOCKET_PART[socket.size];
    if (fallback) map[socket.id] = fallback;
  }
  return Object.keys(map).length > 0 ? map : undefined;
}

export function makeInstance(
  partId: string,
  position: Vec3 = [0, 0, 0],
  rotationY = 0,
): PartInstance {
  const inst: PartInstance = { uid: nextUid(), partId, position, rotationY };
  const sockets = defaultSocketMap(partId);
  if (sockets) inst.sockets = sockets;
  return inst;
}

export function createDefaultConfig(): PlaygroundConfig {
  return {
    version: 1,
    line: "residential",
    scheme: { ...DEFAULT_SCHEME },
    instances: [makeInstance(BUILDING_PART_ID, [0, 0, 0])],
  };
}
