import Rx from 'rx';

export default function(actions) {
  const {
    fetchIssue$,
    updateIssue$
  } = actions;
  const state = { message: 'Hello, world!', count: 0 };
  const actions$ = Rx.Observable.merge(
    fetchIssue$.map(() => state => {
      state.count += 1;
      const baseUrl = 'https://api.github.com';
      const owner = 'bouzuya';
      const repo = 'blog.bouzuya.net';
      const url = `${baseUrl}/repos/${owner}/${repo}/issues`;
      const headers = { 'User-Agent': 'gh-tree' };
      state.request = { method: 'GET', url, headers };
      return state;
    }),
    updateIssue$.map(body => state => {
      state.message = 'fetched!';
      return state;
    })
  );
  const state$ = Rx.Observable.just(state)
    .merge(actions$)
    .scan((state, action) => action(state))
    .share();
  return state$;
}
