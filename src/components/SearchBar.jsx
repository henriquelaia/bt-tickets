import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getStatusName } from '../utils/demoData';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { searchTickets } = useApp();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                const searchResults = searchTickets(query);
                setResults(searchResults);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, searchTickets]);

    const handleSelect = (ticketId) => {
        setQuery('');
        setIsOpen(false);
        navigate(`/ticket/${ticketId}`);
    };

    return (
        <div className="search-container" ref={searchRef} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <div className="relative">
                <Search
                    size={18}
                    className="text-muted"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                    type="text"
                    className="input"
                    placeholder="Pesquisar serviços, clientes, moradas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ paddingLeft: '40px', width: '100%' }}
                    onFocus={() => query.trim() && setIsOpen(true)}
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)' }}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div className="card animate-slideDown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    padding: '8px',
                    zIndex: 100,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-xl)'
                }}>
                    {results.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => handleSelect(ticket.id)}
                            className="search-item p-sm rounded hover-bg cursor-pointer"
                            style={{ transition: 'background 0.2s' }}
                        >
                            <div className="flex justify-between items-start mb-xs">
                                <span className="font-medium text-sm">#{ticket.id.slice(0, 8)}</span>
                                <span className={`badge badge-${ticket.status} text-xs scale-75 origin-right`}>
                                    {getStatusName(ticket.status)}
                                </span>
                            </div>
                            <p className="font-medium text-sm mb-xs">{ticket.title}</p>
                            <div className="text-xs text-muted flex flex-col gap-xs">
                                <div className="flex items-center gap-xs">
                                    <User size={12} />
                                    {ticket.clientName}
                                </div>
                                <div className="flex items-center gap-xs">
                                    <MapPin size={12} />
                                    {ticket.clientAddress}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && query && results.length === 0 && (
                <div className="card animate-slideDown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '8px',
                    padding: '16px',
                    zIndex: 100,
                    textAlign: 'center',
                    color: 'var(--clr-text-muted)'
                }}>
                    <p className="text-sm">Nenhum resultado encontrado</p>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
