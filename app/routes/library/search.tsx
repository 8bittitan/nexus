import type { ChangeEvent, MouseEventHandler } from 'react';
import type { GameDetails } from '~/types';
import type { LoaderFunction } from '@remix-run/node';
import aa from 'search-insights';
import { useLayoutEffect } from 'react';
import {
  useSearchBox,
  useInstantSearch,
  useHits,
  useRefinementList,
} from 'react-instantsearch-hooks-web';
import { useLoaderData } from '@remix-run/react';

import env from '~/utils/env.server';
import RefinementList from '~/components/RefinementList';

type LoaderData = {
  algoliaIndexName: string;
};

export const loader: LoaderFunction = async () => {
  return {
    algoliaIndexName: env.ALGOLIA_SEARCH_INDEX,
  };
};

const SearchPage = () => {
  const { algoliaIndexName } = useLoaderData<LoaderData>();
  const { refine: search } = useSearchBox();
  const { use } = useInstantSearch();
  const { hits } = useHits<GameDetails>();
  const { items: genreFilters, refine: selectGenre } = useRefinementList({
    attribute: 'genres.description',
  });
  const { items: developerFilters, refine: selectDeveloper } =
    useRefinementList({
      attribute: 'developers',
    });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    search(e.currentTarget.value);
  };

  useLayoutEffect(() => {
    const createMiddleware = () => {
      import('instantsearch.js/es/middlewares').then(
        ({ createInsightsMiddleware }) => {
          const middleware = createInsightsMiddleware({
            insightsClient: aa,
            insightsInitParams: {
              useCookie: false,
            },
          });

          use(middleware);
        },
      );
    };

    createMiddleware();
  }, [use]);

  const handleGameClicked: MouseEventHandler<HTMLAnchorElement> = (e) => {
    const objectId = e.currentTarget.dataset['objectid'];

    aa('sendEvents', [
      {
        objectIDs: [objectId ?? ''],
        index: algoliaIndexName,
        eventType: 'click',
        eventName: 'Game clicked',
      },
    ]);
  };

  return (
    <div className="pb-16">
      <h1 className="text-slate-900 dark:text-slate-50 font-bold text-4xl mb-4 tracking-wide">
        Search
      </h1>
      <input
        className="flex w-full mb-8 text-xl rounded-md border border-slate-300 focus:border-slate-400 dark:border-slate-700 dark:focus:border-slate-800 dark:text-slate-50 bg-transparent py-2 px-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
        type="text"
        onChange={handleSearchChange}
        placeholder="Search for some new games!"
      />
      <div className="flex">
        <div className="w-full max-w-xs flex flex-col gap-8">
          <RefinementList
            sectionTitle="Genres"
            refinements={genreFilters}
            handler={selectGenre}
          />
          <RefinementList
            sectionTitle="Developers"
            refinements={developerFilters}
            handler={selectDeveloper}
          />
        </div>
        <div>
          {hits.length > 0 && (
            <div className="grid grid-cols-3 gap-8">
              {hits.map((hit) => (
                <article key={hit.objectID} className="flex flex-col">
                  <figure className="mb-4">
                    <img
                      src={hit.header_image}
                      alt=""
                      className="aspect-auto rounded-md"
                    />
                  </figure>
                  <div className="prose prose-slate dark:prose-invert mb-8">
                    <h2 className="">{hit.name}</h2>
                    <p>{hit.short_description}</p>
                  </div>
                  <a
                    href={`https://store.steampowered.com/app/${hit.steam_appid}`}
                    data-objectid={hit.objectID}
                    target="_blank"
                    rel="noopenerer noreferrer"
                    onClick={handleGameClicked}
                    className="mt-auto underline text-sky-600 hover:text-sky-700 dark:text-sky-500 dark:hover:text-sky-600 transition-colors font-semibold tracking-wide"
                  >
                    View on Steam
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
