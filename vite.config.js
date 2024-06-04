import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";

// https://vitejs.dev/config/
const commitHash = execSync("git rev-parse --short HEAD").toString();

export default defineConfig({
  define: {
    COMMIT_HASH: JSON.stringify(commitHash),
  },
  plugins: [react()],
});