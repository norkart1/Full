import { cilSearch } from '@coreui/icons'
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material'

export const TeamSearch = ({ handleSearchChange }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      defaultValue=""
      fullWidth
      placeholder="Search Team"
      onChange={handleSearchChange}
      startAdornment={
        <InputAdornment position="start">
          <SvgIcon color="action" fontSize="small">
            <cilSearch />
          </SvgIcon>
        </InputAdornment>
      }
      sx={{ maxWidth: 500 }}
    />
  </Card>
)
