import React, { useState, useEffect } from 'react'
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceArea,
    ReferenceLine
} from 'recharts'
import { loadCSV } from '../utils/csv'

const SEOCTRAnalysis = ({ file }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ avgCtr: 0, medianImpressions: 0 })

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const rawData = await loadCSV(file.path)

                // Process Data
                const processed = rawData
                    .map(row => {
                        const impressions = parseInt(row['Impressions']) || 0
                        const clics = parseInt(row['Clics']) || 0
                        const ctrStr = row['CTR'] || '0%'
                        const ctr = parseFloat(ctrStr.replace('%', '').replace(',', '.')) || 0
                        const position = parseFloat(row['Position']) || 0

                        return {
                            name: row['Requêtes les plus fréquentes'] || 'Inconnu',
                            impressions: impressions,
                            clics: clics,
                            ctr: ctr,
                            position: position
                        }
                    })
                    .filter(item => item.impressions > 50) // Filter out noise
                    .sort((a, b) => b.impressions - a.impressions)
                    .slice(0, 100) // Top 100 queries by impressions

                // Calculate thresholds for reference lines
                const avgCtr = processed.reduce((acc, curr) => acc + curr.ctr, 0) / processed.length
                const sortedImpressions = [...processed].sort((a, b) => a.impressions - b.impressions)
                const medianImpressions = sortedImpressions[Math.floor(sortedImpressions.length / 2)].impressions

                setStats({ avgCtr, medianImpressions })
                setData(processed)
                setLoading(false)
            } catch (error) {
                console.error("Error loading SEO CTR Analysis:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [file])

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', maxWidth: '250px' }}>{data.name}</p>
                    <p style={{ margin: '5px 0' }}>Impressions : <strong>{data.impressions.toLocaleString()}</strong></p>
                    <p style={{ margin: '5px 0' }}>CTR : <strong style={{ color: data.ctr < stats.avgCtr ? '#D32F2F' : '#388E3C' }}>{data.ctr.toFixed(2)} %</strong></p>
                    <p style={{ margin: '5px 0' }}>Clics : <strong>{data.clics}</strong></p>
                    <p style={{ margin: '5px 0', color: '#666', fontSize: '0.85rem' }}>Position moy. : <strong>{data.position.toFixed(1)}</strong></p>
                    {data.impressions > stats.medianImpressions && data.ctr < stats.avgCtr && (
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: '#D32F2F', fontWeight: 'bold', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                            🎯 Opportunité d'optimisation
                        </p>
                    )}
                </div>
            )
        }
        return null
    }

    if (loading) return <div className="loading">Chargement de l'analyse CTR SEO...</div>

    return (
        <div className="mission-component">
            <div className="mission-header" style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#0288D1' }}>🎯 Opportunités SEO (CTR)</h2>
                <p>Analyse des requêtes à fort volume d'impressions mais faible taux de clic. Ciblez la "Zone d'Optimisation" pour maximiser votre trafic organique.</p>
            </div>

            <div className="chart-container" style={{ height: '500px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            type="number"
                            dataKey="impressions"
                            name="Impressions"
                            label={{ value: 'Impressions', position: 'insideBottomRight', offset: -10 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="ctr"
                            name="CTR"
                            unit="%"
                            label={{ value: 'CTR (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <ZAxis type="number" dataKey="clics" range={[50, 400]} name="Clics" />

                        {/* High Opportunity Area: High Impressions, Low CTR */}
                        <ReferenceArea
                            x1={stats.medianImpressions}
                            y1={0}
                            y2={stats.avgCtr}
                            fill="#FFEBEE"
                            fillOpacity={0.5}
                        />

                        <ReferenceLine y={stats.avgCtr} stroke="#D32F2F" strokeDasharray="3 3" label={{ position: 'right', value: 'CTR Moyen', fill: '#D32F2F', fontSize: 10 }} />
                        <ReferenceLine x={stats.medianImpressions} stroke="#666" strokeDasharray="3 3" label={{ position: 'top', value: 'Impressions Médiane', fill: '#666', fontSize: 10 }} />

                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                        <Scatter name="Requêtes" data={data}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.impressions > stats.medianImpressions && entry.ctr < stats.avgCtr ? '#D32F2F' : '#0288D1'}
                                    strokeWidth={entry.impressions > stats.medianImpressions && entry.ctr < stats.avgCtr ? 2 : 1}
                                    stroke={entry.impressions > stats.medianImpressions && entry.ctr < stats.avgCtr ? '#B71C1C' : '#01579B'}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', bottom: '40px', right: '40px', backgroundColor: 'rgba(255,235,238,0.8)', padding: '5px 10px', borderRadius: '4px', border: '1px solid #FFCDD2', fontSize: '0.75rem', color: '#B71C1C' }}>
                    Zone d'Optimisation
                </div>
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div className="insight-card" style={{ padding: '20px', backgroundColor: '#e1f5fe', borderRadius: '10px', borderLeft: '5px solid #0288d1' }}>
                    <h4 style={{ color: '#01579b', marginTop: 0 }}>📊 Lecture du graphique</h4>
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem' }}>
                        Chaque point représente une requête. Plus la bulle est grosse, plus elle a généré de clics. Les points en **rouge** sont dans la zone critique : beaucoup de visibilité mais peu de clics.
                    </p>
                </div>
                <div className="insight-card" style={{ padding: '20px', backgroundColor: '#f1f8e9', borderRadius: '10px', borderLeft: '5px solid #689f38' }}>
                    <h4 style={{ color: '#33691e', marginTop: 0 }}>🛠️ Actions suggérées</h4>
                    <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', fontSize: '0.95rem' }}>
                        <li>Optimiser les <strong>Title Tags</strong> pour être plus accrocheur.</li>
                        <li>Rendre les <strong>Meta Descriptions</strong> plus incitatives (Call to Action).</li>
                        <li>Utiliser des <strong>Extraits Enrichis</strong> (Rich Snippets) si possible.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SEOCTRAnalysis
