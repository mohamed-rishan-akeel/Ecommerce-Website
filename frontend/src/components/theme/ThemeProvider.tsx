import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    // Update the class on the html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return <>{children}</>;
};

export default ThemeProvider; 