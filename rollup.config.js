import { defineRollupSwcOption, swc } from "rollup-plugin-swc3";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import svgr from "@svgr/rollup";
import autoprefixer from "autoprefixer";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import tailwind from "tailwindcss";

const packageJson = require("./package.json");

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
      },
      {
        file: packageJson.module,
        format: "esm",
      },
    ],
    external: ["react", "react-dom", "react-router-dom"],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      svgr(),
      swc(defineRollupSwcOption({})),
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
      terser({
        compress: true,
        mangle: true,
        output: {
          preamble: "/* eslint-disable */",
          comments: false,
        },
      }),
    ],
  },
];
