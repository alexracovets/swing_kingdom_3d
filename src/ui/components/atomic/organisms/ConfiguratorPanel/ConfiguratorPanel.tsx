"use client";

import { useMemo } from "react";
import {
  selectDefaultScheme,
  selectSelectedInstanceScheme,
  useConfigurator,
} from "@store";
import { BUILDING_PART_ID } from "@brain";
import { Button } from "@shared";
import { SchemePicker } from "@molecules";

let dropX = 5;

export function ConfiguratorPanel() {
  const defaultScheme = useConfigurator(selectDefaultScheme);
  const instanceScheme = useConfigurator(selectSelectedInstanceScheme);
  const instances = useConfigurator((s) => s.scene.instances);
  const selectedUid = useConfigurator((s) => s.selectedUid);

  const scheme = useMemo(
    () => ({ ...defaultScheme, ...instanceScheme }),
    [defaultScheme, instanceScheme],
  );

  const seedScheme = useMemo(
    () =>
      scheme.main === defaultScheme.main &&
      scheme.accent === defaultScheme.accent &&
      scheme.tertiary === defaultScheme.tertiary
        ? undefined
        : scheme,
    [scheme, defaultScheme],
  );

  const setScheme = useConfigurator((s) => s.setScheme);
  const addPart = useConfigurator((s) => s.addPart);
  const removeInstance = useConfigurator((s) => s.removeInstance);
  const select = useConfigurator((s) => s.select);
  const reset = useConfigurator((s) => s.reset);

  const count = instances.length;

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-6 overflow-y-auto border-r border-zinc-200 bg-white p-5">
      <div>
        <h1 className="text-base font-semibold text-zinc-900">Swing Kingdom</h1>
        <p className="text-xs text-zinc-500">Configurator — test render</p>
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Colour scheme
          </h2>
          <p className="text-xs text-zinc-500">
            {selectedUid
              ? "Editing the selected Building"
              : "Default — select a Building to recolour just that one"}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <SchemePicker scheme={scheme} onChange={setScheme} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Buildings ({count})
        </h2>
        <div className="flex flex-col gap-2">
          {count > 0 && (
            <ul className="flex flex-col gap-1">
              {instances.map((inst, i) => (
                <li key={inst.uid}>
                  <button
                    type="button"
                    onClick={() =>
                      select(selectedUid === inst.uid ? null : inst.uid)
                    }
                    className={
                      "w-full rounded-md border px-3 py-1.5 text-left text-sm transition-colors " +
                      (selectedUid === inst.uid
                        ? "border-zinc-900 bg-zinc-900 text-zinc-50"
                        : "border-zinc-200 hover:bg-zinc-100")
                    }
                  >
                    {inst.part.label} #{i + 1}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <Button
            onClick={() => {
              addPart(BUILDING_PART_ID, [dropX, 0, 0], seedScheme);
              dropX = -dropX + (dropX > 0 ? -3 : 3);
            }}
          >
            Add Building
          </Button>
          <Button
            variant="outline"
            disabled={!selectedUid}
            onClick={() => selectedUid && removeInstance(selectedUid)}
          >
            Remove selected
          </Button>
        </div>
      </section>

      <div className="mt-auto">
        <Button variant="ghost" className="w-full" onClick={reset}>
          Reset scene
        </Button>
      </div>
    </aside>
  );
}
