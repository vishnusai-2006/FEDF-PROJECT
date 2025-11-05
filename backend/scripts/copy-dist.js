const fs = require('fs')
const path = require('path')

const src = path.join(__dirname, '..', '..', 'frontend', 'dist')
const dest = path.join(__dirname, '..', 'public')

async function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.log('[copy-dist] source does not exist:', srcDir)
    return
  }

  await fs.promises.rm(destDir, { recursive: true, force: true })
  await fs.promises.mkdir(destDir, { recursive: true })

  const entries = await fs.promises.readdir(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name)
    const destPath = path.join(destDir, entry.name)
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.promises.copyFile(srcPath, destPath)
    }
  }
}

copyDir(src, dest).then(() => {
  console.log('[copy-dist] finished copying frontend/dist -> backend/public')
}).catch(err => {
  console.error('[copy-dist] error', err)
  process.exit(2)
})
