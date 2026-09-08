import type { ResolvedMaterial, Vec3 } from "@brain";

export const SCENE_BACKGROUND = "#eef1f4";

export const FOG_NEAR = 30;
export const FOG_FAR = 70;

export const CAMERA_POSITION: Vec3 = [6, 4.5, 7.5];
export const CAMERA_FOV = 45;
export const CAMERA_NEAR = 0.5;
export const CAMERA_FAR = 100;

export const ORBIT_MIN_DISTANCE = 3;
export const ORBIT_MAX_DISTANCE = 26;
export const ORBIT_MIN_POLAR = 0.15;
export const ORBIT_MAX_POLAR = Math.PI / 2.05;

export const GRID_CELL_SIZE = 1;
export const GRID_SECTION_SIZE = 5;
export const GRID_FADE_DISTANCE = 38;
export const GRID_CELL_COLOR = "#c6ccd2";
export const GRID_SECTION_COLOR = "#9aa4ad";

export const SHADOW_MAP_SIZE = 2048;
export const SHADOW_CAMERA_NEAR = 1;
export const SHADOW_CAMERA_FAR = 40;
export const SHADOW_CAMERA_EXTENT = 12;
export const SHADOW_RADIUS = 4;
export const SHADOW_BLUR_SAMPLES = 16;
export const SHADOW_BIAS = -0.0005;

export const SELECTION_COLOR = "#26c6da";
export const SELECTION_PADDING = 1.04;

export const SOCKET_GIZMO_RADIUS = 0.12;
export const SOCKET_GIZMO_COLOR = "#f5a623";
export const SOCKET_GIZMO_COLOR_ACTIVE = "#26c6da";
export const SOCKET_GIZMO_HOVER_SCALE = 1.35;
export const SOCKET_GIZMO_OFFSET_OUT = 0.55;
export const SOCKET_GIZMO_OFFSET_UP = 0.7;

export const MATERIAL_ROUGHNESS = 0.72;
export const MATERIAL_METALNESS = 0.05;

export const POLYGON_OFFSET_FACTOR = 1;
export const POLYGON_OFFSET_UNITS = 1;

export const PUSH_BACK_SOURCES = new Set<ResolvedMaterial["source"]>([
  "vinyl-main",
  "accent",
  "accent-fallback",
  "tertiary",
  "tertiary-fallback",
]);
