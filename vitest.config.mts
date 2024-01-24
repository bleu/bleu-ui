import { defineConfig as viteDefineConfig } from "vite";
import react from "@vitejs/plugin-react";

import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
  viteDefineConfig({ plugins: [react()] }),
  defineConfig({
    test: {
      environment: "jsdom",
      setupFiles: "./tests/setup.js",
      passWithNoTests: true,
    },
  })
);
