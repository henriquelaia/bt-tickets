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
    Calendar as CalendarIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = ({ filterType = 'all' }) => {
    const navigate = useNavigate();
    const { tickets, getStatistics } = useApp();
    const { currentUser } = useAuth();
    const stats = getStatistics();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [priorityFilter, setPriorityFilter] = useState('todos');
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
                ticket.clientName.toLowerCase().includes(searchLower) ||
                ticket.id.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            // 3. Status Filter
            if (statusFilter !== 'todos' && ticket.status !== statusFilter) return false;

            // 4. Priority Filter
            if (priorityFilter !== 'todos' && ticket.priority !== priorityFilter) return false;

            return true;
        });
    }, [tickets, filterType, currentUser.id, searchTerm, statusFilter, priorityFilter]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pendente': return 'badge badge-pendente';
            case 'agendado': return 'badge badge-agendado';
            case 'em_andamento': return 'badge badge-em-andamento';
            case 'concluido': return 'badge badge-concluido';
            case 'aprovado': return 'badge badge-aprovado';
            case 'revisao': return 'badge badge-revisao';
            case 'arquivado': return 'badge badge-arquivado';
            default: return 'badge';
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

    const formatDate = (dateString) => {
        if (!dateString) return 'Não agendado';
        return new Date(dateString).toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getPageTitle = () => {
        switch (filterType) {
            case 'assigned': return 'Meus Trabalhos';
            case 'created': return 'Meus Pedidos';
            default: return 'Visão Geral';
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col gap-md mb-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">{getPageTitle()}</h1>
                        <p className="text-secondary">Bem-vindo de volta, {currentUser?.name}</p>
                    </div>
                    <button
                        onClick={() => navigate('/create')}
                        className="btn btn-primary btn-lg"
                    >
                        <Plus size={20} />
                        Novo Serviço
                    </button>
                </div>

                {/* Stats Cards - Only show on main dashboard */}
                {filterType === 'all' && (
                    <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-md">
                        <div className="card flex items-center gap-md">
                            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
                                <CalendarIcon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Agendados Hoje</p>
                                <p className="text-2xl font-bold">{stats.todayScheduled}</p>
                            </div>
                        </div>

                        <div className="card flex items-center gap-md">
                            <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Em Andamento</p>
                                <p className="text-2xl font-bold">{stats.inProgress}</p>
                            </div>
                        </div>

                        <div className="card flex items-center gap-md">
                            <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Pendentes Aprovação</p>
                                <p className="text-2xl font-bold">{stats.pendingApproval}</p>
                            </div>
                        </div>

                        <div className="card flex items-center gap-md">
                            <div className="p-3 rounded-full bg-green-500/10 text-green-500">
                                <ArrowUpRight size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Concluídos Mês</p>
                                <p className="text-2xl font-bold">{stats.completedMonth}</p>
                            </div>
                        </div>
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
                            placeholder="Pesquisar serviços, clientes..."
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-md pt-md border-t border-slate-700 animate-slideDown">
                        <div className="form-group mb-0">
                            <label className="form-label">Status</label>
                            <select
                                className="select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="pendente">Pendente</option>
                                <option value="agendado">Agendado</option>
                                <option value="em_andamento">Em Andamento</option>
                                <option value="concluido">Concluído</option>
                                <option value="aprovado">Aprovado</option>
                            </select>
                        </div>

                        <div className="form-group mb-0">
                            <label className="form-label">Prioridade</label>
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
                    </div>
                )}
            </div>

            {/* Tickets Grid */}
            {filteredTickets.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">📋</div>
                    <h3 className="empty-state-title">Nenhum serviço encontrado</h3>
                    <p>Tente ajustar os filtros ou criar um novo serviço.</p>
                    <button
                        onClick={() => navigate('/create')}
                        className="btn btn-primary mt-md"
                    >
                        Criar Serviço
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
                                    {ticket.status.replace('_', ' ')}
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
                                <span className="capitalize">{ticket.equipmentType.replace('_', ' ')}</span>
                                <span>•</span>
                                <span className="capitalize">{ticket.category}</span>
                            </div>

                            <div className="space-y-sm mb-lg">
                                <div className="flex items-center gap-sm text-sm text-secondary">
                                    <UserCircle size={16} />
                                    {ticket.clientName}
                                </div>
                                <div className="flex items-center gap-sm text-sm text-secondary">
                                    <CalendarIcon size={16} />
                                    {formatDate(ticket.scheduledDate)}
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
