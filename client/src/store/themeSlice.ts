import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PaletteMode } from '@mui/material'

export type ThemeState = {
  mode: PaletteMode
}

const initialState: ThemeState = {
  mode: 'light',
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    changeThemeMode: (state, payload: PayloadAction<PaletteMode>) => {
      state.mode = payload.payload
    },
  },
})

export const { changeThemeMode } = themeSlice.actions

export default themeSlice.reducer
