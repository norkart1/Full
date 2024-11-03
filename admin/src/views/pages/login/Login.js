import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import { AuthContext } from '../../../Context/authContext'

const Login = () => {
  const [email, setEmail] = useState('')

  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState(false)

  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  const [successMessage, setSuccessMessage] = useState('')

  // using dispatch time;
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email')
      setEmailSuccess(false)
      return false
    }
    setEmailError('')
    setEmailSuccess(true)
    return true
  }

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[0-9]).{8,}$/
    if (!password.match(passwordRegex)) {
      setPasswordError('Password must contain at least 8 characters including one number')
      setPasswordSuccess(false)
      return false
    }
    setPasswordError('')
    setPasswordSuccess(true)
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (validateEmail() && validatePassword()) {
      try {
        await login({ email, password })
        setSuccessMessage('Login successful')
        navigate('/')
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred during login.')
        // Enable the button after a delay
        setTimeout(() => setLoading(false), 2000) // Adjust the delay as needed (e.g., 2000 milliseconds = 2 seconds)
      }
    } else {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4 shadow-sm">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1 className="text-center mb-4">Login</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        invalid={!!emailError}
                        valid={emailSuccess}
                      />
                      <CFormFeedback invalid>{emailError}</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={validatePassword}
                        invalid={!!passwordError}
                        valid={passwordSuccess}
                      />
                      <CFormFeedback invalid>{passwordError}</CFormFeedback>
                    </CInputGroup>

                    <CButton type="submit" color="primary" className="w-100" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </CButton>

                    {/* <div className="text-center mt-3">
                      <Link to="/forgot-password" className="text-body-secondary">
                        Forgot password?
                      </Link>
                    </div> */}

                    {successMessage && (
                      <div className="alert alert-success mt-3text-center" role="alert">
                        {successMessage}
                      </div>
                    )}

                    {error && (
                      <div className="alert alert-danger mt-3" role="alert">
                        {error}
                      </div>
                    )}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
