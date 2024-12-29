import { existsSync, globSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { build, BuildOptions } from 'esbuild'

// Generate index.ts
(function genIndexFile(dir: string) {
  const contents: string[] = []

  for (const path of readdirSync(dir)) {
    const fullPath = join(dir, path)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      if (!existsSync(join(fullPath, 'index.ts'))) {
        genIndexFile(fullPath)
      }

      contents.push(`export * from './${path}';`)
    } else if (stat.isFile() && path !== 'index.ts' && /\.tsx?$/.test(path)) {
      const suffix = (path.endsWith('.tsx')) ? '.tsx' : '.ts'
      contents.push(`export * from './${basename(path, suffix)}';`)
    }
  }

  if (contents.length > 0) {
    const target = join(dir, 'index.ts')
    writeFileSync(target, contents.join('\n'), 'utf-8')
    console.log(`Generated index file: ${target}`)
  }
})(resolve(import.meta.dirname, 'src'))

const options: BuildOptions = {
  entryPoints: globSync('src/**/*.{ts,tsx}'),
  // external: Object.keys(peerDependencies),

  treeShaking: true,
  bundle: false,

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