import { Observable } from 'rx';

function parseMilestone(milestone) {
  const { title } = milestone;
  return title;
}

export default function({ HTTP }) {
  const updateMilestone$ = HTTP
    .filter(({ request }) => {
      const pattern = '^https://api.github.com/repos/[^/]+/[^/]+/milestones$';
      return request.url.match(new RegExp(pattern));
    })
    .map(({ response }) => Observable.fromPromise(response.json()))
    .mergeAll()
    .map(json => Observable.from(json.map(parseMilestone)))
    .mergeAll();
  return { updateMilestone$ };
}
