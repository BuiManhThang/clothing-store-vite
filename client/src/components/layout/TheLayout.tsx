import { CssBaseline, PaletteMode, ThemeProvider, createTheme } from '@mui/material'
import React, { useMemo } from 'react'
import { useAppSelector } from '../../hooks/storeHook'

type Props = {
  children: React.ReactNode
}

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
        }
      : {
          // palette values for dark mode
        }),
  },
})

// const theme = createTheme({
//   palette: {
//     mode: 'light',
//   },
// })

const TheLayout = (props: Props) => {
  const mode = useAppSelector((state) => state.theme.mode)
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  )
}

export default TheLayout
