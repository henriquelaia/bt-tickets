import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { DEMO_TICKETS, CATEGORIES, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../utils/demoData';

const AppContext = createContext(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const { showSuccess, showError, showInfo } = useToast();
    const [tickets, setTickets] = useState([]);
    const [categories] = useState(CATEGORIES);
    const [statusOptions] = useState(STATUS_OPTIONS);
    const [priorityOptions] = useState(PRIORITY_OPTIONS);

    // Load tickets from localStorage or use demo data
    useEffect(() => {
        const savedTickets = localStorage.getItem('hvac_tickets');
        if (savedTickets) {
            try {
                setTickets(JSON.parse(savedTickets));
            } catch (error) {
                if (import.meta.env.DEV) {
                    console.error('Failed to load tickets:', error);
                }
                setTickets(DEMO_TICKETS);
            }
        } else {
            setTickets(DEMO_TICKETS);
        }
    }, []);

    // Save tickets to localStorage whenever they change
    useEffect(() => {
        if (tickets.length > 0) {
            localStorage.setItem('hvac_tickets', JSON.stringify(tickets));
        }
    }, [tickets]);

    // Create new ticket
    const createTicket = (ticketData) => {
        if (!currentUser) return { success: false, error: 'Não autenticado' };

        const newTicket = {
            id: `ticket-${Date.now()}`,
            ...ticketData,
            createdBy: currentUser.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            notes: [],
            photos: [],
        };

        setTickets(prev => [newTicket, ...prev]);
        showSuccess('Ticket criado com sucesso!');
        return { success: true, ticket: newTicket };
    };

    // Update ticket
    const updateTicket = (ticketData) => {
        setTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketData.id
                    ? { ...ticket, ...ticketData, updatedAt: new Date().toISOString() }
                    : ticket
            )
        );
        showSuccess('Ticket atualizado com sucesso!');
        return { success: true };
    };

    // Delete ticket
    const deleteTicket = (ticketId) => {
        setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
        showSuccess('Ticket removido com sucesso!');
        return { success: true };
    };

    // Add note to ticket
    const addNote = (ticketId, note) => {
        setTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId
                    ? {
                        ...ticket,
                        notes: [...(ticket.notes || []), note],
                        updatedAt: new Date().toISOString(),
                    }
                    : ticket
            )
        );
        showSuccess('Nota adicionada!');
        return { success: true };
    };

    // Get ticket by ID
    const getTicketById = (ticketId) => {
        return tickets.find(ticket => ticket.id === ticketId) || null;
    };

    // Filter tickets
    const filterTickets = ({ status, category, priority, assignedTo, createdBy }) => {
        return tickets.filter(ticket => {
            if (status && ticket.status !== status) return false;
            if (category && ticket.category !== category) return false;
            if (priority && ticket.priority !== priority) return false;
            if (assignedTo && ticket.assignedTo !== assignedTo) return false;
            if (createdBy && ticket.createdBy !== createdBy) return false;
            return true;
        });
    };

    // Get statistics
    const getStatistics = () => {
        const today = new Date().setHours(0, 0, 0, 0);
        const endOfDay = new Date().setHours(23, 59, 59, 999);

        return {
            total: tickets.length,
            open: tickets.filter(t => t.status === 'aberto').length,
            inProgress: tickets.filter(t => t.status === 'em_andamento').length,
            resolved: tickets.filter(t => t.status === 'resolvido').length,
            closed: tickets.filter(t => t.status === 'fechado').length,
            todayScheduled: 0, // Deprecated but kept for compatibility if needed
            pendingApproval: tickets.filter(t => t.status === 'resolvido').length, // Mapped to resolved for now
            completedMonth: tickets.filter(t => {
                const ticketDate = new Date(t.updatedAt);
                const now = new Date();
                return (
                    t.status === 'fechado' &&
                    ticketDate.getMonth() === now.getMonth() &&
                    ticketDate.getFullYear() === now.getFullYear()
                );
            }).length,
        };
    };

    // Update status
    const updateStatus = (ticketId, status) => {
        setTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, status, updatedAt: new Date().toISOString() }
                    : ticket
            )
        );
        showInfo(`Status alterado para ${status.replace('_', ' ')}`);
        return { success: true };
    };

    // Assign ticket
    const assignTicket = (ticketId, userId) => {
        setTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, assignedTo: userId, updatedAt: new Date().toISOString() }
                    : ticket
            )
        );
        showSuccess('Técnico atribuído com sucesso!');
        return { success: true };
    };

    // Update priority
    const updatePriority = (ticketId, priority) => {
        setTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, priority, updatedAt: new Date().toISOString() }
                    : ticket
            )
        );
        showSuccess('Prioridade atualizada!');
        return { success: true };
    };

    // Analytics Functions
    const getTicketsByTechnician = () => {
        const technicianCounts = {};
        tickets.forEach(ticket => {
            if (ticket.assignedTo) {
                technicianCounts[ticket.assignedTo] = (technicianCounts[ticket.assignedTo] || 0) + 1;
            } else {
                technicianCounts['Unassigned'] = (technicianCounts['Unassigned'] || 0) + 1;
            }
        });
        return Object.entries(technicianCounts).map(([name, value]) => ({ name, value }));
    };

    const getTicketsByStatus = () => {
        const statusCounts = {};
        tickets.forEach(ticket => {
            const statusName = ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            statusCounts[statusName] = (statusCounts[statusName] || 0) + 1;
        });
        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
    };

    const getAverageCompletionTime = () => {
        const completedTickets = tickets.filter(t => t.status === 'fechado');
        if (completedTickets.length === 0) return 0;

        const totalTime = completedTickets.reduce((acc, ticket) => {
            const start = new Date(ticket.createdAt).getTime();
            const end = new Date(ticket.updatedAt).getTime();
            return acc + (end - start);
        }, 0);

        return Math.round(totalTime / completedTickets.length / (1000 * 60 * 60)); // Hours
    };

    const getTicketsTrend = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const count = tickets.filter(t => {
                const ticketDate = new Date(t.createdAt).toISOString().split('T')[0];
                return ticketDate === date;
            }).length;
            return { date: date.split('-').slice(1).join('/'), tickets: count };
        });
    };

    const getTechnicianStats = (userId) => {
        const techTickets = tickets.filter(t => t.assignedTo === userId);
        const completed = techTickets.filter(t => t.status === 'fechado').length;
        const pending = techTickets.filter(t => t.status !== 'fechado').length;

        return {
            total: techTickets.length,
            completed,
            pending,
            completionRate: techTickets.length ? Math.round((completed / techTickets.length) * 100) : 0
        };
    };

    const searchTickets = (query) => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return tickets.filter(ticket =>
            ticket.id.toLowerCase().includes(lowerQuery) ||
            ticket.title.toLowerCase().includes(lowerQuery) ||
            ticket.description.toLowerCase().includes(lowerQuery)
        );
    };

    const value = {
        tickets,
        categories,
        statusOptions,
        priorityOptions,
        createTicket,
        updateTicket,
        deleteTicket,
        addNote,
        updateStatus,
        assignTicket,
        updatePriority,
        getTicketById,
        filterTickets,
        getStatistics,
        getTicketsByTechnician,
        getTicketsByStatus,
        getAverageCompletionTime,
        getTicketsTrend,
        getTechnicianStats,
        searchTickets,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
