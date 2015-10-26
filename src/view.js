import { h } from '@cycle/dom';

export default function(state$) {
  const vtree$ = state$.map(({ message }) => {
    return h('div', [message]);
  });
  const requests = {
    DOM: vtree$
  };
  return requests;
}
