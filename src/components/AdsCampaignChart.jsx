import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

const AdsCampaignChart = ({ rows }) => {
    // Parse data
    const data = rows
        .slice(0, 100) // Limit to 100 rows for performance
        .filter(row => row['Nom de la campagne']) // Ensure campaign name exists
        .map((row) => {
            // Helper to parse currency "9 595,51 €" -> 9595.51
            const parseCurrency = (str) => {
                if (!str) return 0
                return parseFloat(
                    str
                        .replace(/\s/g, '')
                        .replace('€', '')
                        .replace(',', '.')
                )
            }

            // Helper to parse number "29 836" -> 29836
            const parseNumber = (str) => {
                if (!str) return 0
                if (typeof str === 'number') return str
                return parseFloat(str.replace(/\s/g, ''))
            }

            const cost = parseCurrency(row['Coût'])
            const clicks = parseNumber(row['Clics'])
            const conversions = parseNumber(row['Conversions']) // Optional for ranking
            const cpc = clicks > 0 ? cost / clicks : 0

            return {
                name: row['Nom de la campagne'],
                cost: cost,
                clicks: clicks,
                cpc: parseFloat(cpc.toFixed(2)),
                conversions: conversions,
                rawCost: row['Coût'], // Keep raw for display if needed, but we use localeString
            }
        })
        .sort((a, b) => b.cost - a.cost) // Sort chart by cost descending

    // Ranking Logic: Sort by Conversions (descending), then Clicks
    const rankingData = [...data].sort((a, b) => {
        if (b.conversions !== a.conversions) return b.conversions - a.conversions
        return b.clicks - a.clicks
    })

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {/* Chart Section */}
            <div style={{ height: 600 }}>
                <ResponsiveContainer>
                    <ComposedChart
                        layout="vertical"
                        data={data}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 100, // Space for campaign names
                        }}
                    >
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', color: '#333' }}>
                                            <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{label}</p>
                                            <p style={{ color: '#4285F4' }}>Coût : {data.cost.toLocaleString('fr-FR')} €</p>
                                            <p style={{ color: '#82ca9d' }}>Clics : {data.clicks.toLocaleString('fr-FR')}</p>
                                            <p style={{ color: '#ff7300' }}>CPC Moyen : {data.cpc.toLocaleString('fr-FR')} €</p>
                                            <p style={{ color: '#E37400' }}>Conversions : {data.conversions.toLocaleString('fr-FR')}</p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Legend />
                        <Bar dataKey="cost" name="Coût" fill="#4285F4" barSize={20} />
                        <Bar dataKey="clicks" name="Clics" fill="#82ca9d" barSize={20} />
                    </ComposedChart>
                </ResponsiveContainer>
                <div style={{ textAlign: 'center', fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
                    * Le CPC moyen est affiché au survol.
                </div>
            </div>

            {/* Ranking Section */}
            <div className="ranking-section">
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
                    Classement des Campagnes (Performance)
                </h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>#</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Campagne</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Conversions</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Clics</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Coût</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>CPC Moy.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankingData.map((row, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '12px', fontWeight: index < 3 ? 'bold' : 'normal' }}>
                                        {index + 1} {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>{row.name}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#E37400' }}>
                                        {row.conversions.toLocaleString('fr-FR')}
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{row.clicks.toLocaleString('fr-FR')}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{row.cost.toLocaleString('fr-FR')} €</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>{row.cpc.toLocaleString('fr-FR')} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdsCampaignChart
