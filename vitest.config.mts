import { defineConfig as viteDefineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { defineConfig, mergeConfig } from "vitest/config";
import path from "path";

export default mergeConfig(
  viteDefineConfig({ plugins: [react()] }),
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./tests/setup.ts",
      passWithNoTests: true,
    },
    resolve: {
      alias: {
        "#": path.resolve(__dirname, "./src"),
        tests: path.resolve(__dirname, "./tests"),
      },
    },
  })
);
