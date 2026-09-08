"use client";

import { useMemo } from "react";
import { resolveScene, type ResolvedScene } from "@brain";
import { selectConfig, useConfigurator } from "../useConfigurator";

export function useResolvedScene(): ResolvedScene {
  const config = useConfigurator(selectConfig);
  return useMemo(() => resolveScene(config), [config]);
}
