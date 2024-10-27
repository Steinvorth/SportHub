import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './componentes/App'

import 'bootswatch/dist/darkly/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
