import { useState, useEffect, useContext } from 'react'
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material'

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import AddBrokerForm from './addTeam'
import { TeamSearch } from './searchTeam'
import { TeamCard } from './TeamCard'
import { CrudTeamContext } from '../../Context/teamContext'
import { PlusOne } from '@mui/icons-material'

const Page = () => {
  const { fetchTeamData } = useContext(CrudTeamContext)
  const rowsPerPage = 6
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState(false)
  const [brokersData, setBrokersData] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('') // State to hold the search query

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchTeamData()

      setBrokersData(fetchedData)
      setIsLoading(false) // Set isLoading to false after fetching data
    }
    fetchData()
  }, [fetchTeamData]) // Make sure to include fetchFranchises in the dependency array

  // Filter Brokers based on search query
  const filteredBrokers = brokersData?.filter((broker) =>
    broker.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalBrokers = filteredBrokers.length
  const totalPages = Math.ceil(totalBrokers / rowsPerPage)

  // Calculate displayed Brokers based on pagination
  const startIndex = page * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, totalBrokers)

  const displayedBrokers = filteredBrokers.slice(startIndex, endIndex)

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1)
  }

  // Function to handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    setPage(0) // Reset page when search query changes
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Teams</Typography>
              </Stack>
              <div>
                <Button
                  onClick={() => setOpen(!open)}
                  startIcon={<SvgIcon fontSize="small">{<PlusOne />}</SvgIcon>}
                  variant="contained"
                >
                  Add
                </Button>
              </div>
            </Stack>
            <TeamSearch handleSearchChange={handleSearchChange} />
            <Grid container spacing={3}>
              {isLoading
                ? Array.from({ length: rowsPerPage }).map((_, index) => (
                    <Grid xs={12} md={6} lg={4} key={index}>
                      <Box sx={{ p: 2 }}>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={250}
                          animation="wave"
                        />
                        <Box sx={{ pt: 2 }}>
                          <Skeleton variant="text" width={150} height={24} animation="wave" />
                          <Skeleton variant="text" width="80%" height={16} animation="wave" />
                          <Skeleton variant="text" width="60%" height={16} animation="wave" />
                        </Box>
                      </Box>
                    </Grid>
                  ))
                : // Render actual data once it's loaded
                  displayedBrokers.map((broker) => (
                    <Grid xs={12} md={6} lg={4} key={broker._id}>
                      <TeamCard broker={broker} />
                    </Grid>
                  ))}
            </Grid>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={handlePageChange}
                size="large"
              />
            </Box>
          </Stack>
        </Container>

        <AddBrokerForm open={open} setOpen={setOpen} />
      </Box>
    </>
  )
}

export default Page
