import Rx from 'rx';

function parseIssue(issue) {
  const { html_url, title, number, body } = issue;
  const match = html_url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
  const [_, user, repo] = match;
  return { url: html_url, title, number, body, user, repo };
}

export default function({ HTTP }) {
  const updateIssue$ = HTTP
  .filter(({ request }) => {
    const pattern = '^https://api.github.com/repos/[^/]+/[^/]+/issues$';
    return request.url.match(new RegExp(pattern));
  })
  .flatMap(({ response }) => Rx.Observable.fromPromise(response.json()))
  .flatMap(json => Rx.Observable.from(json.map(parseIssue)));
  return { updateIssue$ };
}
