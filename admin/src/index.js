import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App'
import store from './store'
import { AuthProvider } from './Context/authContext'
import { CrudProvider } from './Context/teamContext'
import { ProgramCrudProvider } from './Context/programContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <CrudProvider>
        <ProgramCrudProvider>
          <App />
        </ProgramCrudProvider>
      </CrudProvider>
    </AuthProvider>
  </Provider>,
)
