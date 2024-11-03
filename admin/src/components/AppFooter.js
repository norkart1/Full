import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="http://..?" target="_blank" rel="noopener noreferrer">
          Fest 2024
        </a>
        <span className="ms-1">&copy; 2024 creativeLabs.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://corvoso.vercel.app/" target="_blank" rel="noopener noreferrer">
          Corvoso Technologies
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
