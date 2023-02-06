export type Theme = 'dark' | 'light';

export type Context = {
  theme: Theme;
  toggleTheme: () => void;
};
