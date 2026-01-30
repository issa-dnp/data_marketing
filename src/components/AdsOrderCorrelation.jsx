import React, { useState, useEffect } from 'react'
import {
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area
} from 'recharts'
import { loadCSV } from '../utils/csv'

const AdsOrderCorrelation = ({ file }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [adsRaw, ordersRaw] = await Promise.all([
                    loadCSV(file.path),
                    loadCSV('/data/web/request_sql_2.csv')
                ])

                // 1. Helper for French date parsing in Ads file
                // Format: "Semaine du 28 juil. 2025"
                const parseFrenchAdsDate = (str) => {
                    const months = {
                        'janv.': 0, 'févr.': 1, 'mars': 2, 'avr.': 3, 'mai': 4, 'juin': 5,
                        'juil.': 6, 'août': 7, 'sept.': 8, 'oct.': 9, 'nov.': 10, 'déc.': 11
                    }
                    const parts = str.replace('Semaine du ', '').split(' ')
                    if (parts.length < 3) return null
                    const day = parseInt(parts[0])
                    const month = months[parts[1].toLowerCase()]
                    const year = parseInt(parts[2])
                    return new Date(year, month, day)
                }

                // 2. Process Ads data
                const adsSeries = adsRaw.map(row => {
                    const date = parseFrenchAdsDate(row['Semaine'])
                    // Cleanup cost: "1 051,78 €" -> 1051.78
                    const costClean = row['Coût'] ? parseFloat(row['Coût'].replace('€', '').replace(/\s/g, '').replace(',', '.')) : 0
                    return {
                        date: date,
                        weekLabel: row['Semaine'],
                        cost: costClean
                    }
                }).filter(item => item.date !== null)

                // 3. Aggregate Orders by week
                // We'll use the start of week of each order to bucket them
                // and then match with Ads weeks
                const ordersByWeek = new Map()

                ordersRaw.forEach(row => {
                    const orderDateStr = row['date_commande']
                    if (!orderDateStr) return

                    const orderDate = new Date(orderDateStr)
                    if (isNaN(orderDate.getTime())) return

                    // Find which Ads week this order belongs to
                    // An order belongs to an Ads week if it's >= week_start and < week_start + 7 days
                    // But simpler: find the most recent Monday (or week start)
                })

                // Join logic: for each Ads week, count orders within that range
                const joinedData = adsSeries.map(adsWeek => {
                    const weekStart = adsWeek.date
                    const weekEnd = new Date(weekStart)
                    weekEnd.setDate(weekStart.getDate() + 7)

                    const orderCount = ordersRaw.filter(order => {
                        const d = new Date(order['date_commande'])
                        return d >= weekStart && d < weekEnd
                    }).length

                    return {
                        label: adsWeek.weekLabel.replace('Semaine du ', ''),
                        cost: adsWeek.cost,
                        orders: orderCount,
                        cpa: orderCount > 0 ? (adsWeek.cost / orderCount) : 0
                    }
                })

                setData(joinedData)
                setLoading(false)
            } catch (error) {
                console.error("Error loading Ads/Orders correlation:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [file])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: '5px 0', color: '#4285F4' }}>Coût Ads : <strong>{payload[0].value.toLocaleString()} €</strong></p>
                    <p style={{ margin: '5px 0', color: '#7B1FA2' }}>Commandes : <strong>{payload[1].value}</strong></p>
                    {payload[1].value > 0 && (
                        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                            Coût par commande : <strong>{(payload[0].value / payload[1].value).toFixed(2)} €</strong>
                        </p>
                    )}
                </div>
            )
        }
        return null
    }

    if (loading) return <div className="loading">Chargement de la corrélation temporelle...</div>

    return (
        <div className="mission-component">
            <div className="mission-header" style={{ marginBottom: '30px' }}>
                <h2>Ads vs Commandes (Corrélation)</h2>
                <p>Analyse de l'impact des dépenses publicitaires sur le volume de ventes hebdomadaire.</p>
            </div>

            <div className="chart-container" style={{ height: '450px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="label"
                            style={{ fontSize: '0.75rem' }}
                            interval={Math.ceil(data.length / 10)}
                        />
                        <YAxis
                            yAxisId="left"
                            label={{ value: 'Coût Ads (€)', angle: -90, position: 'insideLeft', style: { fill: '#4285F4', fontWeight: 'bold' } }}
                            stroke="#4285F4"
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            label={{ value: 'Nb Commandes', angle: 90, position: 'insideRight', style: { fill: '#7B1FA2', fontWeight: 'bold' } }}
                            stroke="#7B1FA2"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="cost"
                            name="Coût Publicitaire"
                            fill="#4285F410"
                            stroke="#4285F4"
                            strokeWidth={3}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="orders"
                            name="Volume Commandes"
                            stroke="#7B1FA2"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#7B1FA2' }}
                            activeDot={{ r: 6 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div className="insight-card" style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '10px', borderLeft: '5px solid #2196f3' }}>
                    <h4 style={{ color: '#0d47a1', marginTop: 0 }}>📈 Analyse de Tendance</h4>
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem' }}>
                        Observez si les pics de dépenses (courbe bleue) précèdent ou accompagnent les pics de commandes (courbe violette). Un CPA stable indique une montée en puissance efficace.
                    </p>
                </div>
                <div className="insight-card" style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '10px', borderLeft: '5px solid #7b1fa2' }}>
                    <h4 style={{ color: '#4a148c', marginTop: 0 }}>🎯 Efficacité des Campagnes</h4>
                    <p style={{ margin: '10px 0 0 0', fontSize: '0.95rem' }}>
                        Si le volume de commandes stagne malgré une hausse du coût, vérifiez la qualité du trafic ou l'ajustement du budget sur les périodes creuses.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AdsOrderCorrelation
