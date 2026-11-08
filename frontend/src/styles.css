const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }

  return response.json();
}

export async function getLibrary() {
  return request('/api/library');
}

export async function getStats() {
  return request('/api/stats');
}

export async function scanLibrary() {
  return request('/api/scan', { method: 'POST' });
}

export default API_BASE;
