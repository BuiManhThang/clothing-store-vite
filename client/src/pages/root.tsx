import { Outlet, Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

const Root = () => {
  return (
    <Box>
      <div id="sidebar">
        Logo
        <nav>
          <ul>
            <li>
              <Typography
                sx={{
                  textDecoration: 'none',
                }}
              >
                <Link to={`/admin`}>Admin</Link>
              </Typography>
            </li>
            <li>
              <a href={`/contacts/2`}>Your Friend</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="main">
        <Outlet />
      </div>
    </Box>
  )
}

export default Root
