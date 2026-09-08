import type { ColorScheme, PlaygroundConfig, PartInstance, Vec3 } from "../types";
import { BUILDING_PART_ID } from "../../catalog/building";

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

export function makeInstance(
  partId: string,
  position: Vec3 = [0, 0, 0],
  rotationY = 0,
): PartInstance {
  return { uid: nextUid(), partId, position, rotationY };
}

export function createDefaultConfig(): PlaygroundConfig {
  return {
    version: 1,
    line: "residential",
    scheme: { ...DEFAULT_SCHEME },
    instances: [makeInstance(BUILDING_PART_ID, [0, 0, 0])],
  };
}
