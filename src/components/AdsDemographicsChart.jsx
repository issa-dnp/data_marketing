import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

const AdsDemographicsChart = ({ rows }) => {
    // Parse data
    // Input: [{ Sexe: 'Homme', 'Tranche d\'âge': '18-24', Impressions: '3 813', ... }, ...]
    const dataMap = rows.reduce((acc, row) => {
        const age = row["Tranche d'âge"]
        const sexe = row["Sexe"]
        const impressions = parseInt(row["Impressions"]?.replace(/\s/g, '') || 0)

        if (!acc[age]) {
            acc[age] = { age }
        }
        acc[age][sexe] = impressions
        return acc
    }, {})

    // Transform to array and sort by age range
    const chartData = Object.values(dataMap).sort((a, b) => {
        // Simple sort for age ranges like '18-24', '25-34', etc.
        return a.age.localeCompare(b.age)
    })

    return (
        <div style={{ width: '100%', height: 500, padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#444' }}>
                Profil de l'Audience : Sexe x Âge (Impressions)
            </h3>
            <ResponsiveContainer>
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis
                        dataKey="age"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#666', fontSize: 13 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#666', fontSize: 13 }}
                    />
                    <Tooltip
                        cursor={{ fill: '#f5f5f5' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar
                        dataKey="Homme"
                        stackId="a"
                        fill="#4285F4"
                        radius={[0, 0, 0, 0]}
                        barSize={40}
                    />
                    <Bar
                        dataKey="Femme"
                        stackId="a"
                        fill="#FBBC04"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
                <p>Ce graphique montre à qui BricoMetal parle aujourd'hui sur Google Ads.</p>
                <p>Les <strong>Hommes de 35-54 ans</strong> représentent le segment le plus exposé avec un volume d'impressions maximal.</p>
            </div>
        </div>
    )
}

export default AdsDemographicsChart
