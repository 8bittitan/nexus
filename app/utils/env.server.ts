import invariant from 'tiny-invariant';

invariant(process.env.STEAM_API_KEY);
invariant(process.env.STEAM_RETURN_URL);

export const steamApiKey = process.env.STEAM_API_KEY;
export const steamReturnUrl = process.env.STEAM_RETURN_URL;

invariant(process.env.ALGOLIA_API_KEY);
invariant(process.env.ALGOLIA_ADMIN_API_KEY);
invariant(process.env.ALGOLIA_APP_ID);
invariant(process.env.ALGOLIA_SEARCH_INDEX);

export const algoliaApiKey = process.env.ALGOLIA_API_KEY;
export const algoliaAppId = process.env.ALGOLIA_APP_ID;
export const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
export const algoliaIndexName = process.env.ALGOLIA_SEARCH_INDEX;

invariant(process.env.SENTRY_DSN);

export const sentryDsn = process.env.SENTRY_DSN;

export const vercelAnalyticsId = process.env.VERCEL_ANALYTICS_ID;
