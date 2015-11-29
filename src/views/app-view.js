import { h } from '@cycle/dom';
import issuesView from '../views/issues-view';
import settingsView from '../views/settings-view';

function tabView(state) {
  const { currentTab } = state;
  if (currentTab === 'settings') {
    return settingsView(state);
  } else {
    return issuesView(state);
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
