import catalog from '../data/catalog'

export default function Sidebar({ activeSection, onSelectSection, activeFile, onSelectFile }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>BricoMetal</h1>
        <span className="sidebar-subtitle">Dashboard Data Marketing</span>
      </div>

      <nav className="sidebar-nav">
        {Object.entries(catalog).map(([key, section]) => (
          <div key={key} className="sidebar-section">
            <button
              className={`sidebar-section-btn ${activeSection === key ? 'active' : ''}`}
              style={{ '--section-color': section.color }}
              onClick={() => onSelectSection(key)}
            >
              {section.label}
              <span className="file-count">{section.files.length}</span>
            </button>

            {activeSection === key && (
              <ul className="sidebar-files">
                {section.files.map((file) => (
                  <li key={file.id}>
                    <button
                      className={`sidebar-file-btn ${activeFile?.id === file.id ? 'active' : ''}`}
                      onClick={() => onSelectFile(file)}
                      title={file.description}
                    >
                      {file.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
