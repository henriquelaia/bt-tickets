import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarDay from './CalendarDay';
import LoadingSpinner from '../LoadingSpinner';

export default function ServiceCalendar({ tickets, onTicketMove }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

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

    const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const changeMonth = (offset) => {
        setIsLoading(true);
        // Simulate loading delay for better UX
        setTimeout(() => {
            setCurrentDate(new Date(year, month + offset, 1));
            setIsLoading(false);
        }, 400);
    };

    const handlePrevMonth = () => changeMonth(-1);
    const handleNextMonth = () => changeMonth(1);

    const handleTicketDrop = (ticketId, targetDate) => {
        const newDate = new Date(targetDate);
        newDate.setHours(9, 0, 0, 0);
        onTicketMove(ticketId, newDate.toISOString());
    };

    // Generate calendar grid
    const days = [];

    // Empty slots for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        days.push(
            <div
                key={`empty-${i}`}
                className="calendar-day"
                style={{ opacity: 0.3, cursor: 'default' }}
            />
        );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Filter tickets for this day
        const dayTickets = tickets.filter(ticket => {
            if (!ticket.scheduledDate) return false;
            const ticketDate = new Date(ticket.scheduledDate).toISOString().split('T')[0];
            return ticketDate === dateString;
        });

        const isToday = new Date().toDateString() === date.toDateString();

        days.push(
            <CalendarDay
                key={day}
                date={date}
                tickets={dayTickets}
                onTicketDrop={handleTicketDrop}
                isToday={isToday}
                isWeekend={isWeekend}
            />
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="calendar-container" style={{ position: 'relative', minHeight: '600px' }}>
                {/* Calendar Header with Gradient */}
                <div className="calendar-header">
                    <h2>{monthNames[month]} {year}</h2>
                    <div className="calendar-nav-buttons">
                        <button
                            onClick={handlePrevMonth}
                            className="btn btn-secondary"
                            style={{ minWidth: '40px' }}
                            disabled={isLoading}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="btn btn-secondary"
                            style={{ minWidth: '40px' }}
                            disabled={isLoading}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Weekday Headers */}
                <div className="calendar-weekdays">
                    {weekdayNames.map(day => (
                        <div key={day} className="calendar-weekday">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        top: '80px', // Below header
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                        borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
                    }}>
                        <LoadingSpinner size="large" />
                    </div>
                )}

                {/* Days Grid */}
                <div className="calendar-grid" style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
                    {days}
                </div>
            </div>
        </DndProvider>
    );
}
