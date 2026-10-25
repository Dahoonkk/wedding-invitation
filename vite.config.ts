import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages용 base 경로 (저장소 이름으로 변경!)
  base: "/wedding-invitation/", // ← 본인 GitHub 저장소 이름으로 바꾸세요
});
