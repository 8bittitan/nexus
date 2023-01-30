export type Theme = 'dark' | 'light';

export type Context = {
  theme: Theme;
  setTheme: (theme: theme) => void;
};
