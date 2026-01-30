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
    ReferenceLine,
    Label
} from 'recharts'
import { loadCSV, parseNumber } from '../utils/csv'

export default function AdsProfitability({ file }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [avgCPA, setAvgCPA] = useState(0)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const rows = await loadCSV(file.path)

                let totalCost = 0
                let totalConversions = 0

                const processed = rows.map(row => {
                    const cost = parseNumber(row['Coût']) || 0
                    const conversions = parseNumber(row['Conversions']) || 0
                    const clics = parseNumber(row['Clics']) || 0
                    const cpa = conversions > 0 ? cost / conversions : cost // If 0 conversions, CPA is the total cost

                    totalCost += cost
                    totalConversions += conversions

                    return {
                        name: row['Nom de la campagne'],
                        cost,
                        conversions,
                        clics,
                        cpa: parseFloat(cpa.toFixed(2)),
                        profitable: true // Will be updated after calculating average
                    }
                }).filter(item => item.cost > 0)

                const calculatedAvg = totalConversions > 0 ? totalCost / totalConversions : 0
                setAvgCPA(calculatedAvg)

                const finalData = processed.map(item => ({
                    ...item,
                    profitable: item.cpa <= calculatedAvg
                }))

                setData(finalData)
            } catch (error) {
                console.error("Error processing Ads Profitability data:", error)
            } finally {
                setLoading(false)
            }
        }

        if (file) fetchData()
    }, [file])

    if (loading) return <div className="p-8 animate-pulse text-slate-400">Analyse de la rentabilité en cours...</div>

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload
            return (
                <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-white font-bold mb-2 border-b border-slate-700 pb-2">{d.name}</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Coût :</span>
                            <span className="text-white font-mono font-bold">{d.cost.toLocaleString()} €</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Conversions :</span>
                            <span className="text-white font-mono font-bold">{d.conversions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between gap-4 border-t border-slate-800 pt-2">
                            <span className="text-slate-400">CPA :</span>
                            <span className={`font-mono font-bold ${d.profitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {d.cpa.toLocaleString()} €
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">Clics (Taille) :</span>
                            <span className="text-white font-mono">{d.clics.toLocaleString()}</span>
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
                    🎯 Rentabilité des Campagnes (Conversions vs Coût)
                </h2>
                <p className="text-slate-400 max-w-3xl">
                    Visualisez l'efficacité de vos dépenses. Les points sous la diagonale (CPA moyen de <span className="text-white font-bold">{avgCPA.toFixed(2)}€</span>) indiquent les campagnes les moins rentables nécessitant une optimisation.
                </p>
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl min-h-[500px]">
                <div className="h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                        <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                            <XAxis
                                type="number"
                                dataKey="cost"
                                name="Coût"
                                unit="€"
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8' }}
                                label={{ value: 'Dépenses (€)', position: 'bottom', fill: '#94a3b8', offset: 0 }}
                            />
                            <YAxis
                                type="number"
                                dataKey="conversions"
                                name="Conversions"
                                stroke="#94a3b8"
                                tick={{ fill: '#94a3b8' }}
                                label={{ value: 'Conversions', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                            />
                            <ZAxis type="number" dataKey="clics" range={[100, 2000]} name="Clics" />
                            <Tooltip content={<CustomTooltip />} />

                            {/* ROI Diagonal: y = x / avgCPA  => conversions = cost / avgCPA */}
                            <ReferenceLine
                                segment={[
                                    { x: 0, y: 0 },
                                    { x: Math.max(...data.map(d => d.cost)), y: Math.max(...data.map(d => d.cost)) / avgCPA }
                                ]}
                                stroke="#ffffff20"
                                strokeDasharray="5 5"
                            >
                                <Label value="CPA Moyen" position="insideTopLeft" fill="#ffffff40" fontSize={12} offset={20} />
                            </ReferenceLine>

                            <Scatter name="Campaigns" data={data}>
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.profitable ? '#10b981' : '#f43f5e'}
                                        strokeWidth={1}
                                        stroke="#ffffff20"
                                        fillOpacity={0.8}
                                    />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                    <div className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">ROI Leader</div>
                    <div className="text-2xl font-black text-white truncate" title={data.sort((a, b) => a.cpa - b.cpa)[0]?.name}>
                        {data.sort((a, b) => a.cpa - b.cpa)[0]?.name || 'N/A'}
                    </div>
                    <div className="text-slate-400 text-sm mt-1">CPA: {data.sort((a, b) => a.cpa - b.cpa)[0]?.cpa}€</div>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6">
                    <div className="text-rose-400 font-bold text-sm uppercase tracking-wider mb-2">Moins Rentable</div>
                    <div className="text-2xl font-black text-white truncate" title={data.sort((a, b) => b.cpa - a.cpa)[0]?.name}>
                        {data.sort((a, b) => b.cpa - a.cpa)[0]?.name || 'N/A'}
                    </div>
                    <div className="text-slate-400 text-sm mt-1">CPA: {data.sort((a, b) => b.cpa - a.cpa)[0]?.cpa}€</div>
                </div>

                <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-6">
                    <div className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Potentiel Scale</div>
                    <div className="text-sm text-slate-300">
                        Augmentez le budget des points <span className="text-emerald-400 font-bold">verts</span> proches de l'axe X (bas coût, fort ROI).
                    </div>
                </div>
            </div>
        </div>
    )
}
