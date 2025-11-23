const SkeletonCard = () => {
    return (
        <div className="skeleton-card card">
            <div className="skeleton-header">
                <div className="skeleton skeleton-badge"></div>
            </div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
            <div className="skeleton-footer">
                <div className="skeleton skeleton-avatar"></div>
                <div className="skeleton skeleton-tag"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
