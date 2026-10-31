import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BookCard } from './BookCard.jsx';

const book = { id: 7, title: 'Rayuela', author: 'Julio Cortázar', isbn: '9788437604947', year: 1963, category: 'Novela', status: 'available', borrower: null };

describe('BookCard', () => {
  it('muestra la ficha y permite iniciar un préstamo', async () => {
    const onBorrow = vi.fn();
    render(<BookCard book={book} onBorrow={onBorrow} onReturn={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Rayuela')).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Prestar' }));
    expect(onBorrow).toHaveBeenCalledWith(book);
  });

  it('muestra quién tiene un libro prestado y permite devolverlo', async () => {
    const onReturn = vi.fn();
    const borrowed = { ...book, status: 'borrowed', borrower: 'Ana López' };
    render(<BookCard book={borrowed} onBorrow={vi.fn()} onReturn={onReturn} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Ana López')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Eliminar/ })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: /Devolver/ }));
    expect(onReturn).toHaveBeenCalledWith(borrowed);
  });
});
