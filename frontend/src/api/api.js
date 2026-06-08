// src/api/api.js — Fetch helper ke backend Express

const BASE = '/api'; // Vite proxy → http://localhost:3000/api

async function apiFetch(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  return res.json();
}

export const api = {
  // Catalog
  getCatalog:     ()           => apiFetch('/catalog'),
  getProduct:     (id)         => apiFetch('/catalog/' + id),
  addProduct:     (data)       => apiFetch('/catalog', { method: 'POST', body: data }),
  updateProduct:  (id, data)   => apiFetch('/catalog/' + id, { method: 'PUT', body: data }),
  deleteProduct:  (id)         => apiFetch('/catalog/' + id, { method: 'DELETE' }),

  // Auth
  login:          (data)       => apiFetch('/auth/login', { method: 'POST', body: data }),
  register:       (data)       => apiFetch('/auth/register', { method: 'POST', body: data }),

  // Favorites
  getFavorites:   (userId)     => apiFetch('/favorites/' + userId),
  getFavIds:      (userId)     => apiFetch('/favorites/' + userId + '/ids'),
  toggleFavorite: (data)       => apiFetch('/favorites/toggle', { method: 'POST', body: data }),
  removeFavorite: (uid, pid)   => apiFetch('/favorites/' + uid + '/' + pid, { method: 'DELETE' }),
};
