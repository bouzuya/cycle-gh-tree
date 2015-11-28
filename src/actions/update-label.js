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
    .flatMap(({ response }) => Observable.fromPromise(response.json()))
    .flatMap(json => Observable.from(json.map(parseLabel)));
  return { updateLabel$ };
}
