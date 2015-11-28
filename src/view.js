import { h } from '@cycle/dom';
import { Observable } from 'rx';
import reposSettingView from './views/repos-setting-view';

function renderTokenForm(state) {
  const { settings, token } = state;
  const currentToken = settings && settings.token ? settings.token : '';
  return h('div', [
    h('input.token', { value: token.value }),
    h('button.save-token', ['save token']),
    h('span.token', [
      currentToken.replace(/^(.*)(.{4})$/, (_, p1, p2) => {
        const masked = new Array(p1.length + 1).join('*');
        const opened = p2;
        return masked + opened;
      })
    ])
  ]);
}

function renderIssueTree(state) {
  const { issues } = state;
  return h('ul', issues.map(({ user, repo, url, title, number, children }) => {
    return h('li', [
      h('a', { href: url }, [`${user}/${repo}#${number}`]),
      ' ',
      title,
      children.length === 0 ? null : h('ul', children.map(i => {
        const { user, repo, url, title, number } = i;
        return h('li', [
          h('a', { href: url }, [`${user}/${repo}#${number}`]),
          ' ',
          title
        ]);
      }))
    ]);
  }));
}

function renderSettingsView(state) {
  return h('section.settings', [
    h('h1', ['Settings']),
    h('div', [
      h('h1', ['Token']),
      renderTokenForm(state)
    ]),
    reposSettingView(state)
  ]);
}

function renderIssuesView(state) {
  return h('section.issues', [
    h('h1', ['Issues']),
    h('button.fetch-issues', ['fetch issues']),
    renderIssueTree(state)
  ]);
}

function renderFiltersView(state) {
  const { filters, labels, milestones } = state;
  const labelFilters = filters
    .filter(i => i.type === 'label')
    .map(i => i.name);
  const milestoneFilters = filters
    .filter(i => i.type === 'milestone')
    .map(i => i.title);
  return h('section.filters', [
    h('h1', ['Filters']),
    h('button.fetch-labels', ['fetch labels']),
    h('ul.filter-labels', labels.map(label => {
      const checked = labelFilters.indexOf(label) >= 0;
      const value = label;
      return h('li', [
        h('label.filter-label', [
          h('input.value', { type: 'checkbox', checked, value }),
          h('span.label', [label])
        ])
      ]);
    })),
    h('button.fetch-milestones', ['fetch milestones']),
    h('ul.filter-milestones', milestones.map(milestone => {
      const checked = milestoneFilters.indexOf(milestone) >= 0;
      const value = milestone;
      return h('li', [
        h('label.filter-milestone', [
          h('input.value', { type: 'checkbox', checked, value }),
          h('span.label', [milestone])
        ])
      ]);
    }))
  ]);
}

function renderTabView(state) {
  const { currentTab } = state;
  if (currentTab === 'settings') return renderSettingsView(state);
  if (currentTab === 'filters') return renderFiltersView(state);
  return renderIssuesView(state);
}

export default function(state$) {
  const vtree$ = state$
  .map(state => {
    return h('div', [
      h('h1', ['cycle-gh-tree']),
      h('nav', [
        h('ul', ['settings', 'issues', 'filters'].map(i => {
            const klass = (state.currentTab === i ? '.active' : '');
            return h('li' + klass, [
              h('a', { href: '#' + i }, [
                i.replace(/^(.)/, j => j.toUpperCase())
              ])
            ]);
        }))
      ]),
      renderTabView(state)
    ])
  });
  const request$ = state$
  .flatMap(({ requests }) => Observable.from(requests));
  const data$ = state$
  .map(({ settings }) => settings);
  const requests = {
    DOM: vtree$,
    HTTP: request$,
    Storage: data$
  };
  return requests;
}
