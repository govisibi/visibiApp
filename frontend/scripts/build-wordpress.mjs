import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const viteCli = resolve(frontendRoot, 'node_modules/vite/bin/vite.js')
const themeDist = resolve(frontendRoot, '../wordpress-cms/visibi-react-theme/dist')
const result = spawnSync(process.execPath, [
  viteCli, 'build', '--outDir', themeDist, '--emptyOutDir',
], {
  cwd: frontendRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_WORDPRESS_THEME: '1',
    VITE_WORDPRESS_URL: 'same-origin',
    VITE_BASE_PATH: '/wp-content/themes/visibi-react/dist/',
  },
})
process.exit(result.status ?? 1)
