import { useState, useEffect } from 'react'
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts'
import { loadCSV } from '../utils/csv'

const KeywordCannibalization = ({ file }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Load Ads Keywords (from prop) and SEO Queries (hardcoded path)
                const [adsRaw, seoRaw] = await Promise.all([
                    loadCSV(file.path),
                    loadCSV('/data/seo/Requetes.csv')
                ])

                // Normalize headers to remove NBSPs and other special chars
                const cleanRow = (row) => {
                    const newRow = {}
                    Object.keys(row).forEach(key => {
                        const cleanKey = key.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim()
                        newRow[cleanKey] = row[key]
                    })
                    return newRow
                }

                // Accent normalization function
                const normalize = (str) => {
                    return str?.toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "") // Remove accents
                        .replace(/\s+/g, ' ')
                        .trim()
                }

                const adsProcessed = adsRaw.map(cleanRow)
                const seoProcessed = seoRaw.map(cleanRow)

                // Process Ads Keywords
                const adsMap = {}
                adsProcessed.forEach(row => {
                    // Try different possible header names or indices
                    const kwRaw = row["Mot clé pour le Réseau de Recherche"] || Object.values(row)[0]
                    const kw = normalize(kwRaw)
                    if (kw) {
                        const clics = parseInt(row['Clics']?.replace(/\s/g, '') || 0)
                        adsMap[kw] = clics
                    }
                })

                // Process SEO Queries
                const commonKeywords = []
                seoProcessed.forEach(row => {
                    const kwRaw = row["Requêtes les plus fréquentes"] || Object.values(row)[0]
                    const kw = normalize(kwRaw)
                    if (kw && adsMap[kw] !== undefined) {
                        const seoClics = parseInt(row['Clics'] || 0)
                        const adsClics = adsMap[kw]

                        commonKeywords.push({
                            name: kwRaw, // Keep original casing/accents for display
                            x: adsClics, // Ads Clics
                            y: seoClics, // SEO Clics
                            z: adsClics + seoClics // Bubble size
                        })
                    }
                })

                // Sort by total volume to show most important overlaps
                commonKeywords.sort((a, b) => (b.x + b.y) - (a.x + a.y))

                setData(commonKeywords)
                setLoading(false)
            } catch (error) {
                console.error("Error loading cannibalization data:", error)
                setLoading(false)
            }
        }

        fetchData()
    }, [file])

    if (loading) return <div>Chargement de l'analyse...</div>

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '5px' }}>{data.name}</p>
                    <p style={{ color: '#4285F4', margin: '2px 0' }}>Ads : <strong>{data.x}</strong> clics</p>
                    <p style={{ color: '#34A853', margin: '2px 0' }}>SEO : <strong>{data.y}</strong> clics</p>
                </div>
            )
        }
        return null
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ height: 500, width: '100%', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Comparatif Clics par Mot-Clé : ADS vs SEO</h3>
                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Identifiez les mots-clés où vous payez (Ads) alors que vous avez déjà du trafic gratuit (SEO).
                </p>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Ads Clics"
                            label={{ value: 'Ads Clics', position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="SEO Clics"
                            label={{ value: 'SEO Clics', angle: -90, position: 'insideLeft' }}
                        />
                        <ZAxis type="number" dataKey="z" range={[60, 400]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Scatter name="Mots-Clés" data={data} fill="#8884d8">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.y > entry.x ? '#34A853' : '#4285F4'} opacity={0.7} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h4 style={{ marginBottom: '15px' }}>Détail des Doublons (Ads & SEO)</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Mot-Clé</th>
                            <th style={{ padding: '12px', textAlign: 'right', color: '#4285F4' }}>Ads Clics</th>
                            <th style={{ padding: '12px', textAlign: 'right', color: '#34A853' }}>SEO Clics</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Observation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{row.name}</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{row.x}</td>
                                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{row.y}</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>{row.x + row.y}</td>
                                <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                                    {row.y > row.x * 2 ? (
                                        <span style={{ color: '#d93025' }}>⚠️ Forte Cannibalisation (SEO dominant)</span>
                                    ) : row.x > row.y * 2 ? (
                                        <span style={{ color: '#1a73e8' }}>Ads dominant</span>
                                    ) : (
                                        <span style={{ color: '#666' }}>Equilibré</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Aucun mot-clé commun trouvé entre les deux fichiers.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default KeywordCannibalization
