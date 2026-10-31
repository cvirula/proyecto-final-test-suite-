import express from 'express';
import cors from 'cors';
import { rowToBook, seedDatabase } from './db.js';
import { validateBook, validateBorrower } from './book-service.js';

const findBook = (db, id) => rowToBook(db.prepare('SELECT * FROM books WHERE id = ?').get(id));

export function createApp({ db, enableTestRoutes = false }) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'biblioteca-api' }));

  app.get('/api/books', (req, res) => {
    const search = String(req.query.search ?? '').trim();
    const status = String(req.query.status ?? 'all');
    const clauses = [];
    const values = [];
    if (search) {
      clauses.push('(title LIKE ? OR author LIKE ? OR isbn LIKE ? OR category LIKE ?)');
      const term = `%${search}%`;
      values.push(term, term, term, term);
    }
    if (status !== 'all') {
      if (!['available', 'borrowed'].includes(status)) return res.status(400).json({ message: 'Estado inválido.' });
      clauses.push('status = ?');
      values.push(status);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const rows = db.prepare(`SELECT * FROM books ${where} ORDER BY id DESC`).all(...values);
    res.json(rows.map(rowToBook));
  });

  app.get('/api/books/:id', (req, res) => {
    const book = findBook(db, req.params.id);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado.' });
    res.json(book);
  });

  app.post('/api/books', (req, res) => {
    const validation = validateBook(req.body);
    if (!validation.valid) return res.status(422).json({ message: 'Datos inválidos.', errors: validation.errors });
    const { title, author, isbn, year, category } = validation.value;
    try {
      const result = db.prepare('INSERT INTO books (title, author, isbn, year, category) VALUES (?, ?, ?, ?, ?)')
        .run(title, author, isbn, year, category);
      res.status(201).json(findBook(db, result.lastInsertRowid));
    } catch (error) {
      if (String(error.message).includes('UNIQUE')) return res.status(409).json({ message: 'Ya existe un libro con ese ISBN.' });
      throw error;
    }
  });

  app.put('/api/books/:id', (req, res) => {
    if (!findBook(db, req.params.id)) return res.status(404).json({ message: 'Libro no encontrado.' });
    const validation = validateBook(req.body);
    if (!validation.valid) return res.status(422).json({ message: 'Datos inválidos.', errors: validation.errors });
    const { title, author, isbn, year, category } = validation.value;
    try {
      db.prepare('UPDATE books SET title = ?, author = ?, isbn = ?, year = ?, category = ? WHERE id = ?')
        .run(title, author, isbn, year, category, req.params.id);
      res.json(findBook(db, req.params.id));
    } catch (error) {
      if (String(error.message).includes('UNIQUE')) return res.status(409).json({ message: 'Ya existe un libro con ese ISBN.' });
      throw error;
    }
  });

  app.delete('/api/books/:id', (req, res) => {
    const book = findBook(db, req.params.id);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado.' });
    if (book.status === 'borrowed') return res.status(409).json({ message: 'No puedes eliminar un libro prestado.' });
    db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
    res.status(204).end();
  });

  app.post('/api/books/:id/borrow', (req, res) => {
    const book = findBook(db, req.params.id);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado.' });
    if (book.status === 'borrowed') return res.status(409).json({ message: 'El libro ya está prestado.' });
    const validation = validateBorrower(req.body.borrower);
    if (!validation.valid) return res.status(422).json({ message: validation.error });
    db.prepare("UPDATE books SET status = 'borrowed', borrower = ?, borrowed_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(validation.borrower, req.params.id);
    res.json(findBook(db, req.params.id));
  });

  app.post('/api/books/:id/return', (req, res) => {
    const book = findBook(db, req.params.id);
    if (!book) return res.status(404).json({ message: 'Libro no encontrado.' });
    if (book.status === 'available') return res.status(409).json({ message: 'El libro ya está disponible.' });
    db.prepare("UPDATE books SET status = 'available', borrower = NULL, borrowed_at = NULL WHERE id = ?")
      .run(req.params.id);
    res.json(findBook(db, req.params.id));
  });

  app.get('/api/stats', (_req, res) => {
    const stats = db.prepare(`SELECT COUNT(*) AS total,
      SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available,
      SUM(CASE WHEN status = 'borrowed' THEN 1 ELSE 0 END) AS borrowed,
      COUNT(DISTINCT category) AS categories FROM books`).get();
    res.json(stats);
  });

  if (enableTestRoutes) {
    app.post('/api/test/reset', (_req, res) => {
      seedDatabase(db, true);
      res.status(204).end();
    });
  }

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  });

  return app;
}
