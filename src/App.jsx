import { useState } from 'react'
import Sidebar from './components/Sidebar'
import FileViewer from './components/FileViewer'
import catalog from './data/catalog'

function App() {
  const [activeSection, setActiveSection] = useState(null)
  const [activeFile, setActiveFile] = useState(null)

  const sectionColor = activeSection ? catalog[activeSection]?.color : undefined

  return (
    <div className="app-layout">
      <Sidebar
        activeSection={activeSection}
        onSelectSection={(key) => {
          setActiveSection(key === activeSection ? null : key)
          setActiveFile(null)
        }}
        activeFile={activeFile}
        onSelectFile={setActiveFile}
      />
      <main className="main-content">
        <FileViewer file={activeFile} sectionColor={sectionColor} catalog={catalog} />
      </main>
    </div>
  )
}

export default App
