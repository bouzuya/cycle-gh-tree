import { h } from '@cycle/dom';
import Rx from 'rx';

export default function(state$) {
  const vtree$ = state$.map(({ issues }) => {
    return h('div', [
      h('button', ['fetch']),
      h('ul', issues.map(({ url, title, number }) => {
        return h('li', [
          h('a', { href: url }, [`#${number} ${title}`])
        ]);
      }))
    ])
  });
  const request$ = state$.request$;
  const requests = {
    DOM: vtree$,
    HTTP: request$
  };
  return requests;
}
