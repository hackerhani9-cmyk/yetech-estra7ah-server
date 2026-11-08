* {
  box-sizing: border-box;
}

:root {
  font-family: 'Tahoma', 'Segoe UI', sans-serif;
  color: #f5f7fb;
  background: #0d1117;
  line-height: 1.5;
  font-weight: 400;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  background: linear-gradient(180deg, #0b1220 0%, #111827 100%);
}

body {
  min-height: 100vh;
}

button, input {
  font: inherit;
}

.rtl {
  direction: rtl;
}

.app-shell {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #8bb4ff;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1, h2, h3, p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(1.8rem, 3vw, 3rem);
}

.primary {
  border: none;
  outline: none;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border-radius: 12px;
  padding: 12px 18px;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.35);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(17, 24, 39, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-card span {
  color: #adc2ff;
}

.stat-card strong {
  font-size: 2rem;
}

.toolbar {
  margin-bottom: 20px;
}

.toolbar input {
  width: min(500px, 100%);
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.85);
  color: white;
}

.content-grid {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 20px;
}

.library-panel,
.player-panel {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 18px;
}

.library-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.media-card {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.66);
  border-radius: 14px;
  color: white;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  cursor: pointer;
  text-align: right;
}

.media-card.active {
  border-color: rgba(96, 165, 250, 0.7);
  box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.5);
}

.thumb {
  width: 52px;
  min-width: 52px;
  height: 52px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #1d4ed8, #7c3aed);
  font-size: 1.4rem;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.meta strong,
.meta small,
.meta span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta span {
  color: #93c5fd;
}

.player-panel {
  min-height: 640px;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.badge {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(96, 165, 250, 0.3);
  color: #bfdbfe;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.8rem;
}

.player {
  width: 100%;
  max-height: 500px;
  background: black;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.image-holder {
  width: 100%;
  max-height: 500px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  overflow: hidden;
  background: #050816;
}

.image-holder img {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.details-box {
  margin-top: 18px;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  padding-top: 18px;
}

.details-box ul {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: grid;
  gap: 8px;
}

.empty-state {
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.5);
  border: 1px dashed rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  padding: 18px;
}

.empty-state.large {
  min-height: 300px;
  display: grid;
  place-items: center;
}

@media (max-width: 980px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
}

@media (max-width: 560px) {
  .app-shell {
    padding: 16px;
  }

  .topbar {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
