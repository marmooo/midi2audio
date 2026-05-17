import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

await esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "esm",
  external: [
    "https://cdn.jsdelivr.net/npm/mediabunny@1.45.2/+esm",
    "https://cdn.jsdelivr.net/npm/@mediabunny/mp3-encoder@1.45.2/+esm",
    "https://cdn.jsdelivr.net/npm/@mediabunny/aac-encoder@1.45.2/+esm",
    "https://cdn.jsdelivr.net/npm/@mediabunny/flac-encoder@1.45.2/+esm",
    "https://cdn.jsdelivr.net/gh/marmooo/midy@0.5.1/dist/midy.min.js",
  ],
  outfile: "docs/index.js",
  plugins: [...denoPlugins()],
});
