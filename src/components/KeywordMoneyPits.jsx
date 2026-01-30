import React, { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import { loadCSV } from '../utils/csv'

const KeywordMoneyPits = ({ file }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const rawData = await loadCSV(file.path)

                // Process Data: Cleanup cost and sort
                const processed = rawData
                    .map(row => {
                        const costStr = row['Coût'] || '0'
                        const cost = parseFloat(costStr.replace('€', '').replace(/\s/g, '').replace(',', '.')) || 0
                        const ctr = row['CTR'] || '0%'
                        const clicks = parseInt(row['Clics']) || 0
                        return {
                            name: row['Mot clé pour le Réseau\u00a0de\u00a0Recherche'] || 'Inconnu',
                            cost: cost,
                            clicks: clicks,
                            ctr: ctr
                        }
                    })
                    .filter(item => item.cost > 0)
                    .sort((a, b) => b.cost - a.cost)
                    .slice(0, 10)

                setData(processed)
                setLoading(false)
            } catch (error) {
                console.error("Error loading Keyword Money Pits:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [file])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', maxWidth: '250px' }}>{label}</p>
                    <p style={{ margin: '5px 0', color: '#D32F2F' }}>Dépense : <strong>{payload[0].value.toLocaleString()} €</strong></p>
                    <p style={{ margin: '5px 0', color: '#666' }}>Clics : <strong>{payload[0].payload.clicks}</strong></p>
                    <p style={{ margin: '5px 0', color: '#666' }}>CTR : <strong>{payload[0].payload.ctr}</strong></p>
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#888', fontStyle: 'italic' }}>
                        Zéro conversion enregistrée
                    </p>
                </div>
            )
        }
        return null
    }

    if (loading) return <div className="loading">Chargement des gouffres budgétaires...</div>

    return (
        <div className="mission-component">
            <div className="mission-header" style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#D32F2F' }}>📉 Top 10 Gouffres (Keywords)</h2>
                <p>Mots-clés ayant généré les dépenses les plus élevées sans aucune conversion. Priorité d'optimisation ou d'exclusion.</p>
            </div>

            <div className="chart-container" style={{ height: '500px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={150}
                            tick={{ fontSize: 12, fill: '#333' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
                        <Bar
                            dataKey="cost"
                            radius={[0, 4, 4, 0]}
                            barSize={30}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`rgba(211, 47, 47, ${1 - index * 0.05})`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div className="insight-card" style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '10px', borderLeft: '5px solid #d32f2f' }}>
                    <h4 style={{ color: '#b71c1c', marginTop: 0 }}>⚠️ Alerte Budget</h4>
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem' }}>
                        Le mot-clé <strong>"{data[0]?.name}"</strong> est le plus gros gouffre avec <strong>{data[0]?.cost.toLocaleString()} €</strong> dépensés. Son exclusion ou passage en "Mot-clé à exclure" pourrait libérer du budget pour les campagnes Pmax plus rentables.
                    </p>
                </div>
                <div className="insight-card" style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '10px', borderLeft: '5px solid #ff9800' }}>
                    <h4 style={{ color: '#e65100', marginTop: 0 }}>💡 Recommandation</h4>
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem' }}>
                        Analysez les termes de recherche associés à ces mots-clés. Si l'intention est trop large ou déconnectée de l'offre (ex: "fer forgé" au lieu de "pièce fer forgé"), ajustez le type de correspondance.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default KeywordMoneyPits
