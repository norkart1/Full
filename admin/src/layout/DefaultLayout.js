import { React, useState, useContext } from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useNavigate } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
import { AuthContext } from '../Context/authContext'

const DefaultLayout = () => {
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)
  const [loading, setLoading] = useState(false) // Initialize loading state

  const handleLogout = async () => {
    setLoading(true) // Set loading state to true when logout process starts
    // Introduce a small delay before calling the logout function
    setTimeout(async () => {
      try {
        await logout() // Call logout function (assuming it's an asynchronous operation)
        setLoading(false) // Set loading state to false after logout completes
        navigate('/login')
      } catch (error) {
        setLoading(false) // Set loading state to false in case of an error during logout
        console.error('Logout error:', error)
      }
    }, 1500) // Adjust the delay as needed bro,
  }

  return (
    <div>
      <AppSidebar />
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '100vh' }}
        >
          <div className="text-center">
            {/* Replace the spinner with an image element */}
            <img src="/Animation - 1713940973100.gif" alt="Loading..." />
          </div>
        </div>
      ) : (
        <div className="wrapper d-flex flex-column min-vh-100">
          <AppHeader handleLogout={handleLogout} />
          <div className="body flex-grow-1">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      )}
    </div>
  )
}

export default DefaultLayout
