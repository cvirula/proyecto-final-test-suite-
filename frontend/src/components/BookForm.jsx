import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const emptyBook = { title: '', author: '', isbn: '', year: new Date().getFullYear(), category: '' };

export function BookForm({ book, onSave, onClose, saving }) {
  const [form, setForm] = useState(emptyBook);
  const [errors, setErrors] = useState({});

  useEffect(() => setForm(book ? { ...book } : emptyBook), [book]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.title.trim().length < 2) nextErrors.title = 'Escribe un título válido.';
    if (form.author.trim().length < 2) nextErrors.author = 'Escribe el nombre del autor.';
    const isbnDigits = form.isbn.replace(/[\s-]/g, '');
    if (!/^(?:\d{10}|\d{13})$/.test(isbnDigits)) nextErrors.isbn = 'Usa un ISBN de 10 o 13 dígitos.';
    if (!form.category.trim()) nextErrors.category = 'Indica una categoría.';
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) await onSave(form, setErrors);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="book-form-title">
        <button className="modal-close" aria-label="Cerrar formulario" onClick={onClose}><X /></button>
        <p className="eyebrow">Catálogo</p>
        <h2 id="book-form-title">{book ? 'Editar ejemplar' : 'Registrar un libro'}</h2>
        <p className="modal-intro">Completa la ficha bibliográfica para incorporarla a la colección.</p>
        <form onSubmit={submit} noValidate>
          <label>Título<input name="title" value={form.title} onChange={update} autoFocus />{errors.title && <small>{errors.title}</small>}</label>
          <label>Autor<input name="author" value={form.author} onChange={update} />{errors.author && <small>{errors.author}</small>}</label>
          <div className="form-grid">
            <label>ISBN<input name="isbn" value={form.isbn} onChange={update} inputMode="numeric" />{errors.isbn && <small>{errors.isbn}</small>}</label>
            <label>Año<input name="year" value={form.year} onChange={update} type="number" min="1000" max={new Date().getFullYear()} /></label>
          </div>
          <label>Categoría<input name="category" value={form.category} onChange={update} placeholder="Novela, Historia, Ciencia…" />{errors.category && <small>{errors.category}</small>}</label>
          {errors.form && <p className="form-error">{errors.form}</p>}
          <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>Cancelar</button><button className="button button--primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar libro'}</button></div>
        </form>
      </section>
    </div>
  );
}
