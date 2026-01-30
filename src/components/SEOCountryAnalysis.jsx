import React, { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts'
import { loadCSV, parseNumber } from '../utils/csv'

export default function SEOCountryAnalysis({ file }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [metrics, setMetrics] = useState({
        totalClicks: 0,
        franceClicks: 0,
        franceShare: 0
    })

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const rows = await loadCSV(file.path)

                // Process data
                let total = 0
                let france = 0

                const processed = rows.map(row => {
                    const clics = parseNumber(row['Clics']) || 0
                    const ctrStr = row['CTR'] || '0%'
                    const ctr = parseFloat(ctrStr.replace('%', '').replace(',', '.')) || 0
                    // Position uses dot as decimal in this CSV, parseNumber removes dots. Use parseFloat directly.
                    const position = parseFloat(row['Position']) || 0

                    total += clics
                    if (row['Pays'] === 'France') {
                        france = clics
                    }

                    return {
                        name: row['Pays'],
                        clics,
                        ctr,
                        position,
                        fullCtr: ctrStr
                    }
                })
                    .sort((a, b) => b.clics - a.clics)
                    .slice(0, 15) // Top 15 countries

                setData(processed)
                setMetrics({
                    totalClicks: total,
                    franceClicks: france,
                    franceShare: total > 0 ? (france / total) * 100 : 0
                })

            } catch (error) {
                console.error("Error processing SEO Country data:", error)
            } finally {
                setLoading(false)
            }
        }

        if (file) fetchData()
    }, [file])

    if (loading) return <div className="p-8 animate-pulse text-slate-400">Analyse géographique en cours...</div>

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload
            return (
                <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-white font-bold mb-2 border-b border-slate-700 pb-2">{d.name}</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Clics :</span>
                            <span className="text-white font-mono font-bold">{d.clics.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">CTR :</span>
                            <span className={`font-mono font-bold ${d.ctr > 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {d.fullCtr}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Position Moy. :</span>
                            <span className="text-white font-mono">{d.position.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    🌍 Analyse Géographique du Trafic
                </h2>
                <p className="text-slate-400 max-w-3xl">
                    Répartition des clics organiques par pays. Identifiez la dépendance au marché domestique et les opportunités internationales à fort taux de clic (CTR).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🇫🇷</div>
                    <div className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-2">Part Trafic France</div>
                    <div className="text-4xl font-black text-white">{metrics.franceShare.toFixed(1)}%</div>
                    <div className="text-slate-400 text-sm mt-1">{metrics.franceClicks.toLocaleString()} clics</div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                    <div className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">Opportunité CTR</div>
                    <div className="text-xl font-bold text-white truncate">
                        {data.filter(d => d.name !== 'France').sort((a, b) => b.ctr - a.ctr)[0]?.name || 'N/A'}
                    </div>
                    <div className="text-slate-400 text-sm mt-1">
                        CTR: <span className="text-white font-bold">{data.filter(d => d.name !== 'France').sort((a, b) => b.ctr - a.ctr)[0]?.fullCtr || '0%'}</span>
                    </div>
                </div>

                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                    <span className="text-slate-400 text-sm">
                        La France domine largement. Les pays secondaires comme la Belgique ou la Réunion montrent des CTR intéressants à exploiter.
                    </span>
                </div>
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl min-h-[600px]">
                <h3 className="text-lg font-bold text-white mb-6">Top 15 Pays par Volume de Clics</h3>
                {data.length > 0 ? (
                    <div className="h-[500px] w-full" style={{ minHeight: '500px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#94a3b8" hide />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 500 }}
                                    width={150}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                                <Bar dataKey="clics" radius={[0, 4, 4, 0]} barSize={24}>
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.name === 'France' ? '#3b82f6' : '#f59e0b'}
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="fullCtr"
                                        position="right"
                                        fill="#94a3b8"
                                        fontSize={12}
                                        formatter={(val) => `CTR: ${val}`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-[500px] w-full flex items-center justify-center text-slate-500">
                        Aucune donnée disponible pour le graphique.
                    </div>
                )}
            </div>
        </div>
    )
}
