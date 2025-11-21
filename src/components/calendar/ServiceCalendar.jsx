import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarDay from './CalendarDay';

export default function ServiceCalendar({ tickets, onTicketMove }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay(); // 0 = Sunday
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleTicketDrop = (ticketId, targetDate) => {
        // Set time to 09:00 by default for dropped items if they don't have time
        const newDate = new Date(targetDate);
        newDate.setHours(9, 0, 0, 0);
        onTicketMove(ticketId, newDate.toISOString());
    };

    // Generate calendar grid
    const days = [];

    // Empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} style={{ background: 'var(--clr-bg-tertiary)', opacity: 0.3 }}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];

        // Filter tickets for this day
        const dayTickets = tickets.filter(ticket => {
            if (!ticket.scheduledDate) return false;
            return ticket.scheduledDate.startsWith(dateString);
        });

        const isToday = new Date().toDateString() === date.toDateString();

        days.push(
            <CalendarDay
                key={day}
                date={date}
                tickets={dayTickets}
                onTicketDrop={handleTicketDrop}
                isToday={isToday}
            />
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="calendar-container">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-lg">
                    <h2 style={{ margin: 0 }}>{monthNames[month]} {year}</h2>
                    <div className="flex gap-sm">
                        <button onClick={handlePrevMonth} className="btn btn-secondary btn-icon">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={handleNextMonth} className="btn btn-secondary btn-icon">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-xs mb-xs text-center">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                        <div key={day} className="font-bold text-sm text-muted py-sm">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-xs" style={{ background: 'var(--clr-border)', padding: '1px', gap: '1px' }}>
                    {days}
                </div>
            </div>
        </DndProvider>
    );
}
