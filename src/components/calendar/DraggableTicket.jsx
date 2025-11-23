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
            className={`calendar-ticket draggable-ticket status-${ticket.status} ${isDragging ? 'dragging' : ''}`}
        >
            <div className="calendar-ticket-title">{ticket.title}</div>
            <div className="flex justify-between items-center">
                <span className={`badge badge-${ticket.status}`} style={{ fontSize: '0.65rem', padding: '2px 4px' }}>
                    {getStatusName(ticket.status)}
                </span>
                {assignedUser && (
                    <div className="avatar" style={{ width: '16px', height: '16px', fontSize: '8px' }}>
                        {getInitials(assignedUser.name)}
                    </div>
                )}
            </div>
        </div>
    );
}
