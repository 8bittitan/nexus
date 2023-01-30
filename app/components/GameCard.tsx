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
        <figure className="mb-4">
          <img src={game.image} alt="" className="rounded-md" />
        </figure>
      </Link>
      <div className="prose prose-slate dark:prose-invert prose-img:hidden mb-8">
        <h3>{game.name}</h3>
        <div
          className="break-words"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(truncateText(game.description, 200), {
              ALLOWED_TAGS: [],
            }),
          }}
        />
      </div>
      <Link
        className="mt-auto underline text-sky-600 hover:text-sky-700 dark:text-sky-500 dark:hover:text-sky-600 transition-colors font-semibold tracking-wide"
        to={gameLinkUrl}
      >
        View game details
      </Link>
    </article>
  );
};

export default GameCard;
