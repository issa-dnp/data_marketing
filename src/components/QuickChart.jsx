import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { parseNumber, detectNumericColumns } from '../utils/csv'

export default function QuickChart({ rows, sectionColor }) {
  const numericCols = detectNumericColumns(rows)
  const allCols = Object.keys(rows[0] || {})
  const labelCols = allCols.filter((c) => !numericCols.includes(c))

  const [labelCol, setLabelCol] = useState(labelCols[0] || allCols[0])
  const [valueCol, setValueCol] = useState(numericCols[0] || allCols[1])

  if (!rows.length || allCols.length < 2) return null

  const chartData = rows.slice(0, 30).map((r) => ({
    name: String(r[labelCol] || '').slice(0, 30),
    value: parseNumber(r[valueCol]) ?? 0,
  }))

  return (
    <div className="quick-chart">
      <div className="chart-controls">
        <label>
          Axe X
          <select value={labelCol} onChange={(e) => setLabelCol(e.target.value)}>
            {allCols.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Valeur
          <select value={valueCol} onChange={(e) => setValueCol(e.target.value)}>
            {allCols.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, bottom: 60, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" fill={sectionColor || '#4285F4'} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
