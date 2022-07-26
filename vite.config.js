import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const commitHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString();
export default defineConfig({
  define: {
    COMMIT_HASH: JSON.stringify(commitHash),
  },
  plugins: [react()],
});
