import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");
const siteDir = resolve(root, "site");

if (!existsSync(distDir)) {
  throw new Error("Missing dist directory. Run `npm run build` first.");
}

// site/ is tracked in git. Refuse to sync a build that carries the reviewer
// preview password, which would otherwise be committed to the repository.
const previewPasswordFile = resolve(root, ".env.preview.local");

if (existsSync(previewPasswordFile)) {
  const match = readFileSync(previewPasswordFile, "utf8").match(
    /^\s*VITE_PREVIEW_PASSWORD\s*=\s*(.+?)\s*$/m
  );
  const secret = match?.[1];

  if (secret) {
    const walk = (dir) =>
      readdirSync(dir).flatMap((entry) => {
        const full = join(dir, entry);
        return statSync(full).isDirectory() ? walk(full) : [full];
      });

    const leaked = walk(distDir).filter((file) => {
      try {
        return readFileSync(file, "utf8").includes(secret);
      } catch {
        return false;
      }
    });

    if (leaked.length > 0) {
      throw new Error(
        `Refusing to sync: the reviewer preview password appears in ${leaked.length} built file(s), ` +
          `and site/ is tracked in git.\n  ${leaked.join("\n  ")}\n` +
          "Rebuild with `npm run build` (not `build:preview`) before syncing."
      );
    }
  }
}

rmSync(siteDir, { recursive: true, force: true });
mkdirSync(siteDir, { recursive: true });
cpSync(distDir, siteDir, { recursive: true });

console.log("Synced dist/ to site/");
