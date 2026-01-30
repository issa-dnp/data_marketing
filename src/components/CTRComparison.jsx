import { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts'
import { loadCSV } from '../utils/csv'

const CTRComparison = ({ file }) => {
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

                // Normalize headers and values
                const cleanRow = (row) => {
                    const newRow = {}
                    Object.keys(row).forEach(key => {
                        const cleanKey = key.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim()
                        newRow[cleanKey] = row[key]
                    })
                    return newRow
                }

                const normalize = (str) => {
                    return str?.toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "") // Remove accents
                        .replace(/\s+/g, ' ')
                        .trim()
                }

                const parseCTR = (str) => {
                    if (!str) return 0
                    // Remove % and replace comma with dot, remove spaces
                    return parseFloat(str.replace('%', '').replace(',', '.').replace(/\s/g, '')) || 0
                }

                const adsProcessed = adsRaw.map(cleanRow)
                const seoProcessed = seoRaw.map(cleanRow)

                // Process Ads Keywords
                const adsMap = {}
                adsProcessed.forEach(row => {
                    const kwRaw = row["Mot clé pour le Réseau de Recherche"] || Object.values(row)[0]
                    const kw = normalize(kwRaw)
                    if (kw) {
                        adsMap[kw] = {
                            ctr: parseCTR(row['CTR']),
                            originalName: kwRaw
                        }
                    }
                })

                // Process SEO Queries
                const commonKeywords = []
                seoProcessed.forEach(row => {
                    const kwRaw = row["Requêtes les plus fréquentes"] || Object.values(row)[0]
                    const kw = normalize(kwRaw)
                    if (kw && adsMap[kw] !== undefined) {
                        const seoCTR = parseCTR(row['CTR'])
                        const adsCTR = adsMap[kw].ctr

                        commonKeywords.push({
                            name: adsMap[kw].originalName,
                            adsCTR: adsCTR,
                            seoCTR: seoCTR
                        })
                    }
                })

                // Sort by Ads CTR to show top performers
                commonKeywords.sort((a, b) => b.adsCTR - a.adsCTR)

                // Take top 15 for readability
                setData(commonKeywords.slice(0, 15))
                setLoading(false)
            } catch (error) {
                console.error("Error loading CTR data:", error)
                setLoading(false)
            }
        }

        fetchData()
    }, [file])

    if (loading) return <div>Chargement de l'analyse...</div>

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ height: 500, width: '100%', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Comparatif CTR : ADS vs SEO (Top 15)</h3>
                <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Comparez le taux de clic (CTR) entre vos annonces payantes et vos résultats organiques.
                </p>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={80}
                            style={{ fontSize: '0.8rem' }}
                        />
                        <YAxis label={{ value: 'CTR (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`${value.toFixed(2)}%`]} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="adsCTR" name="CTR Ads" fill="#4285F4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="seoCTR" name="CTR SEO" fill="#34A853" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <h4 style={{ marginBottom: '15px' }}>Analyse de la rentabilité (CTR)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {data.slice(0, 6).map((item, i) => (
                        <div key={i} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px' }}>
                            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '10px' }}>{item.name}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <span>CTR Ads:</span>
                                <span style={{ color: '#4285F4', fontWeight: 'bold' }}>{item.adsCTR.toFixed(2)}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>CTR SEO:</span>
                                <span style={{ color: '#34A853', fontWeight: 'bold' }}>{item.seoCTR.toFixed(2)}%</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                                {item.adsCTR > item.seoCTR * 2 ? (
                                    "L'Ads est ici indispensable pour dominer le clic."
                                ) : item.seoCTR > item.adsCTR ? (
                                    "Le SEO performe mieux : l'Ads est-il vraiment nécessaire ?"
                                ) : (
                                    "Performance équilibrée."
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CTRComparison
