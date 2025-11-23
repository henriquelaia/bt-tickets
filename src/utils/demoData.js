// Demo data for Internal Ticketing System

export const DEMO_USERS = [
    {
        id: 'user-1',
        name: 'Ana Silva',
        email: 'ana.silva@btservices.pt',
        password: 'pass123',
        role: 'tecnico',
        avatar: null,
        createdAt: new Date('2024-01-15').getTime(),
    },
    {
        id: 'user-2',
        name: 'Bruno Costa',
        email: 'bruno.costa@btservices.pt',
        password: 'pass123',
        role: 'tecnico',
        avatar: null,
        createdAt: new Date('2024-01-20').getTime(),
    },
    {
        id: 'user-3',
        name: 'Carlos Mendes',
        email: 'carlos.mendes@btservices.pt',
        password: 'pass123',
        role: 'gestor',
        avatar: null,
        createdAt: new Date('2024-01-10').getTime(),
    },
    {
        id: 'user-4',
        name: 'Diana Rocha',
        email: 'diana.rocha@btservices.pt',
        password: 'pass123',
        role: 'tecnico',
        avatar: null,
        createdAt: new Date('2024-02-01').getTime(),
    },
];

export const CATEGORIES = [
    { id: 'duvida', name: 'Dúvida Técnica', color: '#3b82f6' },
    { id: 'bug', name: 'Reportar Erro/Bug', color: '#ef4444' },
    { id: 'melhoria', name: 'Sugestão de Melhoria', color: '#10b981' },
    { id: 'tarefa', name: 'Tarefa Interna', color: '#f59e0b' },
    { id: 'acesso', name: 'Acessos/Permissões', color: '#8b5cf6' },
];

// Removed EQUIPMENT_TYPES as it's no longer needed

export const STATUS_OPTIONS = [
    { id: 'aberto', name: 'Aberto' },
    { id: 'em_andamento', name: 'Em Andamento' },
    { id: 'resolvido', name: 'Resolvido (Aguardando Verificação)' },
    { id: 'fechado', name: 'Fechado' },
];

export const PRIORITY_OPTIONS = [
    { id: 'baixa', name: 'Baixa' },
    { id: 'media', name: 'Média' },
    { id: 'alta', name: 'Alta' },
    { id: 'urgente', name: 'Urgente' },
];

export const DEMO_TICKETS = [
    {
        id: 'ticket-1',
        title: 'Erro no login do portal antigo',
        description: 'Não consigo acessar o portal legado com as minhas credenciais. Aparece erro 500.',
        category: 'bug',
        priority: 'alta',
        status: 'aberto',
        createdBy: 'user-1', // Ana
        assignedTo: 'user-3', // Carlos
        createdAt: new Date('2025-11-22T10:00:00').getTime(),
        updatedAt: new Date('2025-11-22T10:00:00').getTime(),
        comments: [],
        attachments: [],
        resolutionNote: null,
    },
    {
        id: 'ticket-2',
        title: 'Dúvida sobre novo procedimento de backup',
        description: 'Onde devo salvar os arquivos de backup manual agora? No servidor X ou Y?',
        category: 'duvida',
        priority: 'media',
        status: 'resolvido',
        createdBy: 'user-2', // Bruno
        assignedTo: 'user-3', // Carlos
        createdAt: new Date('2025-11-21T14:00:00').getTime(),
        updatedAt: new Date('2025-11-21T16:00:00').getTime(),
        comments: [
            {
                id: 'comment-1',
                author: 'user-3',
                content: 'Bruno, por favor use o servidor Y a partir de agora.',
                timestamp: new Date('2025-11-21T15:00:00').getTime(),
            }
        ],
        attachments: [],
        resolutionNote: 'Dúvida esclarecida. Servidor Y é o correto.',
        resolvedAt: new Date('2025-11-21T16:00:00').getTime(),
        resolvedBy: 'user-3'
    },
    {
        id: 'ticket-3',
        title: 'Atualizar documentação da API',
        description: 'A documentação da API de clientes está desatualizada no endpoint de busca.',
        category: 'tarefa',
        priority: 'baixa',
        status: 'em_andamento',
        createdBy: 'user-3', // Carlos
        assignedTo: 'user-4', // Diana
        createdAt: new Date('2025-11-20T09:00:00').getTime(),
        updatedAt: new Date('2025-11-20T11:00:00').getTime(),
        comments: [],
        attachments: [],
        resolutionNote: null,
    },
];

// Helper functions
export const getUserById = (userId) => {
    return DEMO_USERS.find(user => user.id === userId);
};

export const getCategoryById = (categoryId) => {
    return CATEGORIES.find(cat => cat.id === categoryId);
};

export const getStatusName = (statusId) => {
    const status = STATUS_OPTIONS.find(s => s.id === statusId);
    return status ? status.name : statusId;
};

export const getPriorityName = (priorityId) => {
    const priority = PRIORITY_OPTIONS.find(p => p.id === priorityId);
    return priority ? priority.name : priorityId;
};

export const getRoleName = (role) => {
    const roles = {
        tecnico: 'Técnico',
        gestor: 'Gestor',
    };
    return roles[role] || role;
};

// Generate initials from name
export const getInitials = (name) => {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Format date
export const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

// Format date and time
export const formatDateTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
