import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const ResolutionModal = ({ isOpen, onClose, onConfirm }) => {
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!note.trim()) {
            setError('Por favor, descreva o que foi feito para resolver o ticket.');
            return;
        }

        setIsSubmitting(true);
        await onConfirm(note);
        setIsSubmitting(false);
        setNote('');
        onClose();
    };

    return (
        <div className="modal-overlay animate-fadeIn">
            <div className="modal-content animate-slideUp" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h2 className="text-xl font-bold flex items-center gap-sm">
                        <CheckCircle2 className="text-success" size={24} />
                        Resolver Ticket
                    </h2>
                    <button onClick={onClose} className="btn btn-icon btn-ghost">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <p className="text-secondary mb-md">
                            Para marcar este ticket como resolvido, é obrigatório descrever a solução aplicada.
                            O criador do ticket será notificado para validar a resolução.
                        </p>

                        <div className="form-group">
                            <label className="form-label">Nota de Resolução *</label>
                            <textarea
                                className={`textarea ${error ? 'input-error' : ''}`}
                                value={note}
                                onChange={(e) => {
                                    setNote(e.target.value);
                                    setError('');
                                }}
                                placeholder="Descreva os passos tomados, a causa do problema e a solução final..."
                                rows={5}
                                autoFocus
                            />
                            {error && <span className="form-error">{error}</span>}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <div className="spinner"></div> : 'Confirmar Resolução'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResolutionModal;
