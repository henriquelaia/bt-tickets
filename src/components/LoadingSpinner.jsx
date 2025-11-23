const LoadingSpinner = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'spinner-sm',
        medium: 'spinner-md',
        large: 'spinner-lg'
    };

    return (
        <div className={`loading-spinner ${sizeClasses[size]} ${className}`}>
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;
