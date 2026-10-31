import { describe, expect, it } from 'vitest';
import { normalizeBook, validateBook, validateBorrower } from '../../src/book-service.js';

describe('servicio de libros', () => {
  it('normaliza espacios, guiones del ISBN y tipos', () => {
    expect(normalizeBook({ title: '  Rayuela ', author: ' Cortázar ', isbn: '978-84-376-0494-7', year: '1963', category: ' Novela ' }))
      .toEqual({ title: 'Rayuela', author: 'Cortázar', isbn: '9788437604947', year: 1963, category: 'Novela' });
  });

  it('acepta un libro válido', () => {
    const result = validateBook({ title: 'Rayuela', author: 'Julio Cortázar', isbn: '9788437604947', year: 1963, category: 'Novela' });
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it.each([
    [{ title: 'A', author: 'Autor', isbn: '9788437604947', year: 1963, category: 'Novela' }, 'title'],
    [{ title: 'Libro', author: 'A', isbn: '9788437604947', year: 1963, category: 'Novela' }, 'author'],
    [{ title: 'Libro', author: 'Autor', isbn: 'ABC', year: 1963, category: 'Novela' }, 'isbn'],
    [{ title: 'Libro', author: 'Autor', isbn: '9788437604947', year: 999, category: 'Novela' }, 'year'],
    [{ title: 'Libro', author: 'Autor', isbn: '9788437604947', year: 1963, category: '' }, 'category']
  ])('rechaza campos inválidos', (book, field) => {
    const result = validateBook(book);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty(field);
  });

  it('valida el nombre de quien solicita el préstamo', () => {
    expect(validateBorrower('  Ana López ')).toMatchObject({ valid: true, borrower: 'Ana López' });
    expect(validateBorrower('Al').valid).toBe(false);
  });
});
