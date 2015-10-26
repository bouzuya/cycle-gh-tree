import { h } from '@cycle/dom';

export default function(state$) {
  const vtree$ = state$.map(({ message, count }) => {
    return h('div', [
      h('button', ['fetch']),
      '' + count,
      message
    ]);
  });
  const request$ = state$.map(({ request }) => {
    return request;
  });
  const requests = {
    DOM: vtree$,
    HTTP: request$
  };
  return requests;
}
