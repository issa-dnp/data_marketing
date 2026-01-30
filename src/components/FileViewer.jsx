import { useState, useEffect } from 'react'
import { loadCSV } from '../utils/csv'
import DataTable from './DataTable'
import QuickChart from './QuickChart'
import AdsCampaignChart from './AdsCampaignChart'
import DeviceComparison from './DeviceComparison'
import AdsTimeHeatmap from './AdsTimeHeatmap'
import AdsDemographicsChart from './AdsDemographicsChart'
import KeywordCannibalization from './KeywordCannibalization'
import CTRComparison from './CTRComparison'
import PageCorrelation from './PageCorrelation'
import AdsOrderCorrelation from './AdsOrderCorrelation'
import KeywordMoneyPits from './KeywordMoneyPits'
import SEOCTRAnalysis from './SEOCTRAnalysis'

export default function FileViewer({ file, sectionColor, catalog }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [view, setView] = useState('table')

  const isMission = catalog.mission.files.some(f => f.id === file?.id)

  useEffect(() => {
    if (isMission) {
      setView('chart')
    } else {
      setView('table')
    }
  }, [file, isMission])

  useEffect(() => {
    if (!file) return
    setLoading(true)
    setError(null)
    loadCSV(file.path)
      .then((data) => {
        setRows(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || 'Erreur de chargement')
        setLoading(false)
      })
  }, [file])

  return (
    <div className="file-viewer">
      {!file && (
        <div className="landing">
          <h2>À vous maintenant.</h2>
          <p className="landing-sub">
            Vous avez accès aux données marketing de BricoMetal — Ads, Analytics et SEO.<br />
            Ouvrez un fichier dans le menu, explorez les chiffres, posez-vous des questions.
          </p>
          <div className="landing-steps">
            <div className="landing-step">
              <span className="step-num">1</span>
              <div>
                <strong>Explorer</strong>
                <p>Parcourez les fichiers, triez les colonnes, repérez les tendances.</p>
              </div>
            </div>
            <div className="landing-step">
              <span className="step-num">2</span>
              <div>
                <strong>Visualiser</strong>
                <p>Passez en mode graphique, croisez les dimensions, testez des axes.</p>
              </div>
            </div>
            <div className="landing-step">
              <span className="step-num">3</span>
              <div>
                <strong>Recommander</strong>
                <p>Identifiez des actions concrètes à partir de ce que vous observez.</p>
              </div>
            </div>
          </div>
          <div className="landing-sources">
            {Object.entries(catalog).map(([key, section]) => (
              <span key={key} style={{ color: section.color }}>
                {section.label} — {section.files.length} fichier{section.files.length > 1 ? 's' : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {file && (
        <>
          <header className="file-header">
            <div>
              <h2>{file.label}</h2>
              <p className="file-description">{file.description}</p>
            </div>
            {!isMission && (
              <div className="view-toggle">
                <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Tableau</button>
                <button className={view === 'chart' ? 'active' : ''} onClick={() => setView('chart')}>Graphique</button>
              </div>
            )}
          </header>

          {loading && <p className="loading">Chargement…</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && rows.length > 0 && (
            <>
              <div className="file-meta">
                <span>{rows.length} lignes</span>
                <span>{Object.keys(rows[0]).length} colonnes</span>
              </div>
              {view === 'table' ? (
                <DataTable rows={rows} />
              ) : file.id === 'campagnes' ? (
                <AdsCampaignChart rows={rows} />
              ) : file.id === 'mission-appareils' ? (
                <DeviceComparison file={file} />
              ) : file.id === 'mission-heatmap' ? (
                <AdsTimeHeatmap file={file} />
              ) : file.id === 'mission-demographie' ? (
                <AdsDemographicsChart rows={rows} />
              ) : file.id === 'mission-keywords' ? (
                <KeywordCannibalization file={file} />
              ) : file.id === 'mission-ctr' ? (
                <CTRComparison file={file} />
              ) : file.id === 'mission-correlation' ? (
                <PageCorrelation file={file} />
              ) : file.id === 'mission-ads-orders' ? (
                <AdsOrderCorrelation file={file} />
              ) : file.id === 'mission-money-pits' ? (
                <KeywordMoneyPits file={file} />
              ) : file.id === 'mission-seo-ctr' ? (
                <SEOCTRAnalysis file={file} />
              ) : (
                <QuickChart rows={rows} sectionColor={sectionColor} />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
