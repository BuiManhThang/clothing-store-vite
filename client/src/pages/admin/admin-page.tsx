import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import TheSidebar from '../../components/layout/TheSidebar'
import TheNavbar from '../../components/layout/TheNavbar'

const AdminPage = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        width: '100%',
        height: '100vh',
        bgcolor: 'background',
        p: 1,
      }}
    >
      <TheSidebar />
      <Box width="100%" height="100%">
        <TheNavbar />
        <Box width="100%" height="calc(100% - 82px)" pt={2} pr={2} pl={3}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminPage
