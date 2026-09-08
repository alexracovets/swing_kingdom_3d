import type { CatalogPart, ColorScheme, MaterialSlot } from "../../model/types";

export const ACCENT_FALLBACK_GRAY = "#8a8d91";

export interface ResolvedMaterial {
  slot: string;
  color: string;
  texture?: string;
  source:
    | "vinyl-main"
    | "accent"
    | "accent-fallback"
    | "tertiary"
    | "tertiary-fallback"
    | "own"
    | "fixed"
    | "override";
}

export interface ResolveOptions {
  availableAccentColors?: Set<string>;
  overrides?: Record<string, string>;
}

export function resolveSlotColor(
  slot: MaterialSlot,
  scheme: ColorScheme,
  opts: ResolveOptions = {},
): ResolvedMaterial | null {
  if (slot.role === "native") return null;

  const override = opts.overrides?.[slot.name];
  if (override) {
    return { slot: slot.name, color: override, texture: slot.texture, source: "override" };
  }

  switch (slot.role) {
    case "vinyl":
      return { slot: slot.name, color: scheme.main, texture: slot.texture, source: "vinyl-main" };

    case "accent": {
      const hasVariant =
        !opts.availableAccentColors || opts.availableAccentColors.has(scheme.accent);
      return {
        slot: slot.name,
        color: hasVariant ? scheme.accent : ACCENT_FALLBACK_GRAY,
        texture: slot.texture,
        source: hasVariant ? "accent" : "accent-fallback",
      };
    }

    case "tertiary": {
      const color = scheme.tertiary ?? scheme.accent;
      return {
        slot: slot.name,
        color: color ?? ACCENT_FALLBACK_GRAY,
        texture: slot.texture,
        source: scheme.tertiary ? "tertiary" : "tertiary-fallback",
      };
    }

    case "own":
      return {
        slot: slot.name,
        color: slot.ownPalette?.[0] ?? ACCENT_FALLBACK_GRAY,
        texture: slot.texture,
        source: "own",
      };

    case "fixed":
      return {
        slot: slot.name,
        color: slot.fixedColor ?? ACCENT_FALLBACK_GRAY,
        texture: slot.texture,
        source: "fixed",
      };
  }
}

export function resolvePartMaterials(
  part: CatalogPart,
  scheme: ColorScheme,
  opts: ResolveOptions = {},
): ResolvedMaterial[] {
  return part.materials
    .map((slot) => resolveSlotColor(slot, scheme, opts))
    .filter((m): m is ResolvedMaterial => m !== null);
}
