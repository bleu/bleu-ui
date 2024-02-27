import { defineRollupSwcOption, swc } from "rollup-plugin-swc3";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import svgr from "@svgr/rollup";
import autoprefixer from "autoprefixer";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import tailwind from "tailwindcss";
import json from "@rollup/plugin-json";

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
      json(),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      svgr(),
      swc(
        defineRollupSwcOption({
          jsc: {
            experimental: {
              plugins: [
                [
                  "@lingui/swc-plugin",
                  {
                    // Optional
                    // Unlike the JS version this option must be passed as object only.
                    // Docs https://lingui.dev/ref/conf#runtimeconfigmodule
                    runtimeModules: {
                      i18n: ["@lingui/core", "i18n"],
                      trans: ["@lingui/react", "Trans"],
                    },
                  },
                ],
              ],
            },
          },
        })
      ),
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
