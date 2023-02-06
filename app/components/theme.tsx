import type { PropsWithChildren } from 'react';
import { createContext, useState, useEffect, useContext } from 'react';

import type { Context, Theme } from '~/types/theme';

const ThemeContext = createContext<Context>({
  theme: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider = ({
  children,
  defaultTheme = 'dark',
}: PropsWithChildren<{ defaultTheme: Theme }>) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const data = new FormData();

    data.append('theme', theme);

    fetch('/api/theme', {
      method: 'POST',
      body: data,
    });

    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return themeContext;
};
