import type { Game } from '@prisma/client';
import { Link } from '@remix-run/react';
import DOMPurify from 'dompurify';
import type { FC } from 'react';
import { truncateText } from '~/utils/truncateText';

type Props = {
  game: Game;
};

const GameCard: FC<Props> = ({ game }) => {
  return (
    <article>
      <figure className="mb-4">
        <img src={game.image} alt="" className="rounded-md" />
      </figure>
      <div className="prose prose-slate dark:prose-invert prose-img:hidden">
        <h3>{game.name}</h3>
        <div
          className="break-words"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(truncateText(game.description, 200), {
              ALLOWED_TAGS: [],
            }),
          }}
        />
        <Link className="mt-auto" to={`./${game.id}`}>
          View game details
        </Link>
      </div>
    </article>
  );
};

export default GameCard;
