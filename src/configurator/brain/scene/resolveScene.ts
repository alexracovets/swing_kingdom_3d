import type { CatalogPart, PlaygroundConfig, Vec3 } from "../model/types";
import { requirePart, resolveRenderable } from "../catalog/registry";
import { resolvePartMaterials, type ResolvedMaterial } from "../materials/resolveColor";

export interface RenderableInstance {
  uid: string;
  part: CatalogPart;
  base: CatalogPart;
  position: Vec3;
  rotationY: number;
  scale: Vec3;
  parentUid?: string;
  socket?: string;
  materials: ResolvedMaterial[];
}

export interface ResolvedScene {
  line: PlaygroundConfig["line"];
  instances: RenderableInstance[];
}

const DECK_AXIS_Y = 1;
const FT_TO_UNIT = 0.3048;

function transformScale(part: CatalogPart, base: CatalogPart): Vec3 {
  const t = part.derivedFrom;
  if (!t) return [1, 1, 1];

  let s: Vec3 = [1, 1, 1];
  if (typeof t.scale === "number") s = [t.scale, t.scale, t.scale];
  else if (Array.isArray(t.scale)) s = [...t.scale];

  if (t.stretchHeightFt && base.deckHeightFt) {
    const targetFt = base.deckHeightFt + t.stretchHeightFt;
    s[DECK_AXIS_Y] *= targetFt / base.deckHeightFt;
  }
  return s;
}

export function resolveScene(config: PlaygroundConfig): ResolvedScene {
  const instances = config.instances.map<RenderableInstance>((inst) => {
    const part = requirePart(inst.partId);
    const { base } = resolveRenderable(inst.partId);

    const scheme = { ...config.scheme, ...inst.scheme };

    return {
      uid: inst.uid,
      part,
      base,
      position: inst.position,
      rotationY: inst.rotationY,
      scale: transformScale(part, base),
      parentUid: inst.parentUid,
      socket: inst.socket,
      materials: resolvePartMaterials(part, scheme, { overrides: inst.overrides }),
    };
  });

  return { line: config.line, instances };
}

export function deckHeightUnits(part: CatalogPart): number {
  return (part.deckHeightFt ?? 0) * FT_TO_UNIT;
}
