import fetch from 'node-fetch';
import Rx from 'rx';

function makeHTTPDriver() {
  return function(request$) {
    return request$
    .filter(request => !(typeof request === 'undefined' || request === null))
    .distinct()
    .map(request => {
      const { url, method, body, headers } = request;
      const promise = fetch(url, { method, body, headers });
      const response$ = Rx.Observable.fromPromise(promise);
      return response$.map(response => ({ request, response }));
    })
    .mergeAll()
    .share();
  };
}

export default { makeHTTPDriver };
