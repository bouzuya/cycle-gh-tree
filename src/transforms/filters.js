import { Observable } from 'rx';
import assign from '../utils/assign';

function addFilterTransform({ addFilter$ }) {
  return addFilter$
    .map(filter => state => {
      const { filters } = state;
      const newFilters = filters.concat([filter]);
      return assign({}, state, { filters: newFilters });
    });
}

function removeFilterTransform({ removeFilter$ }) {
  return removeFilter$
    .map(filter => state => {
      const { filters } = state;
      const newFilters = filters.filter(i => {
        return i.type !== filter.type || i.name !== filter.name; 
      });
      return assign({}, state, { filters: newFilters });
    });
}

export default function(actions) {
  // NOTE: no namespace
  return Observable.merge(
    addFilterTransform(actions),
    removeFilterTransform(actions)
  );
}
