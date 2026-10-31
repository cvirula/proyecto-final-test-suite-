const API_URL = import.meta.env.VITE_API_URL ?? '';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const error = new Error(data.message || 'No se pudo completar la operación.');
    error.errors = data.errors;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

export const api = {
  getBooks: ({ search = '', status = 'all' } = {}) => request(`/api/books?search=${encodeURIComponent(search)}&status=${status}`),
  getStats: () => request('/api/stats'),
  createBook: (book) => request('/api/books', { method: 'POST', body: JSON.stringify(book) }),
  updateBook: (id, book) => request(`/api/books/${id}`, { method: 'PUT', body: JSON.stringify(book) }),
  deleteBook: (id) => request(`/api/books/${id}`, { method: 'DELETE' }),
  borrowBook: (id, borrower) => request(`/api/books/${id}/borrow`, { method: 'POST', body: JSON.stringify({ borrower }) }),
  returnBook: (id) => request(`/api/books/${id}/return`, { method: 'POST' })
};
