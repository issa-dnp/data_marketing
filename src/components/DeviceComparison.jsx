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
} from 'recharts'
import { loadCSV } from '../utils/csv'

const DeviceComparison = ({ file }) => {
    const [data, setData] = useState([])
    const [seoData, setSeoData] = useState([])
    const [adsData, setAdsData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Load Ads Data (from props) and SEO Data (hardcoded path)
                const [adsRaw, seoRaw] = await Promise.all([
                    loadCSV(file.path),
                    loadCSV('/data/seo/Appareils.csv')
                ])

                // Process Ads Data
                // Ads columns: "Type d'appareil", "Clics", "Coût", "Impressions"
                const adsProcessed = adsRaw.map(row => {
                    let device = row["Type d'appareil"]
                    // Normalize names
                    if (device === 'Ordinateurs') device = 'Desktop'
                    if (device === 'Mobiles') device = 'Mobile'
                    if (device === 'Tablettes') device = 'Tablet'
                    if (device === 'Écrans TV') device = 'TV'

                    const clicks = parseInt(row['Clics']?.replace(/\s/g, '') || 0)
                    const cost = parseFloat(row['Coût']?.replace(/\s/g, '').replace('€', '').replace(',', '.') || 0)
                    const impressions = parseInt(row['Impressions']?.replace(/\s/g, '') || 0)

                    return { device, clicks, cost, impressions, source: 'Ads' }
                }).filter(r => r.device) // Filter empty rows

                setAdsData(adsProcessed.sort((a, b) => b.clicks - a.clicks))

                // Process SEO Data
                // SEO columns: "Appareil", "Clics", "Impressions", "CTR", "Position"
                const seoProcessed = seoRaw.map(row => {
                    let device = row['Appareil']
                    // Normalize names
                    if (device === 'Ordinateur') device = 'Desktop'
                    if (device === 'Mobile') device = 'Mobile'
                    if (device === 'Tablette') device = 'Tablet'

                    const clicks = parseInt(row['Clics'] || 0)
                    const impressions = parseInt(row['Impressions'] || 0)
                    const ctr = row['CTR']
                    const position = row['Position']

                    return { device, clicks, impressions, ctr, position, source: 'SEO' }
                }).filter(r => r.device)

                setSeoData(seoProcessed.sort((a, b) => b.clicks - a.clicks))

                // Merge for Chart
                // We want: [{ name: 'Mobile', seo: 2000, ads: 4000 }, ...]
                const devices = ['Mobile', 'Desktop', 'Tablet', 'TV']
                const chartData = devices.map(dev => {
                    const adsItem = adsProcessed.find(i => i.device === dev)
                    const seoItem = seoProcessed.find(i => i.device === dev)
                    return {
                        name: dev,
                        ads: adsItem ? adsItem.clicks : 0,
                        seo: seoItem ? seoItem.clicks : 0
                    }
                })
                // Sort chart data by total volume
                chartData.sort((a, b) => (b.ads + b.seo) - (a.ads + a.seo))

                setData(chartData)
                setLoading(false)

            } catch (error) {
                console.error("Error loading comparison data:", error)
                setLoading(false)
            }
        }

        fetchData()
    }, [file])

    if (loading) return <div>Chargement du comparatif...</div>

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div style={{ height: 500, width: '100%' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Comparatif Clics : SEO vs ADS</h3>
                <ResponsiveContainer>
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="seo" name="SEO Clics" fill="#34A853" />
                        <Bar dataKey="ads" name="ADS Clics" fill="#4285F4" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
                {/* SEO Table */}
                <div style={{ flex: '1 1 400px' }}>
                    <h3 style={{ borderBottom: '2px solid #34A853', paddingBottom: '10px', marginBottom: '15px', color: '#34A853' }}>
                        Classement SEO
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f0f9f0' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Appareil</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Clics</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Impressions</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>CTR</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Pos.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {seoData.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '8px', fontWeight: '500' }}>{row.device}</td>
                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{row.clicks.toLocaleString()}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{row.impressions.toLocaleString()}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{row.ctr}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{row.position}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Ads Table */}
                <div style={{ flex: '1 1 400px' }}>
                    <h3 style={{ borderBottom: '2px solid #4285F4', paddingBottom: '10px', marginBottom: '15px', color: '#4285F4' }}>
                        Classement ADS
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f0f4fc' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Appareil</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Clics</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Coût</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Impressions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adsData.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '8px', fontWeight: '500' }}>{row.device}</td>
                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{row.clicks.toLocaleString()}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{row.cost.toLocaleString('fr-FR')} €</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{row.impressions.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default DeviceComparison
