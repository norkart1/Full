import React from 'react';
import { CButton, CCol, CContainer, CRow } from '@coreui/react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import CIcon from '@coreui/icons-react';
import { cilMagnifyingGlass } from '@coreui/icons';

const Page404 = () => {
  const navigate = useNavigate(); // Initialize navigate function using useNavigate hook

  const goToHomePage = () => {
    // Function to navigate to home page
    navigate('/');
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! You're lost.</h4>
              <p className="text-body-secondary float-start">
                The page you are looking for was not found.
              </p>
            </div>
            <div className="d-flex align-items-center mt-3">
              <CButton color="info" onClick={goToHomePage}>
                Go to Home Page
              </CButton>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Page404;
