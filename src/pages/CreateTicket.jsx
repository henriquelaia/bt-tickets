import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { DEMO_USERS } from '../utils/demoData';

export default function CreateTicket() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { createTicket, categories, equipmentTypes, priorityOptions } = useApp();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'instalacao',
        equipmentType: 'ac',
        equipmentBrand: '',
        equipmentModel: '',
        clientName: '',
        clientPhone: '',
        clientAddress: '',
        scheduledDate: '',
        priority: 'media',
        assignedTo: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get all users for assignment dropdown
    const users = JSON.parse(localStorage.getItem('hvac_users') || '[]');

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
        if (!formData.clientName.trim()) newErrors.clientName = 'Nome do cliente é obrigatório';
        if (!formData.clientPhone.trim()) newErrors.clientPhone = 'Telefone é obrigatório';
        if (!formData.clientAddress.trim()) newErrors.clientAddress = 'Morada é obrigatória';
        if (!formData.equipmentBrand.trim()) newErrors.equipmentBrand = 'Marca é obrigatória';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        const ticketData = {
            ...formData,
            scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).getTime() : null,
            status: 'pendente',
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
                            Criar Novo Serviço
                        </h1>
                    </div>
                </div>
            </header>

            <div className="container" style={{ padding: 'var(--space-xl) var(--space-lg)', maxWidth: '900px' }}>
                <form onSubmit={handleSubmit}>
                    {/* Informação Básica */}
                    <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Informação Básica</h2>

                        <div className="form-group">
                            <label className="form-label">Título do Serviço *</label>
                            <input
                                type="text"
                                className={`input ${errors.title ? 'input-error' : ''}`}
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="ex: Instalação de AC Split 12000 BTU"
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
                            <label className="form-label">Descrição</label>
                            <textarea
                                className="textarea"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Descreva os detalhes do serviço solicitado..."
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Dados do Cliente */}
                    <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Dados do Cliente</h2>

                        <div className="form-group">
                            <label className="form-label">Nome Completo *</label>
                            <input
                                type="text"
                                className={`input ${errors.clientName ? 'input-error' : ''}`}
                                value={formData.clientName}
                                onChange={(e) => handleChange('clientName', e.target.value)}
                                placeholder="João Pedro Silva"
                            />
                            {errors.clientName && <span className="form-error">{errors.clientName}</span>}
                        </div>

                        <div className="grid grid-cols-1 grid-cols-md-2 gap-md">
                            <div className="form-group">
                                <label className="form-label">Telefone *</label>
                                <input
                                    type="tel"
                                    className={`input ${errors.clientPhone ? 'input-error' : ''}`}
                                    value={formData.clientPhone}
                                    onChange={(e) => handleChange('clientPhone', e.target.value)}
                                    placeholder="+351 912 345 678"
                                />
                                {errors.clientPhone && <span className="form-error">{errors.clientPhone}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Morada *</label>
                                <input
                                    type="text"
                                    className={`input ${errors.clientAddress ? 'input-error' : ''}`}
                                    value={formData.clientAddress}
                                    onChange={(e) => handleChange('clientAddress', e.target.value)}
                                    placeholder="Rua das Flores, 123, Lisboa"
                                />
                                {errors.clientAddress && <span className="form-error">{errors.clientAddress}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Equipamento */}
                    <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Equipamento</h2>

                        <div className="form-group">
                            <label className="form-label">Tipo de Equipamento *</label>
                            <select
                                className="select"
                                value={formData.equipmentType}
                                onChange={(e) => handleChange('equipmentType', e.target.value)}
                            >
                                {equipmentTypes.map(eq => (
                                    <option key={eq.id} value={eq.id}>{eq.icon} {eq.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 grid-cols-md-2 gap-md">
                            <div className="form-group">
                                <label className="form-label">Marca *</label>
                                <input
                                    type="text"
                                    className={`input ${errors.equipmentBrand ? 'input-error' : ''}`}
                                    value={formData.equipmentBrand}
                                    onChange={(e) => handleChange('equipmentBrand', e.target.value)}
                                    placeholder="Daikin, Mitsubishi, LG..."
                                />
                                {errors.equipmentBrand && <span className="form-error">{errors.equipmentBrand}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Modelo</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={formData.equipmentModel}
                                    onChange={(e) => handleChange('equipmentModel', e.target.value)}
                                    placeholder="FTXS35K"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Agendamento */}
                    <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--space-lg)' }}>Agendamento</h2>

                        <div className="grid grid-cols-1 grid-cols-md-2 gap-md">
                            <div className="form-group">
                                <label className="form-label">Data e Hora Agendada</label>
                                <input
                                    type="datetime-local"
                                    className="input"
                                    value={formData.scheduledDate}
                                    onChange={(e) => handleChange('scheduledDate', e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Atribuir a Técnico</label>
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
                            {isSubmitting ? <div className="spinner"></div> : 'Criar Serviço'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
