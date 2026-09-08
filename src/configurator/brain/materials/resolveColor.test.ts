import { describe, expect, it } from "vitest";
import type { CatalogPart, ColorScheme, MaterialSlot } from "../model/types";
import {
  ACCENT_FALLBACK_GRAY,
  resolvePartMaterials,
  resolveSlotColor,
} from "./resolveColor";

const scheme: ColorScheme = { main: "#ffffff", accent: "#0000ff" };

describe("resolveSlotColor", () => {
  it("vinyl frame always takes the main colour", () => {
    const slot: MaterialSlot = { name: "frame", role: "vinyl" };
    expect(resolveSlotColor(slot, scheme)?.color).toBe("#ffffff");
  });

  it("accent slot takes the accent colour when the part has that variant", () => {
    const slot: MaterialSlot = { name: "deck", role: "accent" };
    const r = resolveSlotColor(slot, scheme, {
      availableAccentColors: new Set(["#0000ff"]),
    });
    expect(r?.color).toBe("#0000ff");
    expect(r?.source).toBe("accent");
  });

  it("accent slot falls back to grey when the part lacks that variant", () => {
    const slot: MaterialSlot = { name: "deck", role: "accent" };
    const r = resolveSlotColor(slot, scheme, {
      availableAccentColors: new Set(["#ff0000"]),
    });
    expect(r?.color).toBe(ACCENT_FALLBACK_GRAY);
    expect(r?.source).toBe("accent-fallback");
  });

  it("native slots resolve to null — hardware keeps its imported material", () => {
    const slot: MaterialSlot = { name: "Bolt", role: "native" };
    expect(resolveSlotColor(slot, scheme)).toBeNull();
  });

  it("an override cannot repaint a native slot", () => {
    const slot: MaterialSlot = { name: "Bolt", role: "native" };
    expect(resolveSlotColor(slot, scheme, { overrides: { Bolt: "#ff0000" } })).toBeNull();
  });

  it("own-palette parts ignore the scheme", () => {
    const slot: MaterialSlot = {
      name: "chute",
      role: "own",
      ownPalette: ["#00aa00", "#0000ff"],
    };
    expect(resolveSlotColor(slot, scheme)?.color).toBe("#00aa00");
  });

  it("fixed slots use their hard-coded colour (Buoy Ball top)", () => {
    const slot: MaterialSlot = { name: "top", role: "fixed", fixedColor: "#1140ff" };
    expect(resolveSlotColor(slot, scheme)?.color).toBe("#1140ff");
  });

  it("an explicit override beats every rule", () => {
    const slot: MaterialSlot = { name: "frame", role: "vinyl" };
    const r = resolveSlotColor(slot, scheme, { overrides: { frame: "#123456" } });
    expect(r?.color).toBe("#123456");
    expect(r?.source).toBe("override");
  });
});

describe("resolvePartMaterials", () => {
  const part: CatalogPart = {
    id: "x",
    label: "x",
    category: "tower",
    commercial: true,
    status: "ready",
    materials: [
      { name: "Frame", role: "vinyl" },
      { name: "Board", role: "accent" },
      { name: "Bolt", role: "native" },
      { name: "Screw", role: "native" },
      { name: "rubber", role: "fixed", fixedColor: "#111111" },
    ],
  };

  it("only returns paintable slots — native hardware is dropped", () => {
    const out = resolvePartMaterials(part, scheme);
    expect(out.map((m) => m.slot)).toEqual(["Frame", "Board", "rubber"]);
  });

  it("paints frame with main and board with accent", () => {
    const out = resolvePartMaterials(part, scheme);
    expect(out.find((m) => m.slot === "Frame")?.color).toBe("#ffffff");
    expect(out.find((m) => m.slot === "Board")?.color).toBe("#0000ff");
  });
});
