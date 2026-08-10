import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts', 'src/scripts/backfill.ts'],
  outDir: 'dist',
  format: ['esm'],
  clean: true,
  sourcemap: true,
  // Mantém apenas os pacotes declarados no package.json como externos
  external: [/^@prisma\/.*/, 'dotenv'],
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
});
