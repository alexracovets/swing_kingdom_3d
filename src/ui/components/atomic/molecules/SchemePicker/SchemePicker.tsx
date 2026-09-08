"use client";

import type { ColorScheme } from "@brain";
import { ColorSwatch } from "@atoms";

const MAIN_OPTIONS = ["#f4f1ea", "#e8dcc6", "#6b5540"];
const ACCENT_OPTIONS = ["#3b6ea5", "#2e7d32", "#c62828", "#f9a825", "#8a8d91"];

export interface SchemePickerProps {
  scheme: ColorScheme;
  onChange: (patch: Partial<ColorScheme>) => void;
}

export function SchemePicker({ scheme, onChange }: SchemePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1.5 text-xs font-medium text-zinc-500">Frames</p>
        <div className="flex gap-2">
          {MAIN_OPTIONS.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              selected={scheme.main === c}
              onSelect={(main) => onChange({ main })}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-zinc-500">Accent</p>
        <div className="flex gap-2">
          {ACCENT_OPTIONS.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              selected={scheme.accent === c}
              onSelect={(accent) => onChange({ accent })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
