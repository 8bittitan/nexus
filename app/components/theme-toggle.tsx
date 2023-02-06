import { Moon, Sun } from 'lucide-react';

import { useTheme } from '~/components/theme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md font-medium"
    >
      <span className="sr-only">
        Set theme {theme === 'dark' ? 'light' : 'dark'}
      </span>
      {theme === 'dark' ? <Moon /> : <Sun />}
    </button>
  );
}
