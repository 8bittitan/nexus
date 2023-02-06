import type { FC } from 'react';
import type { UserSession } from '~/types';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

import { Link } from '@remix-run/react';
import { useState } from 'react';
import { Gamepad, ChevronDown, ChevronUp } from 'lucide-react';

import Container from '~/components/Container';
import ThemeToggle from '~/components/theme-toggle';
import { useTheme } from '~/components/theme';

type Props = {
  user: UserSession | undefined;
};

const Nav: FC<Props> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="border-b border-b-slate-200 dark:border-b-slate-700 py-4"
      data-test="navigation"
    >
      <Container classes="flex justify-between items-center">
        <Link to={user ? '/library' : '/'} className="flex items-center">
          <Gamepad className="mr-2 w-6 h-6 md:w-10 md:h-10" />
          <span className="text-xl md:text-3xl">Nexus</span>
        </Link>

        {!user && <ThemeToggle />}

        {user && (
          <nav className="flex-none">
            <div className="items-center space-x-4 hidden md:flex">
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

              <ThemeToggle />

              <Dropdown.Root onOpenChange={setIsOpen}>
                <Dropdown.Trigger asChild>
                  <button
                    type="button"
                    className="flex items-center text-sm focus:outline-none hover:bg-slate-100 dark:hover:bg-slate-700 py-2 px-4 rounded-md"
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

            <div className="md:hidden">
              <Dropdown.Root>
                <Dropdown.Trigger className="flex items-center text-sm focus:outline-none h-8 w-8 pointer-events-auto">
                  <span className="sr-only">Open user menu</span>
                  {user.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt=""
                    />
                  ) : (
                    <span className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                  )}
                </Dropdown.Trigger>

                <Dropdown.Portal>
                  <Dropdown.Content
                    align="end"
                    className="mt-2 w-48 z-50 overflow-hidden rounded-md border border-slate-100 bg-white p-1 text-slate-700 shadow-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                  >
                    <div className="flex flex-col space-y-1 leading-none p-2">
                      <strong className="font-medium">
                        {user.displayName}
                      </strong>
                      {user.name && (
                        <span className="w-[200px] truncate text-sm text-slate-500">
                          {user.name}
                        </span>
                      )}
                    </div>
                    <Dropdown.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <Dropdown.Item className="focus-visible:outline-none hover:outline-none">
                      <button
                        onClick={toggleTheme}
                        className="flex w-full cursor-pointer select-none p-2 text-sm font-medium outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                      >
                        {theme === 'dark' ? 'Light' : 'Dark'} Theme
                      </button>
                    </Dropdown.Item>
                    <Dropdown.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <Dropdown.Item className="focus-visible:outline-none hover:outline-none">
                      <Link
                        to="/library"
                        className="flex w-full cursor-pointer select-none p-2 text-sm font-medium outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                      >
                        Library
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="focus-visible:outline-none hover:outline-none">
                      <Link
                        to="/library/search"
                        className="flex w-full cursor-pointer select-none p-2 text-sm font-medium outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                      >
                        Search
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item className="focus-visible:outline-none hover:outline-none">
                      <Link
                        to="/auth/logout"
                        className="flex w-full cursor-pointer select-none p-2 text-sm font-medium outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                      >
                        Logout
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Separator className="h-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <Dropdown.Item className="focus-visible:outline-none hover:outline-none">
                      <a
                        href="https://github.com/8bittitan/nexus"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full cursor-pointer select-none p-2 text-sm font-medium outline-none focus:bg-slate-100 dark:focus:bg-slate-700"
                      >
                        View project on GitHub
                      </a>
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown.Portal>
              </Dropdown.Root>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
};

export default Nav;
