import { Observable } from 'rx';

function parseAssignee(assignee) {
  const { avatar_url, id, login } = assignee;
  const imageUrl = avatar_url;
  const name = login;
  return { id, imageUrl, name };
}

export default function({ HTTP }) {
  const updateAssignee$ = HTTP
    .filter(({ request }) => {
      const pattern = '^https://api.github.com/repos/[^/]+/[^/]+/assignees$';
      return request.url.match(new RegExp(pattern));
    })
    .map(({ response }) => Observable.fromPromise(response.json()))
    .mergeAll()
    .map(json => Observable.from(json.map(parseAssignee)))
    .mergeAll();
  return { updateAssignee$ };
}
