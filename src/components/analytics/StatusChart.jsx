import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatusChart = ({ data }) => {
    const COLORS = [
        'var(--clr-pendente)',
        'var(--clr-agendado)',
        'var(--clr-em-andamento)',
        'var(--clr-concluido)',
        'var(--clr-aprovado)',
        'var(--clr-revisao)',
        'var(--clr-arquivado)'
    ];

    return (
        <div className="card" style={{ height: '400px' }}>
            <h3 className="text-lg font-semibold mb-lg">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--clr-bg-secondary)',
                            borderColor: 'var(--clr-border)',
                            borderRadius: 'var(--radius-md)'
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatusChart;
