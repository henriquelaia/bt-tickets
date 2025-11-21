import { useDrag } from 'react-dnd';
import { getStatusName, getPriorityName, getInitials, getUserById } from '../../utils/demoData';

export default function DraggableTicket({ ticket }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'TICKET',
        item: { id: ticket.id, originalDate: ticket.scheduledDate },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const assignedUser = getUserById(ticket.assignedTo);

    return (
        <div
            ref={drag}
            className="ticket-card-mini"
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: 'grab',
                background: 'var(--clr-bg-secondary)',
                padding: 'var(--space-xs) var(--space-sm)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-xs)',
                borderLeft: `3px solid var(--priority-${ticket.priority})`,
                fontSize: '0.75rem',
                boxShadow: 'var(--shadow-sm)'
            }}
        >
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold truncate" style={{ maxWidth: '80%' }}>{ticket.title}</span>
                {assignedUser && (
                    <div className="avatar avatar-xs" style={{ width: '16px', height: '16px', fontSize: '8px' }}>
                        {getInitials(assignedUser.name)}
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center">
                <span className={`badge badge-${ticket.status} text-xs`} style={{ padding: '2px 4px', fontSize: '0.65rem' }}>
                    {getStatusName(ticket.status)}
                </span>
                <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                    {ticket.id}
                </span>
            </div>
        </div>
    );
}
