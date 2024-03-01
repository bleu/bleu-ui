import { swc } from "rollup-plugin-swc3";
import resolve from "@rollup/plugin-node-resolve";
import svgr from "@svgr/rollup";
import autoprefixer from "autoprefixer";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import tailwind from "tailwindcss";
import json from "@rollup/plugin-json";

import { visualizer } from "rollup-plugin-visualizer";

import { dts } from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import pkg from "./package.json";

const peerDeps = Object.keys(pkg.peerDependencies);

const external = [...peerDeps, "class-variance-authority/types"];

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: "src/index.ts",
    inlineDynamicImports: true,
    output: {
      dir: "dist",
      format: "esm",
    },
    external,
    plugins: [
      json(),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      svgr(),
      swc({
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: true,
          },
        },
      }),
      postcss({
        extract: true,
        config: {
          path: "./postcss.config.js",
        },
        plugins: [
          autoprefixer(),
          tailwind({
            config: "./tailwind.config.js",
          }),
        ],
      }),
      visualizer(),
    ],
  },
  {
    input: "dist/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
