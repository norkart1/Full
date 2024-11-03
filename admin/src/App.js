import React, { Fragment, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { isAuthenticated } from './isAuthenticated'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
          >
            <div className="text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          </div>
        }
      >
        <Routes>
          {/* Public routes */}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/404" element={<Page404 />} />

          {/* Protected routes */}

          <Route
            path="*"
            element={isAuthenticated() ? <DefaultLayout /> : <Navigate to="/login" />}
          />

          {/* <Route
            path="*"
            element={ <DefaultLayout/>}
          /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

{
  /* <Route exact path="/register" name="Register Page" element={<Register />} /> */
}
export default App
