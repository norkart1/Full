import { createContext, useState, useEffect } from 'react'
import { adminBaseUrl } from '../Constant/url'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async (userData) => {
    try {
      const response = await axios.post(`${adminBaseUrl}/login`, userData)

      if (response.status === 200) {
        const authToken = response.data.token
        localStorage.setItem('authToken', authToken)

        // Decode the token to extract user data
        const decodedToken = jwtDecode(authToken)

        // Store user data in the state
        setUser(decodedToken)
      } else {
        console.log('response.data.message', response.data.message)
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const authToken = localStorage.getItem('authToken')

      if (authToken) {
        const response = await axios.post(`${adminBaseUrl}/logout`, {
          token: authToken,
        })

        if (response.status === 200) {
          localStorage.removeItem('authToken')
          setUser(null)
          console.log('Logout successful')
        } else {
          console.error('Error logging out:', response.data.message)
        }
      } else {
        console.error('Token not available to logout')
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const getUser = () => {
    return user
  }

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const authToken = localStorage.getItem('authToken')

      if (authToken) {
        const decodedToken = jwtDecode(authToken)
        const expirationTime = decodedToken.exp * 1000 // Convert expiration time to milliseconds
        const currentTime = Date.now()
        const remainingTime = expirationTime - currentTime

        if (remainingTime <= 0) {
          // Token has expired, clear it from local storage and redirect to login
          await logout()
          console.error('session expired')
        }
      }
    }

    // Check token expiration every second
    const intervalId = setInterval(checkTokenExpiration, 1000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const contextValue = {
    login,
    logout,
    user,
    getUser,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
