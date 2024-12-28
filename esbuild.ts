import { build, BuildOptions } from 'esbuild'
import { peerDependencies } from './package.json'

const options: BuildOptions = {
  entryPoints: ['src/index.ts'],
  external: Object.keys(peerDependencies),

  treeShaking: true,
  bundle: true,

  logLevel: 'info',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx'
  }
}

// Build CJS
await build({
  ...options,
  format: 'cjs',
  outdir: 'dist/cjs'
}).catch(e => {
  console.error(e)
  process.exit(1)
})

// Build ESM
await build({
  ...options,
  format: 'esm',
  outdir: 'dist/esm',
  target: ['esnext']
}).catch(e => {
  console.error(e)
  process.exit(1)
})

process.exit()