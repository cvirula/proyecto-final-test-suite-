import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const SEED_BOOKS = [
  ['Cien años de soledad', 'Gabriel García Márquez', '9780307474728', 1967, 'Realismo mágico'],
  ['El principito', 'Antoine de Saint-Exupéry', '9780156012195', 1943, 'Clásico'],
  ['1984', 'George Orwell', '9780451524935', 1949, 'Ciencia ficción'],
  ['Orgullo y prejuicio', 'Jane Austen', '9780141439518', 1813, 'Novela'],
  ['Don Quijote de la Mancha', 'Miguel de Cervantes', '9788424116331', 1605, 'Clásico']
];

export function createDatabase(path = ':memory:') {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT NOT NULL UNIQUE,
      year INTEGER NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'borrowed')),
      borrower TEXT,
      borrowed_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return db;
}

export function seedDatabase(db, force = false) {
  if (force) db.exec('DELETE FROM books; DELETE FROM sqlite_sequence WHERE name = \'books\';');
  const count = db.prepare('SELECT COUNT(*) AS count FROM books').get().count;
  if (count === 0) {
    const insert = db.prepare('INSERT INTO books (title, author, isbn, year, category) VALUES (?, ?, ?, ?, ?)');
    for (const book of SEED_BOOKS) insert.run(...book);
  }
}

export function rowToBook(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    isbn: row.isbn,
    year: row.year,
    category: row.category,
    status: row.status,
    borrower: row.borrower,
    borrowedAt: row.borrowed_at,
    createdAt: row.created_at
  };
}
