"use client";

import { cn } from "@lib";

export interface ColorSwatchProps {
  color: string;
  selected?: boolean;
  label?: string;
  onSelect?: (color: string) => void;
}

export function ColorSwatch({ color, selected, label, onSelect }: ColorSwatchProps) {
  return (
    <button
      type="button"
      title={label ?? color}
      onClick={() => onSelect?.(color)}
      className={cn(
        "h-7 w-7 rounded-full border transition-transform hover:scale-110",
        selected ? "border-zinc-900 ring-2 ring-zinc-900/30" : "border-zinc-300",
      )}
      style={{ backgroundColor: color }}
    />
  );
}
