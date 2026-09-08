import type {
  ColorScheme,
  PartInstance,
  PlaygroundConfig,
  Vec3,
} from "../../model/types";
import { createDefaultConfig } from "../../model/defaults";
import { getPart } from "../../catalog/registry";

export function serializeConfig(config: PlaygroundConfig): string {
  return JSON.stringify(config);
}

function isVec3(v: unknown): v is Vec3 {
  return (
    Array.isArray(v) &&
    v.length === 3 &&
    v.every((n) => typeof n === "number" && Number.isFinite(n))
  );
}

function isColorScheme(v: unknown): v is ColorScheme {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  const hex = (x: unknown) => typeof x === "string" && /^#[0-9a-fA-F]{3,8}$/.test(x);
  if (!hex(s.main) || !hex(s.accent)) return false;
  if (s.tertiary !== undefined && !hex(s.tertiary)) return false;
  return true;
}

function parseInstance(v: unknown): PartInstance | null {
  if (!v || typeof v !== "object") return null;
  const i = v as Record<string, unknown>;

  if (typeof i.uid !== "string" || typeof i.partId !== "string") return null;
  if (!getPart(i.partId)) return null;
  if (!isVec3(i.position)) return null;
  if (typeof i.rotationY !== "number" || !Number.isFinite(i.rotationY)) return null;

  const inst: PartInstance = {
    uid: i.uid,
    partId: i.partId,
    position: i.position,
    rotationY: i.rotationY,
  };

  if (typeof i.parentUid === "string") inst.parentUid = i.parentUid;
  if (typeof i.socket === "string") inst.socket = i.socket;

  if (i.scheme && typeof i.scheme === "object") {
    const s = i.scheme as Record<string, unknown>;
    const partial: Partial<ColorScheme> = {};
    const hex = (x: unknown) => typeof x === "string" && /^#[0-9a-fA-F]{3,8}$/.test(x);
    if (hex(s.main)) partial.main = s.main as string;
    if (hex(s.accent)) partial.accent = s.accent as string;
    if (hex(s.tertiary)) partial.tertiary = s.tertiary as string;
    if (Object.keys(partial).length > 0) inst.scheme = partial;
  }

  if (i.overrides && typeof i.overrides === "object") {
    const src = i.overrides as Record<string, unknown>;
    const clean: Record<string, string> = {};
    for (const [k, val] of Object.entries(src)) {
      if (typeof val === "string") clean[k] = val;
    }
    if (Object.keys(clean).length > 0) inst.overrides = clean;
  }

  if (i.sockets && typeof i.sockets === "object") {
    const src = i.sockets as Record<string, unknown>;
    const clean: Record<string, string> = {};
    for (const [k, val] of Object.entries(src)) {
      if (typeof val === "string" && getPart(val)) clean[k] = val;
    }
    if (Object.keys(clean).length > 0) inst.sockets = clean;
  }

  return inst;
}

export function deserializeConfig(raw: string): PlaygroundConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return createDefaultConfig();
  }

  if (!parsed || typeof parsed !== "object") return createDefaultConfig();
  const c = parsed as Partial<PlaygroundConfig>;

  if (c.version !== 1 || !Array.isArray(c.instances) || !isColorScheme(c.scheme)) {
    return createDefaultConfig();
  }

  const instances = c.instances
    .map(parseInstance)
    .filter((i): i is PartInstance => i !== null);

  if (instances.length === 0) return createDefaultConfig();

  return {
    version: 1,
    line: c.line === "commercial" ? "commercial" : "residential",
    scheme: c.scheme,
    instances,
  };
}
