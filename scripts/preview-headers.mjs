/**
 * Writes a _headers file into the build output marking the whole site
 * noindex/nofollow.
 *
 * This runs only as part of `npm run build:preview`. It cannot live in
 * netlify.toml: headers there are global and are NOT evaluated per deploy
 * context, so a [[context.branch-deploy.headers]] block is silently ignored
 * and a plain [[headers]] block would deindex production too.
 */
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");

if (!existsSync(distDir)) {
  throw new Error("Missing dist directory. Run the build first.");
}

writeFileSync(
  resolve(distDir, "_headers"),
  ["/*", "  X-Robots-Tag: noindex, nofollow", ""].join("\n")
);

console.log("Wrote dist/_headers (noindex) for the reviewer preview build");
