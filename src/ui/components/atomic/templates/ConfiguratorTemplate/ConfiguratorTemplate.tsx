"use client";

import dynamic from "next/dynamic";
import { ConfiguratorPanel } from "@organisms";

const ConfiguratorCanvas = dynamic(
  () => import("@configurator").then((m) => m.ConfiguratorCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm text-zinc-400">
        Loading viewport…
      </div>
    ),
  },
);

export function ConfiguratorTemplate() {
  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <ConfiguratorPanel />
      <main className="relative flex-1">
        <ConfiguratorCanvas />
      </main>
    </div>
  );
}
