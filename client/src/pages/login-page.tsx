import {
  Box,
  Button,
  Icon,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import baseApi from '../api/baseApi'
import { LocalStorageKey } from '../enums'
import { User } from '../types/user'

const Logo = styled('img')(({ theme }) => ({
  width: '160px',
  height: '50px',
  objectFit: 'contain',
  marginBottom: theme.spacing(1),
}))

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '460px',
  rowGap: theme.spacing(3),
}))

type LoginParams = {
  email: string
  password: string
}

type LoginResult = {
  accessToken: string
  refreshToken: string
  user: User
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [loginParams, setLoginParams] = useState<LoginParams>({
    email: '',
    password: '',
  })
  const [isShowPwd, setIsShowPwd] = useState(false)

  const loginMutation = useMutation({
    mutationFn: async (params: LoginParams) => {
      const res = await baseApi.post('/users/login', params)
      return res.data
    },
    onSuccess: (data: LoginResult) => {
      localStorage.setItem(LocalStorageKey.AccessToken, data.accessToken)
      localStorage.setItem(LocalStorageKey.RefreshToken, data.refreshToken)
      console.log(data)
      navigate('/')
    },
  })

  console.log(loginMutation.status)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof LoginParams
  ) => {
    setLoginParams((prev) => ({
      ...prev,
      [fieldName]: e.target.value,
    }))
  }

  const handleClickShowPwd = () => {
    setIsShowPwd((prev) => !prev)
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loginMutation.mutate(loginParams)
  }

  return (
    <Box
      sx={{
        white: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Logo src={logo} />
        <Typography variant="h5" fontWeight="medium" mb={2}>
          Chào mừng trở lại
        </Typography>
        <Typography variant="subtitle1" mb={3}>
          Bạn chưa có tài khoản?{' '}
          <Link
            component={ReactRouterLink}
            to="/register"
            sx={(theme) => ({
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 'medium',
              transition: theme.transitions.create(['color']),
              '&:hover': {
                textDecoration: 'underline',
                color: 'primary.main',
              },
            })}
          >
            Đăng ký
          </Link>
        </Typography>
        <Form onSubmit={handleLogin}>
          <TextField
            disabled={loginMutation.isPending}
            value={loginParams.email}
            type="email"
            label="Email"
            onChange={(e) => handleChange(e, 'email')}
          ></TextField>
          <TextField
            disabled={loginMutation.isPending}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPwd}>
                    {isShowPwd ? <Icon>visibility_off</Icon> : <Icon>visibility</Icon>}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={loginParams.password}
            type={isShowPwd ? 'text' : 'password'}
            label="Mật khẩu"
            onChange={(e) => handleChange(e, 'password')}
          ></TextField>
          <Button variant="contained" size="large" type="submit" disabled={loginMutation.isPending}>
            Đăng nhập
          </Button>
        </Form>
      </Paper>
    </Box>
  )
}

export default LoginPage
