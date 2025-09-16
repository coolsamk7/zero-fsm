import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8", // or "istanbul"
      reporter: ["text", "json", "html"], // multiple reporters
      reportsDirectory: "./coverage",
      all: true, // include untested files too
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["node_modules/", "tests/"],
    },
  },
});