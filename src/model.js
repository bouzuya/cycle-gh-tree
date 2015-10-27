import Rx from 'rx';

function parseIssue(response) {
  const { html_url, title } = response;
  return { url: html_url, title };
}

export default function(actions) {
  const {
    fetchIssue$,
    updateIssues$
  } = actions;
  const state = {
    message: 'Hello, world!',
    count: 0,
    issues: [],
    requests: []
  };
  const actions$ = Rx.Observable.merge(
    fetchIssue$
    .map(() => {
      const baseUrl = 'https://api.github.com';
      const owner = 'bouzuya';
      const repo = 'blog.bouzuya.net';
      const url = `${baseUrl}/repos/${owner}/${repo}/issues`;
      const headers = { 'User-Agent': 'gh-tree' };
      return { method: 'GET', url, headers };
    })
    .map(request => state => {
      state.count += 1;
      state.requests.push(request); // FIXME
      return state;
    }),
    updateIssues$
    .map(body => {
      const json = JSON.parse(body);
      const issues = json.map(parseIssue);
      return issues;
    })
    .map(issues => state => {
      state.requests.shift(); // FIXME
      state.issues = issues;
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
