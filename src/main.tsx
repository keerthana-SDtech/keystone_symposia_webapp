import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/App.css'
import App from './app/App.tsx'
import { AuthProvider } from './app/providers/AuthProvider'
import { TenantProvider } from './app/providers/TenantProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TenantProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TenantProvider>
  </StrictMode>,
)
