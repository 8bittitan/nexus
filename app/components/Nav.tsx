import type { FC } from 'react';
import type { UserSession } from '~/types';

import { Form, Link } from '@remix-run/react';
import { useState } from 'react';
import { Sun, Moon, Gamepad } from 'lucide-react';

import Container from '~/components/Container';
import { useTheme } from '~/components/theme';

type Props = {
  user: UserSession | undefined;
};

const Nav: FC<Props> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className="border-b border-b-slate-200 dark:border-b-slate-700 py-4"
      data-test="navigation"
    >
      <Container classes="flex justify-between items-center">
        <Link to={user ? '/library' : '/'} className="flex items-center">
          <span className="sr-only">Nexus</span>
          <Gamepad className="mr-2 w-10 h-10" />
          <span className="text-3xl">Nexus</span>
        </Link>

        <nav className="flex-none">
          {user ? (
            <div className="relative flex items-center space-x-6">
              <Link to="/library">Library</Link>
              <Link to="/library/search">Search</Link>

              <button onClick={toggleTheme}>
                <span className="sr-only">
                  Set theme {theme === 'dark' ? 'light' : 'dark'}
                </span>
                {theme === 'dark' ? <Moon /> : <Sun />}
              </button>

              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                id="user-menu-button"
                aria-expanded={isOpen ? 'true' : 'false'}
                aria-haspopup="true"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <span className="inline-flex pr-4 pl-2">
                  {user.displayName}
                </span>
                {user.avatar && (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.avatar}
                    alt=""
                  />
                )}
              </button>

              {isOpen && (
                <div
                  className="origin-top-right absolute right-0 top-8 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <Form action="/auth/logout" role="menuitem" tabIndex={-1}>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 w-full text-left"
                      type="submit"
                    >
                      Logout
                    </button>
                  </Form>
                </div>
              )}
            </div>
          ) : null}
        </nav>
      </Container>
    </header>
  );
};

export default Nav;
