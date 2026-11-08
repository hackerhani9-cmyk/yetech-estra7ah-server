const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const { buildFileMetadata, normalizeRelativePath } = require('./utils');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'media.db');
const dbDir = path.dirname(dbPath);

fs.mkdirSync(dbDir, { recursive: true });
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS media_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    relative_path TEXT UNIQUE NOT NULL,
    absolute_path TEXT,
    media_type TEXT,
    file_extension TEXT,
    file_size INTEGER,
    last_modified INTEGER,
    mime_type TEXT,
    description TEXT,
    genres TEXT,
    year INTEGER,
    language TEXT,
    metadata_source TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    source_url TEXT,
    status TEXT DEFAULT 'queued',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

function upsertMedia(filePath, rootDir) {
  const metadata = buildFileMetadata(filePath, rootDir);
  const stmt = db.prepare(`
    INSERT INTO media_items (
      title, relative_path, absolute_path, media_type, file_extension,
      file_size, last_modified, mime_type, description, genres, year,
      language, metadata_source, updated_at
    ) VALUES (
      @title, @relative_path, @absolute_path, @media_type, @file_extension,
      @file_size, @last_modified, @mime_type, @description, @genres, @year,
      @language, @metadata_source, @updated_at
    )
    ON CONFLICT(relative_path) DO UPDATE SET
      title = excluded.title,
      absolute_path = excluded.absolute_path,
      media_type = excluded.media_type,
      file_extension = excluded.file_extension,
      file_size = excluded.file_size,
      last_modified = excluded.last_modified,
      mime_type = excluded.mime_type,
      description = excluded.description,
      genres = excluded.genres,
      year = excluded.year,
      language = excluded.language,
      metadata_source = excluded.metadata_source,
      updated_at = excluded.updated_at
  `);

  stmt.run({
    title: metadata.title,
    relative_path: metadata.relative_path,
    absolute_path: filePath,
    media_type: metadata.media_type,
    file_extension: metadata.file_extension,
    file_size: metadata.file_size,
    last_modified: metadata.last_modified,
    mime_type: metadata.mime_type,
    description: metadata.description,
    genres: metadata.genres,
    year: metadata.year,
    language: metadata.language,
    metadata_source: metadata.metadata_source,
    updated_at: new Date().toISOString()
  });

  return metadata;
}

function getLibrary() {
  return db.prepare('SELECT * FROM media_items ORDER BY updated_at DESC').all();
}

function getMediaById(id) {
  return db.prepare('SELECT * FROM media_items WHERE id = ?').get(id);
}

function getStats() {
  const total = db.prepare('SELECT COUNT(*) AS count FROM media_items').get();
  const videos = db.prepare("SELECT COUNT(*) AS count FROM media_items WHERE media_type = 'video'").get();
  const audio = db.prepare("SELECT COUNT(*) AS count FROM media_items WHERE media_type = 'audio'").get();
  const images = db.prepare("SELECT COUNT(*) AS count FROM media_items WHERE media_type = 'image'").get();

  return {
    total: total.count,
    videos: videos.count,
    audio: audio.count,
    images: images.count
  };
}

function saveDownload(filename, sourceUrl = '') {
  const stmt = db.prepare('INSERT INTO downloads (filename, source_url, status, created_at) VALUES (?, ?, ?, ?)');
  stmt.run(filename, sourceUrl, 'queued', new Date().toISOString());
}

module.exports = {
  db,
  upsertMedia,
  getLibrary,
  getMediaById,
  getStats,
  saveDownload
};
