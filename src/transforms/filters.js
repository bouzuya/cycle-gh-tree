import { Observable } from 'rx';
import transform from '../utils/transform';

function addFilterTransform({ addFilter$ }) {
  return addFilter$.map(transform(({ filters }, filter) => {
    return { filters: filters.concat([filter]) };
  }));
}

function fetchLabelsTransform({ fetchLabels$ }) {
  return fetchLabels$.map(transform(({ filters }) => {
    return { filters: filters.filter(i => i.type !== 'label') };
  }));
}

function fetchMilestonesTransform({ fetchMilestones$ }) {
  return fetchMilestones$.map(transform(({ filters }) => {
    return { filters: filters.filter(i => i.type !== 'milestone') };
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
  return Observable.of(
    addFilterTransform(actions),
    fetchLabelsTransform(actions),
    fetchMilestonesTransform(actions),
    removeFilterTransform(actions)
  ).mergeAll();
}
