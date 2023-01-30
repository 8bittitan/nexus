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
    <article className="card bg-base-100 shadow-xl">
      <figure>
        <img src={game.image} alt="" className="rounded-t-md" />
      </figure>
      <div className="card-body prose">
        <h3 className="card-title">{game.name}</h3>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(truncateText(game.description, 200)),
          }}
        />
        <Link className="mt-auto btn btn-primary" to={`./${game.id}`}>
          View game details
        </Link>
      </div>
    </article>
  );
};

export default GameCard;
