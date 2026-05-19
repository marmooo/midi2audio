import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

const urls = [
  "https://cdn.jsdelivr.net/npm/mediabunny@1.45.2/+esm",
  "https://cdn.jsdelivr.net/npm/@mediabunny/mp3-encoder@1.45.2/+esm",
  "https://cdn.jsdelivr.net/npm/@mediabunny/aac-encoder@1.45.2/+esm",
  "https://cdn.jsdelivr.net/npm/@mediabunny/flac-encoder@1.45.2/+esm",
  // "https://cdn.jsdelivr.net/gh/marmooo/midy@0.5.2/dist/midy.min.js",
];
const result = await esbuild.build({
  entryPoints: ["src/index.js"],
  bundle: true,
  format: "esm",
  metafile: true,
  external: urls,
  outfile: "docs/index.js",
  plugins: [...denoPlugins()],
});

if (Deno.args[0] === "--debug") {
  console.log(JSON.stringify(result.metafile, null, 2));
  console.log(await esbuild.analyzeMetafile(result.metafile));
  for (const url of urls) {
    const res = await fetch(url);
    const text = await res.text();
    const bytes = new TextEncoder().encode(text).length;
    console.log(`${(bytes / 1024).toFixed(1)} KB`, url);
  }
}
