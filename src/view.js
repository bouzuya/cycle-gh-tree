import { h } from '@cycle/dom';
import Rx from 'rx';

export default function(state$) {
  const vtree$ = state$.map(({ message, count, issues }) => {
    return h('div', [
      h('button', ['fetch']),
      '' + count,
      message,
      h('ul', issues.map(({ url, title, number }) => {
        return h('li', [
          h('a', { href: url }, [`#${number} ${title}`])
        ]);
      }))
    ])
  });
  const request$ = state$.flatMap(({ requests }) => {
    return Rx.Observable.from(requests);
  }).filter(i => i);
  const requests = {
    DOM: vtree$,
    HTTP: request$
  };
  return requests;
}
