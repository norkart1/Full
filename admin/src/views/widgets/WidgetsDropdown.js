import React, { useContext, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { CrudTeamContext } from '../../Context/teamContext'

const WidgetsDropdown = (props) => {
  const { fetchTeamData  } = useContext(CrudTeamContext);
  const [totalBrokers, setTotalBrokers] = useState(0);
  const [brokersData, setBrokersData] = useState([]);
  const [percentageChange, setPercentageChange] = useState(0);

  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchTeamData ()
      setBrokersData(fetchedData)
      setTotalBrokers(fetchedData.length)

      // Calculate percentage change if previous data exists
      if (totalBrokers !== 0) {
        const previousTotalBrokers = totalBrokers; // Assuming previous total brokers
        const change = totalBrokers - previousTotalBrokers;
        const percentage = (change / previousTotalBrokers) * 100;
        setPercentageChange(percentage);
      }else {
        setPercentageChange(0); // Set percentageChange to 0 if there's no previous total brokers
      }
    }
    fetchData()
  }, [fetchTeamData , totalBrokers]) // Include totalBrokers in dependency array to recalculate percentage change

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={
            <>
              {totalBrokers}{' '}
              <span className="fs-6 fw-normal">
                {percentageChange !== 0 && (
                  percentageChange > 0 ?
                  `(+${percentageChange.toFixed(1)}% <CIcon icon={cilArrowTop} />)` :
                  `(${percentageChange.toFixed(1)}% <CIcon icon={cilArrowBottom} />)`
                )}
              </span>
            </>
          }
          title="Total Teams"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href='/allbrokers'>View brokers</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={{
                labels: brokersData.map(entry => entry.monthYear),
                datasets: [
                  {
                    label: 'Total Teams',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,.55)',
                    pointBackgroundColor: 'var(--cui-primary)', // Use your primary color here
                    data: [brokersData.length], // Data is the total number of brokers
                  },
                ],
              }}
              options={{
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
                scales: {
                  x: { display: false, grid: { display: false, drawBorder: false }, ticks: { display: false } },
                  y: { min: 0, display: false, grid: { display: false }, ticks: { display: false } },
                },
                elements: { line: { borderWidth: 1, tension: 0.4 }, point: { radius: 4, hitRadius: 10, hoverRadius: 4 } },
              }}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
