import { useDrop } from 'react-dnd';
import DraggableTicket from './DraggableTicket';

export default function CalendarDay({ date, tickets, onTicketDrop, isToday }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'TICKET',
        drop: (item) => onTicketDrop(item.id, date),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const dayNumber = date.getDate();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    return (
        <div
            ref={drop}
            style={{
                minHeight: '120px',
                background: isOver ? 'var(--clr-bg-hover)' : (isWeekend ? 'var(--clr-bg-tertiary)' : 'var(--clr-bg-secondary)'),
                border: isToday ? '2px solid var(--clr-primary)' : '1px solid var(--clr-border)',
                padding: 'var(--space-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-xs)',
                opacity: isWeekend ? 0.8 : 1
            }}
        >
            <div className="text-right" style={{ marginBottom: 'var(--space-xs)' }}>
                <span
                    style={{
                        display: 'inline-block',
                        width: '24px',
                        height: '24px',
                        lineHeight: '24px',
                        textAlign: 'center',
                        borderRadius: '50%',
                        background: isToday ? 'var(--clr-primary)' : 'transparent',
                        color: isToday ? 'white' : 'inherit',
                        fontWeight: isToday ? 'bold' : 'normal',
                        fontSize: '0.85rem'
                    }}
                >
                    {dayNumber}
                </span>
            </div>

            <div className="flex-1">
                {tickets.map(ticket => (
                    <DraggableTicket key={ticket.id} ticket={ticket} />
                ))}
            </div>
        </div>
    );
}
