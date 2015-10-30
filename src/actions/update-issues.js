import Rx from 'rx';

function parseIssue(response) {
  const { html_url, title, number, body } = response;
  return { url: html_url, title, number, body };
}

export default function({ HTTP }) {
  const updateIssues$ = HTTP.filter(({ request }) => {
    const pattern = '^https://api.github.com/repos/[^/]+/[^/]+/issues$';
    return request.url.match(new RegExp(pattern));
  })
  .mergeAll()
  .flatMap(({ body }) => {
    const json = JSON.parse(body);
    const issues = json.map(parseIssue);
    return Rx.Observable.from(issues);
  });
  return { updateIssues$ };
}
