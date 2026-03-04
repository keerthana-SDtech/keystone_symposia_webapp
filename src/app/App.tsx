import { BrowserRouter, useRoutes } from 'react-router-dom'
import { appRoutes } from './router/routes'

function AppRoutes() {
  return useRoutes(appRoutes)
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
