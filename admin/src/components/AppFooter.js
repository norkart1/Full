import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="http://..?" target="_blank" rel="noopener noreferrer">
          Sargalayam 2024
        </a>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://corvoso.vercel.app/" target="_blank" rel="noopener noreferrer">
        &copy; <span id="copyright-year"></span> Corvoso Technologies All rights reserved.
        </a>
        
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
