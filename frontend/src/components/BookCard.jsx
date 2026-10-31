import { BookOpen, Calendar, Pencil, RotateCcw, Trash2, UserRound } from 'lucide-react';

export function BookCard({ book, onBorrow, onReturn, onEdit, onDelete }) {
  const available = book.status === 'available';
  return (
    <article className="book-card" data-testid={`book-${book.id}`}>
      <div className="book-spine" aria-hidden="true"><BookOpen size={24} /></div>
      <div className="book-content">
        <div className="book-topline">
          <span className={`status status--${book.status}`}>{available ? 'Disponible' : 'Prestado'}</span>
          <span className="category">{book.category}</span>
        </div>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <div className="book-meta">
          <span><Calendar size={14} />{book.year}</span>
          <span>ISBN {book.isbn}</span>
        </div>
        {!available && <p className="borrower"><UserRound size={15} /> En manos de <strong>{book.borrower}</strong></p>}
        <div className="book-actions">
          {available ? (
            <button className="button button--primary button--small" onClick={() => onBorrow(book)}>Prestar</button>
          ) : (
            <button className="button button--return button--small" onClick={() => onReturn(book)}><RotateCcw size={15} /> Devolver</button>
          )}
          <button className="icon-button" aria-label={`Editar ${book.title}`} onClick={() => onEdit(book)}><Pencil size={17} /></button>
          <button className="icon-button icon-button--danger" aria-label={`Eliminar ${book.title}`} onClick={() => onDelete(book)} disabled={!available}><Trash2 size={17} /></button>
        </div>
      </div>
    </article>
  );
}
