import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './portal.css'

const root = document.getElementById('portal-root')
if (!root) throw new Error('Missing #portal-root element')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
