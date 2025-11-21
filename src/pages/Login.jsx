import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = login(formData.email, formData.password);

        setIsLoading(false);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="flex items-center justify-center" style={{ minHeight: '100vh', background: 'var(--clr-bg-primary)' }}>
            <div className="card card-glass animate-fadeIn" style={{ width: '100%', maxWidth: '420px', margin: 'var(--space-lg)' }}>
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
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={{ marginBottom: 'var(--space-sm)' }}>BT Tickets</h1>
                    <p className="text-secondary">Sistema de Gestão de Serviços HVAC</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`input ${error ? 'input-error' : ''}`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="seu.email@btservices.pt"
                            required
                        />
                    </div>

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
                        {error && <span className="form-error">{error}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={isLoading}>
                        {isLoading ? <div className="spinner"></div> : 'Entrar'}
                    </button>

                    <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
                        <span className="text-secondary">Não tem conta? </span>
                        <Link to="/register" className="text-primary font-medium">Registar</Link>
                    </div>

                    <div className="divider"></div>

                    <div style={{ padding: 'var(--space-md)', background: 'var(--clr-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                        <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-sm)' }}>
                            <strong>Utilizadores Demo:</strong>
                        </p>
                        <p className="text-xs text-muted" style={{ margin: 0 }}>
                            ana.silva@btservices.pt (Técnico)<br />
                            carlos.mendes@btservices.pt (Gestor)<br />
                            Password: <code>pass123</code>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
