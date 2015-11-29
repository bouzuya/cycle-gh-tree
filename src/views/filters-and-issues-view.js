import { h } from '@cycle/dom';
import filtersView from '../views/filters-view';
import issuesView from '../views/issues-view';

export default function(state) {
  return h('div.filters-and-issues', [
    filtersView(state),
    issuesView(state)
  ]);
}

