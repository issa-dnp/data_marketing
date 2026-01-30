import Papa from 'papaparse'

export async function loadCSV(path) {
  const encodedPath = path.split('/').map((seg) => seg ? encodeURIComponent(seg) : seg).join('/')
  const res = await fetch(encodedPath)
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${path}`)
  const text = await res.text()
  if (text.trimStart().startsWith('<!')) throw new Error(`Le fichier n'a pas été trouvé : ${path}`)

  // Some Google exports have comment lines at the top (starting with #)
  const lines = text.split('\n')
  const dataStart = lines.findIndex((l) => !l.startsWith('#') && l.trim() !== '')
  const cleanText = lines.slice(dataStart).join('\n')

  return new Promise((resolve, reject) => {
    Papa.parse(cleanText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    })
  })
}

export function parseNumber(val) {
  if (val == null || val === '') return null
  // Handle French formatted numbers: "1 234,56 €" or "12,34%" or "0,32 €"
  const cleaned = String(val)
    .replace(/\s/g, '')
    .replace('€', '')
    .replace('%', '')
    .replace(/\u00a0/g, '')
    .replace(/\./g, '')   // thousands separator in French
    .replace(',', '.')    // decimal separator
    .trim()
  const n = Number(cleaned)
  return isNaN(n) ? null : n
}

export function detectNumericColumns(rows) {
  if (!rows.length) return []
  const cols = Object.keys(rows[0])
  return cols.filter((col) => {
    const sample = rows.slice(0, 20)
    const numCount = sample.filter((r) => parseNumber(r[col]) !== null).length
    return numCount > sample.length * 0.6
  })
}
