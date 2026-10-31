import { useCallback, useEffect, useState } from 'react';
import { BookCopy, BookMarked, BookOpenCheck, Library, Plus, Search, Sparkles } from 'lucide-react';
import { api } from './api.js';
import { BookCard } from './components/BookCard.jsx';
import { BookForm } from './components/BookForm.jsx';
import { BorrowDialog } from './components/BorrowDialog.jsx';
import { StatCard } from './components/StatCard.jsx';

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [formBook, setFormBook] = useState(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [borrowBook, setBorrowBook] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const [nextBooks, nextStats] = await Promise.all([api.getBooks({ search, status }), api.getStats()]);
      setBooks(nextBooks); setStats(nextStats);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [search, status]);

  useEffect(() => { const timeout = setTimeout(load, 180); return () => clearTimeout(timeout); }, [load]);
  const flash = (message) => { setNotice(message); setTimeout(() => setNotice(''), 2600); };
  const refresh = async (message) => { await load(); if (message) flash(message); };

  const saveBook = async (book, setErrors) => {
    setSaving(true);
    try {
      if (formBook) await api.updateBook(formBook.id, book); else await api.createBook(book);
      setFormOpen(false); await refresh(formBook ? 'Libro actualizado.' : 'Libro agregado a la colección.');
    } catch (err) { setErrors(err.errors ?? { form: err.message }); }
    finally { setSaving(false); }
  };

  const confirmBorrow = async (borrower, setDialogError) => {
    setSaving(true);
    try { await api.borrowBook(borrowBook.id, borrower); setBorrowBook(null); await refresh('Préstamo registrado.'); }
    catch (err) { setDialogError(err.message); }
    finally { setSaving(false); }
  };

  const returnBook = async (book) => { try { await api.returnBook(book.id); await refresh('Libro devuelto.'); } catch (err) { setError(err.message); } };
  const deleteBook = async (book) => {
    if (!window.confirm(`¿Eliminar “${book.title}” del catálogo?`)) return;
    try { await api.deleteBook(book.id); await refresh('Libro eliminado.'); } catch (err) { setError(err.message); }
  };

  return (
    <div className="app-shell">
      <header className="topbar"><a className="brand" href="#top"><span><Library /></span><div><strong>Lumen</strong><small>Biblioteca</small></div></a><div className="topbar-note"><Sparkles size={16} /> Lecturas que iluminan</div></header>
      <main id="top">
        <section className="hero">
          <div><p className="eyebrow">Tu colección, en orden</p><h1>Historias disponibles.<br /><em>Lectores conectados.</em></h1><p>Administra el catálogo, registra préstamos y mantén cada libro a la vista desde un solo lugar.</p></div>
          <button className="button button--primary button--large" onClick={() => { setFormBook(undefined); setFormOpen(true); }}><Plus size={19} /> Agregar libro</button>
        </section>
        <section className="stats" aria-label="Resumen de biblioteca">
          <StatCard label="Libros en catálogo" value={stats.total} icon={BookCopy} />
          <StatCard label="Disponibles" value={stats.available} icon={BookOpenCheck} tone="green" />
          <StatCard label="En préstamo" value={stats.borrowed} icon={BookMarked} tone="amber" />
          <StatCard label="Categorías" value={stats.categories} icon={Library} tone="blue" />
        </section>
        <section className="catalog">
          <div className="section-heading"><div><p className="eyebrow">Explora</p><h2>Catálogo de libros</h2></div><span>{books.length} {books.length === 1 ? 'resultado' : 'resultados'}</span></div>
          <div className="toolbar">
            <label className="search"><Search size={19} /><input aria-label="Buscar libros" placeholder="Buscar por título, autor, ISBN o categoría…" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
            <div className="filters" role="group" aria-label="Filtrar por estado">{[['all','Todos'],['available','Disponibles'],['borrowed','Prestados']].map(([value,label]) => <button key={value} className={status === value ? 'active' : ''} onClick={() => setStatus(value)}>{label}</button>)}</div>
          </div>
          {error && <div className="alert">{error} <button onClick={load}>Reintentar</button></div>}
          {loading ? <div className="empty">Cargando la colección…</div> : books.length ? <div className="book-grid">{books.map((book) => <BookCard key={book.id} book={book} onBorrow={setBorrowBook} onReturn={returnBook} onEdit={(selected) => { setFormBook(selected); setFormOpen(true); }} onDelete={deleteBook} />)}</div> : <div className="empty"><BookCopy size={38} /><h3>No encontramos libros</h3><p>Prueba con otra búsqueda o agrega un nuevo ejemplar.</p></div>}
        </section>
      </main>
      <footer><span>© {new Date().getFullYear()} Lumen Biblioteca</span><span>Hecho para acercar libros y personas.</span></footer>
      {formOpen && <BookForm book={formBook} onSave={saveBook} onClose={() => setFormOpen(false)} saving={saving} />}
      {borrowBook && <BorrowDialog book={borrowBook} onConfirm={confirmBorrow} onClose={() => setBorrowBook(null)} saving={saving} />}
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}
