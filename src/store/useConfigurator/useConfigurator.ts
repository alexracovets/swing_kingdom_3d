"use client";

import { create } from "zustand";
import {
  createDefaultConfig,
  makeInstance,
  resolveScene,
  type ColorScheme,
  type PlaygroundConfig,
  type ResolvedScene,
  type Vec3,
} from "@brain";

export interface ConfiguratorState {
  config: PlaygroundConfig;
  scene: ResolvedScene;
  selectedUid: string | null;

  setScheme: (scheme: Partial<ColorScheme>) => void;
  setDefaultScheme: (scheme: Partial<ColorScheme>) => void;
  addPart: (
    partId: string,
    position?: Vec3,
    scheme?: Partial<ColorScheme>,
  ) => string;
  removeInstance: (uid: string) => void;
  moveInstance: (uid: string, position: Vec3) => void;
  rotateInstance: (uid: string, rotationY: number) => void;
  setOverride: (uid: string, slot: string, color: string) => void;
  select: (uid: string | null) => void;
  reset: () => void;
  load: (config: PlaygroundConfig) => void;
}

function recompute(config: PlaygroundConfig) {
  return { config, scene: resolveScene(config) };
}

export const useConfigurator = create<ConfiguratorState>((set) => {
  const initial = createDefaultConfig();

  return {
    config: initial,
    scene: resolveScene(initial),
    selectedUid: null,

    setScheme: (patch) =>
      set((s) => {
        if (!s.selectedUid) {
          return recompute({
            ...s.config,
            scheme: { ...s.config.scheme, ...patch },
          });
        }
        return recompute({
          ...s.config,
          instances: s.config.instances.map((i) =>
            i.uid === s.selectedUid
              ? { ...i, scheme: { ...i.scheme, ...patch } }
              : i,
          ),
        });
      }),

    setDefaultScheme: (patch) =>
      set((s) =>
        recompute({ ...s.config, scheme: { ...s.config.scheme, ...patch } }),
      ),

    addPart: (partId, position = [0, 0, 0], scheme) => {
      const inst = makeInstance(partId, position);
      if (scheme) inst.scheme = { ...scheme };
      set((s) =>
        recompute({ ...s.config, instances: [...s.config.instances, inst] }),
      );
      return inst.uid;
    },

    removeInstance: (uid) =>
      set((s) => {
        const next = recompute({
          ...s.config,
          instances: s.config.instances.filter((i) => i.uid !== uid),
        });
        return {
          ...next,
          selectedUid: s.selectedUid === uid ? null : s.selectedUid,
        };
      }),

    moveInstance: (uid, position) =>
      set((s) =>
        recompute({
          ...s.config,
          instances: s.config.instances.map((i) =>
            i.uid === uid ? { ...i, position } : i,
          ),
        }),
      ),

    rotateInstance: (uid, rotationY) =>
      set((s) =>
        recompute({
          ...s.config,
          instances: s.config.instances.map((i) =>
            i.uid === uid ? { ...i, rotationY } : i,
          ),
        }),
      ),

    setOverride: (uid, slot, color) =>
      set((s) =>
        recompute({
          ...s.config,
          instances: s.config.instances.map((i) =>
            i.uid === uid
              ? { ...i, overrides: { ...i.overrides, [slot]: color } }
              : i,
          ),
        }),
      ),

    select: (uid) => set({ selectedUid: uid }),

    reset: () => set({ ...recompute(createDefaultConfig()), selectedUid: null }),

    load: (config) => set({ ...recompute(config), selectedUid: null }),
  };
});

export const getConfiguratorSnapshot = () => useConfigurator.getState();

export const selectDefaultScheme = (s: ConfiguratorState) => s.config.scheme;

export const selectSelectedInstanceScheme = (
  s: ConfiguratorState,
): Partial<ColorScheme> | undefined => {
  if (!s.selectedUid) return undefined;
  return s.config.instances.find((i) => i.uid === s.selectedUid)?.scheme;
};
