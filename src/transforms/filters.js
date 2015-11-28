import { Observable } from 'rx';
import transform from '../utils/transform';

function addFilterTransform({ addFilter$ }) {
  return addFilter$.map(transform(({ filters }, filter) => {
    return { filters: filters.concat([filter]) };
  }));
}

function removeFilterTransform({ removeFilter$ }) {
  return removeFilter$.map(transform(({ filters }, filter) => {
    const newFilters = filters.filter(i => {
      return i.type !== filter.type || i.name !== filter.name;
    });
    return { filters: newFilters };
  }));
}

export default function(actions) {
  // NOTE: no namespace
  return Observable.merge(
    addFilterTransform(actions),
    removeFilterTransform(actions)
  );
}
