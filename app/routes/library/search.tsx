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

import { algoliaIndexName } from '~/utils/env.server';
import RefinementList from '~/components/RefinementList';

type LoaderData = {
  algoliaIndexName: string;
};

export const loader: LoaderFunction = async () => {
  return {
    algoliaIndexName,
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
    <div>
      <h1 className="text-white font-bold text-4xl mb-4 tracking-wide">
        Search
      </h1>
      <input
        className="input input-bordered w-full mb-8 text-lg"
        type="text"
        onChange={handleSearchChange}
        placeholder="Search for some new games!"
      />
      <div className="flex gap-8">
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
                <article
                  key={hit.objectID}
                  className="card card-bordered shadow-lg"
                >
                  <figure>
                    <img src={hit.header_image} alt="" />
                  </figure>
                  <div className="card-body prose">
                    <h2 className="card-title">{hit.name}</h2>
                    <p>{hit.short_description}</p>
                    <a
                      href={`https://store.steampowered.com/app/${hit.steam_appid}`}
                      data-objectid={hit.objectID}
                      target="_blank"
                      rel="noopenerer noreferrer"
                      className="btn btn-primary"
                      onClick={handleGameClicked}
                    >
                      View on Steam
                    </a>
                  </div>
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
