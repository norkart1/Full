import React, { useContext, useState, useEffect } from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cibSuperuser,
} from '@coreui/icons'

import WidgetsDropdown from '../widgets/WidgetsDropdown'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { CrudTeamContext } from '../../Context/teamContext'
import { imageUrl } from '../../Constant/url'

const Dashboard = () => {
  const { fetchTeamData } = useContext(CrudTeamContext);
  const [teams, setTeams] = useState([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchTeamData();

      // Sort teams based on total score in descending order
      const sortedTeams = fetchedData.sort((a, b) => b.totalScore - a.totalScore);

      // Assign ranking based on the sorted order
      const rankedTeams = sortedTeams.map((team, index) => ({
        ...team,
        ranking: index + 1, // Assign rank based on position
      }));

      setTeams(rankedTeams);
      setIsLoading(false); // Set isLoading to false after fetching data
    };
    fetchData();
  }, [fetchTeamData]);

  return (
    <>
      <WidgetsDropdown className="mb-4" />

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader style={{ fontSize: 30 }}>Top 10 Teams</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary">ID</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cibSuperuser} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Team</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Rank</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">Total Score</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loading
                    ? // Render skeleton rows while data is being fetched
                      Array.from({ length: 10 }).map((_, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell className="text-center">
                            <Skeleton circle={true} height={40} width={40} />
                          </CTableDataCell>
                          <CTableDataCell>
                            <Skeleton height={20} width={`80%`} />
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <Skeleton height={20} width={`60%`} />
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <Skeleton height={20} width={`40%`} />
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <Skeleton height={20} width={`80%`} />
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    : // Render actual data once it's loaded
                      teams.slice(0, 10).map((item, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>{item._id}</CTableDataCell>
                          <CTableDataCell className="text-center">
                            <CAvatar size="md" src={`${imageUrl}/${item.image}`} />
                          </CTableDataCell>
                          <CTableDataCell>{item.name}</CTableDataCell>
                          <CTableDataCell className="text-center">
                            <div className="fw-semibold">{item.ranking}</div> {/* Show calculated rank */}
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <div className="fw-semibold">{item.totalScore}</div>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;

