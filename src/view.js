import { h } from '@cycle/dom';

export default function(state$) {
  const vtree$ = state$.map(({ message, count, issues }) => {
    return h('div', [
      h('button', ['fetch']),
      '' + count,
      message,
      h('ul', issues.map(i => {
        return h('li', [
          h('a', { href: i.html_url }, [
            i.title
          ])
        ]);
      }))
    ])
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
