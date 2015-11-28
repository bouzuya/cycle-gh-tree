import Rx from 'rx';
import assign from '../utils/assign';

function exists(repos, user, repo) {
  return repos
    .filter(i => {
      return i.user === user && i.repo === repo;
    }).length > 0;
}

function addRepoTransform({ addRepo$ }, { reposMaxLength }) {
  return addRepo$
    .map(() => state => {
      const { settings } = state;
      const repos = settings && settings.repos ? settings.repos : [];
      if (repos.length > reposMaxLength) return state;
      const { user, repo } = state.repo;
      if (exists(repos, user, repo)) return state;
      if ((user || '').length === 0 || (repo || '').length === 0) return state;
      const newRepos = repos.concat([{ user, repo }]);
      const newSettings = assign({}, settings, { repos: newRepos });
      const newRepo = { user: null, repo: null };
      return assign({}, state, { repo: newRepo, settings: newSettings });
    });
}

function removeRepoTransform({ removeRepo$ }) {
  return removeRepo$
    .map(index => state => {
      const { settings } = state;
      const repos = settings && settings.repos ? settings.repos : [];
      if (repos.length === 0) return state;
      const newRepos = repos.filter((_, i) => i !== index);
      const newSettings = assign({}, settings, { repos: newRepos });
      return assign({}, state, { settings: newSettings });
    });
}

function updateRepoTransform({ updateRepo$ }) {
  return updateRepo$
    .map(value => state => {
      const { repo } = state;
      const newRepo = assign({}, repo, { repo: value });
      return assign({}, state, { repo: newRepo });
    });
}

function updateUserTransform({ updateUser$ }) {
  return updateUser$
    .map(value => state => {
      const { repo } = state;
      const newRepo = assign({}, repo, { user: value });
      return assign({}, state, { repo: newRepo });
    });
}

export default function({ repos }, { reposMaxLength }) {
  const actions = repos;
  return Rx.Observable
    .merge(
      addRepoTransform(actions, { reposMaxLength }),
      removeRepoTransform(actions),
      updateRepoTransform(actions),
      updateUserTransform(actions)
    );
}
