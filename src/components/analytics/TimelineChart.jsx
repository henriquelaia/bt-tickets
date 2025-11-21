import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TimelineChart = ({ data }) => {
    return (
        <div className="card" style={{ height: '400px' }}>
            <h3 className="text-lg font-semibold mb-lg">Evolução de Serviços (Últimos 7 dias)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" />
                    <XAxis dataKey="date" stroke="var(--clr-text-secondary)" />
                    <YAxis stroke="var(--clr-text-secondary)" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--clr-bg-secondary)',
                            borderColor: 'var(--clr-border)',
                            borderRadius: 'var(--radius-md)'
                        }}
                    />
                    <Area type="monotone" dataKey="tickets" name="Novos Serviços" stroke="var(--clr-secondary)" fill="var(--clr-secondary-light)" fillOpacity={0.3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimelineChart;
