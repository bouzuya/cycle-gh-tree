import Rx from 'rx';

export default function(actions) {
  const {
    addRepo$,
    fetchIssues$,
    updateIssue$,
    updateRepo$,
    updateUser$
  } = actions;
  const state = {
    issues: [],
    repos: [],
    requests: [],
    repo: null,
    user: null
  };
  const actions$ = Rx.Observable.merge(
    fetchIssues$
    .map((_, i) => state => {
      const newRequests = state.repos.map(({ user, repo }, j) => {
        const reposMaxLength = 10;
        const id = i * reposMaxLength + j;
        const url = `https://api.github.com/repos/${user}/${repo}/issues`;
        const headers = { 'User-Agent': 'gh-tree' };
        return { id, method: 'GET', url, headers };
      });
      state.requests = state.requests.concat(newRequests);
      return state;
    }),
    addRepo$
    .map(repo => state => {
      const { user, repo } = state;
      state.repos.push({ user, repo });
      return state;
    }),
    updateIssue$
    .map(issue => state => {
      state.issues.push(issue);
      return state;
    }),
    updateRepo$
    .map(repo => state => {
      state.repo = repo;
      return state;
    }),
    updateUser$
    .map(user => state => {
      state.user = user;
      return state;
    })
  );
  const state$ = Rx.Observable.just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .share();
  return state$;
}
