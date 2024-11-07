import React, { useContext, useEffect, useState } from 'react'
import {
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cibSuperuser } from '@coreui/icons'
import { CrudTeamContext } from '../../Context/teamContext'
import Pagination from 'react-js-pagination' // Import pagination component

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { imageUrl } from '../../Constant/url'

function AllBrokers() {
  const { fetchTeamData } = useContext(CrudTeamContext);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1) // State to manage 
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetchTeamData();

        if (!fetchedData || fetchedData.length === 0) {
          setBrokers([]); // Handle empty data case
        } else {
          const sortedTeams = fetchedData.sort((a, b) => b.totalScore - a.totalScore);

          // Assign ranking based on the sorted order
          const rankedTeams = sortedTeams.map((team, index) => ({
            ...team,
            ranking: index + 1, // Assign rank based on position
          }));

          setBrokers(rankedTeams); // Update brokers with sorted and ranked data
        }
      } catch (err) {
        console.error("Error fetching team data:", err);
        setError("Failed to load data. Please try again later."); // Set error message if fetching fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes, regardless of success or error
      }
    };

    fetchData();
  }, [fetchTeamData]);


  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber)
  }

  // Calculate the indexes for the current page
  const startIndex = (activePage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  

  return (
    <div>
      <CTable align="middle" className="mb-0 border" hover responsive>
  <CTableHead className="text-nowrap">
    <CTableRow>
      <CTableHeaderCell className="bg-body-tertiary text-center">
        <CIcon icon={cibSuperuser} />
      </CTableHeaderCell>
      <CTableHeaderCell className="bg-body-tertiary">Team Name</CTableHeaderCell>
      <CTableHeaderCell className="bg-body-tertiary text-center">Rank</CTableHeaderCell>
      <CTableHeaderCell className="bg-body-tertiary text-center">Score</CTableHeaderCell>
    </CTableRow>
  </CTableHead>
  <CTableBody>
  {loading ? (
        // Loading State: Display skeleton loaders
        Array.from({ length: 5 }).map((_, index) => (
          <CTableRow key={index}>
            <CTableDataCell className="text-center">
              <Skeleton circle={true} height={40} width={40} />
            </CTableDataCell>
            <CTableDataCell>
              <Skeleton height={20} />
            </CTableDataCell>
            <CTableDataCell className="text-center">
              <Skeleton height={20} />
            </CTableDataCell>
            <CTableDataCell className="text-center">
              <Skeleton height={20} />
            </CTableDataCell>
          </CTableRow>
        ))
      ) : error ? (
        // Error State: Display error message
        <CTableRow>
          <CTableDataCell colSpan={4} className="text-center text-red-500 py-3">
            <p>{error}</p>
          </CTableDataCell>
        </CTableRow>
      ) : brokers.length === 0 ? (
        // Empty Data State: Display "No Data Available" message
        <CTableRow>
          <CTableDataCell colSpan={4} className="text-center py-5">
            <h1 className="text-2xl font-bold text-gray-700 mb-2">No Data Available</h1>
            <p className="text-gray-500">
              We couldn’t find any team data to display. Please check back later or try refreshing the page.
            </p>
          </CTableDataCell>
        </CTableRow>
      ) : (
        // Data Display State: Display the actual data
        brokers.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage).map((item, index) => (
          <CTableRow key={index}>
            <CTableDataCell className="text-center">
              <CAvatar size="md" src={`${imageUrl}/${item.image}`} />
            </CTableDataCell>
            <CTableDataCell>{item.name}</CTableDataCell>
            <CTableDataCell className="text-center">
              <div className="fw-semibold">{item.ranking}</div>
            </CTableDataCell>
            <CTableDataCell className="text-center">
              <div className="fw-semibold">{item.totalScore}</div>
            </CTableDataCell>
          </CTableRow>
        ))
      )}
  </CTableBody>
</CTable>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination
          activePage={activePage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={brokers.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    </div>
  )
}

export default AllBrokers
