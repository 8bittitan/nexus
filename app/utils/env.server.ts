import invariant from 'tiny-invariant';

invariant(process.env.STEAM_API_KEY);

invariant(process.env.ALGOLIA_API_KEY);
invariant(process.env.ALGOLIA_ADMIN_API_KEY);
invariant(process.env.ALGOLIA_APP_ID);
invariant(process.env.ALGOLIA_SEARCH_INDEX);

export const steamApiKey = process.env.STEAM_API_KEY;

export const algoliaApiKey = process.env.ALGOLIA_API_KEY;
export const algoliaAppId = process.env.ALGOLIA_APP_ID;
export const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
export const algoliaIndexName = process.env.ALGOLIA_SEARCH_INDEX;
