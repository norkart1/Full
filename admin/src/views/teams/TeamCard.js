import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
//import {} from '@coreui/icons-react'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  SvgIcon,
  Typography,
  Button,
} from '@mui/material'

import { Edit } from '@mui/icons-material'
import EditDialog from './editDialog'
import { imageUrl } from '../../Constant/url'

const getRankColor = (rank) => {
  if (rank >= 1 && rank <= 3) {
    return '#4caf50' // Green color for top ranks
  } else if (rank >= 4 && rank <= 7) {
    return '#ffc107' // Yellow color for mid ranks
  } else {
    return '#f44336' // Red color for lower ranks
  }
}

export const TeamCard = (props) => {
  const { broker } = props

  const [open, setOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const handleOpen = () => {
    setOpen(true)
    setShowDetails(false)
  }

  const handleOpenDetailPage = () => {
    setShowDetails(true)
  }

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          cursor: 'pointer',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.03)',
          },
        }}
      >
        <CardContent onClick={handleOpenDetailPage}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              pb: 3,
            }}
          >
            <Avatar
              src={`${imageUrl}/${broker.image}`}
              variant="square"
              sx={{
                width: '120px',
                height: '120px',
                border: '2px solid #fff',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Box>
          <Typography align="center" gutterBottom variant="h5" sx={{ color: '#333', mb: 1 }}>
            {broker.name}
          </Typography>

          <Typography align="center" variant="body1" sx={{ color: '#666', mb: 1 }}>
            Created at: {broker.createdAt}
          </Typography>

          {/* <Typography
            align="center"
            variant="body1"
            sx={{ color: getRankColor(broker.rank), fontWeight: 'bold' }}
          >
            Rank: {broker.ranking}
          </Typography> */}

          {broker.totalScore > 0 && (
            <Typography align="center" variant="body1">
              Total Score: {broker.totalScore}
            </Typography>
          )}
        </CardContent>

        <Divider />

        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 2 }}
        >
          {/* <Stack alignItems="center" direction="row" spacing={1}>
      <SvgIcon color="action" fontSize="small">
        
      </SvgIcon>
      <Typography color="text.secondary" fontWeight={'bold'} display="inline" variant="body2">
          {brokers.length} Restaurants
        </Typography>
    </Stack> */}

          <Stack alignItems="center" direction="row">
            <Button
              onClick={handleOpen}
              startIcon={<Edit />}
              variant="contained"
              onMouseDown={(e) => e.stopPropagation()} // Prevents the click event from reaching the card
              sx={{
                backgroundColor: '#1976D2',
                color: '#fff',
                '&:hover': { backgroundColor: '#1565C0' },
              }}
            >
              Manage
            </Button>
          </Stack>
        </Stack>
      </Card>

      {open && <EditDialog open={open} setOpen={setOpen} brokersData={broker} />}
    </>
  )
}

TeamCard.propTypes = {
  broker: PropTypes.object.isRequired,
}
