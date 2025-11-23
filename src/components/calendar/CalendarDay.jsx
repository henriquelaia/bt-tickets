import { useDrop } from 'react-dnd';
import DraggableTicket from './DraggableTicket';

export default function CalendarDay({ date, tickets, onTicketDrop, isToday, isWeekend }) {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'TICKET',
        drop: (item) => onTicketDrop(item.id, date),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const dayNumber = date.getDate();

    return (
        <div
            ref={drop}
            className={`calendar-day ${isToday ? 'today' : ''} ${isOver ? 'drag-over' : ''} ${isWeekend ? 'weekend' : ''}`}
        >
            <div className="calendar-day-number">
                {dayNumber}
            </div>

            <div className="calendar-day-tickets">
                {tickets.map(ticket => (
                    <DraggableTicket key={ticket.id} ticket={ticket} />
                ))}
            </div>
        </div>
    );
}
