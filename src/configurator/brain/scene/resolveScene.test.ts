import { describe, expect, it } from "vitest";
import { createDefaultConfig, makeInstance, __resetUidCounter } from "../model/defaults";
import { resolveScene } from "./resolveScene";

describe("resolveScene", () => {
  it("resolves the default scene to a single Building at the origin", () => {
    __resetUidCounter();
    const scene = resolveScene(createDefaultConfig());
    expect(scene.instances).toHaveLength(1);
    expect(scene.instances[0].part.id).toBe("building");
    expect(scene.instances[0].scale).toEqual([1, 1, 1]);
  });

  it("collapses a derived 7' Building onto the 5' base with a Y stretch", () => {
    __resetUidCounter();
    const config = createDefaultConfig();
    config.instances = [makeInstance("building-7ft", [3, 0, 0])];

    const scene = resolveScene(config);
    const inst = scene.instances[0];

    expect(inst.part.id).toBe("building-7ft");
    expect(inst.base.id).toBe("building");
    expect(inst.scale[1]).toBeCloseTo(7 / 5);
    expect(inst.scale[0]).toBe(1);
    expect(inst.scale[2]).toBe(1);
  });

  it("applies the colour scheme to Building material slots", () => {
    __resetUidCounter();
    const config = createDefaultConfig();
    config.scheme = { main: "#ffffff", accent: "#0000ff" };

    const [building] = resolveScene(config).instances;
    const frame = building.materials.find((m) => m.slot === "Frame");
    const board = building.materials.find((m) => m.slot === "Board");

    expect(frame?.color).toBe("#ffffff");
    expect(board?.color).toBe("#0000ff");
  });

  it("a per-instance scheme only recolours that instance", () => {
    __resetUidCounter();
    const config = createDefaultConfig();
    config.scheme = { main: "#ffffff", accent: "#0000ff" };
    const a = makeInstance("building", [0, 0, 0]);
    const b = makeInstance("building", [5, 0, 0]);
    b.scheme = { accent: "#ff0000" };
    config.instances = [a, b];

    const [ra, rb] = resolveScene(config).instances;
    expect(ra.materials.find((m) => m.slot === "Board")?.color).toBe("#0000ff");
    expect(rb.materials.find((m) => m.slot === "Board")?.color).toBe("#ff0000");
    expect(rb.materials.find((m) => m.slot === "Frame")?.color).toBe("#ffffff");
  });
});
