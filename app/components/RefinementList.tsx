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
      <strong>{sectionTitle}</strong>
      {refinements.map((filter) => (
        <div key={slugifyRefinement(filter.label)} className="form-control">
          <label
            htmlFor={slugifyRefinement(filter.label)}
            className="label cursor-pointer"
          >
            <span className="label-text">
              {filter.label} ({filter.count})
            </span>
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              id={slugifyRefinement(filter.label)}
              name={slugifyRefinement(filter.label)}
              onChange={() => handler(filter.value)}
              checked={filter.isRefined}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default RefinementList;
