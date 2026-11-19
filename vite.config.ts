import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-salee-runtime',
      closeBundle() {
        const rootDir = process.cwd();
        const runtimeSrc = path.join(rootDir, 'src', 'runtime');
        const runtimeDest = path.join(rootDir, 'dist', 'src', 'runtime');
        if (fs.existsSync(runtimeSrc)) {
          fs.mkdirSync(runtimeDest, { recursive: true });
          for (const file of fs.readdirSync(runtimeSrc)) {
            fs.copyFileSync(path.join(runtimeSrc, file), path.join(runtimeDest, file));
          }
        }
      },
    },
  ],
  server: {
    port: 5173,
    open: true,
  },
});
