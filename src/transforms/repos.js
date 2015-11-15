import Rx from 'rx';

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
      const newRepos = repos.concat([{ user, repo }]);
      const newSettings = Object.assign({}, settings, { repos: newRepos });
      const newRepo = { user: null, repo: null };
      return Object.assign({}, state, { repo: newRepo, settings: newSettings });
    });
}

function removeRepoTransform({ removeRepo$ }) {
  return removeRepo$
    .map(index => state => {
      const { settings } = state;
      const repos = settings && settings.repos ? settings.repos : [];
      if (repos.length === 0) return state;
      const newRepos = repos.filter((_, i) => i !== index);
      const newSettings = Object.assign({}, settings, { repos: newRepos });
      return Object.assign({}, state, { settings: newSettings });
    });
}

function updateRepoTransform({ updateRepo$ }) {
  return updateRepo$
    .map(value => state => {
      const { repo } = state;
      const newRepo = Object.assign({}, repo, { repo: value });
      return Object.assign({}, state, { repo: newRepo });
    });
}

function updateUserTransform({ updateUser$ }) {
  return updateUser$
    .map(value => state => {
      const { repo } = state;
      const newRepo = Object.assign({}, repo, { user: value });
      return Object.assign({}, state, { repo: newRepo });
    });
}

export default function({ repos }, { reposMaxLength }) {
  const actions = repos;
  return Rx.Observable.merge(
    addRepoTransform(actions, { reposMaxLength }),
    removeRepoTransform(actions),
    updateRepoTransform(actions),
    updateUserTransform(actions)
  );
}
