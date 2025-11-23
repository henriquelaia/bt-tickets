import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

const Toast = ({ id, message, type, removeToast, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, removeToast, duration]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <XCircle size={20} />;
            case 'warning':
                return <AlertCircle size={20} />;
            case 'info':
            default:
                return <Info size={20} />;
        }
    };

    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">
                {getIcon()}
            </div>
            <div className="toast-message">{message}</div>
            <button
                className="toast-close"
                onClick={() => removeToast(id)}
                aria-label="Fechar"
            >
                <X size={16} />
            </button>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    if (!toasts || toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    removeToast={removeToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
