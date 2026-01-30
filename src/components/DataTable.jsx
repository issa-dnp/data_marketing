import { useState } from 'react'

export default function DataTable({ rows, maxRows = 50 }) {
  const [sortCol, setSortCol] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)

  if (!rows.length) return <p className="empty">Aucune donnée.</p>

  const columns = Object.keys(rows[0])

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc)
    } else {
      setSortCol(col)
      setSortAsc(true)
    }
  }

  const sorted = [...rows].sort((a, b) => {
    if (!sortCol) return 0
    const va = a[sortCol] ?? ''
    const vb = b[sortCol] ?? ''
    // Try numeric comparison
    const na = Number(String(va).replace(/[^\d.,-]/g, '').replace(',', '.'))
    const nb = Number(String(vb).replace(/[^\d.,-]/g, '').replace(',', '.'))
    if (!isNaN(na) && !isNaN(nb)) {
      return sortAsc ? na - nb : nb - na
    }
    return sortAsc ? String(va).localeCompare(String(vb), 'fr') : String(vb).localeCompare(String(va), 'fr')
  })

  const display = sorted.slice(0, maxRows)

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col} onClick={() => handleSort(col)} className="sortable">
                {col}
                {sortCol === col ? (sortAsc ? ' ↑' : ' ↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {display.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > maxRows && (
        <p className="table-info">{rows.length} lignes au total — {maxRows} affichées</p>
      )}
    </div>
  )
}
