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
      const { repos } = state;
      if (repos.length > reposMaxLength) return state;
      const { user, repo } = state.repo;
      if (exists(repos, user, repo)) return state;
      const newRepos = repos.concat([{ user, repo }]);
      const newRepo = { user: null, repo: null };
      return Object.assign({}, state, { repo: newRepo, repos: newRepos });
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
    updateRepoTransform(actions),
    updateUserTransform(actions)
  );
}
