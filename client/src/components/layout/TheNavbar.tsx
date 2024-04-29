import { Avatar, Box, Button, Icon, IconButton, Typography } from '@mui/material'

const TheNavbar = () => {
  return (
    <Box
      sx={{
        pl: 3,
        pr: 2,
        display: 'flex',
        alignItems: 'center',
        height: '82px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: 1,
          height: '100%',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h5" fontWeight="medium">
          Dashboard
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: 1,
          }}
        >
          <IconButton>
            <Icon
              sx={{
                color: 'text.primary',
              }}
            >
              notifications
            </Icon>
          </IconButton>
          <Button
            sx={{
              textTransform: 'unset',
              color: 'text.primary',
            }}
          >
            <Avatar
              sx={{
                mr: 1,
                width: 32,
                height: 32,
                bgcolor: 'text.primary',
              }}
            >
              A
            </Avatar>
            <Typography>Admin</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TheNavbar
