import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const getTrendIcon = () => {
        if (trend === 'up') return <ArrowUp size={16} className="text-success" />;
        if (trend === 'down') return <ArrowDown size={16} className="text-error" />;
        return <Minus size={16} className="text-muted" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'var(--clr-accent)';
        if (trend === 'down') return 'var(--clr-error)';
        return 'var(--clr-text-muted)';
    };

    return (
        <div className="card flex items-center gap-md">
            <div
                className={`rounded-full flex items-center justify-center`}
                style={{
                    width: '48px',
                    height: '48px',
                    background: `var(--clr-${color}-light)`,
                    color: 'white',
                    opacity: 0.9
                }}
            >
                <Icon size={24} />
            </div>
            <div className="flex-1">
                <p className="text-sm text-muted font-medium">{title}</p>
                <div className="flex items-end gap-sm">
                    <h3 className="text-2xl font-bold" style={{ marginBottom: 0 }}>{value}</h3>
                    {trendValue && (
                        <div className="flex items-center gap-xs text-xs font-medium" style={{ color: getTrendColor(), marginBottom: '4px' }}>
                            {getTrendIcon()}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
