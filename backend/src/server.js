const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const { getLibrary, getMediaById, getStats } = require('./db');
const { scanLibrary, scanDownloads } = require('./mediaScanner');
const { ensureDirectory, getMediaRoot, getDownloadsRoot } = require('./utils');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '0.0.0.0';
const mediaRoot = getMediaRoot();
const downloadsRoot = getDownloadsRoot();

ensureDirectory(mediaRoot);
ensureDirectory(downloadsRoot);
ensureDirectory(path.dirname(process.env.DB_PATH || path.join(__dirname, '..', 'data', 'media.db')));

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.use('/api/media', express.static(mediaRoot));
app.use('/api/downloads', express.static(downloadsRoot));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'yetech-estra7ah-server',
    mode: 'offline-local',
    mediaRoot,
    downloadsRoot,
    dbPath: process.env.DB_PATH || path.join(__dirname, '..', 'data', 'media.db'),
    time: new Date().toISOString()
  });
});

app.get('/api/library', (req, res) => {
  res.json(getLibrary());
});

app.get('/api/stats', (req, res) => {
  res.json(getStats());
});

app.get('/api/media/:id', (req, res) => {
  const item = getMediaById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Media item not found' });
  const filePath = path.join(mediaRoot, item.relative_path);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on disk' });

  res.sendFile(filePath, { headers: { 'Content-Type': item.mime_type || item.mimeType || 'application/octet-stream' } });
});

app.get('/api/stream/:id', (req, res) => {
  const item = getMediaById(Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Media item not found' });

  const filePath = item.absolute_path || path.join(mediaRoot, item.relative_path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const stat = fs.statSync(filePath);
  const range = req.headers.range;
  if (!range) {
    res.writeHead(200, {
      'Content-Type': item.mime_type || item.mimeType || 'application/octet-stream',
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes'
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, '').split('-');
  const start = Number(parts[0]);
  const end = parts[1] ? Number(parts[1]) : stat.size - 1;
  const chunkSize = end - start + 1;
  const stream = fs.createReadStream(filePath, { start, end });

  res.writeHead(206, {
    'Content-Type': item.mime_type || item.mimeType || 'application/octet-stream',
    'Content-Length': chunkSize,
    'Content-Range': `bytes ${start}-${end}/${stat.size}`,
    'Accept-Ranges': 'bytes'
  });

  stream.pipe(res);
});

app.post('/api/scan', (req, res) => {
  const result = scanLibrary(mediaRoot);
  res.json(result);
});

app.get('/api/downloads', (req, res) => {
  res.json(scanDownloads(downloadsRoot));
});

app.post('/api/downloads/watch', (req, res) => {
  const result = scanDownloads(downloadsRoot);
  res.json(result);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is responsive', mediaRoot, downloadsRoot });
});

scanLibrary(mediaRoot);
scanDownloads(downloadsRoot);

setInterval(() => {
  scanDownloads(downloadsRoot);
}, 15000);

app.listen(port, host, () => {
  console.log(`YeTech Estra7ah backend listening on http://${host}:${port}`);
});

module.exports = app;
