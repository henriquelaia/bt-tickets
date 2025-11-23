import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetail from './pages/TicketDetail';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Layout from './components/Layout';
import ServiceCalendar from './components/calendar/ServiceCalendar';
import { useApp } from './context/AppContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { currentUser, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center" style={{ height: '100vh' }}>
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const CalendarPage = () => {
    const { tickets, updateTicket } = useApp();

    const handleTicketMove = (ticketId, newDate) => {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            const updates = { scheduledDate: newDate };
            if (ticket.status === 'pendente') {
                updates.status = 'agendado';
            }
            updateTicket(ticketId, updates);
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold text-primary mb-xl">Calendário de Serviços</h1>
            <ServiceCalendar tickets={tickets} onTicketMove={handleTicketMove} />
        </div>
    );
};

function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <AppProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* Protected Routes wrapped in Layout */}
                                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                                    <Route index element={<Navigate to="/dashboard" replace />} />

                                    <Route path="dashboard" element={<Dashboard filterType="all" />} />
                                    <Route path="my-work" element={<Dashboard filterType="assigned" />} />
                                    <Route path="my-requests" element={<Dashboard filterType="created" />} />
                                    <Route path="calendar" element={<CalendarPage />} />

                                    <Route path="create" element={<CreateTicket />} />
                                    <Route path="ticket/:id" element={<TicketDetail />} />
                                    <Route path="analytics" element={<AnalyticsDashboard />} />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </AppProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}

export default App;
