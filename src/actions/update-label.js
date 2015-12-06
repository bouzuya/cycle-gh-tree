import { Observable } from 'rx';

function parseLabel(label) {
  const { name, color } = label;
  return name; // TODO: add color
}

export default function({ HTTP }) {
  const updateLabel$ = HTTP
    .filter(({ request }) => {
      const pattern = '^https://api.github.com/repos/[^/]+/[^/]+/labels$';
      return request.url.match(new RegExp(pattern));
    })
    .map(({ response }) => Observable.fromPromise(response.json()))
    .mergeAll()
    .map(json => Observable.from(json.map(parseLabel)))
    .mergeAll();
  return { updateLabel$ };
}
