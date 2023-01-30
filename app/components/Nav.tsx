import type { FC } from 'react';
import type { UserSession } from '~/types';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

import { Form, Link } from '@remix-run/react';
import { useState } from 'react';
import { Sun, Moon, Gamepad, ChevronDown, ChevronUp } from 'lucide-react';

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
          <Gamepad className="mr-2 w-10 h-10" />
          <span className="text-3xl">Nexus</span>
        </Link>

        <nav className="flex-none">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/library"
                className="py-2 px-4 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
              >
                Library
              </Link>
              <Link
                to="/library/search"
                className="py-2 px-4 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
              >
                Search
              </Link>

              <button
                onClick={toggleTheme}
                className="py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md font-medium"
              >
                <span className="sr-only">
                  Set theme {theme === 'dark' ? 'light' : 'dark'}
                </span>
                {theme === 'dark' ? <Moon /> : <Sun />}
              </button>

              <Dropdown.Root onOpenChange={setIsOpen}>
                <Dropdown.Trigger asChild>
                  <button
                    type="button"
                    className="flex items-center text-sm focus:outline-none"
                  >
                    <span className="sr-only">Open user menu</span>
                    <span className="inline-flex text-sm font-semibold pr-2">
                      {user.displayName}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="pr-2" />
                    ) : (
                      <ChevronDown className="pr-2" />
                    )}
                    {user.avatar && (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt=""
                      />
                    )}
                  </button>
                </Dropdown.Trigger>

                <Dropdown.Portal>
                  <Dropdown.Content
                    align="end"
                    side="bottom"
                    className="mt-2 w-48 z-50 overflow-hidden rounded-md border border-slate-100 bg-white p-1 text-slate-700 shadow-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <Dropdown.Item className="focus-visible:outline-none hover:outline-none">
                      <Link
                        to="/auth/logout"
                        className="flex w-full cursor-pointer select-none py-1 px-2 text-sm font-medium outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                      >
                        Logout
                      </Link>
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root>
            </div>
          ) : null}
        </nav>
      </Container>
    </header>
  );
};

export default Nav;
