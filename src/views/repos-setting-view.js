import { h } from '@cycle/dom';

function renderRepoForm(state) {
  const { repo } = state;
  return h('div', [
    h('input.user', { placeholder: 'user', value: repo.user }),
    '/',
    h('input.repo', { placeholder: 'repo', value: repo.repo }),
    h('button.add', ['+'])
  ]);
}

function renderRepoList(state) {
  const { settings } = state;
  const repos = settings && settings.repos ? settings.repos : [];
  return h('ul.repo-list', repos.map(({ user, repo }, index) => {
    const label = `${user}/${repo}`;
    return h('li.repo', [
      h('button.remove-repo.item-' + index.toString(), ['X']),
      label
    ]);
  }));
}

export default function(state) {
  return h('div', [
    h('h1', ['Repos']),
    renderRepoForm(state),
    renderRepoList(state)
  ]);
}
