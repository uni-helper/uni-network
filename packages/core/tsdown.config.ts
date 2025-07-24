import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "tsdown";

export default defineConfig({
  dts: true,
  entry: ["./src/index.ts", "./src/composables.ts"],
  format: ["esm", "cjs"],
  target: "es2017",
  hooks: {
    "build:done": async (ctx) => {
      appendFileSync(
        resolve(ctx.options.outDir, "index.cjs"),
        "\nmodule.exports = Object.assign(exports.default || {}, exports);",
      );
    },
  },
});
