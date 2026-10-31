import { useState } from 'react';
import { X } from 'lucide-react';

export function BorrowDialog({ book, onConfirm, onClose, saving }) {
  const [borrower, setBorrower] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    if (borrower.trim().length < 3) return setError('Escribe el nombre completo del lector.');
    await onConfirm(borrower, setError);
  };
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal modal--compact" role="dialog" aria-modal="true" aria-labelledby="borrow-title">
        <button className="modal-close" aria-label="Cerrar" onClick={onClose}><X /></button>
        <p className="eyebrow">Nuevo préstamo</p>
        <h2 id="borrow-title">{book.title}</h2>
        <p className="modal-intro">Registra a la persona que llevará este ejemplar.</p>
        <form onSubmit={submit}>
          <label>Nombre del lector<input aria-label="Nombre del lector" value={borrower} onChange={(e) => setBorrower(e.target.value)} autoFocus placeholder="Ej. Ana López" />{error && <small>{error}</small>}</label>
          <div className="modal-actions"><button type="button" className="button button--ghost" onClick={onClose}>Cancelar</button><button className="button button--primary" disabled={saving}>{saving ? 'Registrando…' : 'Confirmar préstamo'}</button></div>
        </form>
      </section>
    </div>
  );
}
