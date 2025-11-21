import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    CheckCircle,
    Clock,
    AlertTriangle,
    TrendingUp,
    Users,
    Calendar
} from 'lucide-react';
import StatsCard from '../components/analytics/StatsCard';
import StatusChart from '../components/analytics/StatusChart';
import TechnicianPerformance from '../components/analytics/TechnicianPerformance';
import TimelineChart from '../components/analytics/TimelineChart';

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const {
        getStatistics,
        getTicketsByTechnician,
        getTicketsByStatus,
        getAverageCompletionTime,
        getTicketsTrend
    } = useApp();

    useEffect(() => {
        if (currentUser && currentUser.role !== 'gestor') {
            navigate('/');
        }
    }, [currentUser, navigate]);

    if (!currentUser || currentUser.role !== 'gestor') {
        return null;
    }

    const stats = getStatistics();
    const technicianData = getTicketsByTechnician();
    const statusData = getTicketsByStatus();
    const avgTime = getAverageCompletionTime();
    const trendData = getTicketsTrend();

    return (
        <div className="container" style={{ paddingBottom: 'var(--space-3xl)' }}>
            {/* Header */}
            <div className="flex items-center justify-between" style={{ margin: 'var(--space-xl) 0' }}>
                <div>
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-sm">
                        <TrendingUp />
                        Dashboard Analítico
                    </h1>
                    <p className="text-muted">Visão geral de performance e métricas</p>
                </div>
                <button onClick={() => navigate('/')} className="btn btn-secondary">
                    <LayoutDashboard size={18} />
                    Voltar ao Quadro
                </button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-lg mb-xl">
                <StatsCard
                    title="Total de Serviços"
                    value={stats.total}
                    icon={LayoutDashboard}
                    color="primary"
                />
                <StatsCard
                    title="Taxa de Conclusão"
                    value={`${Math.round((stats.concluidosEsteMes / (stats.total || 1)) * 100)}%`}
                    icon={CheckCircle}
                    color="accent"
                    trend="up"
                    trendValue="+5% este mês"
                />
                <StatsCard
                    title="Tempo Médio"
                    value={`${avgTime}h`}
                    icon={Clock}
                    color="warning"
                    trend="down"
                    trendValue="-2h vs média"
                />
                <StatsCard
                    title="Pendentes"
                    value={stats.pendente}
                    icon={AlertTriangle}
                    color="error"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 grid-cols-lg-2 gap-lg mb-xl">
                <StatusChart data={statusData} />
                <TimelineChart data={trendData} />
            </div>

            {/* Technician Performance */}
            <div className="mb-xl">
                <TechnicianPerformance data={technicianData} />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
