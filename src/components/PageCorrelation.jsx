import React, { useState, useEffect } from 'react'
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

const PageCorrelation = ({ file }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [analyticsRaw, seoRaw] = await Promise.all([
                    loadCSV(file.path),
                    loadCSV('/data/seo/Pages.csv')
                ])

                // Step 1: Process SEO Data
                // Format: Pages les plus populaires, Clics, Impressions, CTR, Position
                const seoMap = new Map()
                seoRaw.forEach(row => {
                    const url = row['Pages les plus populaires'] || ''
                    if (!url) return

                    // Normalize URL to Path
                    // From: https://bricometal.shop/some-path
                    // To: /some-path
                    const path = url.replace('https://bricometal.shop', '').split('?')[0] || '/'

                    seoMap.set(path, {
                        clicks: parseInt(row['Clics']) || 0,
                        impressions: parseInt(row['Impressions']) || 0,
                        ctr: row['CTR'],
                        position: parseFloat(row['Position']) || 0
                    })
                })

                // Step 2: Process Analytics Data and Join
                // Format: Chemin de la page et classe de l'écran, Vues, ...
                const technicalPaths = ['/recherche', '/panier', '/commande', '/connexion', '/mon-compte', '/inscription']

                const joinedData = analyticsRaw
                    .map(row => {
                        const path = row["Chemin de la page et classe de l'écran"]
                        const views = parseInt(row['Vues']) || 0

                        // Ignore technical/utility paths
                        if (!path || technicalPaths.includes(path) || path.includes('?')) return null

                        const seoInfo = seoMap.get(path)
                        if (!seoInfo) return null

                        return {
                            name: path,
                            views: views,
                            position: seoInfo.position,
                            impressions: seoInfo.impressions,
                            clicks: seoInfo.clicks
                        }
                    })
                    .filter(item => item !== null && item.views > 5) // Minimal threshold for noise
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 50) // Top 50 pages for clarity

                setData(joinedData)
                setLoading(false)
            } catch (error) {
                console.error("Error loading correlation data:", error)
                setLoading(false)
            }
        }
        fetchData()
    }, [file])

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <p className="label"><strong>{data.name}</strong></p>
                    <p className="intro">Vues (Analytics): {data.views}</p>
                    <p className="intro">Position (SEO): {data.position.toFixed(1)}</p>
                    <p className="intro">Impressions (SEO): {data.impressions}</p>
                </div>
            )
        }
        return null
    }

    if (loading) return <div className="loading">Chargement des données de corrélation...</div>

    return (
        <div className="mission-component">
            <div className="mission-header">
                <h2>Corrélation Analytics vs SEO</h2>
                <p>Analyse de la relation entre le volume de trafic (Analytics) et la visibilité organique (SEO).</p>
            </div>

            <div className="analysis-box">
                <h3>Interprétation du graphique</h3>
                <ul>
                    <li><strong>Axe X (Horiz.)</strong> : Nombre de vues sur la page (Analytics). Plus on est à droite, plus la page est populaire.</li>
                    <li><strong>Axe Y (Vert.)</strong> : Position moyenne sur Google (SEO). <strong>Le haut du graphique représente la 1ère place.</strong></li>
                    <li><strong>Taille des bulles</strong> : Volume d'impressions sur Google (Visibilité globale).</li>
                </ul>
            </div>

            <div className="chart-container" style={{ height: '500px', marginTop: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 30, bottom: 20, left: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="views"
                            name="Vues"
                            label={{ value: 'Vues Analytics', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis
                            type="number"
                            dataKey="position"
                            name="Position"
                            reversed
                            domain={[1, 'dataMax']}
                            label={{ value: 'Position SEO', angle: -90, position: 'insideLeft' }}
                        />
                        <ZAxis
                            type="number"
                            dataKey="impressions"
                            range={[50, 2000]}
                            name="Impressions"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Scatter
                            name="Pages"
                            data={data}
                            fill="#8884d8"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.position < 10 ? '#4caf50' : '#2196f3'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className="insights-grid" style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                <div className="insight-card" style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h4>🚀 Opportunités Haut de Page</h4>
                    <p>Les bulles situées en haut à gauche sont des pages qui ont une excellente position mais peu de vues relatives. Elles pourraient bénéficier d'un push marketing ou d'un meilleur maillage interne.</p>
                </div>
                <div className="insight-card" style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h4>💎 Pages Piliers</h4>
                    <p>Les grandes bulles en haut à droite sont vos actifs les plus précieux : fortes positions, beaucoup d'impressions et beaucoup de trafic.</p>
                </div>
                <div className="insight-card" style={{ padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h4>⚠️ Trafic Hors SEO</h4>
                    <p>Les bulles en bas à droite (mauvaise position mais beaucoup de vues) indiquent des pages dont le trafic provient probablement de la publicité (Ads) ou des réseaux sociaux plutôt que du SEO.</p>
                </div>
            </div>
        </div>
    )
}

export default PageCorrelation
