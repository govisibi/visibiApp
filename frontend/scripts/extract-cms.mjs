import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isCmsSource, transformCmsSource } from './cms-transform.mjs'

const frontendRoot = fileURLToPath(new URL('..', import.meta.url))
const sourceRoot = join(frontendRoot, 'src')
const manifestPath = fileURLToPath(
  new URL('../../wordpress-cms/visibi-content/content-manifest.json', import.meta.url),
)

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await filesUnder(path))
    else if (isCmsSource(path)) files.push(path)
  }
  return files
}

const fields = new Map()
for (const file of await filesUnder(sourceRoot)) {
  const source = await readFile(file, 'utf8')
  for (const field of transformCmsSource(source, file).fields) {
    fields.set(field.key, field)
  }
}
const manifest = [...fields.values()].sort((a, b) =>
  a.file.localeCompare(b.file) || a.kind.localeCompare(b.kind) ||
  a.default.localeCompare(b.default),
)
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Extracted ${manifest.length} editable fields from ${relative(frontendRoot, sourceRoot)}.`)