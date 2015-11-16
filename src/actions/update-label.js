import Rx from 'rx';

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
    .flatMap(({ response }) => Rx.Observable.fromPromise(response.json()))
    .flatMap(json => Rx.Observable.from(json.map(parseLabel)));
  return { updateLabel$ };
}
