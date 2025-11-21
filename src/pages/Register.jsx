import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import { DEMO_USERS } from '../utils/demoData';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'tecnico',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Initialize demo users in localStorage if not exists
    useState(() => {
        const existingUsers = localStorage.getItem('hvac_users');
        if (!existingUsers) {
            localStorage.setItem('hvac_users', JSON.stringify(DEMO_USERS));
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('As passwords não coincidem');
            return;
        }

        if (formData.password.length < 6) {
            setError('A password deve ter pelo menos 6 caracteres');
            return;
        }

        setIsLoading(true);

        const { confirmPassword, ...userData } = formData;
        const result = register(userData);

        setIsLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'var(--clr-bg-primary)' }}>
            <div className="card card-glass animate-fadeIn" style={{ width: '100%', maxWidth: '480px', margin: 'var(--space-lg)' }}>
                <div className="text-center" style={{ marginBottom: 'var(--space-xl)' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--space-lg)'
                    }}>
                        <UserPlus size={32} color="white" />
                    </div>
                    <h1 style={{ marginBottom: 'var(--space-sm)' }}>Criar Conta</h1>
                    <p className="text-secondary">Registe-se no sistema</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nome Completo</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="João Silva"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`input ${error ? 'input-error' : ''}`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="joao.silva@btservices.pt"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Função</label>
                        <select
                            className="select"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            required
                        >
                            <option value="tecnico">Técnico</option>
                            <option value="instalador">Instalador</option>
                            <option value="gestor">Gestor</option>
                            <option value="orcamentista">Orçamentista</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-md">
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className={`input ${error ? 'input-error' : ''}`}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirmar Password</label>
                            <input
                                type="password"
                                className={`input ${error ? 'input-error' : ''}`}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <span className="form-error" style={{ display: 'block', marginBottom: 'var(--space-md)' }}>{error}</span>}

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={isLoading}>
                        {isLoading ? <div className="spinner"></div> : 'Registar'}
                    </button>

                    <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
                        <span className="text-secondary">Já tem conta? </span>
                        <Link to="/login" className="text-primary font-medium">Entrar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
