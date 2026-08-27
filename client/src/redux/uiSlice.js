import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    dark: localStorage.getItem('dc_dark') === '1',
    toasts: [],
  },
  reducers: {
    toggleDark: (state) => {
      state.dark = !state.dark;
      localStorage.setItem('dc_dark', state.dark ? '1' : '0');
      document.documentElement.classList.toggle('dark', state.dark);
    },
    hydrateTheme: (state) => {
      document.documentElement.classList.toggle('dark', state.dark);
    },
    pushToast: (state, action) => {
      state.toasts.push({ id: Date.now() + Math.random(), ...action.payload });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { toggleDark, hydrateTheme, pushToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
