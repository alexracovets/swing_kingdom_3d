import { type Object3D, Quaternion, Vector3 } from "three";
import type { SocketDef } from "@brain";

export interface SocketAnchor {
  id: string;
  position: [number, number, number];
  quaternion: [number, number, number, number];
}

const anchorCache = new Map<string, SocketAnchor[]>();

function keyFor(url: string, defs: SocketDef[]): string {
  return `${url}::${defs.map((d) => `${d.id}:${d.emptyNode}`).join(",")}`;
}

export function readSocketAnchors(
  url: string,
  scene: Object3D,
  defs: SocketDef[],
): SocketAnchor[] {
  const cacheKey = keyFor(url, defs);
  const cached = anchorCache.get(cacheKey);
  if (cached) return cached;

  scene.updateWorldMatrix(true, true);

  const pos = new Vector3();
  const quat = new Quaternion();
  const scl = new Vector3();

  const anchors: SocketAnchor[] = [];
  for (const def of defs) {
    const node = scene.getObjectByName(def.emptyNode);
    if (!node) continue;
    node.matrixWorld.decompose(pos, quat, scl);
    anchors.push({
      id: def.id,
      position: [pos.x, pos.y, pos.z],
      quaternion: [quat.x, quat.y, quat.z, quat.w],
    });
  }

  anchorCache.set(cacheKey, anchors);
  return anchors;
}
