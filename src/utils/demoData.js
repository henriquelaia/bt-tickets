// Demo data for HVAC Service Management System

export const DEMO_USERS = [
    {
        id: 'user-1',
        name: 'Ana Silva',
        email: 'ana.silva@btservices.pt',
        password: 'pass123', // In production, this would be hashed
        role: 'tecnico',
        avatar: null,
        createdAt: new Date('2024-01-15').getTime(),
    },
    {
        id: 'user-2',
        name: 'Bruno Costa',
        email: 'bruno.costa@btservices.pt',
        password: 'pass123',
        role: 'instalador',
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
    {
        id: 'user-5',
        name: 'Eduardo Santos',
        email: 'eduardo.santos@btservices.pt',
        password: 'pass123',
        role: 'orcamentista',
        avatar: null,
        createdAt: new Date('2024-01-25').getTime(),
    },
];

export const CATEGORIES = [
    { id: 'instalacao', name: 'Instalação', color: '#3b82f6' },
    { id: 'manutencao', name: 'Manutenção', color: '#10b981' },
    { id: 'orcamento', name: 'Orçamento', color: '#f59e0b' },
    { id: 'assistencia_tecnica', name: 'Assistência Técnica', color: '#ef4444' },
    { id: 'reparacao', name: 'Reparação', color: '#8b5cf6' },
];

export const EQUIPMENT_TYPES = [
    { id: 'ac', name: 'Ar Condicionado', icon: '❄️' },
    { id: 'bomba_calor', name: 'Bomba de Calor', icon: '🔥' },
    { id: 'lareira', name: 'Lareira', icon: '🔥' },
    { id: 'eletrodomestico_grande', name: 'Eletrodoméstico Grande', icon: '🏠' },
    { id: 'eletrodomestico_pequeno', name: 'Eletrodoméstico Pequeno', icon: '⚡' },
];

export const STATUS_OPTIONS = [
    { id: 'pendente', name: 'Pendente' },
    { id: 'agendado', name: 'Agendado' },
    { id: 'em_andamento', name: 'Em Andamento' },
    { id: 'concluido', name: 'Concluído' },
    { id: 'aprovado_cliente', name: 'Aprovado pelo Cliente' },
    { id: 'revisao_necessaria', name: 'Revisão Necessária' },
    { id: 'arquivado', name: 'Arquivado' },
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
        title: 'Instalação de AC Split 12000 BTU',
        description: 'Cliente solicitou instalação de ar condicionado split na sala de estar. Local já está preparado com pré-instalação.',
        category: 'instalacao',
        equipmentType: 'ac',
        equipmentBrand: 'Daikin',
        equipmentModel: 'FTXS35K',
        clientName: 'João Pedro Silva',
        clientPhone: '+351 912 345 678',
        clientAddress: 'Rua das Flores, 123, 4º Esq, Lisboa',
        scheduledDate: new Date('2025-11-22T10:00:00').getTime(),
        priority: 'alta',
        status: 'agendado',
        createdBy: 'user-3', // Carlos (Gestor)
        assignedTo: 'user-2', // Bruno (Instalador)
        createdAt: new Date('2025-11-18').getTime(),
        updatedAt: new Date('2025-11-19').getTime(),
        comments: [
            {
                id: 'comment-1',
                author: 'user-3',
                content: 'Cliente preferencial, garantir execução impecável.',
                timestamp: new Date('2025-11-18T14:30:00').getTime(),
                visibleToClient: false,
            },
            {
                id: 'comment-2',
                author: 'user-2',
                content: 'Material já separado. Confirmar horário 9h-10h com cliente.',
                timestamp: new Date('2025-11-19T09:00:00').getTime(),
                visibleToClient: false,
            },
        ],
        attachments: [],
    },
    {
        id: 'ticket-2',
        title: 'Manutenção Anual Bomba de Calor',
        description: 'Manutenção preventiva agendada conforme contrato. Verificar fluido, filtros e sistema elétrico.',
        category: 'manutencao',
        equipmentType: 'bomba_calor',
        equipmentBrand: 'Mitsubishi',
        equipmentModel: 'Ecodan PUHZ-SW100',
        clientName: 'Maria Santos',
        clientPhone: '+351 963 789 012',
        clientAddress: 'Av. da Liberdade, 456, Sintra',
        scheduledDate: new Date('2025-11-21T14:00:00').getTime(),
        priority: 'media',
        status: 'em_andamento',
        createdBy: 'user-3',
        assignedTo: 'user-1', // Ana (Técnico)
        createdAt: new Date('2025-11-10').getTime(),
        updatedAt: new Date('2025-11-20').getTime(),
        comments: [
            {
                id: 'comment-3',
                author: 'user-1',
                content: 'Iniciada verificação. Filtros precisam substituição.',
                timestamp: new Date('2025-11-20T14:15:00').getTime(),
                visibleToClient: false,
            },
        ],
        attachments: [],
    },
    {
        id: 'ticket-3',
        title: 'Orçamento - Lareira a Pellets',
        description: 'Cliente interessado em instalação de lareira a pellets em moradia. Solicita orçamento completo com instalação e material.',
        category: 'orcamento',
        equipmentType: 'lareira',
        equipmentBrand: 'A definir',
        equipmentModel: 'A definir',
        clientName: 'Rui Oliveira',
        clientPhone: '+351 927 456 123',
        clientAddress: 'Rua do Sol, 78, Cascais',
        scheduledDate: null,
        priority: 'baixa',
        status: 'pendente',
        createdBy: 'user-5', // Eduardo (Orçamentista)
        assignedTo: 'user-5',
        createdAt: new Date('2025-11-19').getTime(),
        updatedAt: new Date('2025-11-19').getTime(),
        comments: [
            {
                id: 'comment-4',
                author: 'user-5',
                content: 'Agendada visita técnica para dia 23/11 às 11h para medições.',
                timestamp: new Date('2025-11-19T16:00:00').getTime(),
                visibleToClient: true,
            },
        ],
        attachments: [],
    },
    {
        id: 'ticket-4',
        title: 'Reparação Urgente - Fuga de Gás',
        description: 'URGENTE: Cliente reporta cheiro a gás no AC. Necessita intervenção imediata.',
        category: 'assistencia_tecnica',
        equipmentType: 'ac',
        equipmentBrand: 'LG',
        equipmentModel: 'Artcool',
        clientName: 'Sofia Martins',
        clientPhone: '+351 918 234 567',
        clientAddress: 'Praça do Comércio, 12, 2º, Lisboa',
        scheduledDate: new Date('2025-11-20T16:00:00').getTime(),
        priority: 'urgente',
        status: 'concluido',
        createdBy: 'user-3',
        assignedTo: 'user-4', // Diana (Técnico)
        createdAt: new Date('2025-11-20T13:00:00').getTime(),
        updatedAt: new Date('2025-11-20T18:30:00').getTime(),
        comments: [
            {
                id: 'comment-5',
                author: 'user-4',
                content: 'Detetada fuga na válvula. Substituição efetuada. Sistema testado e pressurizado.',
                timestamp: new Date('2025-11-20T17:45:00').getTime(),
                visibleToClient: false,
            },
            {
                id: 'comment-6',
                author: 'user-4',
                content: 'Serviço concluído. Cliente satisfeito. Aguarda aprovação para arquivar.',
                timestamp: new Date('2025-11-20T18:30:00').getTime(),
                visibleToClient: false,
            },
        ],
        attachments: [],
    },
];

// Helper functions
export const getUserById = (userId) => {
    return DEMO_USERS.find(user => user.id === userId);
};

export const getCategoryById = (categoryId) => {
    return CATEGORIES.find(cat => cat.id === categoryId);
};

export const getEquipmentTypeById = (typeId) => {
    return EQUIPMENT_TYPES.find(type => type.id === typeId);
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
        instalador: 'Instalador',
        gestor: 'Gestor',
        orcamentista: 'Orçamentista',
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
