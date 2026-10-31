import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createDatabase, seedDatabase } from '../../src/db.js';
import { createApp } from '../../src/app.js';

let db;
let app;

beforeEach(() => {
  db = createDatabase(':memory:');
  seedDatabase(db);
  app = createApp({ db });
});

afterEach(() => db.close());

describe('API de biblioteca integrada con SQLite', () => {
  it('lista y filtra libros almacenados', async () => {
    const all = await request(app).get('/api/books').expect(200);
    expect(all.body).toHaveLength(5);
    const filtered = await request(app).get('/api/books?search=orwell').expect(200);
    expect(filtered.body).toHaveLength(1);
    expect(filtered.body[0].title).toBe('1984');
  });

  it('crea un libro y persiste sus datos', async () => {
    const response = await request(app).post('/api/books').send({
      title: 'Rayuela', author: 'Julio Cortázar', isbn: '9788437604947', year: 1963, category: 'Novela'
    }).expect(201);
    expect(response.body).toMatchObject({ title: 'Rayuela', status: 'available' });
    expect(db.prepare('SELECT title FROM books WHERE id = ?').get(response.body.id).title).toBe('Rayuela');
  });

  it('impide ISBN duplicados', async () => {
    await request(app).post('/api/books').send({ title: 'Duplicado', author: 'Otro autor', isbn: '9780451524935', year: 2000, category: 'Novela' }).expect(409);
  });

  it('completa el ciclo de préstamo y devolución', async () => {
    const borrowed = await request(app).post('/api/books/1/borrow').send({ borrower: 'María Pérez' }).expect(200);
    expect(borrowed.body).toMatchObject({ status: 'borrowed', borrower: 'María Pérez' });
    await request(app).delete('/api/books/1').expect(409);
    const returned = await request(app).post('/api/books/1/return').expect(200);
    expect(returned.body).toMatchObject({ status: 'available', borrower: null });
  });

  it('calcula estadísticas desde la base de datos', async () => {
    await request(app).post('/api/books/1/borrow').send({ borrower: 'María Pérez' });
    const stats = await request(app).get('/api/stats').expect(200);
    expect(stats.body).toMatchObject({ total: 5, available: 4, borrowed: 1 });
  });
});
