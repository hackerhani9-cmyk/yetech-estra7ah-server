import { useEffect, useMemo, useState } from 'react';
import { getLibrary, getStats, scanLibrary } from './api';

function App() {
  const [library, setLibrary] = useState([]);
  const [stats, setStats] = useState({ total: 0, videos: 0, audio: 0, images: 0 });
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [items, statsData] = await Promise.all([getLibrary(), getStats()]);
      setLibrary(items);
      setStats(statsData);
      if (items.length && !selected) setSelected(items[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    return library.filter((item) => {
      const text = `${item.title} ${item.genres} ${item.description}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [library, search]);

  const triggerScan = async () => {
    setLoading(true);
    try {
      const result = await scanLibrary();
      console.log('Scan result', result);
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell rtl">
      <header className="topbar">
        <div>
          <p className="eyebrow">YeTech Estra7ah</p>
          <h1>خادم الوسائط المحلي</h1>
        </div>
        <button className="primary" onClick={triggerScan}>
          {loading ? 'جاري الفحص...' : 'مسح المكتبة'}
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>المجموع</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>فيديو</span>
          <strong>{stats.videos}</strong>
        </div>
        <div className="stat-card">
          <span>صوت</span>
          <strong>{stats.audio}</strong>
        </div>
        <div className="stat-card">
          <span>صور</span>
          <strong>{stats.images}</strong>
        </div>
      </section>

      <section className="toolbar">
        <input
          aria-label="بحث في المكتبة"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن عنوان أو نوع أو وسم..."
        />
      </section>

      <main className="content-grid">
        <aside className="library-panel">
          {filtered.length === 0 ? (
            <div className="empty-state">لا توجد عناصر في المكتبة بعد. أضف ملفات إلى مجلد الوسائط أو انقر على «مسح المكتبة».</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                className={`media-card ${selected?.id === item.id ? 'active' : ''}`}
                onClick={() => setSelected(item)}
              >
                <div className="thumb">
                  {item.media_type === 'video' ? '🎬' : item.media_type === 'audio' ? '🎵' : '🖼️'}
                </div>
                <div className="meta">
                  <strong>{item.title}</strong>
                  <small>{item.media_type} • {item.file_extension || 'local'}</small>
                  <span>{item.genres || 'عام'}</span>
                </div>
              </button>
            ))
          )}
        </aside>

        <section className="player-panel">
          {selected ? (
            <>
              <div className="player-header">
                <div>
                  <p className="eyebrow">المحتوى الحالي</p>
                  <h2>{selected.title}</h2>
                </div>
                <span className="badge">{selected.metadata_source || 'local'}</span>
              </div>

              {selected.media_type === 'video' || selected.media_type === 'audio' ? (
                <video
                  key={selected.id}
                  controls
                  autoPlay
                  playsInline
                  className="player"
                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/stream/${selected.id}`}
                />
              ) : (
                <div className="image-holder">
                  <img
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/media/${selected.id}`}
                    alt={selected.title}
                  />
                </div>
              )}

              <div className="details-box">
                <h3>الوصف</h3>
                <p>{selected.description}</p>
                <ul>
                  <li>النوع: {selected.media_type}</li>
                  <li>اللغة: {selected.language || 'العربية'}</li>
                  <li>العام: {selected.year || 'غير محدد'}</li>
                  <li>المسار: {selected.relative_path}</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="empty-state large">اختر عنصرًا من المكتبة لبدء التشغيل.</div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
