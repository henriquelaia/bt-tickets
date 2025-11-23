import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    ClipboardList,
    Briefcase,
    Menu,
    X,
    LogOut,
    Sun,
    Moon,
    CloudMoon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
    const { currentUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
        { path: '/my-work', label: 'Meus Trabalhos', icon: Briefcase },
        { path: '/my-requests', label: 'Meus Pedidos', icon: ClipboardList },
        { path: '/calendar', label: 'Calendário', icon: Calendar },
    ];

    const isActive = (path) => location.pathname === path;

    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun size={20} />;
            case 'dark':
                return <Moon size={20} />;
            case 'night':
                return <CloudMoon size={20} />;
            default:
                return <Sun size={20} />;
        }
    };

    const getThemeLabel = () => {
        switch (theme) {
            case 'light':
                return 'Claro';
            case 'dark':
                return 'Escuro';
            case 'night':
                return 'Noite';
            default:
                return 'Claro';
        }
    };

    return (
        <div className="layout-container">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-overlay"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand">
                        <div className="brand-icon">BT</div>
                        <span className="brand-name">BT Services</span>
                    </div>
                    <button
                        className="close-menu-btn hidden-lg"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="user-profile-summary">
                    <div className="avatar avatar-md">
                        {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="user-info">
                        <p className="user-name">{currentUser?.name}</p>
                        <p className="user-role">{currentUser?.role}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="nav-item theme-toggle"
                        title={`Tema: ${getThemeLabel()}`}
                    >
                        {getThemeIcon()}
                        <span>{getThemeLabel()}</span>
                    </button>

                    <button onClick={handleLogout} className="nav-item logout-btn">
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Mobile Header */}
                <header className="mobile-header hidden-lg">
                    <button
                        className="menu-btn"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <span className="mobile-title">BT Services</span>
                    <button onClick={toggleTheme} className="theme-toggle-mobile">
                        {getThemeIcon()}
                    </button>
                </header>

                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
