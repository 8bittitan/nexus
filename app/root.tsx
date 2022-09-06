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
} from '@remix-run/react';
import { json } from '@remix-run/node';
import type { UserSession } from '@types';
import { InstantSearch, Configure } from 'react-instantsearch-hooks-web';

import { authenticator } from './utils/auth.server';

import tailwindStyles from './styles/tailwind.css';

import Container from '~/components/Container';
import Nav from '~/components/Nav';
import {
  algoliaApiKey,
  algoliaAppId,
  algoliaIndexName,
} from './utils/env.server';
import algoliasearch from 'algoliasearch/lite';
import aa from 'search-insights';

export const links: LinksFunction = () => [
  { href: tailwindStyles, rel: 'stylesheet' },
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
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);

  return json({
    user,
    apiKey: algoliaApiKey,
    appId: algoliaAppId,
    indexName: algoliaIndexName,
  });
};

export default function App() {
  const { user, apiKey, appId, indexName } = useLoaderData<LoaderData>();

  const searchClient = algoliasearch(appId, apiKey);

  aa('setUserToken', user?.userId ?? '');
  aa('init', {
    apiKey,
    appId,
  });

  return (
    <html lang="en" className="h-full" data-theme="night">
      <head>
        <Meta />
        <link
          crossOrigin=""
          href={`https://${appId}-dsn.algolia.net`}
          rel="preconnect"
        />
        <Links />
      </head>
      <body className="h-full">
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <Configure userToken={user?.userId ?? ''} />
          <Nav user={user} />
          <Container classes="mt-8">
            <Outlet />
          </Container>
        </InstantSearch>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
