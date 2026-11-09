const fs = require('fs');
const path = require('path');

function ensureDirectory(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
  return targetDir;
}

function getMediaRoot() {
  const configured = process.env.MEDIA_ROOT || './media';
  return path.resolve(__dirname, '..', configured);
}

function getDownloadsRoot() {
  const configured = process.env.DOWNLOADS_ROOT || './downloads';
  return path.resolve(__dirname, '..', configured);
}

function normalizeRelativePath(value) {
  return value.split(path.sep).join('/');
}

function toSafePath(value) {
  const normalized = normalizeRelativePath(value).replace(/^\/+/, '').replace(/^\.\.(?:\/|$)+/, '');
  return normalized.replace(/\/+/g, '/');
}

function buildFileMetadata(filePath, rootDir) {
  const stat = fs.statSync(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const relativePath = normalizeRelativePath(path.relative(rootDir, filePath));
  const safeRelativePath = toSafePath(relativePath);
  const baseName = path.basename(filePath, extension).replace(/[_-]+/g, ' ').trim();

  let mediaType = 'image';
  if (['.mp4', '.mkv', '.avi', '.mov', '.m4v', '.webm'].includes(extension)) mediaType = 'video';
  else if (['.mp3', '.m4a', '.wav', '.ogg', '.flac'].includes(extension)) mediaType = 'audio';

  const mimeTypeMap = {
    '.mp4': 'video/mp4',
    '.mkv': 'video/x-matroska',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.m4v': 'video/x-m4v',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.flac': 'audio/flac',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp'
  };

  return {
    title: baseName || path.basename(filePath),
    relative_path: safeRelativePath,
    absolute_path: filePath,
    media_type: mediaType,
    file_extension: extension.replace('.', '') || 'file',
    file_size: stat.size,
    last_modified: Math.floor(stat.mtimeMs),
    mimeType: mimeTypeMap[extension] || 'application/octet-stream',
    description: 'Local media item',
    genres: 'local',
    year: null,
    language: 'ar',
    metadata_source: 'local'
  };
}

module.exports = {
  ensureDirectory,
  getMediaRoot,
  getDownloadsRoot,
  normalizeRelativePath,
  toSafePath,
  buildFileMetadata
};
