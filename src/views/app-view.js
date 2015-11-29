import { h } from '@cycle/dom';
import filtersAndIssuesView from '../views/filters-and-issues-view';
import settingsView from '../views/settings-view';

function tabView(state) {
  const { currentTab } = state;
  if (currentTab === 'settings') {
    return settingsView(state);
  } else {
    return filtersAndIssuesView(state);
  }
}

export default function(state) {
  return h('div', [
    h('h1', ['cycle-gh-tree']),
    h('nav', [
      h('ul', ['settings', 'issues'].map(i => {
          const klass = (state.currentTab === i ? '.active' : '');
          return h('li' + klass, [
            h('a', { href: '#' + i }, [
              i.replace(/^(.)/, j => j.toUpperCase())
            ])
          ]);
      }))
    ]),
    tabView(state)
  ]);
}
