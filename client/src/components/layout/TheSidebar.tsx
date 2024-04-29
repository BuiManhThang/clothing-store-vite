import {
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link,
  Paper,
  styled,
  Switch,
  FormControlLabel,
} from '@mui/material'
import logo from '../../assets/images/logo.png'
import { NavLink, Link as ReactRouterLink, useLocation } from 'react-router-dom'
import { SidebarLink } from '../../types/sidebarLink'
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook'
import { changeThemeMode } from '../../store/themeSlice'

const SIDEBAR_LINKS: SidebarLink[] = [
  {
    text: 'Trang chủ',
    url: '/admin',
    icon: 'dashboard',
  },
  {
    text: 'Người dùng',
    url: '/admin/users',
    icon: 'person',
  },
  {
    text: 'Danh mục',
    url: '/admin/categories',
    icon: 'category',
  },
  {
    text: 'Sản phẩm',
    url: '/admin/products',
    icon: 'checkroom',
  },
  {
    text: 'Đơn nhập',
    url: '/admin/receipts',
    icon: 'receipt',
  },
  {
    text: 'Đơn xuất',
    url: '/admin/orders',
    icon: 'inventory',
  },
  {
    text: 'Cài đặt',
    url: '/admin/setting',
    icon: 'settings',
  },
]

const Nav = styled('nav')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexGrow: 1,
})

const TheSidebar = () => {
  const location = useLocation()
  const themeMode = useAppSelector((state) => state.theme.mode)
  const darkMode = themeMode === 'dark' ? true : false
  const dispatch = useAppDispatch()

  const handleChangeDarkMode = () => {
    dispatch(changeThemeMode(darkMode ? 'light' : 'dark'))
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link
        component={ReactRouterLink}
        to="/admin"
        sx={{
          display: 'inline-block',
          width: '160px',
          height: '50px',
          mb: 2,
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: '160px',
            height: '50px',
            objectFit: 'contain',
          }}
        />
      </Link>
      <Nav>
        <List>
          {SIDEBAR_LINKS.map((sidebarLink) => (
            <ListItem
              key={sidebarLink.url}
              sx={{
                px: 0,
              }}
            >
              <Link
                component={NavLink}
                to={sidebarLink.url}
                sx={(theme) => ({
                  bgcolor: location.pathname === sidebarLink.url ? 'primary.dark' : '',
                  color: location.pathname === sidebarLink.url ? 'white' : 'text.primary',
                  textDecoration: 'none',
                  borderRadius: theme.shape.borderRadius,
                })}
                width="100%"
                overflow="hidden"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Icon
                      sx={{
                        color: location.pathname === sidebarLink.url ? 'white' : 'text.primary',
                      }}
                    >
                      {sidebarLink.icon}
                    </Icon>
                  </ListItemIcon>
                  <ListItemText>{sidebarLink.text}</ListItemText>
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <FormControlLabel
          sx={{
            pl: 2,
          }}
          control={
            <Switch
              sx={(theme) => ({
                width: 62,
                height: 34,
                padding: '10px',
                '& .MuiSwitch-switchBase': {
                  width: '32px',
                  height: '32px',
                  left: '4px',
                  backgroundColor:
                    theme.palette.mode === 'dark' ? '#003892 !important' : '#001e3c !important',
                },
              })}
              icon={<Icon fontSize="small">light_mode</Icon>}
              checkedIcon={<Icon fontSize="small">dark_mode</Icon>}
              checked={darkMode}
              onChange={handleChangeDarkMode}
            />
          }
          label="Giao diện"
        ></FormControlLabel>
      </Nav>
    </Paper>
  )
}

export default TheSidebar
