import type { Game } from '@prisma/client';
import { Link } from '@remix-run/react';
import DOMPurify from 'dompurify';
import type { FC } from 'react';

import { truncateText } from '~/utils/truncateText';

type Props = {
  game: Game;
};

const GameCard: FC<Props> = ({ game }) => {
  const gameLinkUrl = `./${game.id}`;

  return (
    <article className="flex flex-col">
      <Link to={gameLinkUrl}>
        <figure className="mb-4 aspect-auto">
          <img src={game.image} alt="" className="rounded-md" width={344} />
        </figure>
      </Link>
      <div className="prose prose-slate dark:prose-invert prose-img:hidden mb-8">
        <h3>{game.name}</h3>
        <div
          className="break-words max-w-[344px] md:max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(truncateText(game.description, 200), {
              ALLOWED_TAGS: [],
            }),
          }}
        />
      </div>
      <Link
        className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 hover:dark:bg-slate-700 rounded text-center py-4 mt-auto text-sky-600 dark:text-sky-500 transition-colors font-semibold tracking-wide"
        to={gameLinkUrl}
      >
        View game details
      </Link>
    </article>
  );
};

export default GameCard;
