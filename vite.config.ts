import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // The reviewer-preview password lives in .env.preview.local (gitignored).
  // It is injected only for local development and for `npm run build:preview`,
  // so a normal production build — including `build:site`, which writes into
  // the tracked site/ folder — never contains it.
  const allowPreview = mode === "development" || mode === "preview";
  const previewEnv = allowPreview
    ? loadEnv("preview", process.cwd(), "VITE_PREVIEW_")
    : {};

  return {
    base: mode === "development" ? "/" : "./",
    define: {
      "import.meta.env.VITE_PREVIEW_PASSWORD": JSON.stringify(
        previewEnv.VITE_PREVIEW_PASSWORD ?? process.env.VITE_PREVIEW_PASSWORD ?? ""
      ),
    },
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
