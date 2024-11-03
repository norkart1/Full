import { useContext } from 'react'
import { AuthContext } from './Context/authContext'

export const isAuthenticated = () => {
  const { getUser } = useContext(AuthContext)

  try {
    const authToken = localStorage.getItem('authToken')
    const user = getUser() // Assuming a function to get user state

    // Check if authToken is present in localStorage or user state
    if (authToken || user) {
      return true
    } else {
      return false
    }
  } catch (error) {
    // Handle errors (e.g., localStorage not available)
    console.error('Error checking authentication:', error)
    return false
  }
}
