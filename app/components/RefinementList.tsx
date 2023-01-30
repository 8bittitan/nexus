import type { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import type { FC } from 'react';

const slugifyRefinement = (refinement: string) =>
  refinement.toLowerCase().split(' ').join('_');

type Props = {
  sectionTitle: string;
  refinements: RefinementListItem[];
  handler: (value: string) => void;
};

const RefinementList: FC<Props> = ({ refinements, handler, sectionTitle }) => {
  return (
    <div>
      <strong className="block mb-2 text-lg font-semibold">
        {sectionTitle}
      </strong>
      {refinements.map((filter) => (
        <label
          key={slugifyRefinement(filter.label)}
          htmlFor={slugifyRefinement(filter.label)}
          className="cursor-pointer flex items-center space-x-4 mb-1"
        >
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 focus:border-none text-sky-600 focus:ring-sky-500 transition-colors cursor-pointer"
            id={slugifyRefinement(filter.label)}
            name={slugifyRefinement(filter.label)}
            onChange={() => handler(filter.value)}
            checked={filter.isRefined}
          />
          <span>
            {filter.label} {filter.count > 1 && <span>({filter.count})</span>}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RefinementList;
