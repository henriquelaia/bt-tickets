import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, User, Send, CheckCircle, AlertTriangle, XCircle, CheckCircle2, RotateCcw, FileText } from 'lucide-react';
import { getStatusName, getPriorityName, getUserById, formatDateTime, getInitials, getCategoryById } from '../utils/demoData';
import PhotoUpload from '../pages/components/PhotoUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import ResolutionModal from '../components/ResolutionModal';

const statusOptions = [
    { id: 'aberto', name: 'Aberto' },
    { id: 'em_andamento', name: 'Em Andamento' },
    { id: 'resolvido', name: 'Resolvido' },
    { id: 'fechado', name: 'Fechado' }
];

export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { getTicketById, updateTicket, addNote } = useApp();

    const [ticket, setTicket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [photos, setPhotos] = useState([]);
    const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        // Simulate network request
        const timer = setTimeout(() => {
            const foundTicket = getTicketById(id);
            if (foundTicket) {
                setTicket(foundTicket);
                setPhotos(foundTicket.photos || []);
            }
            setIsLoading(false);
        }, 600);

        return () => clearTimeout(timer);
    }, [id, getTicketById]);

    const handleStatusChange = (newStatus) => {
        if (ticket) {
            const updatedTicket = { ...ticket, status: newStatus };
            updateTicket(updatedTicket);
            setTicket(updatedTicket);
        }
    };

    const handlePhotosChange = (newPhotos) => {
        setPhotos(newPhotos);
        if (ticket) {
            const updatedTicket = { ...ticket, photos: newPhotos };
            updateTicket(updatedTicket);
        }
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const note = {
            id: Date.now(),
            author: currentUser.id,
            content: newNote,
            timestamp: new Date().toISOString(),
            isResolution: false
        };

        addNote(ticket.id, note);

        // Update local ticket state
        const updatedTicket = {
            ...ticket,
            notes: [...(ticket.notes || []), note]
        };
        setTicket(updatedTicket);
        setNewNote('');
    };

    const handleResolve = (resolutionNote) => {
        const note = {
            id: Date.now(),
            author: currentUser.id,
            content: resolutionNote,
            timestamp: new Date().toISOString(),
            isResolution: true
        };

        addNote(ticket.id, note);

        const updatedTicket = {
            ...ticket,
            status: 'resolvido',
            notes: [...(ticket.notes || []), note],
            resolvedAt: new Date().toISOString(),
            resolvedBy: currentUser.id
        };

        updateTicket(updatedTicket);
        setTicket(updatedTicket);
    };

    const handleClose = () => {
        const updatedTicket = {
            ...ticket,
            status: 'fechado',
            closedAt: new Date().toISOString(),
            closedBy: currentUser.id
        };
        updateTicket(updatedTicket);
        setTicket(updatedTicket);
    };

    const handleReopen = () => {
        const reason = prompt('Motivo da reabertura:');
        if (!reason) return;

        const note = {
            id: Date.now(),
            author: currentUser.id,
            content: `Ticket reaberto. Motivo: ${reason}`,
            timestamp: new Date().toISOString(),
            isSystem: true
        };

        addNote(ticket.id, note);

        const updatedTicket = {
            ...ticket,
            status: 'em_andamento',
            notes: [...(ticket.notes || []), note]
        };

        updateTicket(updatedTicket);
        setTicket(updatedTicket);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center" style={{ height: '100vh' }}>
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex items-center justify-center" style={{ height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Ticket não encontrado</h2>
                    <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const category = getCategoryById(ticket.category);
    const creator = getUserById(ticket.createdBy);
    const assignee = getUserById(ticket.assignedTo);
    const resolutionNote = ticket.notes?.find(n => n.isResolution);

    // Permission checks
    const isCreator = currentUser.id === ticket.createdBy;
    const isAssignee = currentUser.id === ticket.assignedTo;
    const canResolve = (isAssignee || isCreator) && (ticket.status === 'aberto' || ticket.status === 'em_andamento');
    const canVerify = isCreator && ticket.status === 'resolvido';

    return (
        <div>
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
                    <div className="flex-1">
                        <div className="flex items-center gap-md" style={{ marginBottom: 'var(--space-xs)' }}>
                            <span className={`badge badge-${ticket.status === 'aberto' ? 'pendente' : ticket.status === 'resolvido' ? 'concluido' : ticket.status === 'fechado' ? 'aprovado' : 'em-andamento'}`}>
                                {getStatusName(ticket.status)}
                            </span>
                            {ticket.priority === 'urgente' && (
                                <span className="text-xs font-semibold priority-urgente">⚠ URGENTE</span>
                            )}
                        </div>
                        <h1 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 0 }}>
                            {ticket.title}
                        </h1>
                    </div>
                </div>
            </header>

            <div className="container" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
                <div className="grid grid-cols-1 grid-cols-lg-3 gap-xl">
                    {/* Main Content */}
                    <div style={{ gridColumn: 'span 2' }}>

                        {/* Resolution Note (if resolved) */}
                        {resolutionNote && (
                            <div className="card mb-xl border-success bg-success-alpha">
                                <div className="flex items-center gap-sm mb-md text-success">
                                    <CheckCircle2 size={24} />
                                    <h2 className="text-lg font-bold m-0">Resolução</h2>
                                </div>
                                <p className="text-lg">{resolutionNote.content}</p>
                                <div className="flex items-center gap-sm mt-md text-sm text-secondary">
                                    <User size={14} />
                                    <span>Resolvido por {getUserById(resolutionNote.author)?.name}</span>
                                    <span>•</span>
                                    <Calendar size={14} />
                                    <span>{formatDateTime(resolutionNote.timestamp)}</span>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Descrição</h2>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
                        </div>

                        {/* Photo Upload */}
                        <div style={{ marginBottom: 'var(--space-xl)' }}>
                            <PhotoUpload photos={photos} onPhotosChange={handlePhotosChange} />
                        </div>

                        {/* Activity / Notes */}
                        <div className="card">
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Atividade e Notas</h2>

                            <div className="notes-thread" style={{ marginBottom: 'var(--space-lg)' }}>
                                {ticket.notes && ticket.notes.length > 0 ? (
                                    ticket.notes.filter(n => !n.isResolution).map(note => {
                                        const author = getUserById(note.author);
                                        return (
                                            <div
                                                key={note.id}
                                                className="note-item"
                                                style={{
                                                    background: note.isSystem ? 'var(--clr-bg-secondary)' : 'var(--clr-bg-tertiary)',
                                                    padding: 'var(--space-md)',
                                                    borderRadius: 'var(--radius-md)',
                                                    marginBottom: 'var(--space-md)',
                                                    border: note.isSystem ? '1px dashed var(--clr-border)' : '1px solid var(--clr-border)'
                                                }}
                                            >
                                                <div className="flex items-start gap-md">
                                                    <div className="avatar avatar-sm">
                                                        {getInitials(author?.name || 'S')}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xs)' }}>
                                                            <span className="font-medium text-sm">{author?.name || 'Sistema'}</span>
                                                            <span className="text-xs text-muted">{formatDateTime(note.timestamp)}</span>
                                                        </div>
                                                        <p style={{ margin: 0 }}>{note.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-muted text-sm">Nenhuma atividade recente.</p>
                                )}
                            </div>

                            {/* Add Note Form */}
                            <div>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Adicionar comentário ou atualização..."
                                    className="textarea w-full"
                                    rows={3}
                                    style={{ marginBottom: 'var(--space-sm)' }}
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAddNote}
                                        className="btn btn-primary"
                                        disabled={!newNote.trim()}
                                    >
                                        <Send size={18} />
                                        Comentar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Actions Card */}
                        <div className="card mb-lg animate-slideUp">
                            <h3 className="font-bold mb-md">Ações</h3>

                            <div className="flex flex-col gap-sm">
                                {canResolve && (
                                    <button
                                        onClick={() => setIsResolutionModalOpen(true)}
                                        className="btn btn-success w-full flex justify-center items-center gap-xs"
                                    >
                                        <CheckCircle2 size={18} />
                                        Resolver Ticket
                                    </button>
                                )}

                                {canVerify && (
                                    <>
                                        <button
                                            onClick={handleClose}
                                            className="btn btn-primary w-full flex justify-center items-center gap-xs"
                                        >
                                            <FileText size={18} />
                                            Fechar Ticket
                                        </button>
                                        <button
                                            onClick={handleReopen}
                                            className="btn btn-warning w-full flex justify-center items-center gap-xs"
                                        >
                                            <RotateCcw size={18} />
                                            Reabrir
                                        </button>
                                    </>
                                )}

                                {ticket.status === 'fechado' && (
                                    <div className="p-sm bg-slate-800 rounded text-center text-sm text-muted">
                                        Ticket fechado em {formatDateTime(ticket.closedAt)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Select (Manual Override) */}
                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ marginBottom: 'var(--space-md)' }}>Status</h3>
                            <select
                                className="select w-full"
                                value={ticket.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                {statusOptions.map(status => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Details Card */}
                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Detalhes</h3>

                            <div style={{ marginBottom: 'var(--space-md)' }}>
                                <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Categoria</span>
                                <span className="badge" style={{ background: category?.color }}>{category?.name}</span>
                            </div>

                            <div style={{ marginBottom: 'var(--space-md)' }}>
                                <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Prioridade</span>
                                <span className={`font-semibold priority-${ticket.priority}`}>
                                    {getPriorityName(ticket.priority)}
                                </span>
                            </div>

                            <div style={{ marginBottom: 'var(--space-md)' }}>
                                <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Criado por</span>
                                <div className="flex items-center gap-sm">
                                    <div className="avatar avatar-sm">{getInitials(creator?.name || 'U')}</div>
                                    <span className="text-sm">{creator?.name}</span>
                                </div>
                            </div>

                            {assignee && (
                                <div>
                                    <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Atribuído a</span>
                                    <div className="flex items-center gap-sm">
                                        <div className="avatar avatar-sm">{getInitials(assignee.name)}</div>
                                        <span className="text-sm">{assignee.name}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ResolutionModal
                isOpen={isResolutionModalOpen}
                onClose={() => setIsResolutionModalOpen(false)}
                onConfirm={handleResolve}
            />
        </div>
    );
}
