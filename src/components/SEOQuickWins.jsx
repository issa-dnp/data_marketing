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
    ReferenceArea
} from 'recharts'
import { loadCSV } from '../utils/csv'

export default function SEOQuickWins({ file }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const rows = await loadCSV(file.path)

                // Data cleaning and filtering
                const processed = rows.map(row => {
                    // Parse Search Volume (remove spaces, handle N/D)
                    const volStr = row['# de recherches'] || '0'
                    const volume = volStr === 'N/D' ? 0 : parseInt(volStr.replace(/\s/g, ''), 10) || 0

                    // Parse Position (handle formats like "1(2)" -> 1)
                    const posStr = row['Pos. Google.fr'] || '100'
                    const position = parseInt(posStr.split('(')[0], 10) || 100

                    // Parse Visibility (e.g., "98%" -> 98)
                    const visStr = row['Visibilité'] || '0%'
                    const visibility = parseFloat(visStr.replace('%', '')) || 0

                    return {
                        keyword: row['Mot clé'],
                        position,
                        volume,
                        visibility,
                        originalRow: row
                    }
                })
                    .filter(item => item.position >= 5 && item.position <= 15)
                    .sort((a, b) => b.volume - a.volume)

                setData(processed)
            } catch (error) {
                console.error("Error processing Rank Tracker data:", error)
            } finally {
                setLoading(false)
            }
        }

        if (file) {
            fetchData()
        }
    }, [file])

    if (loading) return <div className="p-8 animate-pulse text-slate-400">Analyse des Quick Wins en cours...</div>

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-white font-bold mb-1 text-lg">{data.keyword}</p>
                    <div className="space-y-1 text-sm">
                        <p className="text-blue-400">Position : <span className="text-white font-mono">{data.position}</span></p>
                        <p className="text-emerald-400">Volume : <span className="text-white font-mono">{data.volume.toLocaleString()} searches/mo</span></p>
                        <p className="text-amber-400">Visibilité : <span className="text-white font-mono">{data.visibility}%</span></p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    🚀 SEO Quick Wins (Positions 5-15)
                </h2>
                <p className="text-slate-400 max-w-3xl">
                    Ces mots-clés sont actuellement classés entre la 5ème et la 15ème position. Ils représentent des opportunités majeures : une légère amélioration de contenu ou de netlinking peut les propulser en Top 3 et décupler votre trafic.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl min-h-[500px]">
                    <div className="h-[500px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis
                                    type="number"
                                    dataKey="position"
                                    name="Position"
                                    domain={[5, 15]}
                                    reversed
                                    stroke="#94a3b8"
                                    tick={{ fill: '#94a3b8' }}
                                    label={{ value: 'Position Google (Inversée)', position: 'bottom', fill: '#94a3b8', offset: 0 }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="volume"
                                    name="Volume"
                                    stroke="#94a3b8"
                                    tick={{ fill: '#94a3b8' }}
                                    label={{ value: 'Volume de Recherche', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                                />
                                <ZAxis type="number" dataKey="visibility" range={[100, 1000]} name="Visibilité" />
                                <Tooltip content={<CustomTooltip />} />

                                {/* Highlight Top Volume Zone */}
                                <ReferenceArea x1={5} x2={10} y1={data.reduce((max, p) => p.volume > max ? p.volume : max, 0) * 0.5} stroke="none" fill="#10b981" fillOpacity={0.05} />
                                <ReferenceLine x={10} stroke="#ffffff20" strokeDasharray="5 5" label={{ value: 'Top 10 Limit', position: 'insideTopLeft', fill: '#ffffff40', fontSize: 12 }} />

                                <Scatter name="Keywords" data={data}>
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.position <= 10 ? '#10b981' : '#3b82f6'}
                                            strokeWidth={1}
                                            stroke="#ffffff20"
                                        />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                        <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                            <span className="text-xl">🔥</span> Opportunités Top 10
                        </h3>
                        <div className="space-y-4">
                            {data.slice(0, 3).map((item, i) => (
                                <div key={i} className="bg-slate-900/50 p-3 rounded-xl border border-white/5">
                                    <div className="text-white font-medium truncate" title={item.keyword}>{item.keyword}</div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-slate-400">Vol: {item.volume}</span>
                                        <span className="text-xs font-bold text-emerald-400">Pos: {item.position}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 font-light text-slate-300 text-sm leading-relaxed">
                        <h3 className="text-blue-400 font-bold mb-3 text-base">Conseils Action</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Optimisez le <span className="text-white">balisage H1-H3</span> pour ces mots-clés.</li>
                            <li>Ajoutez du <span className="text-white">maillage interne</span> depuis les pages piliers.</li>
                            <li>Vérifiez l'intention de recherche (Search Intent).</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
