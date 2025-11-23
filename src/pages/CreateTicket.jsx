import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { DEMO_USERS } from '../utils/demoData';

export default function CreateTicket() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { createTicket, categories, priorityOptions } = useApp();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'duvida',
        priority: 'media',
        assignedTo: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get all users for assignment dropdown
    const users = DEMO_USERS;

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
        if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        const ticketData = {
            ...formData,
            status: 'aberto',
        };

        const result = createTicket(ticketData);

        setIsSubmitting(false);

        if (result.success) {
            navigate(`/ticket/${result.ticket.id}`);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--clr-bg-primary)' }}>
            {/* Header */}
            <header style={{
                background: 'var(--clr-bg-secondary)',
                borderBottom: '1px solid var(--clr-border)',
                padding: 'var(--space-lg)',
                position: 'sticky',
                top: 0,
                zIndex: 'var(--z-sticky)'
            }}>
                <div className="container flex items-center gap-md">
                    <button onClick={() => navigate('/')} className="btn btn-secondary btn-icon">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 0 }}>
                            Novo Ticket Interno
                        </h1>
                    </div>
                </div>
            </header>

            <div className="container" style={{ padding: 'var(--space-xl) var(--space-lg)', maxWidth: '800px' }}>
                <form onSubmit={handleSubmit}>
                    <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                        <div className="form-group">
                            <label className="form-label">Título do Ticket *</label>
                            <input
                                type="text"
                                className={`input ${errors.title ? 'input-error' : ''}`}
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="Resumo do problema ou solicitação"
                            />
                            {errors.title && <span className="form-error">{errors.title}</span>}
                        </div>

                        <div className="grid grid-cols-1 grid-cols-md-2 gap-md">
                            <div className="form-group">
                                <label className="form-label">Categoria *</label>
                                <select
                                    className="select"
                                    value={formData.category}
                                    onChange={(e) => handleChange('category', e.target.value)}
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Prioridade *</label>
                                <select
                                    className="select"
                                    value={formData.priority}
                                    onChange={(e) => handleChange('priority', e.target.value)}
                                >
                                    {priorityOptions.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Descrição Detalhada *</label>
                            <textarea
                                className={`textarea ${errors.description ? 'input-error' : ''}`}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Descreva o problema, passos para reproduzir, ou detalhes da tarefa..."
                                rows={6}
                            />
                            {errors.description && <span className="form-error">{errors.description}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Atribuir a (Opcional)</label>
                            <select
                                className="select"
                                value={formData.assignedTo}
                                onChange={(e) => handleChange('assignedTo', e.target.value)}
                            >
                                <option value="">Atribuir depois...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} - {user.role}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-md justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="btn btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <div className="spinner"></div> : 'Criar Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
