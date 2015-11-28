import { Observable } from 'rx';
import assign from '../utils/assign';
import transform from '../utils/transform';

function exists(repos, user, repo) {
  return repos
    .filter(i => {
      return i.user === user && i.repo === repo;
    }).length > 0;
}

function addRepoTransform({ addRepo$ }, { reposMaxLength }) {
  return addRepo$.map(transform((state) => {
    const { settings } = state;
    const repos = settings && settings.repos ? settings.repos : [];
    if (repos.length > reposMaxLength) return;
    const { user, repo } = state.repo;
    if (exists(repos, user, repo)) return;
    if ((user || '').length === 0 || (repo || '').length === 0) return;
    const newRepos = repos.concat([{ user, repo }]);
    const newSettings = assign({}, settings, { repos: newRepos });
    const newRepo = { user: null, repo: null };
    return { repo: newRepo, settings: newSettings };
  }));
}

function removeRepoTransform({ removeRepo$ }) {
  return removeRepo$.map(transform(({ settings }, index) => {
    const repos = settings && settings.repos ? settings.repos : [];
    if (repos.length === 0) return;
    const newRepos = repos.filter((_, i) => i !== index);
    const newSettings = assign({}, settings, { repos: newRepos });
    return { settings: newSettings };
  }));
}

function updateRepoTransform({ updateRepo$ }) {
  return updateRepo$.map(transform(({ repo }, value) => {
    return { repo: assign({}, repo, { repo: value }) };
  }));
}

function updateUserTransform({ updateUser$ }) {
  return updateUser$.map(transform(({ repo }, value) => {
    return { repo: assign({}, repo, { user: value }) };
  }));
}

export default function({ repos }, { reposMaxLength }) {
  const actions = repos;
  return Observable
    .merge(
      addRepoTransform(actions, { reposMaxLength }),
      removeRepoTransform(actions),
      updateRepoTransform(actions),
      updateUserTransform(actions)
    );
}
