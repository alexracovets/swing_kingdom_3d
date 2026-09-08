import type {
  CatalogPart,
  ColorScheme,
  PartInstance,
  PlaygroundConfig,
  Vec3,
} from "../../model/types";
import { requirePart, resolveRenderable } from "../../catalog/registry";
import { resolvePartMaterials, type ResolvedMaterial } from "../../materials/resolveColor";
import { DECK_AXIS_Y, FT_TO_UNIT } from "../../constants";

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

function effectiveScheme(base: ColorScheme, own?: Partial<ColorScheme>): ColorScheme {
  return { ...base, ...own };
}

function instanceCacheKey(inst: PartInstance, scheme: ColorScheme): string {
  return [
    inst.uid,
    inst.partId,
    inst.position.join(","),
    inst.rotationY,
    inst.parentUid ?? "",
    inst.socket ?? "",
    scheme.main,
    scheme.accent,
    scheme.tertiary ?? "",
    inst.overrides ? JSON.stringify(inst.overrides) : "",
  ].join("|");
}

const instanceCache = new Map<string, RenderableInstance>();

export function resolveInstance(
  inst: PartInstance,
  defaultScheme: ColorScheme,
): RenderableInstance {
  const scheme = effectiveScheme(defaultScheme, inst.scheme);
  const key = instanceCacheKey(inst, scheme);

  const cached = instanceCache.get(key);
  if (cached) return cached;

  const part = requirePart(inst.partId);
  const { base } = resolveRenderable(inst.partId);

  const resolved: RenderableInstance = {
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

  instanceCache.set(key, resolved);
  return resolved;
}

export function resolveScene(config: PlaygroundConfig): ResolvedScene {
  const live = new Set<string>();
  const instances = config.instances.map((inst) => {
    const scheme = effectiveScheme(config.scheme, inst.scheme);
    live.add(instanceCacheKey(inst, scheme));
    return resolveInstance(inst, config.scheme);
  });

  for (const key of instanceCache.keys()) {
    if (!live.has(key)) instanceCache.delete(key);
  }

  return { line: config.line, instances };
}

export function deckHeightUnits(part: CatalogPart): number {
  return (part.deckHeightFt ?? 0) * FT_TO_UNIT;
}

export function nextInstancePosition(config: PlaygroundConfig, spacing: number): Vec3 {
  const n = config.instances.length;
  const step = Math.ceil(n / 2);
  const dir = n % 2 === 0 ? 1 : -1;
  return [dir * step * spacing, 0, 0];
}
