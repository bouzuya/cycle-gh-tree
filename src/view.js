import { h } from '@cycle/dom';

export default function(state$) {
  const vtree$ = state$.map(({ message, count }) => {
    return h('div', [
      h('button', ['fetch']),
      '' + count
    ]);
  });
  const requests = {
    DOM: vtree$
  };
  return requests;
}
