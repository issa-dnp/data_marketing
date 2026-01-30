import { useState, useEffect } from 'react'
import { loadCSV } from '../utils/csv'

const AdsTimeHeatmap = ({ file }) => {
    const [heatmapData, setHeatmapData] = useState([])
    const [maxValue, setMaxValue] = useState(0)
    const [loading, setLoading] = useState(true)

    const daysOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    const hours = Array.from({ length: 24 }, (_, i) => i) // 0 to 23

    useEffect(() => {
        if (!file) return

        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await loadCSV(file.path)

                // Initialize grid: 7 days x 24 hours
                const grid = {}
                daysOrder.forEach(day => {
                    grid[day] = Array(24).fill(0)
                })

                let max = 0

                data.forEach(row => {
                    const day = row['Jour']
                    const hourStr = row['Heure de début'] // "00 h"
                    const clicks = parseInt(row['Clics'] || 0)

                    if (grid[day] && hourStr) {
                        const hour = parseInt(hourStr.replace(' h', ''))
                        if (!isNaN(hour) && hour >= 0 && hour < 24) {
                            grid[day][hour] = clicks
                            if (clicks > max) max = clicks
                        }
                    }
                })

                setHeatmapData(grid)
                setMaxValue(max)
                setLoading(false)
            } catch (error) {
                console.error("Error loading heatmap data:", error)
                setLoading(false)
            }
        }

        fetchData()
    }, [file])

    if (loading) return <div>Chargement de la Heatmap...</div>

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#444' }}>
                Intensité des Clics par Jour et Heure
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {/* Header Row (Hours) */}
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ width: '100px', fontWeight: 'bold' }}></div>
                    {hours.map(h => (
                        <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', color: '#888' }}>
                            {h}h
                        </div>
                    ))}
                </div>

                {/* Day Rows */}
                {daysOrder.map(day => (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                        <div style={{ width: '100px', fontWeight: 'bold', fontSize: '0.9rem' }}>{day}</div>
                        {hours.map(h => {
                            const value = heatmapData[day] ? heatmapData[day][h] : 0
                            const intensity = maxValue > 0 ? value / maxValue : 0
                            // Color: Blue scale (RGB: 66, 133, 244)
                            // We start from a very light blue to full blue
                            const opacity = Math.max(0.05, intensity) // Min opacity so cell exists visually

                            return (
                                <div
                                    key={h}
                                    style={{
                                        flex: 1,
                                        height: '36px',
                                        margin: '0 2px',
                                        backgroundColor: `rgba(66, 133, 244, ${opacity})`,
                                        borderRadius: '4px',
                                        position: 'relative',
                                        cursor: 'pointer'
                                    }}
                                    title={`${day} ${h}h : ${value} clics`}
                                >
                                    {intensity > 0.6 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: '#fff',
                                            fontSize: '0.7rem'
                                        }}>
                                            {value}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.8rem', color: '#666' }}>
                <span>Moins de clics</span>
                <div style={{ width: '100px', height: '10px', background: 'linear-gradient(to right, rgba(66,133,244,0.1), rgba(66,133,244,1))', borderRadius: '5px' }}></div>
                <span>Plus de clics</span>
            </div>
        </div>
    )
}

export default AdsTimeHeatmap
