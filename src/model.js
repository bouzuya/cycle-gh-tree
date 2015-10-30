import Rx from 'rx';

export default function(actions) {
  const {
    fetchIssues$,
    updateIssues$
  } = actions;
  const state = {
    issues: [],
    message: 'Hello, world!'
  };
  const actions$ = Rx.Observable.merge(
    updateIssues$
    .map(({ issues }) => state => {
      state.issues = issues;
      state.message = 'fetched!';
      return state;
    })
  );
  const state$ = Rx.Observable.just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .share();
  state$.request$ = fetchIssues$
  .map(() => {
    const baseUrl = 'https://api.github.com';
    const owner = 'bouzuya';
    const repo = 'blog.bouzuya.net';
    const url = `${baseUrl}/repos/${owner}/${repo}/issues`;
    const headers = { 'User-Agent': 'gh-tree' };
    return { method: 'GET', url, headers };
  });
  return state$;
}
