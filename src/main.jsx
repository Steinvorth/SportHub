import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootswatch/dist/darkly/bootstrap.min.css'
import { HomePage } from './componentes/HomePage/HomePage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Aqui van las vistas que queremos Renderizar */}
    <HomePage/>

  </StrictMode>
)
