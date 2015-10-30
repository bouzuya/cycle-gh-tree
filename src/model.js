import Rx from 'rx';

export default function(actions) {
  const {
    fetchIssues$,
    updateIssue$
  } = actions;
  const state = { issues: [] };
  const actions$ = Rx.Observable.merge(
    updateIssue$
    .map(issue => state => {
      state.issues.push(issue);
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
