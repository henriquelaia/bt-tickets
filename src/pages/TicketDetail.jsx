import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Calendar, User, MapPin, Phone, Wrench, Send, PenTool, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { getStatusName, getPriorityName, getUserById, formatDateTime, getInitials, getCategoryById, getEquipmentTypeById } from '../utils/demoData';
import PhotoUpload from './components/PhotoUpload';
import SignaturePad from '../components/SignaturePad';

const statusOptions = [
    { id: 'pendente', name: 'Pendente' },
    { id: 'agendado', name: 'Agendado' },
    { id: 'em_andamento', name: 'Em Andamento' },
    { id: 'concluido', name: 'Concluído' },
    { id: 'aprovado_cliente', name: 'Aprovado pelo Cliente' },
    { id: 'revisao_necessaria', name: 'Revisão Necessária' },
    { id: 'arquivado', name: 'Arquivado' }
];

export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { getTicketById, updateTicket, addNote, requestRevision, approveTicket, archiveTicket } = useApp();

    const [ticket, setTicket] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [noteVisibleToClient, setNoteVisibleToClient] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [showSignaturePad, setShowSignaturePad] = useState(false);

    useEffect(() => {
        const foundTicket = getTicketById(id);
        if (foundTicket) {
            setTicket(foundTicket);
            setPhotos(foundTicket.photos || []);
        }
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

    const handleSignatureSave = (signatureDataUrl) => {
        // Create a new photo object for the signature
        const signaturePhoto = {
            id: `sig-${Date.now()}`,
            url: signatureDataUrl,
            name: 'Assinatura do Cliente',
            type: 'image/png',
            size: 0,
            createdAt: new Date().toISOString()
        };

        // Update ticket with new photo
        const updatedTicket = {
            ...ticket,
            photos: [...(ticket.photos || []), signaturePhoto]
        };

        updateTicket(updatedTicket);
        setPhotos(updatedTicket.photos);
        setShowSignaturePad(false);
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const note = {
            id: Date.now(),
            author: currentUser.id,
            content: newNote,
            timestamp: new Date().toISOString(),
            visibleToClient: noteVisibleToClient
        };

        addNote(ticket.id, note);

        // Update local ticket state
        const updatedTicket = {
            ...ticket,
            notes: [...(ticket.notes || []), note]
        };
        setTicket(updatedTicket);

        setNewNote('');
        setNoteVisibleToClient(false);
    };

    if (!ticket) {
        return (
            <div className="flex items-center justify-center" style={{ height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Serviço não encontrado</h2>
                    <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const category = getCategoryById(ticket.category);
    const equipment = getEquipmentTypeById(ticket.equipmentType);
    const creator = getUserById(ticket.createdBy);
    const assignee = getUserById(ticket.assignedTo);

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
                            <span className={`badge badge-${ticket.status}`}>
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
                        {/* Client Info */}
                        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Informação do Cliente</h2>

                            <div className="grid grid-cols-1 grid-cols-md-2 gap-lg">
                                <div>
                                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-sm)' }}>
                                        <User size={18} className="text-muted" />
                                        <span className="text-sm text-muted">Nome</span>
                                    </div>
                                    <p className="font-medium">{ticket.clientName}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-sm)' }}>
                                        <Phone size={18} className="text-muted" />
                                        <span className="text-sm text-muted">Telefone</span>
                                    </div>
                                    <p className="font-medium">{ticket.clientPhone}</p>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-sm)' }}>
                                        <MapPin size={18} className="text-muted" />
                                        <span className="text-sm text-muted">Morada</span>
                                    </div>
                                    <p className="font-medium">{ticket.clientAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Equipment Info */}
                        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Equipamento</h2>

                            <div className="grid grid-cols-1 grid-cols-md-3 gap-lg">
                                <div>
                                    <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-sm)' }}>
                                        <Wrench size={18} className="text-muted" />
                                        <span className="text-sm text-muted">Tipo</span>
                                    </div>
                                    <p className="font-medium">{equipment?.icon} {equipment?.name}</p>
                                </div>

                                <div>
                                    <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>Marca</span>
                                    <p className="font-medium">{ticket.equipmentBrand}</p>
                                </div>

                                <div>
                                    <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>Modelo</span>
                                    <p className="font-medium">{ticket.equipmentModel || '-'}</p>
                                </div>
                            </div>

                            {ticket.description && (
                                <div style={{ marginTop: 'var(--space-lg)' }}>
                                    <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--space-sm)' }}>Descrição</span>
                                    <p>{ticket.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Photo Upload */}
                        <div style={{ marginBottom: 'var(--space-xl)' }}>
                            <PhotoUpload photos={photos} onPhotosChange={handlePhotosChange} />
                        </div>

                        {/* Technical Notes */}
                        <div className="card">
                            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Notas Técnicas</h2>

                            {/* Notes Thread */}
                            <div className="notes-thread" style={{ marginBottom: 'var(--space-lg)' }}>
                                {ticket.notes && ticket.notes.length > 0 ? (
                                    ticket.notes.map(note => {
                                        const author = getUserById(note.author);
                                        return (
                                            <div
                                                key={note.id}
                                                className="note-item"
                                                style={{
                                                    background: note.visibleToClient ? 'var(--clr-success-alpha)' : 'var(--clr-bg-tertiary)',
                                                    padding: 'var(--space-md)',
                                                    borderRadius: 'var(--radius-md)',
                                                    marginBottom: 'var(--space-md)',
                                                    border: note.visibleToClient ? '1px solid var(--clr-success)' : '1px solid var(--clr-border)'
                                                }}
                                            >
                                                <div className="flex items-start gap-md">
                                                    <div className="avatar avatar-sm">
                                                        {getInitials(author?.name || 'U')}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xs)' }}>
                                                            <span className="font-medium text-sm">{author?.name}</span>
                                                            <span className="text-xs text-muted">{formatDateTime(note.timestamp)}</span>
                                                        </div>
                                                        <p style={{ margin: 0 }}>{note.content}</p>
                                                        {note.visibleToClient && (
                                                            <span className="text-xs" style={{ color: 'var(--clr-success)', marginTop: 'var(--space-xs)', display: 'block' }}>
                                                                ✓ Visível para o cliente
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-muted text-sm">Ainda não existem notas técnicas.</p>
                                )}
                            </div>

                            {/* Add Note Form */}
                            <div>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Adicionar nova nota..."
                                    className="textarea w-full"
                                    rows={3}
                                    style={{ marginBottom: 'var(--space-sm)' }}
                                />

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-sm cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={noteVisibleToClient}
                                            onChange={(e) => setNoteVisibleToClient(e.target.checked)}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span className="text-sm">Visível para o cliente</span>
                                    </label>

                                    <button
                                        onClick={handleAddNote}
                                        className="btn btn-primary"
                                        disabled={!newNote.trim()}
                                    >
                                        <Send size={18} />
                                        Adicionar Nota
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div>
                        {/* Change Status */}
                        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                            <h3 style={{ marginBottom: 'var(--space-md)' }}>Alterar Status</h3>
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

                            {ticket.scheduledDate && (
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <span className="text-sm text-muted" style={{ display: 'block', marginBottom: 'var(--space-xs)' }}>Data Agendada</span>
                                    <div className="flex items-center gap-xs">
                                        <Calendar size={16} />
                                        <span className="text-sm">{formatDateTime(ticket.scheduledDate)}</span>
                                    </div>
                                </div>
                            )}

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

                        {/* Actions */}
                        <div className="card p-md animate-slideUp" style={{ animationDelay: '0.3s' }}>
                            <h3 className="font-bold mb-md">Ações</h3>

                            <div className="flex flex-col gap-sm">
                                {ticket.status === 'concluido' && (
                                    <button
                                        onClick={() => setShowSignaturePad(true)}
                                        className="btn btn-outline w-full flex justify-center items-center gap-xs"
                                    >
                                        <PenTool size={18} />
                                        Recolher Assinatura
                                    </button>
                                )}

                                {ticket.status === 'concluido' && currentUser?.id === ticket.createdBy && (
                                    <>
                                        <button
                                            onClick={() => approveTicket(ticket.id)}
                                            className="btn btn-success w-full flex justify-center items-center gap-xs"
                                        >
                                            <CheckCircle size={18} />
                                            Aprovar Serviço
                                        </button>
                                        <button
                                            onClick={() => {
                                                const reason = prompt('Motivo da revisão:');
                                                if (reason) requestRevision(ticket.id, reason);
                                            }}
                                            className="btn btn-warning w-full flex justify-center items-center gap-xs"
                                        >
                                            <AlertTriangle size={18} />
                                            Solicitar Revisão
                                        </button>
                                    </>
                                )}

                                {ticket.status === 'aprovado_cliente' && (
                                    <button
                                        onClick={() => archiveTicket(ticket.id)}
                                        className="btn btn-secondary w-full flex justify-center items-center gap-xs"
                                    >
                                        <XCircle size={18} />
                                        Arquivar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Modal */}
            {showSignaturePad && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <SignaturePad
                        onSave={handleSignatureSave}
                        onCancel={() => setShowSignaturePad(false)}
                    />
                </div>
            )}
        </div>
    );
}
