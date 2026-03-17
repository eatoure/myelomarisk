import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");
const siteDir = resolve(root, "site");

if (!existsSync(distDir)) {
  throw new Error("Missing dist directory. Run `npm run build` first.");
}

rmSync(siteDir, { recursive: true, force: true });
mkdirSync(siteDir, { recursive: true });
cpSync(distDir, siteDir, { recursive: true });

console.log("Synced dist/ to site/");
