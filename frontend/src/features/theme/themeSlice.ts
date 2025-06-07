import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
}

const getInitialState = (): ThemeState => {
  // Check if theme preference exists in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return { isDarkMode: savedTheme === 'dark' };
  }
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return { isDarkMode: true };
  }
  return { isDarkMode: false };
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: getInitialState(),
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // Save to localStorage
      localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
      // Update document class
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer; 