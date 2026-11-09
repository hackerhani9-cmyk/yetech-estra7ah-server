const fs = require('fs');
const path = require('path');
const { upsertMedia, saveDownload } = require('./db');
const { ensureDirectory, toSafePath } = require('./utils');

const supportedExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.m4v', '.webm', '.mp3', '.m4a', '.wav', '.ogg', '.flac', '.jpg', '.jpeg', '.png', '.webp'];

function scanDirectory(rootDir) {
  const root = path.resolve(rootDir);
  ensureDirectory(root);

  const imported = [];
  const walk = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;

      const ext = path.extname(entry.name).toLowerCase();
      if (!supportedExtensions.includes(ext)) continue;

      const relativePath = path.relative(root, fullPath);
      saveDownload(entry.name, 'local://media');
      const metadata = upsertMedia(fullPath, root);
      imported.push({
        filename: entry.name,
        metadata,
        relative_path: toSafePath(relativePath)
      });
    }
  };

  walk(root);
  return { root, scanned: imported.length, imported };
}

function scanLibrary(rootDir) {
  return scanDirectory(rootDir);
}

function scanDownloads(rootDir) {
  const root = path.resolve(rootDir);
  ensureDirectory(root);

  const downloads = [];
  for (const file of fs.readdirSync(root, { withFileTypes: true })) {
    if (!file.isFile()) continue;
    const extension = path.extname(file.name).toLowerCase();
    if (!supportedExtensions.includes(extension)) continue;

    const relativePath = toSafePath(path.relative(root, path.join(root, file.name)));
    downloads.push({
      filename: file.name,
      relative_path: relativePath,
      source: 'downloads'
    });
  }

  return { root, scanned: downloads.length, items: downloads };
}

module.exports = { scanLibrary, scanDownloads };
