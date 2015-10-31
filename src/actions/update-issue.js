import Rx from 'rx';

function parseIssue(issue) {
  const { html_url, title, number, body } = issue;
  return { url: html_url, title, number, body };
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
