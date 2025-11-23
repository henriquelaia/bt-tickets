import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    UserCircle,
    Calendar as CalendarIcon,
    Users,
    CalendarRange,
    FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../utils/demoData';
import ExportButton from '../components/ExportButton';

const Dashboard = ({ filterType = 'all' }) => {
    const navigate = useNavigate();
    const { tickets, getStatistics } = useApp();
    const { currentUser } = useAuth();
    const stats = getStatistics();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [priorityFilter, setPriorityFilter] = useState('todos');
    const [dateFilter, setDateFilter] = useState('all');
    const [technicianFilter, setTechnicianFilter] = useState('all');
    const [customDateStart, setCustomDateStart] = useState('');
    const [customDateEnd, setCustomDateEnd] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter tickets based on props and local filters
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            // 1. Main View Filter (Prop-based)
            if (filterType === 'assigned' && ticket.assignedTo !== currentUser.id) return false;
            if (filterType === 'created' && ticket.createdBy !== currentUser.id) return false;

            // 2. Search Filter
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                ticket.title.toLowerCase().includes(searchLower) ||
                ticket.id.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            // 3. Status Filter
            if (statusFilter !== 'todos' && ticket.status !== statusFilter) return false;

            // 4. Priority Filter
            if (priorityFilter !== 'todos' && ticket.priority !== priorityFilter) return false;

            // 5. Technician Filter
            if (technicianFilter !== 'all' && ticket.assignedTo !== technicianFilter) return false;

            // 6. Date Filter
            if (dateFilter !== 'all') {
                const ticketDate = new Date(ticket.createdAt);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (dateFilter === '7days') {
                    const sevenDaysAgo = new Date(today);
                    sevenDaysAgo.setDate(today.getDate() - 7);
                    if (ticketDate < sevenDaysAgo) return false;
                } else if (dateFilter === '30days') {
                    const thirtyDaysAgo = new Date(today);
                    thirtyDaysAgo.setDate(today.getDate() - 30);
                    if (ticketDate < thirtyDaysAgo) return false;
                } else if (dateFilter === 'thisMonth') {
                    if (ticketDate.getMonth() !== today.getMonth() || ticketDate.getFullYear() !== today.getFullYear()) return false;
                } else if (dateFilter === 'lastMonth') {
                    const lastMonth = new Date(today);
                    lastMonth.setMonth(today.getMonth() - 1);
                    if (ticketDate.getMonth() !== lastMonth.getMonth() || ticketDate.getFullYear() !== lastMonth.getFullYear()) return false;
                } else if (dateFilter === 'custom') {
                    if (customDateStart) {
                        const startDate = new Date(customDateStart);
                        if (ticketDate < startDate) return false;
                    }
                    if (customDateEnd) {
                        const endDate = new Date(customDateEnd);
                        endDate.setHours(23, 59, 59, 999);
                        if (ticketDate > endDate) return false;
                    }
                }
            }

            return true;
        });
    }, [tickets, filterType, currentUser.id, searchTerm, statusFilter, priorityFilter, technicianFilter, dateFilter, customDateStart, customDateEnd]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'aberto': return 'badge badge-pendente'; // Reusing pendente style for now
            case 'em_andamento': return 'badge badge-em-andamento';
            case 'resolvido': return 'badge badge-concluido'; // Reusing concluido style
            case 'fechado': return 'badge badge-aprovado'; // Reusing aprovado style
            default: return 'badge';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'aberto': return 'Aberto';
            case 'em_andamento': return 'Em Andamento';
            case 'resolvido': return 'Resolvido';
            case 'fechado': return 'Fechado';
            default: return status;
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'baixa': return 'priority-baixa';
            case 'media': return 'priority-media';
            case 'alta': return 'priority-alta';
            case 'urgente': return 'priority-urgente';
            default: return '';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getPageTitle = () => {
        switch (filterType) {
            case 'assigned': return 'Meus Tickets';
            case 'created': return 'Criados por Mim';
            default: return 'Dashboard';
        }
    };

    // Calculate stats dynamically based on current tickets
    const dashboardStats = useMemo(() => {
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'aberto').length;
        const inProgress = tickets.filter(t => t.status === 'em_andamento').length;
        const resolved = tickets.filter(t => t.status === 'resolvido').length;
        const closed = tickets.filter(t => t.status === 'fechado').length;
        return { total, open, inProgress, resolved, closed };
    }, [tickets]);

    return (
        <div className="animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col gap-md mb-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">{getPageTitle()}</h1>
                        <p className="text-secondary">Bem-vindo de volta, {currentUser?.name}</p>
                    </div>
                    <div className="flex gap-sm">
                        <ExportButton tickets={filteredTickets} filename="tickets_internos" />
                        <button
                            onClick={() => navigate('/create')}
                            className="btn btn-primary btn-lg"
                        >
                            <Plus size={20} />
                            Novo Ticket
                        </button>
                    </div>
                </div>

                {/* Stats Cards - Only show on main dashboard */}
                {filterType === 'all' && (
                    <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-md">
                        <button
                            className="stat-card stat-icon-primary"
                            onClick={() => {
                                setStatusFilter('aberto');
                                setShowFilters(true);
                            }}
                        >
                            <div className="stat-icon">
                                <AlertCircle size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Abertos</p>
                                <p className="stat-value">{dashboardStats.open}</p>
                            </div>
                        </button>

                        <button
                            className="stat-card stat-icon-warning"
                            onClick={() => {
                                setStatusFilter('em_andamento');
                                setShowFilters(true);
                            }}
                        >
                            <div className="stat-icon">
                                <Clock size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Em Andamento</p>
                                <p className="stat-value">{dashboardStats.inProgress}</p>
                            </div>
                        </button>

                        <button
                            className="stat-card stat-icon-info"
                            onClick={() => {
                                setStatusFilter('resolvido');
                                setShowFilters(true);
                            }}
                        >
                            <div className="stat-icon">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Resolvidos</p>
                                <p className="stat-value">{dashboardStats.resolved}</p>
                            </div>
                        </button>

                        <button
                            className="stat-card stat-icon-success"
                            onClick={() => {
                                setStatusFilter('fechado');
                                setShowFilters(true);
                            }}
                        >
                            <div className="stat-icon">
                                <FileText size={24} />
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Fechados</p>
                                <p className="stat-value">{dashboardStats.closed}</p>
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Filters & Search */}
            <div className="card mb-lg">
                <div className="flex flex-col md:flex-row gap-md justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
                        <input
                            type="text"
                            placeholder="Pesquisar por título ou ID..."
                            className="input pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        className={`btn btn-secondary ${showFilters ? 'bg-slate-700' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter size={20} />
                        Filtros
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-md mt-md pt-md border-t border-slate-700 animate-slideDown">
                        <div className="form-group mb-0">
                            <label className="form-label flex items-center gap-xs">
                                <Filter size={14} /> Status
                            </label>
                            <select
                                className="select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="aberto">Aberto</option>
                                <option value="em_andamento">Em Andamento</option>
                                <option value="resolvido">Resolvido</option>
                                <option value="fechado">Fechado</option>
                            </select>
                        </div>

                        <div className="form-group mb-0">
                            <label className="form-label flex items-center gap-xs">
                                <AlertCircle size={14} /> Prioridade
                            </label>
                            <select
                                className="select"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="todos">Todas</option>
                                <option value="baixa">Baixa</option>
                                <option value="media">Média</option>
                                <option value="alta">Alta</option>
                                <option value="urgente">Urgente</option>
                            </select>
                        </div>

                        <div className="form-group mb-0">
                            <label className="form-label flex items-center gap-xs">
                                <Users size={14} /> Técnico
                            </label>
                            <select
                                className="select"
                                value={technicianFilter}
                                onChange={(e) => setTechnicianFilter(e.target.value)}
                            >
                                <option value="all">Todos</option>
                                {DEMO_USERS.filter(u => u.role === 'tecnico').map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mb-0">
                            <label className="form-label flex items-center gap-xs">
                                <CalendarRange size={14} /> Período
                            </label>
                            <select
                                className="select"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >
                                <option value="all">Todo o período</option>
                                <option value="7days">Últimos 7 dias</option>
                                <option value="30days">Últimos 30 dias</option>
                                <option value="thisMonth">Este Mês</option>
                                <option value="lastMonth">Mês Passado</option>
                                <option value="custom">Personalizado</option>
                            </select>
                        </div>

                        {dateFilter === 'custom' && (
                            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-md mt-sm p-sm bg-slate-800 rounded-md">
                                <div className="form-group mb-0">
                                    <label className="form-label text-xs">Data Início</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={customDateStart}
                                        onChange={(e) => setCustomDateStart(e.target.value)}
                                    />
                                </div>
                                <div className="form-group mb-0">
                                    <label className="form-label text-xs">Data Fim</label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={customDateEnd}
                                        onChange={(e) => setCustomDateEnd(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tickets Grid */}
            {filteredTickets.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">📋</div>
                    <h3 className="empty-state-title">Nenhum ticket encontrado</h3>
                    <p>Tente ajustar os filtros ou criar um novo ticket.</p>
                    <button
                        onClick={() => navigate('/create')}
                        className="btn btn-primary mt-md"
                    >
                        Criar Ticket
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-lg">
                    {filteredTickets.map(ticket => (
                        <div
                            key={ticket.id}
                            className="card cursor-pointer hover:border-blue-500/50 group relative"
                            onClick={() => navigate(`/ticket/${ticket.id}`)}
                        >
                            <div className="flex justify-between items-start mb-md">
                                <span className={getStatusBadgeClass(ticket.status)}>
                                    {getStatusLabel(ticket.status)}
                                </span>
                                {ticket.priority === 'urgente' && (
                                    <span className="flex items-center gap-xs text-red-500 text-xs font-bold animate-pulse">
                                        <AlertCircle size={14} />
                                        URGENTE
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-semibold mb-xs group-hover:text-blue-400 transition-colors">
                                {ticket.title}
                            </h3>

                            <div className="flex items-center gap-xs text-sm text-secondary mb-md">
                                <span className="capitalize">{ticket.category}</span>
                            </div>

                            <div className="space-y-sm mb-lg">
                                <div className="flex items-center gap-sm text-sm text-secondary">
                                    <UserCircle size={16} />
                                    Criado por: {DEMO_USERS.find(u => u.id === ticket.createdBy)?.name || 'Desconhecido'}
                                </div>
                                <div className="flex items-center gap-sm text-sm text-secondary">
                                    <CalendarIcon size={16} />
                                    {formatDate(ticket.createdAt)}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-md border-t border-slate-700">
                                <div className="flex items-center gap-sm">
                                    <div className="avatar avatar-sm" title="Técnico Responsável">
                                        {ticket.assignedTo ? 'U' + ticket.assignedTo.split('-')[1] : '?'}
                                    </div>
                                    <span className="text-xs text-secondary">
                                        {ticket.assignedTo ? 'Atribuído' : 'Não atribuído'}
                                    </span>
                                </div>
                                <div className={`text-xs font-bold uppercase ${getPriorityClass(ticket.priority)}`}>
                                    {ticket.priority}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
