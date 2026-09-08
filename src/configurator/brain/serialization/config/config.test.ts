import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultConfig, __resetUidCounter } from "../../model/defaults";
import { deserializeConfig, serializeConfig } from "./config";

beforeEach(() => __resetUidCounter());

describe("deserializeConfig", () => {
  it("round-trips a valid config", () => {
    const config = createDefaultConfig();
    __resetUidCounter();
    const restored = deserializeConfig(serializeConfig(config));
    expect(restored).toEqual(config);
  });

  it("falls back to default on invalid JSON", () => {
    const fallback = deserializeConfig("not json {");
    __resetUidCounter();
    expect(fallback).toEqual(createDefaultConfig());
  });

  it("falls back to default on a bad scheme", () => {
    const raw = JSON.stringify({
      version: 1,
      line: "residential",
      scheme: { main: "blue", accent: "#0000ff" },
      instances: [
        { uid: "a", partId: "building", position: [0, 0, 0], rotationY: 0 },
      ],
    });
    const fallback = deserializeConfig(raw);
    __resetUidCounter();
    expect(fallback).toEqual(createDefaultConfig());
  });

  it("drops instances with a malformed position", () => {
    const raw = JSON.stringify({
      version: 1,
      line: "residential",
      scheme: { main: "#ffffff", accent: "#0000ff" },
      instances: [
        { uid: "a", partId: "building", position: [0, 0], rotationY: 0 },
        { uid: "b", partId: "building", position: [1, 0, 1], rotationY: 0 },
      ],
    });
    const restored = deserializeConfig(raw);
    expect(restored.instances).toHaveLength(1);
    expect(restored.instances[0].uid).toBe("b");
  });

  it("drops instances pointing at an unknown part", () => {
    const raw = JSON.stringify({
      version: 1,
      line: "residential",
      scheme: { main: "#ffffff", accent: "#0000ff" },
      instances: [
        { uid: "a", partId: "nope", position: [0, 0, 0], rotationY: 0 },
      ],
    });
    const fallback = deserializeConfig(raw);
    __resetUidCounter();
    expect(fallback).toEqual(createDefaultConfig());
  });

  it("keeps a valid per-instance scheme and drops bad keys", () => {
    const raw = JSON.stringify({
      version: 1,
      line: "commercial",
      scheme: { main: "#ffffff", accent: "#0000ff" },
      instances: [
        {
          uid: "a",
          partId: "building",
          position: [2, 0, 0],
          rotationY: 1,
          scheme: { accent: "#ff0000", main: 42 },
        },
      ],
    });
    const restored = deserializeConfig(raw);
    expect(restored.line).toBe("commercial");
    expect(restored.instances[0].scheme).toEqual({ accent: "#ff0000" });
  });
});
