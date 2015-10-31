import fetch from 'node-fetch';
import Rx from 'rx';

function makeHTTPDriver() {
  var requests = {};
  return function(request$) {
    return request$
    .filter(request => {
      if (typeof request === 'undefined' || request === null) return false;
      const { id } = request;
      if (typeof id === 'undefined' || id === null) return false;
      if (requests.hasOwnProperty(id)) return false;
      requests[id] = request;
      return true;
    })
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
