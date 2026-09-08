import type { PlaygroundConfig } from "../model/types";
import { createDefaultConfig } from "../model/defaults";
import { getPart } from "../catalog/registry";

export function serializeConfig(config: PlaygroundConfig): string {
  return JSON.stringify(config);
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

  if (c.version !== 1 || !Array.isArray(c.instances) || !c.scheme) {
    return createDefaultConfig();
  }

  const instances = c.instances.filter((i) => i && getPart(i.partId));
  if (instances.length === 0) return createDefaultConfig();

  return {
    version: 1,
    line: c.line === "commercial" ? "commercial" : "residential",
    scheme: c.scheme,
    instances,
  };
}
