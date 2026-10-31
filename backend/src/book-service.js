export const BOOK_STATUSES = ['available', 'borrowed'];

export function normalizeBook(input = {}) {
  return {
    title: String(input.title ?? '').trim(),
    author: String(input.author ?? '').trim(),
    isbn: String(input.isbn ?? '').replace(/[\s-]/g, '').trim(),
    year: Number(input.year),
    category: String(input.category ?? '').trim()
  };
}

export function validateBook(input) {
  const book = normalizeBook(input);
  const errors = {};

  if (book.title.length < 2) errors.title = 'El título debe tener al menos 2 caracteres.';
  if (book.author.length < 2) errors.author = 'El autor debe tener al menos 2 caracteres.';
  if (!/^(?:\d{10}|\d{13})$/.test(book.isbn)) errors.isbn = 'El ISBN debe contener 10 o 13 dígitos.';
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(book.year) || book.year < 1000 || book.year > currentYear) {
    errors.year = `El año debe estar entre 1000 y ${currentYear}.`;
  }
  if (!book.category) errors.category = 'La categoría es obligatoria.';

  return { valid: Object.keys(errors).length === 0, errors, value: book };
}

export function validateBorrower(name) {
  const borrower = String(name ?? '').trim();
  return {
    valid: borrower.length >= 3,
    borrower,
    error: borrower.length >= 3 ? null : 'El nombre del lector debe tener al menos 3 caracteres.'
  };
}
