import type {
  MetaFunction,
  LoaderFunction,
  LinksFunction,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
} from '@remix-run/react';
import { json } from '@remix-run/node';
import type { UserSession } from '~/types';
import { InstantSearch, Configure } from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import aa from 'search-insights';
import * as Sentry from '@sentry/remix';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import InterFont from '@fontsource/inter/variable.css';

import type { Theme } from '~/types/theme';

import { authenticator } from './utils/auth.server';
import { getThemeSession } from '~/utils/session.server';
import tailwindStyles from './styles/tailwind.css';

import { ThemeProvider } from '~/components/theme';

import Container from '~/components/Container';
import Nav from '~/components/Nav';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndexName,
  vercelAnalyticsId,
} from './utils/env.server';

import { sentryDsn } from '~/utils/env.server';

export const links: LinksFunction = () => [
  { href: tailwindStyles, rel: 'stylesheet' },
  { href: InterFont, rel: 'stylesheet' },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Nexus',
  viewport: 'width=device-width,initial-scale=1',
});

type LoaderData = {
  user?: UserSession;
  apiKey: string;
  appId: string;
  indexName: string;
  theme: Theme;
  ENV: {
    isDevelopment: boolean;
    sentryDsn: string;
    vercelAnalyticsId?: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const [user, theme] = await Promise.all([
    authenticator.isAuthenticated(request),
    getThemeSession(request),
  ]);

  return json({
    user,
    apiKey: algoliaApiKey,
    appId: algoliaAppId,
    indexName: algoliaIndexName,
    theme,
    ENV: {
      isDevelopment: process.env.NODE_ENV === 'development',
      sentryDsn,
      vercelAnalyticsId,
    },
  });
};

function App() {
  const { user, apiKey, appId, indexName, ENV, theme } =
    useLoaderData<LoaderData>();

  const searchClient = algoliasearch(appId, apiKey);

  aa('setUserToken', user?.userId ?? '');
  aa('init', {
    apiKey,
    appId,
  });

  useEffect(() => {
    Sentry.init({
      dsn: ENV.sentryDsn,
      tracesSampleRate: 1,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.remixRouterInstrumentation(
            useEffect,
            useLocation,
            useMatches,
          ),
        }),
      ],
    });
  }, [ENV]);

  return (
    <html lang="en" className={`h-full ${theme === 'dark' ? 'dark' : ''}`}>
      <head>
        <Meta />
        <link
          crossOrigin=""
          href={`https://${appId}-dsn.algolia.net`}
          rel="preconnect"
        />
        <Links />
      </head>
      <body className="min-h-screen text-slate-900 dark:bg-slate-900 dark:text-slate-50 antialiased">
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <Configure userToken={user?.userId ?? ''} />
          <ThemeProvider defaultTheme={theme}>
            <Nav user={user} />
          </ThemeProvider>
          <Container classes="mt-8">
            <Outlet />
          </Container>
        </InstantSearch>
        {!ENV.isDevelopment && <Analytics />}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              vercelAnalyticsId: ENV.vercelAnalyticsId,
            })}`,
          }}
        />
      </body>
    </html>
  );
}

export default Sentry.withSentry(App);
