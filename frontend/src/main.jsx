import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { loadCms } from './cms/client'
import { installCmsFormHandler } from './cms/forms'

async function start() {
  await loadCms()
  installCmsFormHandler()
  const { default: App } = await import('./App.jsx')
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </React.StrictMode>,
  )
}

start()