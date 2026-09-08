"use client";

import { create } from "zustand";
import {
  INSTANCE_SPACING_UNITS,
  createDefaultConfig,
  makeInstance,
  nextInstancePosition,
  type ColorScheme,
  type PlaygroundConfig,
  type Vec3,
} from "@brain";

const HISTORY_LIMIT = 50;

export interface EditingSocket {
  uid: string;
  socketId: string;
}

export interface ConfiguratorState {
  config: PlaygroundConfig;
  selectedUid: string | null;
  editingSocket: EditingSocket | null;
  past: PlaygroundConfig[];
  future: PlaygroundConfig[];

  setScheme: (scheme: Partial<ColorScheme>) => void;
  setDefaultScheme: (scheme: Partial<ColorScheme>) => void;
  addPart: (partId: string, scheme?: Partial<ColorScheme>) => string;
  removeInstance: (uid: string) => void;
  moveInstance: (uid: string, position: Vec3) => void;
  rotateInstance: (uid: string, rotationY: number) => void;
  setOverride: (uid: string, slot: string, color: string) => void;
  setSocketPart: (uid: string, socketId: string, partId: string) => void;
  editSocket: (target: EditingSocket | null) => void;
  select: (uid: string | null) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  load: (config: PlaygroundConfig) => void;
}

function commit(
  state: ConfiguratorState,
  next: PlaygroundConfig,
  extra: Partial<ConfiguratorState> = {},
): Partial<ConfiguratorState> {
  const past = [...state.past, state.config].slice(-HISTORY_LIMIT);
  return { config: next, past, future: [], ...extra };
}

export const useConfigurator = create<ConfiguratorState>((set) => ({
  config: createDefaultConfig(),
  selectedUid: null,
  editingSocket: null,
  past: [],
  future: [],

  setScheme: (patch) =>
    set((s) => {
      if (!s.selectedUid) {
        return commit(s, {
          ...s.config,
          scheme: { ...s.config.scheme, ...patch },
        });
      }
      return commit(s, {
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
      commit(s, { ...s.config, scheme: { ...s.config.scheme, ...patch } }),
    ),

  addPart: (partId, scheme) => {
    const inst = makeInstance(
      partId,
      nextInstancePosition(useConfigurator.getState().config, INSTANCE_SPACING_UNITS),
    );
    if (scheme) inst.scheme = { ...scheme };
    set((s) =>
      commit(s, { ...s.config, instances: [...s.config.instances, inst] }),
    );
    return inst.uid;
  },

  removeInstance: (uid) =>
    set((s) =>
      commit(
        s,
        {
          ...s.config,
          instances: s.config.instances.filter((i) => i.uid !== uid),
        },
        { selectedUid: s.selectedUid === uid ? null : s.selectedUid },
      ),
    ),

  moveInstance: (uid, position) =>
    set((s) =>
      commit(s, {
        ...s.config,
        instances: s.config.instances.map((i) =>
          i.uid === uid ? { ...i, position } : i,
        ),
      }),
    ),

  rotateInstance: (uid, rotationY) =>
    set((s) =>
      commit(s, {
        ...s.config,
        instances: s.config.instances.map((i) =>
          i.uid === uid ? { ...i, rotationY } : i,
        ),
      }),
    ),

  setOverride: (uid, slot, color) =>
    set((s) =>
      commit(s, {
        ...s.config,
        instances: s.config.instances.map((i) =>
          i.uid === uid
            ? { ...i, overrides: { ...i.overrides, [slot]: color } }
            : i,
        ),
      }),
    ),

  setSocketPart: (uid, socketId, partId) =>
    set((s) =>
      commit(
        s,
        {
          ...s.config,
          instances: s.config.instances.map((i) =>
            i.uid === uid
              ? { ...i, sockets: { ...i.sockets, [socketId]: partId } }
              : i,
          ),
        },
        { editingSocket: null },
      ),
    ),

  editSocket: (target) => set({ editingSocket: target }),

  select: (uid) => set({ selectedUid: uid, editingSocket: null }),

  undo: () =>
    set((s) => {
      if (s.past.length === 0) return s;
      const previous = s.past[s.past.length - 1];
      return {
        config: previous,
        past: s.past.slice(0, -1),
        future: [s.config, ...s.future].slice(0, HISTORY_LIMIT),
        selectedUid: null,
        editingSocket: null,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      return {
        config: next,
        past: [...s.past, s.config].slice(-HISTORY_LIMIT),
        future: s.future.slice(1),
        selectedUid: null,
        editingSocket: null,
      };
    }),

  reset: () =>
    set({
      config: createDefaultConfig(),
      selectedUid: null,
      editingSocket: null,
      past: [],
      future: [],
    }),

  load: (config) =>
    set({
      config,
      selectedUid: null,
      editingSocket: null,
      past: [],
      future: [],
    }),
}));

export const getConfiguratorSnapshot = () => useConfigurator.getState();

export const selectConfig = (s: ConfiguratorState) => s.config;

export const selectDefaultScheme = (s: ConfiguratorState) => s.config.scheme;

export const selectSelectedInstanceScheme = (
  s: ConfiguratorState,
): Partial<ColorScheme> | undefined => {
  if (!s.selectedUid) return undefined;
  return s.config.instances.find((i) => i.uid === s.selectedUid)?.scheme;
};

export const selectCanUndo = (s: ConfiguratorState) => s.past.length > 0;

export const selectCanRedo = (s: ConfiguratorState) => s.future.length > 0;

export const selectEditingSocket = (s: ConfiguratorState) => s.editingSocket;
