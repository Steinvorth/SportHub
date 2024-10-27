import 'bootswatch/dist/darkly/bootstrap.min.css' //bootswatch theme

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//componentes
import App from './componentes/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>

  </StrictMode>
)
