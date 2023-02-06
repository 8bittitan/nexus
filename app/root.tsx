import type { MetaFunction, LinksFunction, LoaderArgs } from '@remix-run/node';
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
import { InstantSearch, Configure } from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
import aa from 'search-insights';
import * as Sentry from '@sentry/remix';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import InterFont from '@fontsource/inter/variable.css';
import { DynamicLinks } from 'remix-utils';

import { authenticator } from './utils/auth.server';
import { getThemeSession } from '~/utils/session.server';
import tailwindStyles from './styles/tailwind.css';

import { ThemeProvider } from '~/components/theme';

import Container from '~/components/Container';
import GithubIndicator from '~/components/GithubIndicator';
import Nav from '~/components/Nav';
import env from '~/utils/env.server';

export const links: LinksFunction = () => [
  { href: tailwindStyles, rel: 'stylesheet' },
  { href: InterFont, rel: 'stylesheet' },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Nexus',
  description: 'A game library for the modern age',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({ request }: LoaderArgs) {
  let [user, theme] = await Promise.all([
    authenticator.isAuthenticated(request),
    getThemeSession(request),
  ]);

  return json({
    user,
    apiKey: env.ALGOLIA_API_KEY,
    appId: env.ALGOLIA_APP_ID,
    indexName: env.ALGOLIA_SEARCH_INDEX,
    theme,
    ENV: {
      env: env.NODE_ENV,
      sentryDsn: env.SENTRY_DSN,
      vercelAnalyticsId: env.VERCEL_ANALYTICS_ID,
    },
  });
}

function App() {
  const { user, apiKey, appId, indexName, ENV, theme } =
    useLoaderData<typeof loader>();

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
      environment: ENV.env,
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
        <DynamicLinks />
        <Links />
      </head>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50 antialiased">
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <Configure userToken={user?.userId ?? ''} />
          <ThemeProvider defaultTheme={theme}>
            <Nav user={user} />
          </ThemeProvider>
          <Container classes="mt-8">
            <Outlet />
          </Container>
        </InstantSearch>
        <GithubIndicator />
        {ENV.env === 'production' && <Analytics />}
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
