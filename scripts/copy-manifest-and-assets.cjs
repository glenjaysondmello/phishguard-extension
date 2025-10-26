// scripts/copy-manifest-and-assets.js
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const root = process.cwd();
const dist = path.join(root, 'dist');

async function copy() {
  // copy manifest.json
  await fse.copyFile(path.join(root, 'manifest.json'), path.join(dist, 'manifest.json'));
  // copy public to dist
  if (fs.existsSync(path.join(root, 'public'))) {
    await fse.copy(path.join(root, 'public'), path.join(dist, 'public'));
    // flatten public icons to dist/icons for manifest
    if (fs.existsSync(path.join(dist, 'public', 'icons'))) {
      await fse.ensureDir(path.join(dist, 'icons'));
      await fse.copy(path.join(dist, 'public', 'icons'), path.join(dist, 'icons'));
    }
  }
  console.log('manifest.json and public/ copied to dist/');
}
copy().catch(e => { console.error(e); process.exit(1); });
