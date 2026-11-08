const fs = require('fs');
const path = require('path');
const { upsertMedia } = require('./db');
const { toSafePath } = require('./utils');

const supportedExtensions = new Set([
  '.mp4', '.mkv', '.avi', '.mov', '.m4v', '.mp3', '.m4a', '.wav', '.flac',
  '.jpg', '.jpeg', '.png', '.webp', '.srt', '.ass'
]);

function scanLibrary(rootDir) {
  const root = path.resolve(rootDir);
  const results = [];

  if (!fs.existsSync(root)) {
    return { scanned: 0, root, items: [] };
  }

  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.')) continue;
        walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!supportedExtensions.has(ext)) continue;

      const relativePath = toSafePath(path.relative(root, fullPath));
      const metadata = upsertMedia(fullPath, root);
      results.push({ ...metadata, relative_path: relativePath });
    }
  };

  walk(root);
  return { scanned: results.length, root, items: results };
}

function scanDownloads(rootDir) {
  const root = path.resolve(rootDir);
  const results = [];

  if (!fs.existsSync(root)) {
    return { scanned: 0, root, items: [] };
  }

  const files = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of files) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!supportedExtensions.has(ext)) continue;

    const fullPath = path.join(root, entry.name);
    const metadata = upsertMedia(fullPath, root);
    results.push({ ...metadata, relative_path: toSafePath(path.relative(root, fullPath)) });
  }

  return { scanned: results.length, root, items: results };
}

module.exports = {
  scanLibrary,
  scanDownloads
};
