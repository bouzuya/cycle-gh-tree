import { Observable } from 'rx';

function parseIssue(issue) {
  const { html_url, title, number, body, assignee } = issue;
  const url = html_url;
  const labels = issue.labels.map(label => label.name);
  const milestone = issue.milestone ? issue.milestone.title : null;
  const match = html_url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
  const [_, user, repo] = match;
  return { url, title, number, body, user, repo, labels, milestone, assignee };
}

export default function({ HTTP }) {
  const updateIssue$ = HTTP
  .filter(({ request }) => {
    const pattern = '^https://api.github.com/repos/[^/]+/[^/]+/issues$';
    return request.url.match(new RegExp(pattern));
  })
  .flatMap(({ response }) => Observable.fromPromise(response.json()))
  .flatMap(json => Observable.from(json.map(parseIssue)));
  return { updateIssue$ };
}
