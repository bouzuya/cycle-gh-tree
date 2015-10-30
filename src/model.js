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
    repo: null,
    user: null
  };
  const actions$ = Rx.Observable.merge(
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
  state$.request$ = fetchIssues$
  .flatMap(() => {
    const repos = [
      { user: 'bouzuya', repo: 'bouzuya.net' },
      { user: 'bouzuya', repo: 'blog.bouzuya.net' }
    ];
    return Rx.Observable.from(repos.map(({ user, repo }) => {
      const url = `https://api.github.com/repos/${user}/${repo}/issues`;
      const headers = { 'User-Agent': 'gh-tree' };
      return { method: 'GET', url, headers };
    }));
  });
  return state$;
}
