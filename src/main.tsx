import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AppBoundary } from './components/effects/AppBoundary'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppBoundary>
  </StrictMode>,
)
