import React, { useState, useEffect } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    CartesianGrid,
    Legend
} from 'recharts'
import { loadCSV, parseNumber } from '../utils/csv'

export default function BudgetAllocation({ file }) {
    const [campaigns, setCampaigns] = useState([])
    const [loading, setLoading] = useState(true)

    const TOTAL_EXTRA_BUDGET = 2000

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const rows = await loadCSV(file.path)
                const processed = rows.map(row => {
                    const cost = parseNumber(row['Coût']) || 0
                    const conversions = parseNumber(row['Conversions']) || 0
                    const cpo = conversions > 0 ? cost / conversions : 0
                    return {
                        name: row['Nom de la campagne'],
                        cost,
                        conversions,
                        cpo: parseFloat(cpo.toFixed(2))
                    }
                })
                    .filter(c => c.cost > 0)
                    .sort((a, b) => a.cpo - b.cpo) // Best ROI first

                setCampaigns(processed)
            } catch (error) {
                console.error("Error processing Budget Allocation data:", error)
            } finally {
                setLoading(false)
            }
        }

        if (file) fetchData()
    }, [file])

    if (loading) return <div className="p-8 animate-pulse text-slate-400">Élaboration de la stratégie budgétaire...</div>

    // Recommendation Data
    const allocationData = [
        { name: 'Scaling Pmax (ROI Leader)', value: 1200, color: '#10b981', desc: 'Renforcer la campagne la plus rentable.' },
        { name: 'Capture SEO Quick Wins', value: 500, color: '#3b82f6', desc: 'Achat de trafic sur les mots-clés SEO Pos 5-15.' },
        { name: 'Brand Protection & Tests', value: 300, color: '#6366f1', desc: 'Protection de la marque et tests de nouveaux produits.' }
    ]

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col gap-2 border-l-4 border-orange-500 pl-6">
                <h2 className="text-3xl font-black text-white tracking-tight">
                    💰 Stratégie d'Allocation Budgétaire (+{TOTAL_EXTRA_BUDGET}€)
                </h2>
                <p className="text-slate-400 text-lg max-w-3xl">
                    Maximisation du ROI par le renforcement des leaders de conversion et la capture tactique du volume SEO inexploité.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Allocation Pie Chart */}
                <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-6xl">📊</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-6">Répartition Recommandée</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                            <PieChart>
                                <Pie
                                    data={allocationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {allocationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex justify-around text-center">
                        {allocationData.map((item, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-2xl font-black text-white">{item.value}€</span>
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{(item.value / TOTAL_EXTRA_BUDGET * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Plan */}
                <div className="space-y-6">
                    {allocationData.map((item, i) => (
                        <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-2xl hover:bg-slate-800/40 transition-colors flex gap-5 items-start">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg" style={{ backgroundColor: `${item.color}20`, border: `1px solid ${item.color}40` }}>
                                <span className="text-2xl" style={{ color: item.color }}>{i === 0 ? '🚀' : i === 1 ? '🎯' : '🛡️'}</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">{item.name}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                <div className="mt-3 inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900" style={{ backgroundColor: item.color }}>
                                    Investissement : {item.value}€
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Justification Chart (CPO Comparison) */}
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    📉 Coût par Conversion (CPO) Actuel
                </h3>
                <p className="text-slate-500 mb-8 text-sm">Pourquoi Pmax ? C'est la campagne au coût d'acquisition le plus compétitif.</p>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                        <BarChart data={campaigns} layout="vertical" margin={{ left: 40, right: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis type="number" stroke="#94a3b8" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#94a3b8"
                                width={150}
                                tick={{ fontSize: 11 }}
                            />
                            <RechartsTooltip
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                                formatter={(value) => [`${value} €`, 'CPO']}
                            />
                            <Bar dataKey="cpo" radius={[0, 4, 4, 0]} barSize={24}>
                                {campaigns.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.name.includes('Pmax') ? '#10b981' : '#334155'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Summary Alert */}
            <div className="bg-orange-500/10 border border-orange-500/20 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
                <div className="text-4xl">💡</div>
                <div className="flex-1">
                    <h4 className="text-orange-400 font-bold text-lg mb-1">Résumé de la Stratégie</h4>
                    <p className="text-slate-300 leading-relaxed italic">
                        "Le budget est alloué à 60% sur la performance brute (Pmax) et à 40% sur la conquête tactique. Cette approche équilibre la génération de cash-flow immédiat avec la capture de parts de marché sur des termes SEO stratégiques où nous sommes aux portes du podium."
                    </p>
                </div>
            </div>
        </div>
    )
}
