const fs = require('fs');
const path = require('path');
const { saveDownload, upsertMedia } = require('./db');
const { toSafePath } = require('./utils');

function watchDownloads(rootDir) {
  const root = path.resolve(rootDir);
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  const files = fs.readdirSync(root, { withFileTypes: true });
  const imported = [];

  for (const entry of files) {
    if (!entry.isFile()) continue;
    const fullPath = path.join(root, entry.name);
    const ext = path.extname(entry.name).toLowerCase();
    const supported = ['.mp4', '.mkv', '.avi', '.mov', '.m4v', '.mp3', '.m4a', '.wav', '.jpg', '.jpeg', '.png', '.webp'];

    if (!supported.includes(ext)) continue;

    saveDownload(entry.name, 'local://downloads');
    const metadata = upsertMedia(fullPath, root);
    imported.push({ filename: entry.name, metadata, relative_path: toSafePath(path.relative(root, fullPath)) });
  }

  return { root, imported, scanned: imported.length };
}

module.exports = {
  watchDownloads
};
