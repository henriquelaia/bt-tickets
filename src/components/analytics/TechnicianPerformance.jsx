import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TechnicianPerformance = ({ data }) => {
    return (
        <div className="card" style={{ height: '400px' }}>
            <h3 className="text-lg font-semibold mb-lg">Performance por Técnico</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--clr-border)" />
                    <XAxis dataKey="name" stroke="var(--clr-text-secondary)" />
                    <YAxis stroke="var(--clr-text-secondary)" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--clr-bg-secondary)',
                            borderColor: 'var(--clr-border)',
                            borderRadius: 'var(--radius-md)'
                        }}
                        cursor={{ fill: 'var(--clr-bg-hover)' }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Serviços Atribuídos" fill="var(--clr-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TechnicianPerformance;
