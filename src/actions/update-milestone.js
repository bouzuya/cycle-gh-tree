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
    .flatMap(({ response }) => Observable.fromPromise(response.json()))
    .flatMap(json => Observable.from(json.map(parseMilestone)));
  return { updateMilestone$ };
}
