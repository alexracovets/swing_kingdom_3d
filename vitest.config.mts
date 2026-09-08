import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": r("./src"),
      "@configurator": r("./src/configurator"),
      "@brain": r("./src/configurator/brain"),
      "@eyes": r("./src/configurator/eyes"),
      "@ui": r("./src/ui/components/atomic"),
      "@atoms": r("./src/ui/components/atomic/atoms"),
      "@molecules": r("./src/ui/components/atomic/molecules"),
      "@organisms": r("./src/ui/components/atomic/organisms"),
      "@templates": r("./src/ui/components/atomic/templates"),
      "@shared": r("./src/ui/components/shared"),
      "@store": r("./src/store"),
      "@hooks": r("./src/hooks"),
      "@lib": r("./src/lib"),
      "@types": r("./src/types"),
    },
  },
});
