"use client";

export interface SocketPickerOption {
  id: string;
  label: string;
}

export interface SocketPickerProps {
  title: string;
  options: SocketPickerOption[];
  activeId: string | null;
  onPick: (partId: string) => void;
  onClose: () => void;
}

export function SocketPicker({
  title,
  options,
  activeId,
  onPick,
  onClose,
}: SocketPickerProps) {
  return (
    <div className="w-44 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
          {title}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-zinc-400 hover:text-zinc-900"
        >
          ✕
        </button>
      </div>
      <ul className="flex flex-col gap-0.5">
        {options.map((opt) => (
          <li key={opt.id}>
            <button
              type="button"
              onClick={() => onPick(opt.id)}
              className={
                "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors " +
                (activeId === opt.id
                  ? "bg-zinc-900 text-zinc-50"
                  : "hover:bg-zinc-100 text-zinc-900")
              }
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
