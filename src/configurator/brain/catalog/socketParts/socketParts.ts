import type { CatalogPart } from "../../model/types";

// Socket parts come from the backend. Nothing is hardcoded here.
export const SOCKET_PARTS_4X4: CatalogPart[] = [];

// No client-side default: an empty socket stays empty until a part is chosen.
export const DEFAULT_SOCKET_PART: Record<string, string> = {};
